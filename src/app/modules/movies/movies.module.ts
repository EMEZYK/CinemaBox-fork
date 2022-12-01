import { Module } from '@nestjs/common';

import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
