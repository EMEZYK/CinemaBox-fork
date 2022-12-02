import { Module } from '@nestjs/common';

import { ShowingService } from './showing.service';
import { ShowingController } from './showing.controller';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [ShowingController],
  providers: [ShowingService],
  exports: [ShowingService],
})
export class ShowingModule {}
