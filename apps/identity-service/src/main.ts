import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const webApp = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Identity Service API")
    .setDescription("API documentation for identity-service")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(webApp, swaggerConfig, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup("identity/docs", webApp, swaggerDocument);

  await webApp.startAllMicroservices();
  await webApp.listen(process.env.PORT || 3004);
  return await webApp.getUrl();
}

bootstrap()
  .then((url) => {
    console.log(`Identity service is running on ${url}`);
    console.log(`Swagger docs available at ${url}/identity/docs`);
  })
  .catch((err) => {
    console.error("Error starting identity service:", err);
  });
