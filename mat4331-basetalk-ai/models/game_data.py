from typing import List
from pydantic import BaseModel

# 타격 데이터
class BatInfo(BaseModel):
    PA: float
    AB: float
    R: float
    H: float
    HR: float
    RBI: float
    BB: float
    HBP: float
    SO: float
    GO: float
    FO: float
    NP: float
    GDP: float
    LOB: float
    ABG: float
    OPS: float
    LI: float
    WPA: float
    RE24: float

# 투구 데이터
class PitchInfo(BaseModel):
    IP: float
    TBF: float
    H: float
    R: float
    ER: float
    BB: float
    HBP: float
    K: float
    HR: float
    GO: float
    FO: float
    NP: float
    S: float
    IR: float
    IS: float
    GSC: float
    ERA: float
    WHIP: float
    LI: float
    WPA: float
    RE24: float
    
# 팀 데이터
class TeamData(BaseModel):
    bat_info: BatInfo
    pitch_info: PitchInfo
    
# 최종 요청 모델 (어웨이 팀과 홈 팀 데이터 포함)
class GamePredictionRequest(BaseModel):
    game_id: str
    away_team_stats: List[TeamData]
    home_team_stats: List[TeamData]