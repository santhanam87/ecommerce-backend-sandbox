import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AWSTransporter } from './common/messaging/aws-transporter';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const webApp = await NestFactory.create(AppModule);
  webApp.connectMicroservice<MicroserviceOptions>({
    strategy: new AWSTransporter({
      queueUrl: process.env.AWS_SQS_QUEUE_URL || '',
    }),
  });
  await webApp.startAllMicroservices();
  await webApp.listen(process.env.PORT || 3000);
  return await webApp.getUrl();
}
bootstrap()
  .then((url) => {
    console.log(`User service is running on ${url}`);
  })
  .catch((err) => {
    console.error('Error starting user service:', err);
  });
