import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException } from '@nestjs/common';
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
      body.ticket_no
    );

    if (isError) {
      throw new HttpException(ResponseDictionary.reservationsError, 400);
    }

    return {
      message: data
    }
  }

  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(+id);
  }
}
