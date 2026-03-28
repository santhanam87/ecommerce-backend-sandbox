import { IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateUserDto {
  @IsUUID()
  @IsNotEmpty()
  tenant_id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
