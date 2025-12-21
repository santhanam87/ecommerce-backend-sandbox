import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNumber()
  price: number;
  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
