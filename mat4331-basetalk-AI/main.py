import asyncio
from fastapi import FastAPI, BackgroundTasks
from models.game_data import GamePredictionRequest
from models.text_data import ProfanityCheckRequest
from routers import mock
from services.game_service import predict_outcome
from services.profanity_service import detect_profanity
from configs.config import RABBITMQ_HOST, RABBITMQ_MAIN_TO_AI_QUEUE, RABBITMQ_AI_TO_MAIN_QUEUE, RABBITMQ_CRAWLER_TO_AI_QUEUE, RABBITMQ_USER, RABBITMQ_PASSWORD
import pika
import json

app = FastAPI()

# 테스트용 라우터 등록
app.include_router(mock.router)

# RabbitMQ 연결 설정
credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASSWORD)
connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST, credentials=credentials))
channel = connection.channel()

# declare queue
channel.queue_declare(queue=RABBITMQ_CRAWLER_TO_AI_QUEUE, durable=True)
channel.queue_declare(queue=RABBITMQ_MAIN_TO_AI_QUEUE, durable=True)

# Event handler routing table
event_handlers = {
    "Game.Predict.Score": predict_outcome,
    "Chat.Predict.Profanity": detect_profanity,
}

request_models = {
    "Game.Predict.Score": GamePredictionRequest,
    "Chat.Predict.Profanity": ProfanityCheckRequest,
}

response_event_patterns = {
    "Game.Predict.Score": "Game.Save.Prediction",
    "Chat.Predict.Profanity": "Chat.Save.Prediction",
}

# message consumer function
def on_message(channel, method, properties, body):
    message = json.loads(body)
    
    event_pattern = message.get("pattern")
    data = message.get("data")
        
    # call event handler
    if event_pattern in event_handlers:
        model = request_models[event_pattern]
        parsed_data = model.parse_obj(data)
        
        print(f"parsed_data: {parsed_data}")

        result_data = event_handlers[event_pattern](parsed_data)
        
        response_message = json.dumps({
            "pattern": response_event_patterns[event_pattern],
            "data": result_data,
        })
        
        channel.basic_publish(
            exchange="",
            routing_key=RABBITMQ_AI_TO_MAIN_QUEUE,
            body=response_message,
            properties=pika.BasicProperties(
                delivery_mode=2,
                content_type="application/json"
            ),
        )        
        
    else:
        print(f"Unhandled event type: {event_pattern}")
        
    # Acknowledge response
    channel.basic_ack(delivery_tag=method.delivery_tag)
    
# Consumer configuration
channel.basic_consume(queue=RABBITMQ_CRAWLER_TO_AI_QUEUE, on_message_callback=on_message)
channel.basic_consume(queue=RABBITMQ_MAIN_TO_AI_QUEUE, on_message_callback=on_message)

@app.on_event("startup")
async def startup_event():
    import threading
    threading.Thread(target=channel.start_consuming, daemon=True).start()

@app.get("/")
async def helathCheck():
    return {
        "message": "Healthy"
    }
