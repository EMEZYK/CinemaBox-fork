import { Module } from '@nestjs/common';
import { PromoCodesService } from './promo_codes.service';
import { PromoCodesController } from './promo_codes.controller';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [PromoCodesController],
  providers: [PromoCodesService],
  exports: [PromoCodesService]
})
export class PromoCodesModule {}
