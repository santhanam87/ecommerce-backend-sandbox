import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('STORE_SERVICE') private readonly client: ClientProxy,
    @Inject('AWS_SNS_CLIENT') private awsSNSClient: ClientProxy,
  ) {}
  @Get('test')
  async processTestMessage() {
    const message = await lastValueFrom(
      this.awsSNSClient.emit('test', { message: 'Hello from AWS SNS!' }),
    );
    return message;
  }
}
