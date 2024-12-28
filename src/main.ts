import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import tracing from './tracing';
import { Logger } from 'nestjs-pino';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  await tracing.start();
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  await app.listen(process.env.PORT ?? 3000);
  app.useLogger(app.get(Logger));
}
bootstrap();
