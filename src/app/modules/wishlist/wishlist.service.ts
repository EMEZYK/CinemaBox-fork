import { Injectable } from '@nestjs/common';
import { DBService } from '../db/db.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

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
          message: 'Movie already in wishlist',
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
        isError: false,
        message: 'Movie added to wishlist',
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

  findOne(id: number) {
    return `This action returns a #${id} wishlist`;
  }

  update(id: number, updateWishlistDto: UpdateWishlistDto) {
    return `This action updates a #${id} wishlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} wishlist`;
  }
}
