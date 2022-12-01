import { IsNotEmpty, IsString, IsEmail, IsPhoneNumber } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('PL')
  phoneNumber: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
