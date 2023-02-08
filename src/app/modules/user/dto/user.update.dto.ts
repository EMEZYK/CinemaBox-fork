import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  oldEmail?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  newEmail?: string;

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
  phone?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  oldPassword?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  newPassword?: string;
}
