import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { CreateOrderProductDto } from './order-product-create.dto';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
  @IsString()
  @IsNotEmpty()
  status: string;
  @IsArray()
  orderItems: CreateOrderProductDto[];
}
