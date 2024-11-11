from src.models.text_data import ProfanityCheckRequest

# 비속어 판별 함수
# 비속어를 판별하고 true or false를 return한다.
def detect_profanity(data: ProfanityCheckRequest) -> bool:
    # 데이터 확인을 위한 로그
    print(f"전체 데이터: {data}")
    
    print(f"비속어 판별의 대상이 되는 텍스트 데이터: {data.content}")
    
    is_profane = True
    
    # TODO: AI 모델을 불러와 필요한 작업을 수행하고 결과값을 반환한다.
    
    return {
        "is_profane": is_profane
    }
    