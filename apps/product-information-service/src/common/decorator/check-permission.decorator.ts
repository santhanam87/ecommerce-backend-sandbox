import { SetMetadata } from '@nestjs/common';
import {
  PERMISSION_METADATA_KEY,
  PermissionMetadata,
} from 'src/auth/permission.guard';

export const CheckPermission = (metadata: PermissionMetadata) =>
  SetMetadata(PERMISSION_METADATA_KEY, metadata);
