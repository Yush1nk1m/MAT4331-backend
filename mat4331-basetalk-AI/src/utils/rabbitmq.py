import aio_pika
from src.config import RabbitMQConfig

async def get_rabbitmq_connection(config: RabbitMQConfig):
    connection = await aio_pika.connect_robust(config.url)
    channel = await connection.channel()
    await channel.set_qos(prefetch_count=1)
    return connection, channel

async def declare_queue(channel: aio_pika.Channel, queue_name: str):
    queue = await channel.declare_queue(queue_name, durable=True)
    return queue