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
import { Public } from 'src/app/declarations/isPublic';

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

  @Public()
  @Get()
  async getShowings(@Query() query) {
    const { date, filters, hall_id: hallId } = query;

    return await this.showingService.getShowings(
      ShowingValidator.date(date),
      ShowingValidator.filters(filters),
      ShowingValidator.hallId(hallId),
    );
  }

  @Public()
  @Get(':id')
  async getShowing(@Param('id') id: number) {
    const response = await this.showingService.getShowing(id);

    if (!response) {
      throw new HttpException(ResponseDictionary.movieNotFound, 400);
    }

    return {
      showing: response,
    };
  }

  @Public()
  @Get(':id/movie')
  async getMovieByShowingId(@Param('id') id: number) {
    const response = await this.showingService.getMovieByShowingId(id);

    if (!response) {
      throw new HttpException(ResponseDictionary.movieNotFound, 400);
    }

    return {
      showing: response,
    };
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

  @Public()
  @Patch(':id/booked')
  async addToBookedSeats(@Param('id') id: number, @Body() body) {
    const response = await this.showingService.addToBookedSeats(id, body.seats);

    setTimeout(() => {
      this.showingService.removeFromBookedSeats(id, body.seats);
    }, 900000);

    // 15 min = 900000

    if (!response) {
      throw new HttpException(ResponseDictionary.movieNotUpdated, 400);
    }

    return {
      message: ResponseDictionary.movieUpdated,
      showing: response,
    };
  }

  @Public()
  @Patch(':id/paid')
  async addToPaidSeats(@Param('id') id: number, @Body() body) {
    const response = await this.showingService.addToPaidSeats(id, body.seats);

    if (!response) {
      throw new HttpException(ResponseDictionary.movieNotUpdated, 400);
    }

    return {
      message: ResponseDictionary.movieUpdated,
      showing: response,
    };
  }

  @Public()
  @Patch(':id/remove')
  async removeFromBookedSeats(@Param('id') id: number, @Body() body) {
    const response = await this.showingService.removeFromBookedSeats(
      id,
      body.seats,
    );

    return {
      message: ResponseDictionary.movieUpdated,
    };
  }
}
