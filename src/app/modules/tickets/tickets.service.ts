import { HttpException, Injectable } from '@nestjs/common';
import ResponseDictionary from 'src/app/dictionaries/Response.dictionary';
import { DBService } from '../db/db.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    private readonly dbService: DBService,
  ) {}
  create(createTicketDto: CreateTicketDto) {
    return 'This action adds a new ticket';
  }

  async getTickets() {
    try {
      const result = await this.dbService.query(`
        SELECT
            *
        FROM
            ticket_types
        ORDER BY
            price
        DESC
      `)

      if (Array.isArray(result) && result.length > 0) {
        return result
      }

      return null
    } catch (err) {
      console.log(err)
      return null
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
