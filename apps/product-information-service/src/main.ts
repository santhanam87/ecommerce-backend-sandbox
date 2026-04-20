import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const webApp = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Product Information Service API')
    .setDescription('API documentation for product-information-service')
    .setVersion('1.0')
    .addServer(
      process.env.IDENTITY_SERVICE_URL || 'http://localhost:3001',
      'Identity Service',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Enter a valid JWT access token obtained from the identity service',
        name: 'Authorization',
        in: 'header',
      },
      'bearer',
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(webApp, swaggerConfig);
  SwaggerModule.setup('docs', webApp, swaggerDocument);

  await webApp.startAllMicroservices();
  await webApp.listen(process.env.PORT || 3000);
  return await webApp.getUrl();
}
bootstrap()
  .then((url) => {
    console.log(`Product information service is running on ${url}`);
    console.log(`Swagger docs available at ${url}/docs`);
  })
  .catch((err) => {
    console.error('Error starting product information service:', err);
  });
