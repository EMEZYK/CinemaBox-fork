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

    console.log(data)

    return {
      newsletter: data,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.newsletterService.remove(id);
  }
}
