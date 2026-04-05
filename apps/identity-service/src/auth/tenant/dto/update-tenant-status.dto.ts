import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { TenantStatus } from "../entities/tenant.entity";

export class UpdateTenantStatusDto {
  @ApiProperty({
    example: TenantStatus.ACTIVE,
    enum: TenantStatus,
  })
  @IsEnum(TenantStatus)
  status: TenantStatus;
}
