import { ApiProperty } from "@nestjs/swagger";
import { BaseResourceResponseDto } from "../../dto/base-resource-response.dto";

export class UserRoleResponseDto extends BaseResourceResponseDto {
  @ApiProperty({ example: "8d79c6fe-f5b6-4a5d-b7d0-f7be4c74f1e9" })
  user_id: string;

  @ApiProperty({ example: "f90c5d7b-c1d2-4568-a4dd-7be4474847da" })
  role_id: string;
}
