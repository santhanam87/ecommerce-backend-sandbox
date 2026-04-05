import { ApiProperty } from "@nestjs/swagger";
import { TenantStatus } from "../entities/tenant.entity";

export class TenantStatusResponseDto {
  @ApiProperty({
    example: "7c7f52ff-4b90-4b87-8bf9-4c235db630f8",
  })
  id: string;

  @ApiProperty({
    example: TenantStatus.ACTIVE,
    enum: TenantStatus,
  })
  status: TenantStatus;
}
