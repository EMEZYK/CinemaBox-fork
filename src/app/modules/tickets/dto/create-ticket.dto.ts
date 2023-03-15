import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsNumber()
  'ticket_type_id': number;

  @IsNotEmpty()
  @IsString()
  'name': string;

  @IsNotEmpty()
  @IsNumber()
  'price': number;

  @IsNotEmpty()
  @IsString()
  'description': string;
}
