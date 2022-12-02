import { IsNotEmpty, IsString, IsEmail, IsPhoneNumber } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber('PL')
  @IsString()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}
