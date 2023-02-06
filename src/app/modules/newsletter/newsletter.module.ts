import { Module } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { DbModule } from 'src/app/modules/db/db.module';
import { ReservationsModule } from 'src/app/modules/reservations/reservations.module';

@Module({
  imports: [DbModule, ReservationsModule],
  controllers: [NewsletterController],
  providers: [NewsletterService],
  exports: [NewsletterService],
})
export class NewsletterModule {}
