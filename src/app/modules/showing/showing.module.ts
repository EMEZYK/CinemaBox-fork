import { Module } from '@nestjs/common';

import { ShowingService } from './showing.service';
import { ShowingController } from './showing.controller';
import { DbModule } from '../db/db.module';
import { MoviesModule } from '../movies/movies.module';
import ShowingQueryRepository from './utlis/ShowingQueryRepository';

@Module({
  imports: [DbModule, MoviesModule],
  controllers: [ShowingController],
  providers: [ShowingService, ShowingQueryRepository],
  exports: [ShowingService],
})
export class ShowingModule {}
