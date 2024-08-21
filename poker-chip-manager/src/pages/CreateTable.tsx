import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';

const CreateTable: React.FC = () => {
  const navigate = useNavigate();
  const [minBuyIn, setMinBuyIn] = useState(100);
  const [smallBlind, setSmallBlind] = useState(1);
  const [bigBlind, setBigBlind] = useState(2);
  const [playerName, setPlayerName] = useState("");

  const createTable = () => {
    const socket = io('http://localhost:3001');
    socket.emit('createLobby', { minBuyIn, smallBlind, bigBlind, playerName });
    socket.on('lobbyCreated', ({ roomId, lobbyState }) => {
      console.log('Lobby created:', roomId, lobbyState);
      navigate(`/lobby/${roomId}`, { state: { lobbyState, playerName } });
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create Table</h2>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Your Name</span>
        </label>
        <input 
          type="text" 
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="input input-bordered w-full max-w-xs" 
        />
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Minimum Buy-In</span>
        </label>
        <input 
          type="number" 
          value={minBuyIn}
          onChange={(e) => setMinBuyIn(Number(e.target.value))}
          className="input input-bordered w-full max-w-xs" 
        />
      </div>
      <div className="form-control w-full max-w-xs mt-4">
        <label className="label">
          <span className="label-text">Small Blind</span>
        </label>
        <input 
          type="number" 
          value={smallBlind}
          onChange={(e) => setSmallBlind(Number(e.target.value))}
          className="input input-bordered w-full max-w-xs" 
        />
      </div>
      <div className="form-control w-full max-w-xs mt-4">
        <label className="label">
          <span className="label-text">Big Blind</span>
        </label>
        <input 
          type="number" 
          value={bigBlind}
          onChange={(e) => setBigBlind(Number(e.target.value))}
          className="input input-bordered w-full max-w-xs" 
        />
      </div>
      <button className="btn btn-primary mt-6" onClick={createTable}>
        Create Table and Go to Lobby
      </button>
    </div>
  );
};

export default CreateTable;