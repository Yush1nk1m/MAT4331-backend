export const Events = {
  // Crawler service -> Main service: respond updated games datum
  GAME_UPDATED: 'Game.Updated',
  // Main service -> Crawler service: request to calculate average statistics of specified game
  GAME_CACULATE_AVERAGE: 'Game.Calulate.Average',
  // Crawler service -> AI service: reqeust to predict each team's score with the statistics
  GAME_PREDICT_SCORE: 'Game.Predict.Score',
  // AI service -> Main service: request to save score prediction
  GAME_SAVE_PREDICTION: 'Game.Save.Prediction',
  // Main service -> AI service: request to predict chat's profanity
  CHAT_PREDICT_PROFANITY: 'Chat.Predict.Profanity',
  // AI service -> Main service: request to save profanity prediction
  CHAT_SAVE_PREDICTION: 'Chat.Save.Prediction',
};
