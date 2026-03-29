import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsObject } from "class-validator";

export class UpdateRolePermissionValueDto {
  @ApiProperty({
    example: {
      allow: false,
      scopes: ["own"],
    },
  })
  @IsObject()
  @IsNotEmpty()
  value: Record<string, unknown>;
}
