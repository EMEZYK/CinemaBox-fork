import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Public } from 'src/app/declarations/isPublic';

import ResponseDictionary from 'src/app/dictionaries/Response.dictionary';
import { CreateMovieDto } from './dto/movie.create.dto';
import { updateMovieDto } from './dto/movie.update.dto';
import { MoviesService } from './movies.service';

@Controller('/movies')
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}

  @Public()
  @Get(':id')
  async getMovie(@Param('id') id: number) {
    const response = await this.movieService.getMovie(id);

    if (!response) {
      throw new HttpException(ResponseDictionary.movieNotFound, 404);
    }

    return {
      movie: response,
    };
  }

  @Public()
  @Get()
  async getMovies() {
    const response = await this.movieService.getMovies();

    if (!response) {
      throw new HttpException(ResponseDictionary.moviesError, 404);
    }

    return {
      movies: response,
      count: response.length,
    };
  }

  @Post()
  async createMovie(@Body() createMovieDto: CreateMovieDto) {
    const { isError, data } = await this.movieService.createMovie(
      createMovieDto,
    );

    if (isError) {
      throw new HttpException(ResponseDictionary.movieNotCreated, 400);
    }

    return {
      message: ResponseDictionary.movieCreated,
      movies: data,
    };
  }

  @Delete(':id')
  async deleteMovie(@Param('id') id: number) {
    const { isError, data } = await this.movieService.deleteMovie(id);

    if (isError) {
      throw new HttpException(ResponseDictionary.movieNotDeleted, 400);
    }

    return {
      message: ResponseDictionary.movieDeleted,
      movies: data,
    };
  }

  @Patch(':id')
  async updateMovie(
    @Param('id') id: number,
    @Body() updateMovieDto: updateMovieDto,
  ) {
    const { isError, data } = await this.movieService.updateMovie(
      id,
      updateMovieDto,
    );

    if (isError) {
      throw new HttpException(ResponseDictionary.movieNotUpdated, 400);
    }

    return {
      message: ResponseDictionary.movieUpdated,
      movies: data,
    };
  }
}
