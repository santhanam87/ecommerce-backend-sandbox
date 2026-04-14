import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { createHash } from "node:crypto";
import { Role } from "./role/entities/role.entity";
import { RolePermission } from "./role-permission/entities/role-permission.entity";
import { UserRole } from "./user-role/entities/user-role.entity";
import { LoginDto } from "./dto/login.dto";
import { MeRolePermissionsResponseDto } from "./dto/me-role-permissions-response.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RolePermissionCacheService } from "./role-permission/role-permission-cache.service";
import { RedisService } from "src/redis/redis.service";
import { User } from "./user/entities/user.entity";
import { UserService } from "./user/user.service";
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "./types/token-payload.type";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly rolePermissionCacheService: RolePermissionCacheService,
    private readonly redisService: RedisService,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userService.findActiveByEmail(loginDto.email);

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    try {
      await this.rolePermissionCacheService.warmUserRolePermissionCache(
        user.id,
        user.tenant_id,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(
        `Failed to warm role permission cache for user '${user.id}': ${message}`,
      );
    }

    return this.signTokens(this.buildAccessPayload(user));
  }

  async refresh(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const refreshSecret = this.getRefreshSecret();

    let payload: RefreshTokenPayload & { exp?: number };
    try {
      payload = await this.jwtService.verifyAsync(
        refreshTokenDto.refresh_token,
        {
          secret: refreshSecret,
        },
      );
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }

    if (payload.type !== "refresh") {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const isRevoked = await this.isRefreshTokenRevoked(
      refreshTokenDto.refresh_token,
    );
    if (isRevoked) {
      throw new UnauthorizedException("Refresh token revoked");
    }

    const user = await this.userService.findActiveById(payload.sub);
    if (!user) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    return this.signTokens(this.buildAccessPayload(user));
  }

  async getMyRolePermissions(
    tokenUser: AccessTokenPayload,
  ): Promise<MeRolePermissionsResponseDto> {
    const userRole = await UserRole.findOne({
      where: {
        user_id: tokenUser.id,
        is_active_role: true,
      },
      include: [
        {
          model: Role,
          where: {
            tenant_id: tokenUser.tenant_id,
          },
          include: [RolePermission],
        },
      ],
    });

    const role = userRole?.role || null;
    const permissions = (role?.rolePermissions || []).map((permission) => {
      const value = (permission.value || {}) as {
        allow?: boolean;
        scope?: string[];
      };

      return {
        permission: permission.permission,
        allow: Boolean(value.allow),
        scope: value.scope || [],
      };
    });

    return {
      user_id: tokenUser.id,
      tenant_id: tokenUser.tenant_id,
      role: role
        ? {
            id: role.id,
            name: role.name,
          }
        : null,
      permissions,
    };
  }

  async logout(
    userId: string,
    authorization: string | undefined,
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ message: string }> {
    const refreshSecret = this.getRefreshSecret();

    let payload: (RefreshTokenPayload & { exp?: number }) | null = null;
    try {
      payload = await this.jwtService.verifyAsync<
        RefreshTokenPayload & { exp?: number }
      >(refreshTokenDto.refresh_token, { secret: refreshSecret });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        // Token already expired — nothing to revoke, just clear the cache and succeed
        await this.revokeAccessTokenIfPresent(authorization, userId);
        await this.rolePermissionCacheService.invalidateUser(userId);
        return { message: "Logged out successfully" };
      }
      throw new UnauthorizedException("Invalid refresh token");
    }

    if (!payload || payload.type !== "refresh" || payload.sub !== userId) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const ttlSeconds =
      typeof payload.exp === "number"
        ? Math.max(payload.exp - Math.floor(Date.now() / 1000), 1)
        : 7 * 24 * 60 * 60;

    await this.redisService.set(
      this.getRefreshTokenRevokedKey(refreshTokenDto.refresh_token),
      true,
      ttlSeconds,
    );

    await this.revokeAccessTokenIfPresent(authorization, userId);
    await this.rolePermissionCacheService.invalidateUser(userId);
    return { message: "Logged out successfully" };
  }

  private async revokeAccessTokenIfPresent(
    authorization: string | undefined,
    userId: string,
  ): Promise<void> {
    const accessToken = this.extractBearerToken(authorization);
    if (!accessToken) {
      return;
    }

    let payload: (AccessTokenPayload & { exp?: number }) | null = null;
    try {
      payload = await this.jwtService.verifyAsync<
        AccessTokenPayload & { exp?: number }
      >(accessToken, { secret: this.getAccessSecret() });
    } catch {
      return;
    }

    if (!payload || payload.id !== userId) {
      return;
    }

    const ttlSeconds =
      typeof payload.exp === "number"
        ? Math.max(payload.exp - Math.floor(Date.now() / 1000), 1)
        : 24 * 60 * 60;
    console.info(ttlSeconds);
    await this.redisService.set(
      this.getAccessTokenRevokedKey(accessToken),
      true,
      ttlSeconds,
    );
  }

  private async isRefreshTokenRevoked(token: string): Promise<boolean> {
    const key = this.getRefreshTokenRevokedKey(token);
    const revoked = await this.redisService.get<boolean>(key);
    return Boolean(revoked);
  }

  private getRefreshTokenRevokedKey(token: string): string {
    const tokenHash = createHash("sha256").update(token).digest("hex");
    return `auth:refresh-token:revoked:${tokenHash}`;
  }

  private getAccessTokenRevokedKey(token: string): string {
    const tokenHash = createHash("sha256").update(token).digest("hex");
    return `auth:access-token:revoked:${tokenHash}`;
  }

  private extractBearerToken(authorization: string | undefined): string | null {
    if (!authorization) {
      return null;
    }

    const [scheme, token] = authorization.split(" ");
    if (!scheme || !token || scheme.toLowerCase() !== "bearer") {
      return null;
    }

    return token;
  }

  private async signTokens(
    payload: AccessTokenPayload,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(
      {
        sub: payload.id,
        type: "refresh",
      },
      {
        secret: this.getRefreshSecret(),
        expiresIn: "7d",
      },
    );

    return { access_token, refresh_token };
  }

  private buildAccessPayload(user: User): AccessTokenPayload {
    return {
      id: user.id,
      email: user.email,
      tenant_id: user.tenant_id,
      is_active: user.is_active,
    };
  }

  private getRefreshSecret(): string {
    return (
      this.configService.get<string>("JWT_REFRESH_SECRET") ||
      this.configService.get<string>("JWT_SECRET") ||
      ""
    );
  }

  private getAccessSecret(): string {
    return this.configService.get<string>("JWT_SECRET") || "";
  }
}
