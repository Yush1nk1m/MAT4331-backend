from src.models.game_data import GamePredictionRequest

# 승패 예측 함수
# 주어진 팀 데이터를 바탕으로 양 팀의 점수를 예측하고 반환한다.
def predict_outcome(data: GamePredictionRequest):
    # 데이터 확인을 위한 로그
    # print(f"전체 데이터: {data}")
    
    # print(f"어웨이 팀 데이터: {data.away_team}")
    # print(f"홈 팀 데이터: {data.home_team}")
    
    # print(f"어웨이 팀 타격 데이터: {data.away_team.bat_info}")
    # print(f"어웨이 팀 투구 데이터: {data.away_team.pitch_info}")
    
    # print(f"홈 팀 타격 데이터: {data.home_team.bat_info}")
    # print(f"홈 팀 투구 데이터: {data.home_team.pitch_info}")

    # 결과 데이터: 모델을 실행하고 아래 이름의 변수를 반환    
    predicted_away_score = 1
    predicted_home_score = 2

    # TODO: AI 모델을 불러와 필요한 작업을 수행하고 결과값을 반환한다.
    
    return {
        "game_id": data.game_id,
        "predicted_away_score": predicted_away_score,
        "predicted_home_score": predicted_home_score,
    }