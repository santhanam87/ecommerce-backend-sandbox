import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTenantDto {
  @ApiProperty({ example: "acme" })
  @IsString()
  @IsNotEmpty()
  tenantName: string;

  @ApiProperty({ example: "premium" })
  @IsString()
  @IsNotEmpty()
  subscriptionType: string;
}
