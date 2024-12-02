from models.text_data import ProfanityCheckRequest
from transformers import BertTokenizer, TFBertForSequenceClassification
import tensorflow as tf
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FILE_PATH = os.path.join(BASE_DIR, "saved_model")

# 비속어 판별 함수
# 비속어를 판별하고 true or false를 return한다.
def detect_profanity(data: ProfanityCheckRequest) -> bool:
    # 데이터 확인을 위한 로그
    print(f"전체 데이터: {data}")
    
    # print(f"비속어 판별의 대상이 되는 텍스트 데이터: {data.content}")
    
    # TODO: AI 모델을 불러와 필요한 작업을 수행하고 결과값을 반환한다.
    #모델 불러오기
    model = TFBertForSequenceClassification.from_pretrained(FILE_PATH)
    tokenizer = BertTokenizer.from_pretrained(FILE_PATH)

    # 입력 데이터를 토크나이저로 인코딩
    inputs = tokenizer(
        data.content,
        return_tensors='tf',  # TensorFlow 텐서 형태로 반환
        max_length=128,        # 최대 길이 설정 (BERT 최대 길이로 설정)
        truncation=True,       # 길이를 초과하면 자르기
        padding='max_length'   # 최대 길이만큼 패딩
    )
    # 예측 수행 (logits로 반환)
    outputs = model(inputs)
    logits = outputs.logits

    # 소프트맥스를 적용해 확률로 변환
    probs = tf.nn.softmax(logits, axis=-1)

    print(f"probability: {probs}")

    predicted_class = tf.argmax(probs, axis=-1).numpy()[0]
    if predicted_class == 1:
        is_profane = True
    else:
        is_profane = False
    
    return {
        "chat_id": data.chat_id,
        "is_profane": is_profane,
    }
    