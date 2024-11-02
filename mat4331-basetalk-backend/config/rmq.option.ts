import { ClientOptions, Transport } from '@nestjs/microservices';

export const rmqOption: {
  transport: Transport;
} & ClientOptions = {
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://localhost:5672'], // RabbitMQ URL
    queue: 'data_queue', // Queue name
    queueOptions: { durable: true },
  },
};
