from pydantic import BaseModel

# 타격 데이터
class BatInfo(BaseModel):
    PA: int
    AB: int
    R: int
    H: int
    HR: int
    RBI: int
    BB: int
    HBP: int
    SO: int
    GO: int
    FO: int
    NP: int
    GDP: int
    LOB: int
    ABG: float
    OPS: float
    LI: float
    WPA: float
    RE24: float

# 투구 데이터
class PitchInfo(BaseModel):
    IP: float
    TBF: int
    H: int
    R: int
    ER: int
    BB: int
    HBP: int
    K: int
    HR: int
    GO: int
    FO: int
    NP: int
    S: int
    IR: int
    IS: int
    GSC: int
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
    away_team: TeamData
    home_team: TeamData