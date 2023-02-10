import { Controller, Body, Patch, Param, HttpException } from '@nestjs/common';
import { RatingsService } from './ratings.service';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Patch(':id')
  async updateRating(@Param('id') id: number, @Body() body) {
    const { rating, user_id } = body;
    const { isError, data, userAlreadyRated } =
      await this.ratingsService.updateRating(id, rating, user_id);

    if (userAlreadyRated) {
      throw new HttpException('Już oceniłeś ten film', 400);
    }

    if (isError) {
      throw new HttpException('Wystąpił błąd', 500);
    }

    return data;
  }
}
