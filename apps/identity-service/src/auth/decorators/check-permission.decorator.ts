import { SetMetadata } from "@nestjs/common";
import {
  PermissionMetadata,
  PERMISSION_METADATA_KEY,
} from "../guards/permission.guard";

export const CheckPermission = (metadata: PermissionMetadata) =>
  SetMetadata(PERMISSION_METADATA_KEY, metadata);
