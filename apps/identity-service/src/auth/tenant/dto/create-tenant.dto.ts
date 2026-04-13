import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { TenantStatus } from "../entities/tenant.entity";

export class CreateTenantDto {
  @ApiProperty({ example: "acme" })
  @IsString()
  @IsNotEmpty()
  tenantName: string;

  @ApiProperty({ example: "premium" })
  @IsString()
  @IsNotEmpty()
  subscriptionType: string;

  @ApiProperty({
    example: TenantStatus.ACTIVE,
    enum: TenantStatus,
    required: false,
    default: TenantStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(TenantStatus)
  status?: TenantStatus;
}
