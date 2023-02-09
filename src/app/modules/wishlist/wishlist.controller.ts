import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Public } from 'src/app/declarations/isPublic';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Public()
  @Post()
  async createWishList(@Body() createWishlistDto: CreateWishlistDto) {
    const { alreadyAdded, message, isError } =
      await this.wishlistService.createWishList(createWishlistDto);

    if (isError) {
      throw new HttpException('Coś poszło nie tak', 500);
    }

    if (alreadyAdded) {
      throw new HttpException('Film jest już dodany do ulubionych', 400);
    }

    return {
      message,
    };
  }

  @Get()
  findAll() {
    return this.wishlistService.findAll();
  }

  @Get(':id')
  async getUserWishList(@Param('id') id: string) {
    const { isError, noWishlist, data } =
      await this.wishlistService.getUserWishList(id);

    if (isError) {
      throw new HttpException('Nie masz ulubionych filmów', 404);
    }

    if (noWishlist) {
      throw new HttpException('Nie masz ulubionych filmów', 404);
    }

    return {
      wishlist: data,
    };
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistService.update(+id, updateWishlistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishlistService.remove(+id);
  }
}
