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

import { ShowingService } from './showing.service';
import { CreateShowingDto } from './dto/create.showing.dto';
import ResponseDictionary from 'src/app/dictionaries/Response.dictionary';
import { Public } from 'src/app/declarations/isPublic';
import { UpdateShowingDto } from './dto/update.showing.dto';

@Controller('showings')
export class ShowingController {
  constructor(private readonly showingService: ShowingService) {}

  @Post()
  async createShowing(@Body() createShowingDto: CreateShowingDto) {
    const { isError } = await this.showingService.createShowing(
      createShowingDto,
    );

    if (isError) {
      throw new HttpException(ResponseDictionary.showingNotCreated, 400);
    }

    return {
      message: ResponseDictionary.showingCreated,
    };
  }

  @Public()
  @Get(':id')
  async getShowing(@Param('id') id: number) {
    const response = await this.showingService.getShowing(id);

    if (!response) {
      throw new HttpException(ResponseDictionary.movieNotFound, 404);
    }

    return {
      showing: response.data,
    };
  }

  @Public()
  @Get()
  async getShowings() {
    const response = await this.showingService.getShowings();

    if (!response) {
      throw new HttpException(ResponseDictionary.moviesError, 404);
    }

    return {
      showings: response,
      count: response.length,
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
}
