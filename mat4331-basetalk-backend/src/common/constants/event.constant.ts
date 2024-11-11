export const Events = {
  // Crawler service -> Main service: respond updated games datum
  GAME_UPDATED: 'Game.Updated',
  // Main service -> Crawler service: request to calculate average statistics of specified game
  GAME_CACULATE_AVERAGE: 'Game.Calulate.Average',
  // Crawler service -> AI service: reqeust to predict each team's score with the statistics
  GAME_PREDICT_SCORE: 'Game.Predict.Score',
  // AI service -> Main service: request to save prediction score
  GAME_SAVE_PREDICTION: 'Game.Save.Prediction',
};
