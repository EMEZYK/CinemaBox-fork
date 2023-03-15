import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  review: string;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
