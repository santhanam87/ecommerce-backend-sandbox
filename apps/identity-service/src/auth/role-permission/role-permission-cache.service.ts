import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Role } from "../role/entities/role.entity";
import { UserRole } from "../user-role/entities/user-role.entity";
import { RolePermission } from "./entities/role-permission.entity";
import { RedisService } from "src/redis/redis.service";

interface CachedPermission {
  permission: string;
  allow: boolean;
  scope: string[];
}

interface CachedRolePermissions {
  roleId: string;
  permissions: CachedPermission[];
}

interface CachedUserRolePermissions {
  roleId: string;
  permissions: CachedPermission[];
}

@Injectable()
export class RolePermissionCacheService {
  private readonly defaultTtlSeconds = 300;

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async hasPermission(
    userId: string,
    tenantId: string,
    permissionKey: string,
    permissionScope: string,
  ): Promise<boolean> {
    const payload = await this.getPermissionsForUser(userId, tenantId);
    if (!payload) {
      return false;
    }

    return payload.permissions.some(
      (permission) =>
        permission.permission === permissionKey &&
        permission.allow &&
        permission.scope.includes(permissionScope),
    );
  }

  async warmUserRolePermissionCache(
    userId: string,
    tenantId: string,
  ): Promise<void> {
    await this.getPermissionsForUser(userId, tenantId);
  }

  async invalidateByRoleId(roleId: string): Promise<void> {
    const role = await Role.findByPk<Role>(roleId, {
      attributes: ["tenant_id"],
    });

    if (!role?.tenant_id) {
      return;
    }

    await this.redisService.del(
      this.getRolePermissionsKey(role.tenant_id, roleId),
    );
    await this.invalidateUsersByRoleId(roleId, role.tenant_id);
  }

  async invalidateUser(userId: string, tenantId?: string): Promise<void> {
    if (tenantId) {
      await this.redisService.del(
        this.getUserRolePermissionsKey(userId, tenantId),
      );
      return;
    }

    await this.redisService.deleteByPattern(
      `auth:user-role-permissions:user:${userId}:tenant:*`,
    );
  }

  private async getPermissionsForUser(
    userId: string,
    tenantId: string,
  ): Promise<CachedUserRolePermissions | null> {
    const userRolePermissionsKey = this.getUserRolePermissionsKey(
      userId,
      tenantId,
    );
    const cachedPayload =
      await this.redisService.get<CachedUserRolePermissions>(
        userRolePermissionsKey,
      );

    if (cachedPayload) {
      return cachedPayload;
    }

    const userRoles = await UserRole.findAll({
      where: {
        user_id: userId,
        is_active_role: true,
      },
      include: [
        {
          model: Role,
          where: {
            tenant_id: tenantId,
          },
          include: [RolePermission],
        },
      ],
    });

    const activeUserRole = userRoles[0];

    if (!activeUserRole?.role?.id) {
      return null;
    }

    const ttlSeconds = this.getCacheTtlSeconds();
    const activeRole = activeUserRole.role;
    const rolePermissionsKey = this.getRolePermissionsKey(
      tenantId,
      activeRole.id,
    );
    let rolePermissionsPayload =
      await this.redisService.get<CachedRolePermissions>(rolePermissionsKey);

    if (!rolePermissionsPayload) {
      rolePermissionsPayload = {
        roleId: activeRole.id,
        permissions: (activeRole.rolePermissions || []).map((permission) => {
          const value = (permission.value || {}) as {
            allow?: boolean;
            scope?: string[];
          };

          return {
            permission: permission.permission,
            allow: Boolean(value.allow),
            scope: value.scope || [],
          };
        }),
      };

      await this.redisService.set(
        rolePermissionsKey,
        rolePermissionsPayload,
        ttlSeconds,
      );
    }

    const payload: CachedUserRolePermissions = {
      roleId: activeRole.id,
      permissions: rolePermissionsPayload.permissions,
    };

    await this.redisService.set(userRolePermissionsKey, payload, ttlSeconds);

    return payload;
  }

  private async invalidateUsersByRoleId(
    roleId: string,
    tenantId: string,
  ): Promise<void> {
    const userRoles = await UserRole.findAll({
      where: {
        role_id: roleId,
        is_active_role: true,
      },
      attributes: ["user_id"],
    });

    const keys = userRoles
      .map((item) => item.user_id)
      .filter((userId): userId is string => Boolean(userId))
      .map((userId) => this.getUserRolePermissionsKey(userId, tenantId));

    await this.redisService.del(...keys);
  }

  private getCacheTtlSeconds(): number {
    const configured = Number(
      this.configService.get<string>("ROLE_PERMISSION_CACHE_TTL_SECONDS") ||
        this.defaultTtlSeconds,
    );

    return Number.isFinite(configured) && configured > 0
      ? configured
      : this.defaultTtlSeconds;
  }

  private getRolePermissionsKey(tenantId: string, roleId: string): string {
    return `auth:role-permissions:tenant:${tenantId}:role:${roleId}`;
  }

  private getUserRolePermissionsKey(userId: string, tenantId: string): string {
    return `auth:user-role-permissions:user:${userId}:tenant:${tenantId}`;
  }
}
