import { Injectable } from '@nestjs/common';

import { DBService } from '../db/db.service';
import { MoviePostData, MovieUpdateData } from './movies.types';

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
                genre,
                age,
                short_description as shortDescription,
                img,
                price,
                rating
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

  async getMovies(sortBy = 'movie_id') {
    try {
      const result = await this.dbService.query(`
      SELECT movie_id as id,
              title,
              description,
              is_premiere as isPremiere,
              duration,
              genre,
              age,
              short_description as shortDescription,
              img,
              price,
              rating
      FROM movies
      ORDER BY ${sortBy}
      `);

      if (Array.isArray(result) && result.length > 0) {
        return result;
      }

      return null;
    } catch (err) {
      return null;
    }
  }

  async createMovie(moviePostData: MoviePostData) {
    try {
      const {
        title,
        description,
        isPremiere,
        duration,
        genre,
        age,
        img,
        price,
        rating,
      } = moviePostData;

      const result = await this.dbService.query(`
        INSERT
        INTO 
            movies 
                (title, description, short_description, is_premiere, duration, genre, age, img, price, rating)
        VALUES
            ('${title}', '${description}', '${description.slice(
        0,
        100,
      )}', ${isPremiere}, '${duration}', ARRAY['${genre}'], '${age}', '${img}', ${
        price ? `${price}` : 22
      }, ${rating})
        RETURNING movie_id as id
      `);

      console.log(result[0]);
      return {
        data: result[0],
        isError: false,
      };
    } catch (err) {
      return {
        data: err,
        isError: true,
      };
    }
  }

  async updateMovie(id: number, movieUpdateData: MovieUpdateData) {
    try {
      const { title, description, genre, age } = movieUpdateData;

      const result = await this.dbService.query(`
        UPDATE
            movies
        SET
            title = ${title ? `'${title}'` : 'title'},
            description = ${description ? `'${description}'` : 'description'},
            short_description = ${
              description
                ? `'${description.slice(0, 100)}'`
                : 'short_description'
            },
            genere = ${genre ? `'${genre}'` : 'category'},
            age = ${age ? `'${age}'` : 'age'}
        WHERE
            movie_id = ${id}
      `);

      return {
        data: result,
        isError: false,
      };
    } catch (err) {
      return {
        data: err,
        isError: true,
      };
    }
  }

  async deleteMovie(id: number) {
    try {
      const result = await this.dbService.query(`
        DELETE FROM movies
        WHERE movie_id = ${id}
      `);

      return {
        data: result,
        isError: false,
      };
    } catch (err) {
      return {
        data: err,
        isError: true,
      };
    }
  }
}
