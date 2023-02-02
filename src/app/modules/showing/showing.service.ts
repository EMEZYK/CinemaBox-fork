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
    console.log(data);
    const movie = await this.movieService.getMovie(data.movie_id);

    if (!movie || (Array.isArray(movie) && movie.length === 0)) {
      throw new HttpException('Movie not found', 404);
    }

    const duration = await this.dbService.query(`
      SELECT duration
      FROM movies
      WHERE movie_id = ${data.movie_id}
    `);

    const startTime = dayjs(data.start);
    const endTime = dayjs(data.start).add(+duration[0].duration + 15, 'minute');

    const middleHours = [];

    for (
      let currentTime = startTime;
      currentTime.isBefore(endTime);
      currentTime = currentTime.clone().add(30, 'minute')
    ) {
      middleHours.push(currentTime.format('HH:mm'));
    }

    middleHours.push(endTime.format('HH:mm'));

    const convertedData = {
      year: dayjs(data.date_start).year(),
      month: dayjs(data.date_start).month(),
      week: dayjs(data.date_start).week(),
      day: dayjs(data.date_start).date(),
      start: data.start,
      end: endTime.format('YYYY-MM-DD HH:mm:ss'),
      hall_id: data.hall_id,
      movie_id: data.movie_id,
      middlehours: `${middleHours}`,
    };

    return this.showingQueryRepository.createShowing(convertedData);
  }

  async getShowings(date: Date | string, filters: string[], hallId?: number) {
    const showings = await this.showingQueryRepository.getShowingsByFilter(
      date,
      filters,
      hallId,
    );

    if (!Array.isArray(showings)) {
      throw new HttpException(
        {
          message: 'Wystąpił błąd podczas pobierania seansów',
          data: showings,
        },
        404,
      );
    }

    let showingsCount = 0;

    const mapped = showings.map(
      ({
        id,
        movieid,
        hallid,
        hallno,
        middlehours,
        start,
        end,
        bookedseats,
        paidseats,
      }) => {
        showingsCount++;

        return {
          id,
          movieid,
          hallid,
          hallno,
          start,
          end,
          bookedseats,
          paidseats,
          middlehours,
        };
      },
    );
    return {
      showings: mapped,
      count: showingsCount,
    };
  }

  async getShowing(id: number) {
    try {
      const result = await this.dbService.query(`
      SELECT
          showing_id AS id,
          booked_seats as bookedseats,
          paid_seats as paidseats
      FROM
          showings
      WHERE
          showing_id = ${id}
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

  async getMovieByShowingId(id: number) {
    try {
      const result = await this.dbService.query(`
      SELECT
            showing_id AS id,
            start,
            booked_seats as bookedseats,
            paid_seats as paidseats,
            movies.movie_id as movieid,
            movies.title AS title,
            movies.duration AS duration,
            halls.hall_id AS hallid,
            halls.hall_no AS hallno,
            halls.columns AS columns,
            halls.rows AS rows
        FROM
            showings
        INNER JOIN movies ON movies.movie_id = showings.movie_id
        INNER JOIN halls ON halls.hall_id = showings.hall_id
        WHERE
            showing_id = ${id}
      `);

      if (Array.isArray(result) && result.length > 0) {
        return result[0];
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

  async addToBookedSeats(id: number, seats: string) {
    const bookedSeats = await this.dbService.query(`
      SELECT booked_seats
      FROM showings
      WHERE showing_id = ${id}
    `);

    if (bookedSeats[0].booked_seats) {
      if (bookedSeats[0].booked_seats.includes(seats)) {
        this.removeFromBookedSeats(id, seats);
      }
    }

    try {
      const result = await this.dbService.query(`
        UPDATE
            showings
        SET
            booked_seats = booked_seats || '{${seats}}'
        WHERE
            showing_id = ${id}
      `);

      return await this.getMovieByShowingId(id);
    } catch (err) {
      return {
        isError: true,
        data: err,
      };
    }
  }

  async addToPaidSeats(id: number, seats: string[]) {
    try {
      seats.forEach(async (seat, index) => {
        const result = await this.dbService.query(`
        UPDATE
            showings
        SET
            paid_seats = paid_seats || '{${seats[index]}}'
        WHERE
            showing_id = ${id}
        `);

        return {
          isError: false,
          data: result,
        };
      });
    } catch (err) {
      return {
        isError: true,
        data: err,
      };
    }
  }

  async removeFromBookedSeats(id: number, seats: string[] | string) {
    try {
      seats.forEach(async (seat, index) => {
        const result = await this.dbService.query(`
        UPDATE
            showings
        SET
            booked_seats = array_remove(booked_seats, '${seats[index]}')
        WHERE
            showing_id = ${id}
        `);

        return {
          isError: false,
          data: result,
        };
      });
    } catch (err) {
      return {
        isError: true,
        data: err,
      };
    }
  }
}
