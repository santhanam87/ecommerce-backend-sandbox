import { IsNotEmpty, IsObject } from "class-validator";

export class UpdateRolePermissionValueDto {
  @IsObject()
  @IsNotEmpty()
  value: Record<string, unknown>;
}
