import { HttpException, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';

import { DBService } from '../../db/db.service';

@Injectable()
class ShowingQueryRepository {
  constructor(private readonly dbService: DBService) {}

  getShowingsByFilter = async (
    date: Date | string,
    filters: string[],
    hallId?: number,
  ) => {
    const time = this.convertDateToCustomValues(date);

    const filterKeys = [
      ...time,
      {
        key: 'hall_id',
        value: hallId,
      },
    ];

    const conditions = this.filtersParser(filterKeys, filters);

    const query = `
      SELECT
          showing_id as id,
          "year",
          "month",
          "week",
          "day",
          "start",
          "end",
          movie_id as movieId,
          hall_id as hallId,
          middle_hours as middleHours,
          booked_seats as bookedSeats,
          paid_seats as paidSeats,
          break
      FROM
          showings
      ${conditions && `WHERE ${conditions}`} 
      ORDER BY
          showings.year,
          showings.month,
          showings.day
    `;

    try {
      const result = await this.dbService.query(query);

      return result;
    } catch (err) {
      throw new HttpException('Wystąpił błąd podczas pobierania seansów', 500);
    }
  };

  private convertDateToCustomValues = (date: Date | string) => {
    const year = dayjs(date).year();
    const month = dayjs(date).month() + 1;
    const week = dayjs(date).week();
    const day = dayjs(date).date();
    const hour = dayjs(date).hour();
    const minute = dayjs(date).minute();

    return [
      {
        key: 'year',
        value: year,
      },
      {
        key: 'month',
        value: month,
      },
      {
        key: 'week',
        value: week,
      },
      {
        key: 'day',
        value: day,
      },
      {
        key: 'start_hour',
        value: hour,
      },
      {
        key: 'start_minute',
        value: minute,
      },
    ];
  };

  private filtersParser = (keys: any, filters: string[]) => {
    let query = ``;

    if (keys) {
      filters.map((filter, index) => {
        keys.forEach(({ key, value }) => {
          if (key === filter) {
            if (index && key) {
              query += ' AND ';
            }
            query += `${filter} = ${value}`;
          }
        });
      });
    }

    return query;
  };

  createShowing = async (data: any) => {
    const {
      year,
      month,
      week,
      day,
      start,
      end,
      movie_id,
      hall_id,
      middlehours,
    } = data;

    const query = `
      INSERT INTO
          showings
          (
              "year",
              "month",
              "week",
              "day",
              "start",
              "end",
              movie_id,
              hall_id,
              break,
              middle_hours
          )
      VALUES
          (
              ${year},
              ${month},
              ${week},
              ${day},
              '${start}',
              '${end}',
              ${movie_id},
              ${hall_id},
              ${15},
              '{${middlehours}}'
          )
      RETURNING
          showing_id as id
    `;

    // fix naprawić sprawdzanie dostępności seansu
    // if (!(await this.checkShowingAvailability(data))) {
    //   throw new HttpException('Seans jest już zajęty', 400)
    // }
    try {
      const response = await this.dbService.query(query);

      return response[0];
    } catch (err) {
      console.log(err);
      throw new HttpException('Wystąpił błąd podczas tworzenia seansu', 500);
    }
  };

  async checkShowingAvailability(data: any) {
    const { start, end, hall_id, movie_id } = data;

    const query = `
      SELECT NOT exists (
        SELECT 1
        FROM showings
        WHERE
          hall_id = ${hall_id}
          AND movie_id = ${movie_id}
          AND "start" < '${end}'
          AND "end" > '${start}'
      )
    `;

    try {
      const response = await this.dbService.query(query);

      return response[0]['?column?'];
    } catch (err) {
      throw new HttpException(
        'Wystąpił błąd podczas sprawdzania dostępności seansu',
        500,
      );
    }
  }
}

export default ShowingQueryRepository;
