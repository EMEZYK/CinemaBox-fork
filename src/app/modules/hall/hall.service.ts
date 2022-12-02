import { Injectable } from '@nestjs/common';

import { UpdateHallDto } from './dto/update.hall.dto';
import { DBService } from '../db/db.service';
import { CreateHallData, UpdateHallData } from './hall.types';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

@Injectable()
export class HallService {
  constructor(private readonly dbService: DBService) {}

  async createHall(createHallData: CreateHallData) {
    try {
      const { rows = 10, columns = 16, hall_no } = createHallData;

      if (rows < 1 || columns < 1) {
        return {
          isError: true,
          data: null,
        };
      }

      if (hall_no < 1 || hall_no > 50) {
        return {
          isError: true,
          data: null,
        };
      }

      if (rows > 26) {
        return {
          isError: true,
          data: null,
        };
      }

      const rowsArray = alphabet.slice(0, +rows).split('');
      const columnsArray = Array.from({ length: +columns }, (_, i) => i + 1);

      const result = await this.dbService.query(`
        INSERT
        INTO
            halls
                (hall_no, rows, columns)
        VALUES
            (${hall_no}, ARRAY['${rowsArray}'], ARRAY['${columnsArray}'])
        RETURNING
            hall_id as id
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

  async getHalls(sortBy: string = 'hall_id') {
    try {
      const result = await this.dbService.query(`
        SELECT
            hall_id as id,
            hall_no as hallNo,
            rows,
            columns
        FROM
            halls
        ORDER BY
            ${sortBy}
      `);

      if (Array.isArray(result) && result.length > 0) {
        return result;
      }

      return null;
    } catch (err) {
      return {
        isError: true,
        data: err,
      };
    }
  }

  async getHall(id: number) {
    try {
      const result = await this.dbService.query(`
        SELECT
            hall_id as id,
            hall_no as hallNo,
            rows,
            columns
        FROM
            halls
        WHERE
            hall_id = ${id}
      `);

      if (Array.isArray(result) && result.length > 0) {
        return result[0];
      }

      return null;
    } catch (err) {
      return {
        isError: true,
        data: err,
      };
    }
  }

  async updateHall(id: number, updateHallData: UpdateHallData) {
    const { rows, columns } = updateHallData;

    const updatedRowsArray = alphabet.slice(0, +rows).split('');
    const updatedColumnsArray = Array.from({ length: +columns }, (_, i) => i + 1);

    try {
      const result = await this.dbService.query(`
        UPDATE
            halls
        SET
            rows = ${rows ? `ARRAY['${updatedRowsArray}']` : 'rows'},
            columns = ${columns ? `ARRAY['${updatedColumnsArray}']` : 'columns'}
        WHERE
            hall_id = ${id}
      `)

      return {
        isError: false,
        data: result,
      }

    } catch(err) {
      return {
        isError: true,
        data: err,
      };
    }
  }

  async deleteHall(id: number) {
    try {
      const result = await this.dbService.query(`
        DELETE
        FROM
            halls
        WHERE
            hall_id = ${id}
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
