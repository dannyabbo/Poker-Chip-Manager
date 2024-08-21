import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { GameState, Player, Round, LobbyState, LobbyPlayer } from './types';

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

const lobbies: { [key: string]: LobbyState } = {};
const games: { [key: string]: GameState } = {};
const playerRooms: { [key: string]: string } = {};

io.on('connection', (socket) => {
  console.log('A user connected with socket id:', socket.id);

  socket.on('createLobby', ({ minBuyIn, smallBlind, bigBlind, playerName }) => {
    const roomId = Math.random().toString(36).substr(2, 6).toUpperCase();
    lobbies[roomId] = {
      players: [],
      minBuyIn,
      smallBlind,
      bigBlind,
      hostId: ''
    };
    console.log('Lobby created:', roomId, lobbies[roomId]);
    socket.emit('lobbyCreated', { roomId });
  });

  socket.on('joinLobby', ({ roomId, playerName }) => {
    console.log(`Player ${playerName} (${socket.id}) attempting to join room ${roomId}`);
    if (lobbies[roomId]) {
      const lobby = lobbies[roomId];
      const existingPlayer = lobby.players.find(p => p.name === playerName);
      
      if (!existingPlayer) {
        const newPlayer = { id: playerName, name: playerName, socketId: socket.id };
        lobby.players.push(newPlayer);
        if (lobby.players.length === 1) {
          lobby.hostId = playerName;
        }
      } else {
        existingPlayer.socketId = socket.id;
      }

      socket.join(roomId);
      playerRooms[socket.id] = roomId;
      io.to(roomId).emit('lobbyUpdated', lobby);
    } else {
      socket.emit('error', { message: 'Lobby not found' });
    }
  });

  socket.on('startGame', (roomId) => {
    if (lobbies[roomId] && lobbies[roomId].hostId === socket.id) {
      const { players, minBuyIn, smallBlind, bigBlind } = lobbies[roomId];
      games[roomId] = initializeGame(players, minBuyIn, smallBlind, bigBlind);
      io.to(roomId).emit('gameStarted', games[roomId]);
      delete lobbies[roomId];
    }
  });

  socket.on('disconnect', () => {
    const roomId = playerRooms[socket.id];
    if (roomId && lobbies[roomId]) {
      const lobby = lobbies[roomId];
      lobby.players = lobby.players.filter(p => p.socketId !== socket.id);
      
      if (lobby.players.length === 0) {
        delete lobbies[roomId];
      } else {
        if (lobby.hostId === socket.id) {
          lobby.hostId = lobby.players[0].id;
        }
        io.to(roomId).emit('lobbyUpdated', lobby);
      }
      delete playerRooms[socket.id];
    }
  });
});

function initializeGame(players: LobbyPlayer[], minBuyIn: number, smallBlind: number, bigBlind: number): GameState {
  return {
    players: players.map(player => ({
      id: player.id,
      name: player.name,
      chips: minBuyIn,
      folded: false,
      betThisRound: 0
    })),
    pot: 0,
    currentTurn: players[0].id,
    round: Round.PreFlop,
    currentBet: bigBlind,
    dealerPosition: 0,
    lastPlayerToAct: players.length - 1,
    smallBlind,
    bigBlind
  };
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});