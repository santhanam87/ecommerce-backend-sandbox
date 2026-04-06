import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "7c7f52ff-4b90-4b87-8bf9-4c235db630f8" })
  @IsUUID()
  @IsNotEmpty()
  tenant_id: string;

  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: "strong-password",
    writeOnly: true,
    description:
      "User password. Accepted only in request body and never returned in responses.",
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
