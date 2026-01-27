import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AWSTransporter } from './common/messaging/aws-transporter';

async function bootstrap() {
  const webApp = await NestFactory.create(AppModule);
  await webApp.startAllMicroservices();
  webApp.connectMicroservice<MicroserviceOptions>({
    strategy: new AWSTransporter({
      queueUrl: process.env.AWS_PAYMENT_PROCESS_ORDER_QUEUE_URL || '',
    }),
  });
  await webApp.listen(process.env.PORT || 3000);
}
bootstrap();
