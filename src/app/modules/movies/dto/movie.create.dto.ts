import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsBoolean()
  isPremiere: boolean;

  @IsNotEmpty()
  @IsString()
  duration: string;

  @IsNotEmpty()
  @IsArray()
  genre: string[];

  @IsNotEmpty()
  @IsString()
  age: string;

  @IsNotEmpty()
  @IsString()
  img: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  rating: number;
}
