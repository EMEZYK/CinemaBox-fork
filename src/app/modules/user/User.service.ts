import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';

import { DBService } from '../db/db.service';
import { UserPostData } from './user.types';

const jwt = require('jsonwebtoken');

config();

@Injectable()
export class UserService {
  constructor(private readonly dbService: DBService) {}

  async getUser(id: number) {
    try {
      const result = await this.dbService.query(`
        SELECT user_id as id,
                email,
                phone_number as phone,
                first_name as firstName,
                last_name as lastName,
                is_admin as isAdmin
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

  async getUsers(sortBy: string = 'user_id') {
    try {
      const result = await this.dbService.query(`
          SELECT user_id      as id,
                 email,
                 phone_number as phone,
                 first_name   as firstName,
                 last_name    as lastName
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
            users (email, phone_number, first_name, last_name, "password")
        VALUES
            ('${email}', '${phoneNumber}', '${firstName}', '${lastName}', '${password}')
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

  updateUser() {
    return true;
  }

  deleteUser() {
    return true;
  }
}
