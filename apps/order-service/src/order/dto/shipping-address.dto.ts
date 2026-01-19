import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class ShippingAddressDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;
  @IsString()
  @IsNotEmpty()
  address1: string;
  @IsString()
  @IsNotEmpty()
  city: string;
  @IsString()
  @IsNotEmpty()
  state: string;
  @IsNumber()
  @IsNotEmpty()
  postalCode: string;
  @IsString()
  @IsNotEmpty()
  country: string;
}
