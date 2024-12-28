import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpanLoggerModule } from '../logger/logger.module';

@Module({
  imports: [SpanLoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
