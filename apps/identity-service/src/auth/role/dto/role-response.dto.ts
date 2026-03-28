import { ApiProperty } from "@nestjs/swagger";
import { BaseResourceResponseDto } from "../../dto/base-resource-response.dto";

export class RoleResponseDto extends BaseResourceResponseDto {
  @ApiProperty({ example: "7c7f52ff-4b90-4b87-8bf9-4c235db630f8" })
  tenant_id: string;

  @ApiProperty({ example: "admin" })
  name: string;
}
