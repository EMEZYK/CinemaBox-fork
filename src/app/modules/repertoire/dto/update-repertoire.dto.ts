import { PartialType } from '@nestjs/swagger';
import { CreateRepertoireDto } from './create-repertoire.dto';

export class UpdateRepertoireDto extends PartialType(CreateRepertoireDto) {}
