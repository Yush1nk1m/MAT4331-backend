export const Events = {
  // Main service -> Crawler service: request crawler service to crawl annual games and reload the information
  GAME_RELOAD: 'Game.Reload',
  // Crawler service -> Main service: respond updated games datum
  GAME_UPDATED: 'Game.Updated',
};
