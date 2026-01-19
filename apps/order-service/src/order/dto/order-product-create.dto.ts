import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderProductDto {
  @IsString()
  @IsNotEmpty()
  productId: string;
  @IsNumber()
  quantity: number;
  @IsNumber()
  price: number;
}
