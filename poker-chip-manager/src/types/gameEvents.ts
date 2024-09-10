export enum GameEventType {
  ROOM_CREATED = "ROOM_CREATED",
  PLAYER_JOINED = "PLAYER_JOINED",
  PLAYER_LEFT = "PLAYER_LEFT",
  GAME_STARTED = "GAME_STARTED",
  BUY_IN = "BUY_IN",
  BLIND_POSTED = "BLIND_POSTED",
  CARD_DEALT = "CARD_DEALT",
  PLAYER_ACTION = "PLAYER_ACTION",
  POT_UPDATED = "POT_UPDATED",
  ROUND_ENDED = "ROUND_ENDED",
  GAME_ENDED = "GAME_ENDED",
}

export interface GameEvent {
  type: GameEventType;
  payload: any;
  timestamp: number;
}

export interface GameSettings {
  minBuyIn: number;
  smallBlind: number;
  bigBlind: number;
  hasTimeLimit: boolean;
  timeLimit: number | null;
}
