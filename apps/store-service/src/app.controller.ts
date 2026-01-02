import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('STORE_SERVICE') private readonly client: ClientProxy,
  ) {}

  @MessagePattern({ event: 'test' })
  processTestMessage(data: string) {
    return data + 'some more information';
  }

  @Get()
  getHello(): string {
    this.client.emit({ event: 'test' }, 'Helloworld');
    return this.appService.getHello();
  }
}
