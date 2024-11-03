import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { rmqMainToCrawlerOption } from './config/rmq.option';

async function bootstrap() {
  // HTTP server
  const app = await NestFactory.create(AppModule);

  // RabbitMQ Microservice
  app.connectMicroservice(rmqMainToCrawlerOption);

  // start microservices
  await app.startAllMicroservices();

  await app.listen(8079);
}
bootstrap();
