import os
import numpy as np
from models.game_data import GamePredictionRequest
from tensorflow.keras.models import load_model
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler

# os.environ["CUDA_VISIBLE_DEVICES"] = "-1"   # GPU 관련 경고 제거
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FILE_PATH = os.path.join(BASE_DIR, "game_predict.h5")

model = load_model(FILE_PATH, custom_objects={"mse": tf.keras.losses.MeanSquaredError()})


def preprocess_input(data: GamePredictionRequest):
    
    # data 구조
    # game_id: str
    # away_team_stats: List[TeamData] away team의 최근 50경기 데이터
    # home_team_stats: List[TeamData] home team의 최근 50경기 데이터
    
    n = 10      # window size = 10
    away_team_stats = data.away_team_stats[:n]
    home_team_stats = data.home_team_stats[:n]
    

    # TODO
    # X_home: home_bat_info + away_pit_info
    # X_away: home_pit_info + away_bat_info
    # X_combined: X_home과 X_away 결합
    # input_data = X_combined


    # bat_info와 pitch_info를 리스트로 변환
    def extract_features(team_stats, is_bat_info=True):
        feature_list = []
        for game in team_stats:
            if is_bat_info:
                AVG = game.bat_info.ABG
                feature_list.append([
                    game.bat_info.PA, AVG, game.bat_info.OPS, game.bat_info.R,
                    game.bat_info.HR, game.bat_info.BB, game.bat_info.SO
                ])
                '''
                game.bat_info.PA, game.bat_info.AB, game.bat_info.R, game.bat_info.H,
                game.bat_info.HR, game.bat_info.RBI, game.bat_info.BB, game.bat_info.HBP,
                game.bat_info.SO, game.bat_info.GO, game.bat_info.FO, game.bat_info.NP,
                game.bat_info.GDP, game.bat_info.LOB, game.bat_info.ABG, game.bat_info.OPS,
                game.bat_info.LI, game.bat_info.WPA, game.bat_info.RE24
                '''
            else:
                feature_list.append([
                    game.pitch_info.ERA, game.pitch_info.WHIP
                ])
                '''
                game.pitch_info.IP, game.pitch_info.TBF, game.pitch_info.H, game.pitch_info.R,
                game.pitch_info.ER, game.pitch_info.BB, game.pitch_info.HBP, game.pitch_info.K,
                game.pitch_info.HR, game.pitch_info.GO, game.pitch_info.FO, game.pitch_info.NP,
                game.pitch_info.S, game.pitch_info.IR, game.pitch_info.IS, game.pitch_info.GSC,
                game.pitch_info.ERA, game.pitch_info.WHIP, game.pitch_info.LI, game.pitch_info.WPA,
                game.pitch_info.RE24
                '''
        return feature_list

    # 각 데이터에서 배팅 정보와 투구 정보를 추출
    away_bat_info = extract_features(away_team_stats, is_bat_info=True)
    away_pit_info = extract_features(away_team_stats, is_bat_info=False)
    home_bat_info = extract_features(home_team_stats, is_bat_info=True)
    home_pit_info = extract_features(home_team_stats, is_bat_info=False)

    # 각 데이터를 결합
    home_bat_away_pit = np.hstack((home_bat_info, away_pit_info))  # 홈팀 배팅 + 어웨이팀 투구
    away_bat_home_pit = np.hstack((away_bat_info, home_pit_info))  # 어웨이팀 배팅 + 홈팀 투구

    # X_home과 X_away를 결합
    combined = np.hstack((home_bat_away_pit, away_bat_home_pit))
    
    input_data = np.array(combined)
    input_data_3d = input_data.reshape(1, input_data.shape[0], -1)  # [batch_size, time_steps, features]
    #input_data_3d = np.expand_dims(input_data, axis=0)
    print(input_data_3d.shape)
    return input_data_3d


# 승패 예측 함수
# 주어진 팀 데이터를 바탕으로 양 팀의 점수를 예측하고 반환한다.
def predict_outcome(data: GamePredictionRequest):
    # 데이터 확인을 위한 로그
    #print(f"{type(data.home_team_stats)}")
    #print(f"전체 데이터: {data}")
    #print(f"어웨이 팀 데이터: {data.away_team_stats}")
    #print(f"홈 팀 데이터: {data.home_team_stats}")

    input_data = preprocess_input(data)

    # 모델을 통해 점수 예측
    predicted_score = model.predict(input_data)
    predicted_away_score = round(predicted_score[0][0])  # home 팀 점수
    predicted_home_score = round(predicted_score[0][1])  # away 팀 점수

    # 예측 결과 로그
    #print(f"예측된 어웨이 팀 점수: {predicted_away_score}")
    #print(f"예측된 홈 팀 점수: {predicted_home_score}")

    # TODO: AI 모델을 불러와 필요한 작업을 수행하고 결과값을 반환한다.
    
    return {
        "game_id": data.game_id,
        "predicted_away_score": predicted_home_score,
        "predicted_home_score": predicted_away_score,
    }