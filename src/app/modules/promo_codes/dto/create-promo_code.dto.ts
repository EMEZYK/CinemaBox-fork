import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePromoCodeDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  discount: number;
}
