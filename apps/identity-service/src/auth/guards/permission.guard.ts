import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RolePermissionCacheService } from "../role-permission/role-permission-cache.service";

export interface PermissionMetadata {
  key: string;
  scope: string;
  errorMessage?: string;
}

export const PERMISSION_METADATA_KEY = "permissions";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rolePermissionCacheService: RolePermissionCacheService,
  ) {}

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
    const actorTenantId = request.user?.tenant_id;

    if (!actorUserId || !actorTenantId) {
      throw new ForbiddenException("User not found in request");
    }

    const hasPermission = await this.rolePermissionCacheService.hasPermission(
      actorUserId,
      actorTenantId,
      permissionMetadata.key,
      permissionMetadata.scope,
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
