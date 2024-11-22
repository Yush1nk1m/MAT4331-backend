from fastapi import APIRouter
from models.game_data import GamePredictionRequest, TeamData, BatInfo, PitchInfo
from models.text_data import ProfanityCheckRequest
from services.profanity_service import detect_profanity
from services.game_service import predict_outcome

router = APIRouter()

@router.get("/profanity-check")
async def mock_profanity_check():
    # 가짜 데이터를 사용하여 비속어 판별 함수 호출
    mock_text = "나쁜말나쁜말나쁜말나쁜말나쁜말"
    
    mock_data = ProfanityCheckRequest(content=mock_text)
    
    # 모델을 실행하고 결과를 받아온다.
    result = detect_profanity(mock_data)
    
    return {
        "text": mock_text,
        "is_profane": result,
    }
    
    
@router.get("/game-prediction")
async def mock_game_prediction():
    # 가짜 데이터를 사용하여 승패 예측 함수 호출
    mock_bat_info = BatInfo(
        PA=5, AB=4, R=1, H=2, HR=1, RBI=2, BB=1, HBP=0, SO=1, GO=1, FO=2,
        NP=20, GDP=0, LOB=3, ABG=0.5, OPS=1.0, LI=0.9, WPA=0.1, RE24=0.5
    )
    mock_pitch_info = PitchInfo(
        IP=5.0, TBF=20, H=3, R=1, ER=1, BB=2, HBP=0, K=5, HR=0, GO=3, FO=4,
        NP=80, S=60, IR=0, IS=0, GSC=60, ERA=2.0, WHIP=1.2, LI=0.9, WPA=0.2, RE24=0.5
    )
    mock_away_team = TeamData(bat_info=mock_bat_info, pitch_info=mock_pitch_info)
    mock_home_team = TeamData(bat_info=mock_bat_info, pitch_info=mock_pitch_info)
    
    mock_away_team_stats = [mock_away_team] * 50
    mock_home_team_stats = [mock_home_team] * 50

    mock_data = GamePredictionRequest(game_id="00000001", away_team_stats=mock_away_team_stats, home_team_stats=mock_home_team_stats)

    result = predict_outcome(mock_data)
    
    return result