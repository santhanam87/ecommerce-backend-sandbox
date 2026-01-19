import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { AWSTransporter } from './aws-transporter/aws-transporter';

async function bootstrap() {
  const webApp = await NestFactory.create(AppModule);
  webApp.connectMicroservice<MicroserviceOptions>({
    // transport: Transport.TCP,
    // options: {
    //   host: '127.0.0.1',
    //   port: Number(process.env.BROKER_PORT),
    // },
    strategy: new AWSTransporter({
      queueUrl: process.env.AWS_SQS_QUEUE_URL || '',
    }),
  });
  await webApp.startAllMicroservices();
  await webApp.listen(process.env.PORT || 3000);
  console.info(`Microservice is running on ${await webApp.getUrl()}`);
}

bootstrap();
