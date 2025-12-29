import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const webApp = await NestFactory.create(AppModule);
  await webApp.listen(process.env.PORT || 3000);
  console.info(`Microservice is running on ${await webApp.getUrl()}`);
}

bootstrap();
