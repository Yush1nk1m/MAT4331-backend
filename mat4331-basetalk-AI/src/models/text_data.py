from pydantic import BaseModel

# 텍스트 데이터
class ProfanityCheckRequest(BaseModel):
    content: str