import { IsNotEmpty, IsString } from "class-validator";

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  tenantName: string;

  @IsString()
  @IsNotEmpty()
  subscriptionType: string;
}
