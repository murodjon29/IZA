import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: '*',
  });

  await app.listen(config.PORT ?? 3000, () => {
    console.log(`Server running on port ${config.PORT ?? 3000}`);
  });
}
bootstrap();
