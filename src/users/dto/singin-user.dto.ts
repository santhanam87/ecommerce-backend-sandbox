import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class SignInUserDto {
  @IsString()
  @IsNotEmpty()
  userName: string;
  @IsEmail()
  @IsNotEmpty()
  password: string;
}
