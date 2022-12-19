import { Injectable } from '@nestjs/common';
import { DBService } from '../db/db.service';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly dbService: DBService
  ) {}

  async createReservation(
    showing_id: number,
    seats: string[],
    user_id: number,
    ticket_no: number
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
                    ticket_no
                  )
          VALUES
              (
                ${showing_id},
                '{${seats}}',
                ${user_id},
                ${ticket_no}
              )
          RETURNING
              ticket_no as ticketNo
      `)

      await this.dbService.query(`
          UPDATE
              showings
          SET
              paid_seats = paid_seats || '{${seats}}'
          WHERE
              showing_id = ${showing_id}
      `)

      return {
        data: result[0],
        isError: false
      }
    } catch (err) {
      return {
        data: err,
        isError: true
      }
    }
  }

  findAll() {
    return `This action returns all reservations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
