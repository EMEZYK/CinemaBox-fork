import { Injectable } from '@nestjs/common';

import { DBService } from '../db/db.service';
import { CreatePromoCodeDto } from './dto/create-promo_code.dto';

@Injectable()
export class PromoCodesService {
  constructor(private dbService: DBService) {}

  async createPromoCode(createPromoCodeDto: CreatePromoCodeDto) {
    try {
      const { code, discount } = createPromoCodeDto;

      const result = await this.dbService.query(`
            INSERT
            INTO
                promo_codes
                    (promo_code, value)
            VALUES
                ('${code}', ${discount})
      `);

      const updatedResult = await this.dbService.query(`
            SELECT
                promo_id as id,
                promo_code,
                value
            FROM
                promo_codes
      `);

      return {
        data: updatedResult,
        isError: false,
      };
    } catch (error) {
      return {
        isError: true,
      };
    }
  }

  async getAllPromoCodes() {
    try {
      const result = await this.dbService.query(`
          SELECT
              promo_id as id,
              promo_code,
              value
          FROM
              promo_codes
      `);

      if (Array.isArray(result) && result.length > 0) {
        return result;
      }

      return null;
    } catch (err) {
      return null;
    }
  }

  async update(id: number, body) {
    try {
      const { promo_code, discount } = body;

      const promoCode = await this.getAllPromoCodes();

      const isCodeExist = promoCode.find(
        (item) => item.promo_code === promo_code,
      );

      if (!isCodeExist) {
        const result = await this.dbService.query(`
        UPDATE
        promo_codes
    SET
        promo_code = ${promo_code ? `'${promo_code}'` : 'promo_code'},
        value = ${discount ? `${discount}` : 'value'}
    WHERE
        promo_id = ${id}
      `);

        if (result) {
          const updatedResult = await this.dbService.query(`
          SELECT
              promo_id as id,
              promo_code,
              value
          FROM
              promo_codes
      `);
          return {
            data: updatedResult,
            isError: false,
          };
        }
      } else {
        return {
          isNameError: true,
        };
      }

      return {
        isError: true,
      };
    } catch (err) {
      return {
        isError: true,
      };
    }
  }

  async getPromoCode(id: number) {
    try {
      const result = await this.dbService.query(`
          SELECT
              promo_id as id,
              promo_code,
              value
          FROM
              promo_codes
          WHERE
              promo_id = ${id}
      `);

      if (Array.isArray(result) && result.length > 0) {
        return result[0];
      }

      return null;
    } catch (err) {
      return null;
    }
  }

  async remove(id: number) {
    try {
      const result = await this.dbService.query(`
          DELETE
          FROM
              promo_codes
          WHERE
              promo_id = ${id}
      `);

      const updatedResult = await this.dbService.query(`
            SELECT
                promo_id as id,
                promo_code,
                value
            FROM
                promo_codes
      `);

      return {
        data: updatedResult,
        isError: false,
      };
    } catch (err) {
      return {
        isError: true,
      };
    }
  }
}
