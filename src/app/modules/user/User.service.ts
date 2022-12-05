import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';

import { DBService } from '../db/db.service';
import { UserPostData, userPatchData } from './user.types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

config();

@Injectable()
export class UserService {
  constructor(private readonly dbService: DBService) {}

  async getMe(token: string) {
    const secret = process.env.SECRET;
    const formattedToken = token.split(' ')[1];

    try {
      const result = jwt.verify(formattedToken, secret, (err, decoded) => {
        if (err) {
          return {
            statusCode: 401,
            message: ['Nieautoryzowany'],
          };
        }

        return {
          statusCode: 200,
          message: ['Autoryzacja poprawna'],
          data: decoded,
        };
      });

      const userId = await this.dbService.query(`
        SELECT 
            user_id,
            phone_number as phone,
            first_name as firstName,
            last_name as lastName,
            role
        FROM 
            users
        WHERE
            email = '${result?.data?.email}'
      `);

      return {
        email: result?.data?.email,
        phone: userId[0].phone,
        firstName: userId[0].firstname,
        lastName: userId[0].lastname,
        userId: userId[0].user_id,
        role: userId[0].role,
      };
    } catch (err) {
      return {
        statusCode: 500,
        message: ['Internal server error'],
      };
    }
  }

  async getUserByEmail(email: string): Promise<{ password: string } | null> {
    try {
      const result = await this.dbService.query(`
      SELECT 
          email,
          user_id as id,
          "password"
      FROM 
          users
      WHERE 
          email = '${email}'
    `);

      if (Array.isArray(result) && result.length > 0) {
        return result[0];
      }

      return null;
    } catch (err) {
      return null;
    }
  }

  async getUser(id: number) {
    try {
      const result = await this.dbService.query(`
        SELECT user_id as id,
                email,
                phone_number as phone,
                first_name as firstName,
                last_name as lastName
        FROM users
        WHERE user_id = ${id}
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

  async getUsers(sortBy = 'user_id') {
    try {
      const result = await this.dbService.query(`
          SELECT user_id      as id,
                 email,
                 phone_number as phone,
                 first_name   as firstName,
                 last_name    as lastName,
                 role
          FROM users
          ORDER BY ${sortBy}
      `);

      if (Array.isArray(result) && result.length > 0) {
        return result;
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  async createUser(userPostData: UserPostData) {
    try {
      const { email, phoneNumber, firstName, lastName, password } =
        userPostData;

      const result = await this.dbService.queryOne(`
        INSERT
        INTO
            users (email, phone_number, first_name, last_name, "password", role, is_active)
        VALUES
            ('${email}', '${phoneNumber}', '${firstName}', '${lastName}', '${password}', '${0}', true)
        RETURNING user_id as id
      `);

      return {
        data: result,
        isError: false,
      };
    } catch (err) {
      return {
        data: err,
        isError: true,
      };
    }
  }

  async updateUser(id: number, userPatchData: userPatchData) {
    try {
      const { email, phoneNumber, firstName, lastName, password } =
        userPatchData;

      const result = await this.dbService.query(`
        UPDATE
            users
        SET
            email = ${email ? `'${email}'` : 'email'},
            phone_number = ${phoneNumber ? `'${phoneNumber}'` : 'phone_number'},
            first_name = ${firstName ? `'${firstName}'` : 'first_name'},
            last_name = ${lastName ? `'${lastName}'` : 'last_name'},
            "password" = ${password ? `'${password}'` : '"password"'}
        WHERE
            user_id = ${id}
      `);

      return {
        data: result,
        isError: false,
      };
    } catch (err) {
      return {
        data: err,
        isError: true,
      };
    }
  }

  async deleteUser(id: number) {
    try {
      const result = this.dbService.query(`
        DELETE
        FROM users
        WHERE user_id = ${id}
      `);

      return {
        data: result,
        isError: false,
      };
    } catch (err) {
      return {
        data: err,
        isError: true,
      };
    }
  }

  async refreshToken(token: string) {
    
  }
}
