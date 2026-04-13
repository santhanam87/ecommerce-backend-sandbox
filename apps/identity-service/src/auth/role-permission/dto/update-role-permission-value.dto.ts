import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsString } from "class-validator";

export class UpdateRolePermissionValueDto {
  @ApiProperty({
    example: ["read", "update"],
    description: "Allowed scopes for the permission",
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  scope: string[];
}
