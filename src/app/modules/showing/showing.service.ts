import { HttpException, Injectable } from '@nestjs/common';
import dayjs from '../../utils/dayjs';

import { DBService } from '../db/db.service';
import { ShowingUpdateData } from './showing.types';
import ShowingQueryRepository from './utlis/ShowingQueryRepository';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class ShowingService {
  constructor(
    private readonly showingQueryRepository: ShowingQueryRepository,
    private readonly movieService: MoviesService,
    private readonly dbService: DBService,
    ) {}

  async createShowing(data: any) {
    const movie = await this.movieService.getMovie(data.movie_id);

    if (!movie || (Array.isArray(movie) && movie.length === 0)) {
      throw new HttpException('Movie not found', 404);
    }

    const duration = await this.dbService.query(`
      SELECT duration
      FROM movies
      WHERE movie_id = ${data.movie_id}
    `)

    const convertedData = {
      year: dayjs(data.date_start).year(),
      month: dayjs(data.date_start).month(),
      week: dayjs(data.date_start).week(),
      day: dayjs(data.date_start).date(),
      start: data.start,
      end: dayjs(data.start).add(duration[0].duration, 'minute').format('YYYY-MM-DD HH:mm'),
      hall_id: data.hall_id,
      movie_id: data.movie_id
    }

    return this.showingQueryRepository.createShowing(convertedData)
  }

  async getShowing(id: number) {
    try {
      const result = await this.dbService.query(`
        SELECT
            showing_id as id,
            movie.title as movieTitle,
            movie.description as movieDescription,
            movie.short_description as movieShortDescription,
            movie.genre as movieGenre,
            movie.is_premiere as movieIsPremiere,
            movie.age as movieAge,
            movie.img as movieImg,
            movie.rating as movieRating,
            movie.duration as movieDuration,
            hall_id as hallId,
            date_start as dateStart,
            date_end as dateEnd,

            break
        FROM
            showings
        INNER JOIN
            movies movie
        ON
            movie.movie_id = showings.movie_id
        WHERE
            showing_id = ${id}
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

  async getShowings(
    date: Date | string,
    filters: string[],
    hallId?: number
    ) {
    const showings = await this.showingQueryRepository.getShowingsByFilter(
      date,
      filters,
      hallId,
    )

    if (!Array.isArray(showings)) {
      throw new HttpException({
        message: 'Wystąpił błąd podczas pobierania seansów',
        data: showings
      }, 404)
    }

    let showingsCount = 0

    const mapped = showings.map(({ id, movieid, hallid, middlehours, start, end }) => { 
      showingsCount++

      return {
        id,
        movieid,
        hallid,
        start,
        end,
        middlehours
      }
    })
    return {
      showings: mapped,
      count: showingsCount
    }
  }

  async deleteShowing(id: number) {
    try {
      const result = await this.dbService.query(`
        DELETE
        FROM
            showings
        WHERE
            showing_id = ${id}
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
            showing_id = ${id}
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
