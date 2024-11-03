import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { rmqCrawlerToMainOption } from 'config/rmq.option';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Basetalk API')
    .setDescription('API description')
    .setVersion('0.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  // cors configuration
  app.enableCors({
    origin: ['http://localhost:3000'],
  });

  // RabbitMQ Microservice
  app.connectMicroservice(rmqCrawlerToMainOption);

  // start microservices
  await app.startAllMicroservices();

  await app.listen(8080);
}
bootstrap();
