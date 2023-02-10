import { Injectable } from '@nestjs/common';
import { DBService } from 'src/app/modules/db/db.service';

@Injectable()
export class RatingsService {
  constructor(private dbService: DBService) {}

  async updateRating(id: number, rating: number, user_id: number) {
    try {
      // if user_id is in user_id array, return error

      const isUserInArray = await this.dbService.query(`
        SELECT user_id
        FROM ratings
        WHERE movie_id = ${id}
      `);

      if (isUserInArray[0].user_id.includes(user_id)) {
        return {
          userAlreadyRated: true,
        };
      }

      const result = await this.dbService.query(`
        UPDATE ratings
        SET
          rating = rating || ${rating},
          user_id = user_id || ${user_id}
        WHERE movie_id = ${id}
      `);

      const data = await this.dbService.query(`
        SELECT rating
        FROM ratings
        WHERE movie_id = ${id}
      `);

      const ratings = data[0].rating;
      const averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

      await this.dbService.query(`
        UPDATE movies
        SET rating = ${averageRating}
        WHERE movie_id = ${id}
      `);

      const response = {
        movie_id: +id,
        rating: averageRating,
      };

      return {
        isError: false,
        data: response,
      };
    } catch (err) {
      console.log(err);
      return {
        isError: true,
      };
    }
  }
}
