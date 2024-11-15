import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { rmqMainToCrawlerOption } from './config/rmq.option';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  // HTTP server
  const app = await NestFactory.create(AppModule);

  // Compression configuration
  app.use(compression());

  // Helmet configuration
  app.use(helmet());

  // RabbitMQ Microservice
  app.connectMicroservice(rmqMainToCrawlerOption);

  // start microservices
  await app.startAllMicroservices();

  await app.listen(8079);
}
bootstrap();
