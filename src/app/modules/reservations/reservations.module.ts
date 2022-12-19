import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DbModule } from '../db/db.module';
import { ShowingModule } from '../showing/showing.module';

@Module({
  imports: [DbModule, ShowingModule],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService]
})
export class ReservationsModule {}
