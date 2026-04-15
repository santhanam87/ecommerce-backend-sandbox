import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionService } from './permission.service';

export interface PermissionMetadata {
  key: string;
  scope: string;
  errorMessage?: string;
}

export const PERMISSION_METADATA_KEY = 'permissions';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissionMetadata =
      this.reflector.getAllAndOverride<PermissionMetadata>(
        PERMISSION_METADATA_KEY,
        [context.getHandler(), context.getClass()],
      );

    if (!permissionMetadata) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authorization = request.headers?.authorization as string | undefined;

    if (!authorization) {
      throw new ForbiddenException('Authorization header is missing');
    }

    const hasPermission = await this.permissionService.hasPermission(
      authorization,
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
