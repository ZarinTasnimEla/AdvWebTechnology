import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class SignInDto {
  @IsNotEmpty({ message: 'Please provide your correct email'})
  @IsEmail({},{ message: 'Invalid Email Format'})
  email: string;

  @IsNotEmpty({ message: 'Please provide your correct Password!'})
  @IsString({ message: 'password must be a string'})
  password: string;
}
