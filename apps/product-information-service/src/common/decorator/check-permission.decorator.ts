import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import {
  PERMISSION_METADATA_KEY,
  PermissionMetadata,
} from 'src/auth/permission.guard';

export const CheckPermission = (metadata: PermissionMetadata) =>
  applyDecorators(
    SetMetadata(PERMISSION_METADATA_KEY, metadata),
    ApiUnauthorizedResponse({
      description: 'Missing or invalid bearer token',
    }),
    ApiForbiddenResponse({
      description:
        metadata.errorMessage ||
        `Requires permission ${metadata.key} with scope ${metadata.scope}`,
    }),
  );
