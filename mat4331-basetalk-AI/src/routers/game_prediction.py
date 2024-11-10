from fastapi import APIRouter
from src.models.game_data import GamePredictionRequest, TeamData, BatInfo, PitchInfo
from src.services.game_service import predict_outcome

app = ApiRouter()
