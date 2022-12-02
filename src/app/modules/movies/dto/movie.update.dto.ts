import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class updateMovieDto {
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsNotEmpty()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsArray()
  genre?: string[];

  @IsNotEmpty()
  @IsString()
  age?: string;
}
