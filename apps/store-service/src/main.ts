import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const webApp = await NestFactory.create(AppModule);
  webApp.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    // options: {
    //   host: '127.0.0.1',
    //   port: Number(process.env.BROKER_PORT),
    // },
  });
  await webApp.startAllMicroservices();
  await webApp.listen(process.env.PORT || 3000);
  console.info(`Microservice is running on ${await webApp.getUrl()}`);
}

bootstrap();
