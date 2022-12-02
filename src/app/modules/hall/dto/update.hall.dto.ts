import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class UpdateHallDto {
  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  rows?: number;

  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  columns?: number;
}
