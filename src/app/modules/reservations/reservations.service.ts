import { Injectable } from '@nestjs/common';
import { DBService } from '../db/db.service';

@Injectable()
export class ReservationsService {
  constructor(private readonly dbService: DBService) {}

  async createReservation(
    showing_id: number,
    seats: string[],
    user_id: number,
    ticket_no: number,
    blik_code: string,
    first_name: string,
    last_name: string,
    phone_number: string,
    email: string,
  ) {
    try {
      const result = await this.dbService.query(`
          INSERT
          INTO
              reservations
                  (
                    showing_id,
                    seats,
                    user_id,
                    ticket_no,
                    blik_code,
                    first_name,
                    last_name,
                    phone_number,
                    email
                  )
          VALUES
              (
                ${showing_id},
                '{${seats}}',
                ${user_id},
                ${ticket_no},
                '${blik_code}',
                '${first_name}',
                '${last_name}',
                '${phone_number}',
                '${email}'
              )
          RETURNING
              ticket_no as ticketNo
      `);

      await this.dbService.query(`
          UPDATE
              showings
          SET
              paid_seats = paid_seats || '{${seats}}'
          WHERE
              showing_id = ${showing_id}
      `);

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

  async getAllReservations() {
    try {
      const result = await this.dbService.query(`
          SELECT
              reservations.seats,
              reservations.ticket_no,
              reservations.first_name,
              reservations.last_name,
              reservations.email,
              reservations.phone_number,
              reservations.blik_code,
              reservations.user_id,
              reservations.showing_id,
              showings.start,
              showings.hall_id,
              movies.title
          FROM
              reservations
                  INNER JOIN showings ON showings.showing_id = reservations.showing_id
                  INNER JOIN movies ON movies.movie_id = showings.movie_id
          ORDER BY
              reservations.reservation_id
      `);
      if (Array.isArray(result) && result.length > 0) {
        return result;
      }

      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async getMyReservations(id: number) {
    try {
      const result = await this.dbService.query(`
          SELECT
              *
          FROM
              reservations
          WHERE
              user_id = ${id}
          ORDER BY
              reservation_id
      `);
      if (Array.isArray(result) && result.length > 0) {
        return result[0];
      }

      return null;
    } catch (err) {
      return null;
    }
  }

  async getReservationByTicket(ticketNo: number) {
    try {
      const result = await this.dbService.query(`
          SELECT
              *
          FROM
              reservations
          WHERE
              ticket_no = ${ticketNo}
          ORDER BY
              reservation_id
      `);
      if (Array.isArray(result) && result.length > 0) {
        return result[0];
      }

      return null;
    } catch (err) {
      return null;
    }
  }

  // refund reservation by ticket number only if it's showing starts not earlier than 24h from now
  async refundReservation(ticketNo: number) {
    try {
      const result = await this.dbService.query(`
          SELECT
              *
          FROM
              reservations
          WHERE
              ticket_no = ${ticketNo}
          ORDER BY
              reservation_id
      `);
      if (Array.isArray(result) && result.length > 0) {
        const reservation = result[0];
        const showing = await this.dbService.query(`
            SELECT
                *
            FROM
                showings
            WHERE
                showing_id = ${reservation.showing_id}
            ORDER BY
                showing_id
        `);
        if (Array.isArray(showing) && showing.length > 0) {
          const showingDate = new Date(showing[0].date);
          const now = new Date();
          if (showingDate.getTime() - now.getTime() > 86400000) {
            await this.dbService.query(`
                DELETE
                FROM
                    reservations
                WHERE
                    ticket_no = ${ticketNo}
            `);

            await this.dbService.query(`
                UPDATE
                    showings
                SET
                    paid_seats = paid_seats - '{${reservation.seats}}'
                WHERE
                    showing_id = ${reservation.showing_id}
            `);
            return {
              data: {
                message: 'Zwrot rezerwacji przebiegł pomyślnie',
              },
              isError: false,
            };
          } else {
            return {
              data: {
                message:
                  'Nie można zwrócić rezerwacji, ponieważ seans rozpocznie się za mniej niż 24h',
              },
              isError: true,
            };
          }
        }
      }

      return null;
    } catch (err) {
      return null;
    }
  }
}
