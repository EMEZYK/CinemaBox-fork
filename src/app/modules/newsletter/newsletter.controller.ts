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
import { NewsletterService } from './newsletter.service';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Get()
  async getNewsletter() {
    const { isError, data } = await this.newsletterService.getNewsletter();

    if (isError) {
      throw new HttpException('Nie udało się pobrać newsletter', 400);
    }

    return {
      newsletter: data,
    };
  }

  @Post()
  async checkIfEmailExists(@Body() body) {
    const { isError, data } = await this.newsletterService.checkIfEmailExists(
      body.email,
    );

    if (isError) {
      throw new HttpException('Nie udało się pobrać newsletter', 400);
    }

    return {
      newsletter: data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const { isError, data } = await this.newsletterService.remove(id);

    if (isError) {
      throw new HttpException('Nie udało się usunąć newsletter', 400);
    }

    return {
      newsletter: data,
    };
  }
}
