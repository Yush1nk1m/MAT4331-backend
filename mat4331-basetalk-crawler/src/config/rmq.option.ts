import { ClientOptions, Transport } from '@nestjs/microservices';

export const rmqOption: {
  name: string;
  transport: Transport;
} & ClientOptions = {
  name: 'DATA_SERVICE',
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://localhost:5672'], // RabbitMQ URL
    queue: 'data_queue', // Queue name
    queueOptions: { durable: true },
    // connection retry options
    socketOptions: {
      heartbeatIntervalInSeconds: 60,
      reconnectTimeInSeconds: 5,
    },
    prefetchCount: 1,
  },
};
