import { ApiProperty } from "@nestjs/swagger";
import { BaseResourceResponseDto } from "../../dto/base-resource-response.dto";

export class RolePermissionResponseDto extends BaseResourceResponseDto {
  @ApiProperty({ example: "f90c5d7b-c1d2-4568-a4dd-7be4474847da" })
  role_id: string;

  @ApiProperty({ example: "product.create" })
  permission: string;

  @ApiProperty({
    example: {
      allow: true,
      scopes: ["all"],
    },
  })
  value: Record<string, unknown>;
}
