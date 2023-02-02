import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { DbModule } from './modules/db/db.module';
import { UserModule } from './modules/user/user.module';
import { MoviesModule } from './modules/movies/movies.module';
import { ShowingModule } from './modules/showing/showing.module';
import { HallModule } from './modules/hall/hall.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { InfoModule } from 'src/app/modules/info/info.module';
import { PromoCodesModule } from 'src/app/modules/promo_codes/promo_codes.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';

@Module({
  imports: [
    DbModule,
    UserModule,
    AuthModule,
    ReservationsModule,
    MoviesModule,
    ShowingModule,
    HallModule,
    TicketsModule,
    OrdersModule,
    PromoCodesModule,
    InfoModule,
    WishlistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
