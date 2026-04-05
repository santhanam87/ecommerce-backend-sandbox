import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../role/entities/role.entity";
import { RolePermission } from "../role-permission/entities/role-permission.entity";
import { UserRole } from "../user-role/entities/user-role.entity";

export interface PermissionMetadata {
  key: string;
  scope: string;
  errorMessage?: string;
}

export const PERMISSION_METADATA_KEY = "permissions";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissionMetadata = this.reflector.get<PermissionMetadata>(
      PERMISSION_METADATA_KEY,
      context.getHandler(),
    );

    if (!permissionMetadata) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const actorUserId = request.user?.id;

    if (!actorUserId) {
      throw new ForbiddenException("User not found in request");
    }

    const actorActiveRole = await UserRole.findOne({
      where: {
        user_id: actorUserId,
        is_active_role: true,
      },
      include: [
        {
          model: Role,
          include: [RolePermission],
        },
      ],
    });

    const hasPermission = (actorActiveRole?.role?.rolePermissions || []).some(
      (permission) => {
        if (permission.permission !== permissionMetadata.key) {
          return false;
        }

        const value = permission.value as {
          allow?: boolean;
          scope?: string[];
        };
        const scopes = value.scope || [];

        return (
          Boolean(value.allow) && scopes.includes(permissionMetadata.scope)
        );
      },
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        permissionMetadata.errorMessage ||
          `User does not have permission: ${permissionMetadata.key}.${permissionMetadata.scope}`,
      );
    }

    return true;
  }
}
