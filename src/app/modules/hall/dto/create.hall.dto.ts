import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateHallDto {
  @IsOptional()
  @IsNumber()
  rows: number

  @IsOptional()
  @IsNumber()
  columns: number

  @IsNotEmpty()
  @IsNumber()
  hall_no: number;
}
