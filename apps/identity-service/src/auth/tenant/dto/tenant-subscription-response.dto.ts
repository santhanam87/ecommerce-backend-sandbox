import { ApiProperty } from "@nestjs/swagger";

export class TenantSubscriptionResponseDto {
  @ApiProperty({
    example: "7c7f52ff-4b90-4b87-8bf9-4c235db630f8",
  })
  id: string;

  @ApiProperty({ example: "enterprise" })
  subscriptionType: string;
}
