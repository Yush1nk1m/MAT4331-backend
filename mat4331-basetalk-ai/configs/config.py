from dotenv import load_dotenv
import os


RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "127.0.0.1")
RABBITMQ_USER = os.getenv("RABBITMQ_USER", "guest")
RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD", "guest")
RABBITMQ_MAIN_TO_AI_QUEUE = "main_to_ai_data_queue"
RABBITMQ_CRAWLER_TO_AI_QUEUE = "crawler_to_ai_data_queue"
RABBITMQ_AI_TO_MAIN_QUEUE = "ai_to_main_data_queue"