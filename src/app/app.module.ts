import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { DbModule } from './modules/db/db.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    DbModule,
    UserModule,
    AuthModule,
    ReservationsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
