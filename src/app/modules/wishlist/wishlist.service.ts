import { Injectable } from '@nestjs/common';
import { DBService } from '../db/db.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private readonly dbService: DBService) {}

  async createWishList(createWishlistDto: CreateWishlistDto) {
    try {
      const { user_id, movie_id } = createWishlistDto;

      const check = await this.dbService.query(`
        SELECT
            *
        FROM
            wishlist
        WHERE
            user_id = ${user_id} AND movie_id = ${movie_id}
      `);

      if (Array.isArray(check) && check.length > 0) {
        return {
          alreadyAdded: 'Film jest już w ulubionych',
        };
      }

      const result = await this.dbService.query(`
        INSERT INTO 
            wishlist 
                (user_id, movie_id)
        VALUES
            (${user_id}, ${movie_id})
      `);

      return {
        message: 'Dodano film do ulubionych',
      };
    } catch (error) {
      return {
        isError: true,
      };
    }
  }

  findAll() {
    return `This action returns all wishlist`;
  }

  async getUserWishList(id: string) {
    try {
      const result = await this.dbService.query(`
        SELECT
            wishlist.id,
            wishlist.user_id,
            wishlist.movie_id,
            movies.title,
            movies.img,
            movies.description
        FROM
            wishlist
        INNER JOIN movies ON wishlist.movie_id = movies.movie_id
        WHERE
            wishlist.user_id = ${id}
      `);

      return {
        data: result,
      };
    } catch (error) {
      return {
        isError: true,
      };
    }
  }

  async removeFromWishList(id: string) {
    try {
      const result = await this.dbService.query(`
        DELETE FROM
            wishlist
        WHERE
            wishlist.id = ${id}
      `);

      return {
        message: 'Usunięto film z ulubionych',
      };
    } catch (error) {
      return {
        isError: true,
      };
    }
  }
}
