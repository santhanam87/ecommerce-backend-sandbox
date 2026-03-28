import { IsNotEmpty, IsObject, IsString, IsUUID } from "class-validator";

export class CreateRolePermissionDto {
  @IsUUID()
  @IsNotEmpty()
  role_id: string;

  @IsString()
  @IsNotEmpty()
  permission: string;

  @IsObject()
  @IsNotEmpty()
  value: Record<string, unknown>;
}
