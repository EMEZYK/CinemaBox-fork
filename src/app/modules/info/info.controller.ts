import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import axios from 'axios';

@Controller('info')
export class InfoController {
  @Post()
  async ask(@Body('question') question: string) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/engines/text-davinci-002/completions',
        {
          prompt: question,
          max_tokens: 3500,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI}`,
          },
        },
      );
      return response.data.choices[0].text;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
