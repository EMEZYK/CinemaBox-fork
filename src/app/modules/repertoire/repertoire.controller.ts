import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RepertoireService } from './repertoire.service';
import { CreateRepertoireDto } from './dto/create-repertoire.dto';
import { UpdateRepertoireDto } from './dto/update-repertoire.dto';

@Controller('repertoire')
export class RepertoireController {
  constructor(private readonly repertoireService: RepertoireService) {}

  @Post()
  create(@Body() createRepertoireDto: CreateRepertoireDto) {
    return this.repertoireService.create(createRepertoireDto);
  }

  @Get()
  findAll() {
    return this.repertoireService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repertoireService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRepertoireDto: UpdateRepertoireDto) {
    return this.repertoireService.update(+id, updateRepertoireDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repertoireService.remove(+id);
  }
}
