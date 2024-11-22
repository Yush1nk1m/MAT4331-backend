export const Events = {
  // Crawler service -> Main service: respond updated games datum
  GAME_UPDATED: 'Game.Updated',
  // Main service -> Crawler service: request to aggregate statistics of each team
  GAME_AGGREGATE_STATISTICS: 'Game.Aggregate.Statistics',
  // Crawler service -> AI service: reqeust to predict each team's score with the statistics
  GAME_PREDICT_SCORE: 'Game.Predict.Score',
};
