import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { DbModule } from '../db/db.module';
import { UserModule } from '../user/user.module';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [DbModule, UserModule, MoviesModule],
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [WishlistService],
})
export class WishlistModule {}
