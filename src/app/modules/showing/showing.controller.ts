import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  Query,
} from '@nestjs/common';

import { ShowingService } from './showing.service';
import ResponseDictionary from 'src/app/dictionaries/Response.dictionary';
import { UpdateShowingDto } from './dto/update.showing.dto';
import ShowingValidator from './utlis/showing.validator';

@Controller('showings')
export class ShowingController {
  constructor(private readonly showingService: ShowingService) {}

  @Post()
  async createShowing(@Body() body) {
    return await this.showingService.createShowing({
      start: ShowingValidator.date(body.start),
      movie_id: body.movie_id,
      hall_id: ShowingValidator.hallId(body.hall_id),
    });
  }

  @Get()
  async getShowings(@Query() query) {
    const {
      date, filters, hall_id: hallId
    } = query

    return await this.showingService.getShowings(
      ShowingValidator.date(date),
      ShowingValidator.filters(filters),
      ShowingValidator.hallId(hallId),
    )
  }

  @Delete(':id')
  async deleteShowing(@Param('id') id: number) {
    const response = await this.showingService.deleteShowing(id);

    if (!response) {
      throw new HttpException(ResponseDictionary.movieNotDeleted, 400);
    }

    return {
      message: ResponseDictionary.movieDeleted,
    };
  }

  @Patch(':id')
  async updateShowing(
    @Param('id') id: number,
    @Body() updateShowingDto: UpdateShowingDto,
  ) {
    const response = await this.showingService.updateShowing(
      id,
      updateShowingDto,
    );

    if (!response) {
      throw new HttpException(ResponseDictionary.movieNotUpdated, 400);
    }

    return {
      message: ResponseDictionary.movieUpdated,
    };
  }

  @Patch(':id/booked')
  async addToBookedSeats(@Param('id') id: number, @Body() body) {
    const response = await this.showingService.addToBookedSeats(
      id,
      body.seats,
    );

    setTimeout(() => {
      this.showingService.removeFromBookedSeats(id, body.seats);
    }, 900000);

    if (!response) {
      throw new HttpException(ResponseDictionary.movieNotUpdated, 400);
    }

    return {
      message: ResponseDictionary.movieUpdated,
    };
  }
}
