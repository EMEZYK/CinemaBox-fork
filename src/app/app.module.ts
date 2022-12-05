import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { DbModule } from './modules/db/db.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { UserModule } from './modules/user/user.module';
import { MoviesModule } from './modules/movies/movies.module';
import { ShowingModule } from './modules/showing/showing.module';
import { HallModule } from './modules/hall/hall.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { OrdersModule } from './modules/orders/orders.module';
import { RepertoireModule } from './modules/repertoire/repertoire.module';

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
    RepertoireModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
