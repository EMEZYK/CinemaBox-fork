import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';

import { CreateShowingDto } from './dto/create.showing.dto';
import { DBService } from '../db/db.service';
import { ShowingUpdateData } from './showing.types';

@Injectable()
export class ShowingService {
  constructor(private readonly dbService: DBService) {}

  async createShowing(createShowingDto: CreateShowingDto) {
    try {
      const { movie_id, hall_id, date_start } = createShowingDto;

      const movieDuration = await this.dbService.query(`
        SELECT
            duration
        FROM
            movies
        WHERE
            movie_id = ${movie_id}
    `);

      if (!movieDuration[0].duration) {
        return {
          isError: true,
        };
      }

      const result = await this.dbService.query(`
        INSERT
        INTO
          showings 
              (movie_id, hall_id, date_start, date_end, duration, break)
        VALUES
              (${movie_id}, ${hall_id}, '${dayjs(
        date_start,
      ).format()}', '${dayjs(date_start)
        .add(movieDuration[0].duration, 'minute')
        .format()}', ${movieDuration[0].duration}, ${15})
        RETURNING showings_id as id
      `);

      return {
        isError: false,
        data: result[0],
      };
    } catch (err) {
      return {
        data: err,
        isError: true,
      };
    }
  }

  async getShowing(id: number) {
    try {
      const result = await this.dbService.query(`
        SELECT
            showings_id as id,
            movie_id as movieId,
            hall_id as hallId,
            date_start as dateStart,
            date_end as dateEnd,
            duration,
            break
        FROM
            showings
        WHERE
            showings_id = ${id}
      `);

      return {
        isError: false,
        data: result[0],
      };
    } catch (err) {
      return {
        isError: true,
        data: err,
      };
    }
  }

  async getShowings(sortBy = 'showings_id') {
    try {
      const response = await this.dbService.query(`
        SELECT
          showings_id as id,
          movie_id as movieId,
          hall_id as hallId,
          date_start as dateStart,
          date_end as dateEnd,
          duration,
          break
        FROM
          showings
        ORDER BY ${sortBy}
      `);

      if (Array.isArray(response) && response.length > 0) {
        return response;
      }
    } catch (err) {
      return null;
    }
  }

  async deleteShowing(id: number) {
    try {
      const result = await this.dbService.query(`
        DELETE
        FROM
            showings
        WHERE
            showings_id = ${id}
      `);

      return {
        isError: false,
        data: result,
      };
    } catch (err) {
      return {
        isError: true,
        data: err,
      };
    }
  }

  async updateShowing(id: number, updateShowingDto: ShowingUpdateData) {
    const { movie_id, hall_id, date_start, duration } = updateShowingDto;

    try {
      const result = await this.dbService.query(`
        UPDATE
            showings
        SET
            movie_id = ${movie_id ? `${movie_id}` : 'movie_id'},
            hall_id = ${hall_id ? `${hall_id}` : 'hall_id'},
            date_start = ${
              date_start ? `'${dayjs(date_start).format()}'` : 'date_start'
            },
            date_end = ${
              date_start
                ? `'${dayjs(date_start).add(duration, 'minute').format()}'`
                : 'date_end'
            },
            duration = ${duration ? `${duration}` : 'duration'}
        WHERE
            showings_id = ${id}
      `);

      return {
        isError: false,
        data: result,
      };
    } catch (err) {
      return {
        isError: true,
        data: err,
      };
    }
  }
}
