import { Module } from '@nestjs/common';
import { RepertoireService } from './repertoire.service';
import { RepertoireController } from './repertoire.controller';

@Module({
  controllers: [RepertoireController],
  providers: [RepertoireService]
})
export class RepertoireModule {}
