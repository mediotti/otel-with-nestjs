// logger.module.ts
import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { SpanLogger } from './logger.service';

@Module({
  exports: [SpanLogger],
  providers: [SpanLogger],
  imports: [LoggerModule.forRoot({
    pinoHttp: {
      level: 'debug',
    }
  })],
})
export class SpanLoggerModule {}
