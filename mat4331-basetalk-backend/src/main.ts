import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  rmqAiToMainOption,
  rmqCrawlerToMainOption,
} from 'src/config/rmq.option';
import { ValidationPipe } from '@nestjs/common';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { RedisIoAdapter } from './common/adapters/redis-io.adapter';
import * as compression from 'compression';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  // initialize @Transactional() configuration
  initializeTransactionalContext({
    storageDriver: StorageDriver.ASYNC_LOCAL_STORAGE,
  });

  const app = await NestFactory.create(AppModule);

  // Compression configuration
  app.use(compression());

  // Helmet configuration
  app.use(helmet());

  // use Redis WebSocket adapter
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // global pipe configuration
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // only allow properties defined on DTO
      forbidNonWhitelisted: true, // reject undefined properties
      transform: true, // transform request data to DTO instance
    }),
  );

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
    origin: [
      'http://localhost:3000',
      'https://www.basetalk.org',
      'https://basetalk.org',
    ],
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // RabbitMQ Microservice
  app.connectMicroservice(rmqCrawlerToMainOption);
  app.connectMicroservice(rmqAiToMainOption);

  // start microservices
  await app.startAllMicroservices();

  await app.listen(8080);
}
bootstrap();
