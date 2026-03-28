import { ApiProperty } from "@nestjs/swagger";
import { BaseResourceResponseDto } from "../../dto/base-resource-response.dto";

export class TenantResponseDto extends BaseResourceResponseDto {
  @ApiProperty({ example: "acme" })
  tenantName: string;

  @ApiProperty({ example: "premium" })
  subscriptionType: string;
}
