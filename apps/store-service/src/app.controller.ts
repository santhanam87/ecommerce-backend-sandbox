import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('AWS_SNS_CLIENT') private awsSNSClient: ClientProxy,
  ) {}

  @EventPattern('order-created')
  handleTestEventV1(data: any) {
    console.log('Received test eventV1:', data);
  }
  @EventPattern('order-created')
  handleTestEventV2(data: any) {
    console.log('Received test eventV2:', data);
  }
  @Post('test')
  async processTestMessage(@Body() body: any) {
    const message = await lastValueFrom(
      this.awsSNSClient.emit('order-created', body),
    );
    return message;
  }
}
