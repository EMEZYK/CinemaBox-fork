import { Injectable } from '@nestjs/common';
import { DBService } from 'src/app/modules/db/db.service';

@Injectable()
export class NewsletterService {
  constructor(private readonly dbService: DBService) {}
  async getNewsletter() {
    try {
      const result = await this.dbService.query('SELECT * FROM newsletter');

      return {
        isError: false,
        data: result,
      };
    } catch (error) {
      return {
        isError: true,
        data: error,
      };
    }
  }

  async checkIfEmailExists(email: string) {
    try {
      const result = await this.dbService.query(`
        SELECT
            *
        FROM
            newsletter
        WHERE
            email = '${email}'
      `);

      if (result.length === 0) {
        return {
          isError: false,
          data: false,
        };
      }

      return {
        isError: false,
        data: true,
      };
    } catch (error) {
      return {
        isError: true,
        data: error,
      };
    }
  }

  async remove(id: number) {
    try {
      const result = await this.dbService.query(`
        DELETE
        FROM
            newsletter
        WHERE
            newsletter_id = ${id}
        RETURNING
            *
      `);

      return {
        isError: false,
        data: result,
      };
    } catch (error) {
      return {
        isError: true,
        data: error,
      };
    }
  }
}
