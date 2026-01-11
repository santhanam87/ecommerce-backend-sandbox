import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
  @IsString()
  @IsNotEmpty()
  cvv: string;
  @IsString()
  @IsNotEmpty()
  cardNumber: string;
  @IsString()
  @IsNotEmpty()
  exp: string;
  @IsString()
  @IsNotEmpty()
  cardHolderName: string;
}
