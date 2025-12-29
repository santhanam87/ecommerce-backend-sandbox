import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('MATH_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Get()
  async getHello() {
    return await firstValueFrom(
      this.client.send({ event: 'test' }, 'Helloworld'),
    );
  }
}
