import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type IdentityPermission = {
  permission: string;
  allow: boolean;
  scope: string[];
};

type RolePermissionsResponse = {
  permissions: IdentityPermission[];
};

type CachedPermissions = {
  expiresAt: number;
  permissions: IdentityPermission[];
};

@Injectable()
export class PermissionService {
  private readonly cacheTtlMs = 30_000;
  private readonly permissionsByToken = new Map<string, CachedPermissions>();

  constructor(private readonly configService: ConfigService) {}

  async hasPermission(
    authorization: string,
    key: string,
    scope: string,
  ): Promise<boolean> {
    const permissions = await this.getPermissions(authorization);

    return permissions.some(
      (permission) =>
        permission.permission === key &&
        permission.allow &&
        permission.scope.includes(scope),
    );
  }

  private async getPermissions(
    authorization: string,
  ): Promise<IdentityPermission[]> {
    const token = this.extractBearerToken(authorization);
    if (!token) {
      throw new UnauthorizedException('Missing or invalid bearer token');
    }

    const now = Date.now();
    const cached = this.permissionsByToken.get(token);
    if (cached && cached.expiresAt > now) {
      return cached.permissions;
    }

    const response = await fetch(this.getIdentityPermissionsUrl(), {
      method: 'GET',
      headers: {
        Authorization: authorization,
      },
    });

    if (response.status === 401) {
      throw new UnauthorizedException('Invalid access token');
    }

    if (!response.ok) {
      throw new ForbiddenException('Unable to resolve role permissions');
    }

    const payload = (await response.json()) as RolePermissionsResponse;
    const permissions = payload.permissions || [];

    this.permissionsByToken.set(token, {
      permissions,
      expiresAt: now + this.cacheTtlMs,
    });

    return permissions;
  }

  private getIdentityPermissionsUrl(): string {
    const baseUrl =
      this.configService.get<string>('IDENTITY_SERVICE_URL') ||
      'http://localhost:3001';

    return `${baseUrl.replace(/\/$/, '')}/identity/auth/me/role-permissions`;
  }

  private extractBearerToken(authorization: string): string | null {
    const [scheme, token] = authorization.split(' ');

    if (!scheme || !token || scheme.toLowerCase() !== 'bearer') {
      return null;
    }

    return token;
  }
}
