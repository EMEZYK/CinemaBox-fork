import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';

import { AppModule } from './app/app.module';
import { DBService } from './app/modules/db/db.service';

config();
const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const db = new DBService();
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix(`api/${process.env.API_VERSION}`);
  app.useGlobalPipes(new ValidationPipe());

  const con = new DocumentBuilder()
    .setTitle('Cinema-box')
    .setDescription('Cinema-box API')
    .setVersion('0.1.0')
    .build();

  const document = SwaggerModule.createDocument(app, con);
  SwaggerModule.setup('docs', app, document);

  await app.listen(PORT);
  console.log(`Server is running on port ${PORT}`);

  const dbStatus = await db.isReady();
  console.log(`Database is ${dbStatus ? 'connected' : 'disconnected'}`);
}

try {
  bootstrap();
} catch (err) {
  console.log(err);
}
