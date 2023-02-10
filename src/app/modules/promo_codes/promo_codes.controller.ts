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

import { PromoCodesService } from './promo_codes.service';
import { CreatePromoCodeDto } from './dto/create-promo_code.dto';
import ResponseDictionary from 'src/app/dictionaries/Response.dictionary';
import { Public } from 'src/app/declarations/isPublic';

@Controller('promo-codes')
export class PromoCodesController {
  constructor(private readonly promoCodesService: PromoCodesService) {}

  @Post()
  async createPromoCode(@Body() createPromoCodeDto: CreatePromoCodeDto) {
    const { isError, data } = await this.promoCodesService.createPromoCode(
      createPromoCodeDto,
    );

    if (isError) {
      throw new HttpException(ResponseDictionary.promocodeNotCreated, 400);
    }

    return {
      message: ResponseDictionary.promocodeCreated,
      promoCodes: data,
    };
  }

  @Public()
  @Get()
  async getAllPromoCodes() {
    const response = await this.promoCodesService.getAllPromoCodes();

    if (!response) {
      throw new HttpException(ResponseDictionary.promocodesError, 404);
    }

    return {
      promoCodes: response,
      count: response.length,
    };
  }

  @Get(':id')
  getPromoCode(@Param('id') id: number) {
    return this.promoCodesService.getPromoCode(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() body) {
    const { isError, isNameError, data } = await this.promoCodesService.update(
      id,
      body,
    );

    if (isError) {
      throw new HttpException(ResponseDictionary.promocodeNotUpdated, 400);
    }

    if (isNameError) {
      throw new HttpException('Nazwa kodu jest już zajęta', 400);
    }

    return {
      message: ResponseDictionary.promocodeUpdated,
      promoCodes: data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const { isError, data } = await this.promoCodesService.remove(id);

    if (isError) {
      throw new HttpException(ResponseDictionary.promocodeNotDeleted, 400);
    }

    return {
      message: ResponseDictionary.promocodeDeleted,
      promoCodes: data,
    };
  }
}
