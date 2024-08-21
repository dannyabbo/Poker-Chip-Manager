export interface Player {
  id: string;
  name: string;
  chips: number;
  folded: boolean;
  betThisRound: number;
}

export interface LobbyPlayer {
  id: string;
  name: string;
}

export enum Round {
  PreFlop = 'PreFlop',
  Flop = 'Flop',
  Turn = 'Turn',
  River = 'River'
}

export interface GameState {
  players: Player[];
  pot: number;
  currentTurn: string;
  round: Round;
  currentBet: number;
  dealerPosition: number;
  lastPlayerToAct: number;
  smallBlind: number; 
  bigBlind: number;   
}

export interface LobbyState {
  players: LobbyPlayer[];
  minBuyIn: number;
  smallBlind: number;
  bigBlind: number;
  hostId: string;
}