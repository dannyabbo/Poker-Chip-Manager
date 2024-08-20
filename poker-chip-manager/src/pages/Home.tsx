import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  const createGame = () => {
    const newRoomCode = Math.random().toString(36).substr(2, 6).toUpperCase();
    if (playerName) {
      navigate(`/game/${newRoomCode}`, { state: { playerName } });
    } else {
      alert("Please enter your name before creating a game.");
    }
  };

  const joinGame = () => {
    if (roomCode && playerName) {
      navigate(`/game/${roomCode.toUpperCase()}`, { state: { playerName } });
    } else {
      alert("Please enter your name and a room code before joining a game.");
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-8">Poker Chip Manager</h1>
          <div className="form-control">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter Your Name"
              className="input input-bordered w-full max-w-xs mb-4"
            />
            <button className="btn btn-primary mb-4" onClick={createGame}>Create Game</button>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="Enter Room Code"
              className="input input-bordered w-full max-w-xs mb-4"
            />
            <button className="btn btn-secondary" onClick={joinGame}>Join Game</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;