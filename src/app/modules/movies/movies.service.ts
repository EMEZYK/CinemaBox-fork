import { Injectable } from '@nestjs/common';

import { DBService } from '../db/db.service';
import { MoviePostData } from './movies.types';

@Injectable()
export class MoviesService {
  constructor(private readonly dbService: DBService) {}

  async getMovie(id: number) {
    try {
      const result = await this.dbService.query(`
        SELECT movie_id as id,
                title,
                description,
                is_premiere as isPremiere,
                duration,
                category,
                age,
                short_description as shortDescription,
                img,
                price,
                rating,
                hours
        FROM movies
        WHERE movie_id = ${id}
      `);

      if (Array.isArray(result) && result.length > 0) {
        return {
          data: result[0],
        };
      }
    } catch (err) {
      return null;
    }
  }

  async getMovies(sortBy: string = 'movie_id') {
    try {
      const result = await this.dbService.query(`
      SELECT movie_id as id,
              title,
              description,
              is_premiere as isPremiere,
              duration,
              category,
              age,
              short_description as shortDescription,
              img,
              price,
              rating,
              hours
      FROM movies
      ORDER BY ${sortBy}
      `)
    } catch (err) {
      return null;
    }
  }

  async createMovie(moviePostData: MoviePostData) {
    try {
      const {
        title,
        description,
        shortDescription,
        isPremiere,
        duration,
        category,
        age,
        img,
        price,
        rating,
        hours,
      } = moviePostData;

      const result = await this.dbService.query(`
        INSERT
        INTO 
            movies (title, description, short_description, is_premiere, duration, category, age, img, price, rating, hours)
        VALUES
            ('${title}', '${description}', '${shortDescription}', ${isPremiere}, '${duration}', '${category}', '${age}', '${img}', ${price}, ${rating}, '${hours}')
        RETURNING movie_id as id
      `);

      return {
        data: result[0],
        isError: false,
      }
    } catch (err) {
      return {
        data: err,
        isError: true,
      }
    }
  }
}
