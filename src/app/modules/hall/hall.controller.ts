import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
} from '@nestjs/common';

import { HallService } from './hall.service';
import { CreateHallDto } from './dto/create.hall.dto';
import { UpdateHallDto } from './dto/update.hall.dto';
import ResponseDictionary from 'src/app/dictionaries/Response.dictionary';
import { Public } from 'src/app/declarations/isPublic';

@Controller('halls')
export class HallController {
  constructor(private readonly hallService: HallService) {}

  @Post()
  async createHall(@Body() createHallDto: CreateHallDto) {
    const { isError, message } = await this.hallService.createHall(
      createHallDto,
    );

    if (isError) {
      throw new HttpException(message, 400);
    }

    return {
      message: isError,
    };
  }

  @Get()
  async getHalls() {
    const response = await this.hallService.getHalls();

    if (!response) {
      throw new HttpException(ResponseDictionary.hallsError, 404);
    }

    return {
      halls: response,
    };
  }

  @Public()
  @Get(':id')
  async getHall(@Param('id') id: number) {
    const response = await this.hallService.getHall(id);

    if (!response) {
      throw new HttpException(ResponseDictionary.hallNotFound, 404);
    }

    return {
      hall: response,
    };
  }

  @Patch(':id')
  async updateHall(@Param('id') id: number, @Body() updateHallDto: UpdateHallDto) {
    const response = await this.hallService.updateHall(id, updateHallDto);

    if (!response) {
      throw new HttpException(ResponseDictionary.hallNotUpdated, 400);
    }

    return {
      message: ResponseDictionary.hallUpdated,
    };
  }

  @Delete(':id')
  async deleteHall(@Param('id') id: number) {
    const response = await this.hallService.deleteHall(id);

    if (!response) {
      throw new HttpException(ResponseDictionary.hallNotDeleted, 400);
    }

    return {
      message: ResponseDictionary.hallDeleted,
    };
  }
}
