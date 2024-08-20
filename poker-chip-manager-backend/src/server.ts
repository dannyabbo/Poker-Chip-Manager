import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { GameState, Player, Round } from './types';

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

const games: { [key: string]: GameState } = {};
const playerRooms: { [key: string]: string } = {};

const SMALL_BLIND = 5;
const BIG_BLIND = 10;

function initializeBettingRound(roomId: string) {
  const game = games[roomId];
  game.lastPlayerToAct = game.dealerPosition;
  if (game.round === Round.PreFlop) {
    // On pre-flop, betting starts with the player under the gun (left of big blind)
    game.currentTurn = game.players[(game.dealerPosition + 3) % game.players.length].id;
  } else {
    // On other rounds, betting starts with the first active player left of the dealer
    let startIndex = (game.dealerPosition + 1) % game.players.length;
    while (game.players[startIndex].folded) {
      startIndex = (startIndex + 1) % game.players.length;
    }
    game.currentTurn = game.players[startIndex].id;
  }
}

function nextTurn(roomId: string) {
  const game = games[roomId];
  const currentPlayerIndex = game.players.findIndex(p => p.id === game.currentTurn);
  let nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length;
  
  while (game.players[nextPlayerIndex].folded || game.players[nextPlayerIndex].chips === 0) {
    nextPlayerIndex = (nextPlayerIndex + 1) % game.players.length;
  }
  
  game.currentTurn = game.players[nextPlayerIndex].id;

  // Check if we've completed the betting round
  if (nextPlayerIndex === game.lastPlayerToAct || 
      game.players.filter(p => !p.folded && p.chips > 0).length === 1) {
    nextRound(roomId);
  }
}

function nextDealer(roomId: string) {
  const game = games[roomId];
  game.dealerPosition = (game.dealerPosition + 1) % game.players.length;
  return game.dealerPosition;
}

function postBlinds(roomId: string) {
  const game = games[roomId];
  const smallBlindIndex = (game.dealerPosition + 1) % game.players.length;
  const bigBlindIndex = (game.dealerPosition + 2) % game.players.length;

  const smallBlindPlayer = game.players[smallBlindIndex];
  const bigBlindPlayer = game.players[bigBlindIndex];

  smallBlindPlayer.chips -= SMALL_BLIND;
  smallBlindPlayer.betThisRound = SMALL_BLIND;
  game.pot += SMALL_BLIND;

  bigBlindPlayer.chips -= BIG_BLIND;
  bigBlindPlayer.betThisRound = BIG_BLIND;
  game.pot += BIG_BLIND;

  game.currentBet = BIG_BLIND;
}

function nextRound(roomId: string) {
  const game = games[roomId];
  switch (game.round) {
    case Round.PreFlop:
      game.round = Round.Flop;
      break;
    case Round.Flop:
      game.round = Round.Turn;
      break;
    case Round.Turn:
      game.round = Round.River;
      break;
    case Round.River:
      // Here you would determine the winner and distribute the pot
      startNewHand(roomId);
      return;
  }
  game.players.forEach(player => player.betThisRound = 0);
  game.currentBet = 0;
  initializeBettingRound(roomId);
}

function startNewHand(roomId: string) {
  const game = games[roomId];
  game.round = Round.PreFlop;
  game.pot = 0;
  game.currentBet = 0;
  game.players.forEach(player => {
    player.folded = false;
    player.betThisRound = 0;
  });

  nextDealer(roomId);
  postBlinds(roomId);
  initializeBettingRound(roomId);

  io.to(roomId).emit('updateGameState', game);
}

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinGame', (roomId: string, playerName: string) => {
    socket.join(roomId);
    if (!games[roomId]) {
      games[roomId] = {
        players: [],
        pot: 0,
        currentTurn: '',
        round: Round.PreFlop,
        currentBet: 0,
        dealerPosition: 0,
        lastPlayerToAct: 0
      };
    }

    let player = games[roomId].players.find(p => p.name === playerName);
    if (!player) {
      player = {
        id: socket.id,
        name: playerName,
        chips: 1000,
        folded: false,
        betThisRound: 0
      };
      games[roomId].players.push(player);
    } else {
      player.id = socket.id;
      player.folded = false;
      player.betThisRound = 0;
    }

    playerRooms[socket.id] = roomId;

    if (games[roomId].players.length === 2) {
      startNewHand(roomId);
    } else {
      io.to(roomId).emit('updateGameState', games[roomId]);
    }
  });

  socket.on('placeBet', ({ roomId, amount }: { roomId: string; amount: number }) => {
    const game = games[roomId];
    if (game && game.currentTurn === socket.id) {
      const player = game.players.find(p => p.id === socket.id);
      if (player && player.chips >= amount && amount >= game.currentBet - player.betThisRound) {
        player.chips -= amount;
        player.betThisRound += amount;
        game.pot += amount;
        game.currentBet = Math.max(game.currentBet, player.betThisRound);
        
        // Update lastPlayerToAct if this raise changes it
        if (player.betThisRound > game.currentBet) {
          game.lastPlayerToAct = game.players.findIndex(p => p.id === socket.id);
        }
        
        nextTurn(roomId);
        io.to(roomId).emit('updateGameState', game);
      }
    }
  });

  socket.on('check', (roomId: string) => {
    const game = games[roomId];
    if (game && game.currentTurn === socket.id) {
      const player = game.players.find(p => p.id === socket.id);
      if (player && player.betThisRound === game.currentBet) {
        nextTurn(roomId);
        io.to(roomId).emit('updateGameState', game);
      }
    }
  });

  socket.on('fold', (roomId: string) => {
    const game = games[roomId];
    if (game && game.currentTurn === socket.id) {
      const player = game.players.find(p => p.id === socket.id);
      if (player) {
        player.folded = true;
        nextTurn(roomId);
        if (game.players.filter(p => !p.folded && p.id !== '').length === 1) {
          startNewHand(roomId);
        }
        io.to(roomId).emit('updateGameState', game);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    const roomId = playerRooms[socket.id];
    if (roomId && games[roomId]) {
      const playerIndex = games[roomId].players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        // Instead of removing the player, mark them as disconnected
        games[roomId].players[playerIndex].id = '';
        if (games[roomId].currentTurn === socket.id) {
          nextTurn(roomId);
        }
        if (games[roomId].players.every(p => p.id === '')) {
          delete games[roomId];
        } else {
          io.to(roomId).emit('updateGameState', games[roomId]);
        }
      }
    }
    delete playerRooms[socket.id];
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});