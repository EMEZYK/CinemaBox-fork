import { Injectable } from '@nestjs/common';

import { DBService } from '../db/db.service';
import { CreateHallData, UpdateHallData } from './hall.types';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

@Injectable()
export class HallService {
  constructor(private readonly dbService: DBService) {}

  async createHall(createHallData: CreateHallData) {
    try {
      const { rows = 10, columns = 16, hall_no } = createHallData;

      let hallNo = hall_no;

      if (rows < 1 || columns < 1) {
        return {
          isError: true,
          message: 'Rząd i kolumna muszą być większe od 0',
        };
      }

      if (hall_no < 1 || hall_no > 50) {
        return {
          isError: true,
          message: 'Numer sali musi być większy od 0 i mniejszy od 50',
        };
      }

      if (rows > 26) {
        return {
          isError: true,
          message: 'Maksymalna liczba rzędów to 26',
        };
      }

      if (!hallNo) {
        const lastHall = await this.dbService.query(`
          SELECT
              hall_no
          FROM
              halls
          ORDER BY
              hall_no DESC
          LIMIT 1
        `);

        if (lastHall.length) {
          hallNo = lastHall[0].hall_no + 1;
        } else {
          hallNo = 1;
        }
      }

      const hallNoExists = await this.dbService.query(`
        SELECT
            hall_no
        FROM
            halls
        WHERE
            hall_no = ${hallNo}
      `);

      if (hallNoExists.length) {
        return {
          isError: true,
          message: 'Sala o podanym numerze już istnieje',
        };
      }

      const rowsArray = alphabet.slice(0, +rows).split('');
      const columnsArray = Array.from({ length: +columns }, (_, i) => i + 1);
      const capacity = rows * columns;

      const result = await this.dbService.query(`
        INSERT
        INTO
            halls
                (hall_no, rows, columns, capacity)
        VALUES
            (${hallNo}, '{${rowsArray}}', '{${columnsArray}}', ${capacity})
        RETURNING
            hall_id as id
      `);

      const updatedHalls = await this.dbService.query(`
        SELECT
          *
        FROM
          halls
        `);

      return {
        isError: false,
        message: 'Sala została pomyślnie dodana',
        data: updatedHalls,
      };
    } catch (err) {
      return {
        isError: true,
        message: 'Wystąpił błąd podczas dodawania sali',
        data: err,
      };
    }
  }

  async getHalls(sortBy = 'hall_id') {
    try {
      const result = await this.dbService.query(`
        SELECT
            hall_id as id,
            hall_no as hallNo,
            rows,
            columns,
            capacity
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
            columns,
            capacity
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
    const updatedColumnsArray = Array.from(
      { length: +columns },
      (_, i) => i + 1,
    );

    try {
      const result = await this.dbService.query(`
        UPDATE
            halls
        SET
            rows = ${rows ? `'{${updatedRowsArray}}'` : 'rows'},
            columns = ${columns ? `'{${updatedColumnsArray}}'` : 'columns'},
            capacity = ${rows && columns ? rows * columns : 'capacity'}
        WHERE
            hall_id = ${id}
      `);

      const updatedHalls = await this.dbService.query(`
        SELECT
          *
        FROM
          halls
        `);

      return {
        isError: false,
        data: updatedHalls,
      };
    } catch (err) {
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
