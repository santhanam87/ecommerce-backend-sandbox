import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateInventoryDto {
  @IsNumber()
  availableQty: number;
  @IsString()
  @IsNotEmpty()
  productId: string;
}
