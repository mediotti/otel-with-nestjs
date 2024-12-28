import { Injectable } from '@nestjs/common';
import { LogLevel, SpanLogger } from '../logger/logger.service';

@Injectable()
export class AppService {
  constructor(private readonly logger: SpanLogger) {}
  async getHello(): Promise<string> {
    this.logger.log('Teste', LogLevel.Debug);
    return 'Hello World!';
  }
}
