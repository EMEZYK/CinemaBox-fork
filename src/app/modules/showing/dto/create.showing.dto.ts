import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateShowingDto {
  @IsNotEmpty()
  @IsNumber()
  hall_id: number;

  @IsNotEmpty()
  @IsNumber()
  movie_id: number;

  @IsNotEmpty()
  @IsString()
  date_start: string;
}
