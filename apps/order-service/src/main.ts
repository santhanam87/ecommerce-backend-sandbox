import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AWSTransporter } from './common/messaging/aws-transporter';

async function bootstrap() {
  const webApp = await NestFactory.create(AppModule);
  webApp.connectMicroservice<MicroserviceOptions>({
    strategy: new AWSTransporter({
      queueUrl: process.env.AWS_ORDER_SAGA_STATUS_QUEUE_URL || '',
    }),
  });
  await webApp.startAllMicroservices();
  await webApp.listen(process.env.PORT || 3000);
  return await webApp.getUrl();
}
bootstrap()
  .then((url) => {
    console.log(`Order service is running on ${url}`);
  })
  .catch((err) => {
    console.error('Error starting user service:', err);
  });
