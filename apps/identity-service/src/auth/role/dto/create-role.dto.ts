import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateRoleDto {
  @IsUUID()
  @IsNotEmpty()
  tenant_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
