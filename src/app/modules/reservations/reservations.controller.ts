import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
} from '@nestjs/common';
import { Public } from 'src/app/declarations/isPublic';
import ResponseDictionary from 'src/app/dictionaries/Response.dictionary';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Public()
  @Post()
  async createReservation(@Body() body) {
    const { isError, data } = await this.reservationsService.createReservation(
      body.showing_id,
      body.seats,
      body.user_id,
      body.ticket_no,
      body.blik_code,
      body.first_name,
      body.last_name,
      body.phone_number,
      body.email,
    );

    console.log(isError, data)

    if (isError) {
      throw new HttpException(ResponseDictionary.reservationsError, 400);
    }

    return {
      message: data,
    };
  }

  @Get()
  async getAllReservations() {
    const response = await this.reservationsService.getAllReservations();

    if (!response) {
      throw new HttpException(ResponseDictionary.reservationsError, 400);
    }

    return {
      reservations: response,
      count: response.length,
    };
  }

  @Get(':id')
  async getMyReservations(@Param('id') id: number) {
    const response = await this.reservationsService.getMyReservations(id);

    if (!response) {
      throw new HttpException(ResponseDictionary.reservationsError, 400);
    }

    return {
      reservations: response,
      count: response.length,
    };
  }

  @Public()
  @Get('ticket/:id')
  async getReservationByTicket(@Param('id') id: number) {
    const response = await this.reservationsService.getReservationByTicket(id);

    if (!response) {
      throw new HttpException(ResponseDictionary.reservationsError, 400);
    }

    return {
      reservation: response,
    };
  }

  @Public()
  @Patch(':id')
  async refundReservation(@Param('id') id: number) {
    const response = await this.reservationsService.refundReservation(id);

    if (!response) {
      throw new HttpException(ResponseDictionary.reservationsError, 400);
    }

    return {
      message: response,
    };
  }
}
