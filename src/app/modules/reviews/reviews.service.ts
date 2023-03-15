import { Injectable } from '@nestjs/common';
import { DBService } from '../db/db.service';
import { CreateReviewDto } from './dto/create-review.dto';

const reviews = [
  {
    id: 1,
    review: 'pierwszsreview',
    user_id: 2,
    movie_id: 3,
  },
];

@Injectable()
export class ReviewsService {
  constructor(private readonly dbService: DBService) {}

  getAll() {
    return reviews;
  }

  async addReview(data: CreateReviewDto) {
    const { review, user_id } = data;

    const result = await this.dbService.query(`
    INSERT 
    INTO
     reviews
     (
        review,
        movie_id,
        user_id
     )
     VALUES ('${review}', '${user_id}', '${movie_id}'
    `);
    return {
      data: result[0],
      isError: false,
    };
  }
  catch(err) {
    return {
      data: err,
      isError: true,
    };
  }
}
