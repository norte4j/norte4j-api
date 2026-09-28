import {ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express';
import {join} from 'path';
import helmet from 'helmet';
import {AppModule} from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(process.cwd(), process.env.UPLOAD_DIR || 'uploads'), {prefix: '/uploads/'});
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.enableCors({origin: process.env.FRONTEND_URL?.split(',') ?? ['http://localhost:8080'], credentials: true});
  app.useGlobalPipes(new ValidationPipe({whitelist: true, transform: true}));
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
