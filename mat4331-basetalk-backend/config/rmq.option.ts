import { ClientOptions, Transport } from '@nestjs/microservices';

/**
 * RabbitMQ option for emitting event from the crawler service to the main service
 */
export const rmqCrawlerToMainOption: {
  name: string;
  transport: Transport;
} & ClientOptions = {
  name: 'CrawlerToMain',
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://localhost:5672'], // RabbitMQ URL
    queue: 'crawler_to_main_data_queue', // Queue name
    queueOptions: { durable: true },
    // connection retry options
    socketOptions: {
      heartbeatIntervalInSeconds: 60,
      reconnectTimeInSeconds: 5,
    },
    prefetchCount: 1,
  },
};

/**
 * RabbitMQ option for emitting event from the main service to the crawler service
 */
export const rmqMainToCrawlerOption: {
  name: string;
  transport: Transport;
} & ClientOptions = {
  name: 'MainToCrawler',
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://localhost:5672'],
    queue: 'main_to_crawler_data_queue',
    queueOptions: { durable: true },
    // connection retry options
    socketOptions: {
      heartbeatIntervalInSeconds: 60,
      reconnectTimeInSeconds: 5,
    },
    prefetchCount: 1,
  },
};
