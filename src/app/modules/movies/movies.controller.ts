import { Body, Controller, Get, HttpException, Param, Post } from '@nestjs/common';

import ResponseDictionary from 'src/app/dictionaries/Response.dictionary';
import { CreateMovieDto } from './dto/movie.create.dto';
import { MoviesService } from './movies.service';

@Controller('/movies')
export class MoviesController {
  constructor(
    private readonly movieService: MoviesService
  ) {}

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
    const { isError, data } = await this.movieService.createMovie(createMovieDto);

    if (isError) {
      throw new HttpException(ResponseDictionary.movieNotCreated, 400);
    }

    return {
      id: data.data.id,
    };
  }
}
