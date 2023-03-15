import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpException,
  Headers,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import ResponseDictionary from 'src/app/dictionaries/Response.dictionary';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async addReview(@Body() body: CreateReviewDto) {
    const { isError, data } = await this.reviewsService.addReview(body);

    if (isError) {
      throw new HttpException(ResponseDictionary.reviewNotCreated, 400);
    }

    return {
      message: ResponseDictionary.reviewCreated,
      reviews: data,
    };
  }

  @Get()
  async getReviews() {
    const response = await this.reviewsService.getAll();
    if (!response) {
      throw new HttpException(ResponseDictionary.reviewsError, 400);
    }
    return {
      reviews: response,
      count: response.length,
    };
  }
}
