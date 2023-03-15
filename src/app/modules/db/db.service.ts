import { HttpException, Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { Pool } from 'pg';

config();
@Injectable()
export class DBService {
  private static getDBPool() {
    return new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }

  async isReady() {
    try {
      await DBService.getDBPool().query('SELECT 1');
      return true;
    } catch (err) {
      throw new HttpException('Błąd połączenia z bazą danych', 500);
    }
  }

  async query(query: string) {
    try {
      const response = await DBService.getDBPool().query(query);

      return response.rows;
    } catch (err) {
      console.log(err);
      throw new HttpException('Błąd połączenia z bazą danych', 500);
    }
  }

  async queryOne(query: string) {
    try {
      const response = await DBService.getDBPool().query(query);

      if (Array.isArray(response.rows) && response.rows.length > 0) {
        return {
          data: response.rows[0],
          isError: false,
        };
      }
      return {
        data: null,
        isError: true,
      };
    } catch (err) {
      return {
        data: err,
        isError: true,
      };
    }
  }
}
