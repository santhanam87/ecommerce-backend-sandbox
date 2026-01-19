import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ProductStatus } from 'generated/prisma/enums';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNumber()
  price: number;
  @IsString()
  @IsNotEmpty()
  categoryId: string;
  @IsString()
  description?: string;
  @IsString()
  status?: ProductStatus;
  @IsNumber()
  availableQuantity?: number;
}
