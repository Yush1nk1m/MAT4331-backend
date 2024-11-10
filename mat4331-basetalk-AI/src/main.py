from fastapi import FastAPI
import asyncio
import pika
from src.routers import mock

app = FastAPI()

# 테스트용 라우터 등록
app.include_router(mock.router)

@app.on_event("startup")
def startup():
    # configure RabbitMQ connection
    connection = pika.BlockingConnection(pika.ConnectionParameters("localhost", 5672))
    channel = connection.channel()
    app.state.rabbitmq_connection = connection
    app.state.rabbitmq_channel = channel
    
    # declare queues
    channel.queue_declare(queue="cralwer_to_ai_data_queue")
    channel.queue_declare(queue="ai_to_main_data_queue")
    
    # start to consume RabbitMQ messages
    channel.basic_consume(queue="crawler_to_ai_data_queue", on_message_callback=on_message, auto_ack=False)
    channel.start_consuming()

@app.on_event("shutdown")
def shutdown():
    app.state.rabbitmq_connection.close()

@app.get("/")
async def helathCheck():
    return {
        "message": "Healthy"
    }
    
# RabbitMQ consume 