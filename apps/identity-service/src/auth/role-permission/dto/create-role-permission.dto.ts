import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsObject, IsString, IsUUID } from "class-validator";

export class CreateRolePermissionDto {
  @ApiProperty({ example: "f90c5d7b-c1d2-4568-a4dd-7be4474847da" })
  @IsUUID()
  @IsNotEmpty()
  role_id: string;

  @ApiProperty({ example: "product.create" })
  @IsString()
  @IsNotEmpty()
  permission: string;

  @ApiProperty({
    example: {
      allow: true,
      scopes: ["all"],
    },
  })
  @IsObject()
  @IsNotEmpty()
  value: Record<string, unknown>;
}
