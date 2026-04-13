import { ApiProperty } from "@nestjs/swagger";

class MeRolePermissionsItemDto {
  @ApiProperty({ example: "role-permission" })
  permission!: string;

  @ApiProperty({ example: true })
  allow!: boolean;

  @ApiProperty({ type: [String], example: ["read", "update"] })
  scope!: string[];
}

class MeRoleDto {
  @ApiProperty({ example: "f90c5d7b-c1d2-4568-a4dd-7be4474847da" })
  id!: string;

  @ApiProperty({ example: "admin" })
  name!: string;
}

export class MeRolePermissionsResponseDto {
  @ApiProperty({ example: "8d79c6fe-f5b6-4a5d-b7d0-f7be4c74f1e9" })
  user_id!: string;

  @ApiProperty({ example: "7c7f52ff-4b90-4b87-8bf9-4c235db630f8" })
  tenant_id!: string;

  @ApiProperty({ type: () => MeRoleDto, nullable: true })
  role!: MeRoleDto | null;

  @ApiProperty({
    type: () => MeRolePermissionsItemDto,
    isArray: true,
    description: "Permissions attached to the current active role",
  })
  permissions!: MeRolePermissionsItemDto[];
}
