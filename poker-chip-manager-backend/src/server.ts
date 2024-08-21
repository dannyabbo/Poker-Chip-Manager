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
    console.log('Creating lobby:', { minBuyIn, smallBlind, bigBlind, playerName });
    const roomId = Math.random().toString(36).substr(2, 6).toUpperCase();
    lobbies[roomId] = {
      players: [],
      minBuyIn,
      smallBlind,
      bigBlind,
      hostId: '' // We'll set this when the host joins the lobby
    };
    console.log('Lobby created:', roomId, lobbies[roomId]);
    socket.emit('lobbyCreated', { roomId, lobbyState: lobbies[roomId] });
  });

  socket.on('joinLobby', ({ roomId, playerName }) => {
    console.log(`Player ${playerName} (${socket.id}) attempting to join room ${roomId}`);
    if (lobbies[roomId]) {
      const lobby = lobbies[roomId];
      const existingPlayer = lobby.players.find(p => p.name === playerName);
      
      if (!existingPlayer) {
        const newPlayer = { id: playerName, name: playerName, socketId: socket.id };
        lobby.players.push(newPlayer);
        socket.join(roomId);
        playerRooms[socket.id] = roomId;
        console.log(`Player ${playerName} added to lobby ${roomId}`);
        
        // If this is the first player, make them the host
        if (lobby.players.length === 1) {
          lobby.hostId = playerName;
          console.log(`Player ${playerName} set as host for lobby ${roomId}`);
        }
        
        io.to(roomId).emit('lobbyUpdated', lobby);
      } else if (existingPlayer.socketId !== socket.id) {
        existingPlayer.socketId = socket.id;
        socket.join(roomId);
        playerRooms[socket.id] = roomId;
        console.log(`Updated socket ID for player ${playerName} in lobby ${roomId}`);
        io.to(roomId).emit('lobbyUpdated', lobby);
      } else {
        console.log(`Player ${playerName} already in lobby ${roomId}, no update needed`);
      }
      
      socket.emit('lobbyJoined', lobby);
    } else {
      console.log(`Lobby ${roomId} not found`);
      socket.emit('error', { message: 'Lobby not found' });
    }
  });

  socket.on('startGame', (roomId) => {
    console.log(`Attempting to start game in room ${roomId}`);
    if (lobbies[roomId] && lobbies[roomId].hostId === socket.id) {
      const { players, minBuyIn, smallBlind, bigBlind } = lobbies[roomId];
      games[roomId] = initializeGame(players, minBuyIn, smallBlind, bigBlind);
      console.log('Game started:', games[roomId]);
      io.to(roomId).emit('gameStarted', games[roomId]);
      delete lobbies[roomId];
    } else {
      console.log(`Failed to start game in room ${roomId}. Host mismatch or lobby not found.`);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    const roomId = playerRooms[socket.id];
    if (roomId) {
      if (lobbies[roomId]) {
        console.log(`Removing player with socket ${socket.id} from lobby ${roomId}`);
        lobbies[roomId].players = lobbies[roomId].players.filter(p => p.socketId !== socket.id);
        
        if (lobbies[roomId].players.length === 0) {
          console.log(`Deleting empty lobby ${roomId}`);
          delete lobbies[roomId];
        } else {
          if (lobbies[roomId].hostId === socket.id) {
            console.log(`Assigning new host in lobby ${roomId}`);
            lobbies[roomId].hostId = lobbies[roomId].players[0].id;
          }
          io.to(roomId).emit('lobbyUpdated', lobbies[roomId]);
        }
      } else if (games[roomId]) {
        console.log(`Player with socket ${socket.id} disconnected from active game ${roomId}`);
        // TODO: Implement game state update logic for player disconnect
      }
      delete playerRooms[socket.id];
    }
  });
});

function initializeGame(players: LobbyPlayer[], minBuyIn: number, smallBlind: number, bigBlind: number): GameState {
  console.log('Initializing game with players:', players);
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