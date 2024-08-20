export interface Player {
    id: string;
    name: string;
    chips: number;
    folded: boolean;
    betThisRound: number;
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
    lastPlayerToAct: number;  // Add this line
  }