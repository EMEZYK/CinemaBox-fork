import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  controllers: [ReviewsController],
  imports: [DbModule],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
