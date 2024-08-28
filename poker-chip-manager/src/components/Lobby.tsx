"use client";

import { useRouter } from "next/navigation";

export default function Lobby() {
  const router = useRouter();

  const handleStartGame = () => {
    // Logic for starting the game would go here
    router.push("/game?state=playing");
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Game Lobby</h2>
        <p>Lobby screen (waiting for players) would go here</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary" onClick={handleStartGame}>
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}
