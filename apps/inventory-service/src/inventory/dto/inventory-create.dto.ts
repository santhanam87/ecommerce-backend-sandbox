import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateInventoryDto {
  @IsNumber()
  availableQuantity: number;
  @IsString()
  @IsNotEmpty()
  productId: string;
}
