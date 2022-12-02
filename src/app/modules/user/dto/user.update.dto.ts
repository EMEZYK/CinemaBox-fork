import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UserUpdateDto {
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  email?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  lastName?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  password?: string;
}
