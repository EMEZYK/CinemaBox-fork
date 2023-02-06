import { Injectable } from '@nestjs/common';
import { DBService } from 'src/app/modules/db/db.service';

@Injectable()
export class NewsletterService {
  constructor(private readonly dbService: DBService) {}
  async getNewsletter() {
    try {
      const result = this.dbService.query('SELECT * FROM newsletter');

      return {
        isError: false,
        data: result,
      };
    } catch (error) {
      return {
        isError: true,
        data: error,
      };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} newsletter`;
  }
}
