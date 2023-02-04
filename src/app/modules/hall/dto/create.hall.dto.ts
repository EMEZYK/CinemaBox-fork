import { IsNumber, IsOptional } from 'class-validator';

export class CreateHallDto {
  @IsOptional()
  @IsNumber()
  rows: number;

  @IsOptional()
  @IsNumber()
  columns: number;

  @IsOptional()
  @IsNumber()
  hall_no: number;
}
