import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class SignUpDto {
@IsNotEmpty({ message: 'Username is required'})
  @IsString({ message: 'Username must be a string'})
  @MinLength(3,{ message: 'username must be at least 3 characters'})
  //@MaxLength(25,{ message: 'username cant exceed 25 characters'})
  username: string;

  @IsNotEmpty({ message: 'Email is required'})
  @IsEmail({},{ message: 'Invalid email Format'})
  email: string;

  @IsNotEmpty({ message: 'Password is required'})
  @IsString({ message: 'Password must be a string'})
  @MinLength(8, { message: 'password must be at least 8 characters'})
  password: string;
  
  @IsNotEmpty({message: 'Write your Password again'})
  @IsString()
  confirmPassword: string;
}
