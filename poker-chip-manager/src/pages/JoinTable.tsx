import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinTable: React.FC = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");

  const joinTable = () => {
    if (roomCode && playerName) {
      navigate(`/lobby/${roomCode}`, { state: { playerName } });
    } else {
      alert("Please enter a room code and your name");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Join Table</h2>
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
      <div className="form-control w-full max-w-xs mt-4">
        <label className="label">
          <span className="label-text">Room Code</span>
        </label>
        <input 
          type="text" 
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          placeholder="Enter room code"
          className="input input-bordered w-full max-w-xs" 
        />
      </div>
      <button className="btn btn-primary mt-6" onClick={joinTable}>
        Join Table
      </button>
    </div>
  );
};

export default JoinTable;