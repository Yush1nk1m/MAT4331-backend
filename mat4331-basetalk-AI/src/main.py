from fastapi import FastAPI
from src.routers import mock

app = FastAPI()

# 테스트용 라우터 등록
app.include_router(mock.router)

@app.get("/")
async def helathCheck():
    return {
        "message": "Healthy"
    }