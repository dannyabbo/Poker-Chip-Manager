import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import io, { Socket } from "socket.io-client";
import { GameState, LobbyState, LobbyPlayer } from '../types';

const Lobby: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [lobbyState, setLobbyState] = useState<LobbyState>({
    players: [],
    minBuyIn: 0,
    smallBlind: 0,
    bigBlind: 0,
    hostId: ''
  });
  const socketRef = useRef<Socket | null>(null);
  const [isHost, setIsHost] = useState(false);
  const playerName = location.state?.playerName || 'Anonymous';
  const joinedRef = useRef(false);

  useEffect(() => {
    console.log('Lobby component mounted');
    
    if (!joinedRef.current) {
      socketRef.current = io('http://localhost:3001');
      
      console.log(`Emitting joinLobby event for room ${id} with player ${playerName}`);
      socketRef.current.emit('joinLobby', { roomId: id, playerName });

      socketRef.current.on('lobbyJoined', (updatedLobbyState: LobbyState) => {
        console.log('Received lobbyJoined event:', updatedLobbyState);
        setLobbyState(updatedLobbyState);
        setIsHost(updatedLobbyState.hostId === playerName);
        joinedRef.current = true;
      });

      socketRef.current.on('lobbyUpdated', (updatedLobbyState: LobbyState) => {
        console.log('Received lobbyUpdated event:', updatedLobbyState);
        setLobbyState(updatedLobbyState);
        setIsHost(updatedLobbyState.hostId === playerName);
      });

      socketRef.current.on('gameStarted', (gameState: GameState) => {
        console.log('Received gameStarted event:', gameState);
        navigate(`/game/${id}`, { state: { gameState, playerName } });
      });
    }

    return () => {
      console.log('Lobby component unmounting, closing socket');
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      joinedRef.current = false;
    };
  }, [id, navigate, playerName]);

  const startGame = () => {
    if (socketRef.current) {
      console.log('Emitting startGame event');
      socketRef.current.emit('startGame', id);
    }
  };

  console.log('Rendering Lobby component with state:', { lobbyState, isHost, playerName });

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Lobby: {id}</h2>
      <div className="mb-4">
        <p>Minimum Buy-In: ${lobbyState.minBuyIn}</p>
        <p>Small Blind: ${lobbyState.smallBlind}</p>
        <p>Big Blind: ${lobbyState.bigBlind}</p>
      </div>
      <h3 className="text-xl font-semibold mb-2">Players:</h3>
      <ul className="list-disc list-inside mb-4">
        {lobbyState.players.map((player: LobbyPlayer) => (
          <li key={player.id}>{player.name}{player.id === lobbyState.hostId ? ' (Host)' : ''}</li>
        ))}
      </ul>
      {isHost && (
        <button className="btn btn-primary" onClick={startGame}>
          Start Game
        </button>
      )}
      {!isHost && <p>Waiting for host to start the game...</p>}
    </div>
  );
};

export default Lobby;