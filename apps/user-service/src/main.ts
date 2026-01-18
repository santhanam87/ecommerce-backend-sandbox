import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const webApp = await NestFactory.create(AppModule);
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
