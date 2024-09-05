import React, { useState, useEffect } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import PlayerList from "./PlayerList";

interface Player {
  id: string;
  name: string;
  isReady: boolean;
  isHost: boolean;
}

const Lobby: React.FC = () => {
  const [isHost, setIsHost] = useState(true);
  const [players, setPlayers] = useState<Player[]>([
    { id: "player-1", name: "Danny", isReady: true, isHost: true },
    { id: "player-2", name: "Mike Jackson", isReady: true, isHost: false },
    { id: "player-3", name: "Justin", isReady: false, isHost: false },
    { id: "player-4", name: "Haris", isReady: false, isHost: false },
    { id: "player-5", name: "Matt Genise", isReady: false, isHost: false },
    { id: "player-6", name: "Haris", isReady: false, isHost: false },
    { id: "player-7", name: "Haris", isReady: false, isHost: false },
    { id: "player-8", name: "Haris", isReady: false, isHost: false },
    { id: "player-9", name: "Haris", isReady: false, isHost: false },
    { id: "player-10", name: "Haris", isReady: false, isHost: false },
    { id: "player-11", name: "Haris", isReady: false, isHost: false },
  ]);
  const [currentPlayerReady, setCurrentPlayerReady] = useState(false);

  useEffect(() => {
    if (isHost) {
      setCurrentPlayerReady(true);
    }
  }, [isHost]);

  const handlePlayerReady = () => {
    setCurrentPlayerReady(!currentPlayerReady);
  };

  const handleStartGame = () => {
    console.log("Starting game...");
  };

  const allPlayersReady = players.every((player) => player.isReady);
  const canStartGame = isHost && allPlayersReady && players.length >= 2;

  return (
    <div className="h-full flex flex-col flex-grow">
      <div className="bg-neutral rounded-2xl p-4 mb-4">
        <h1 className="text-xl font-bold mb-2 text-center">ROOM #PM22</h1>
        <div className="grid grid-cols-3 gap-4 text-base">
          <div className="text-center">
            <div>Buy-in</div>
            <div className="font-semibold">$100</div>
          </div>
          <div className="text-center">
            <div>Blinds</div>
            <div className="font-semibold">$1 / $2</div>
          </div>
          <div className="text-center">
            <div>Time Limit</div>
            <div className="font-semibold">20s</div>
          </div>
        </div>
      </div>
      <div className="divider text-sm mb-4">
        {isHost
          ? allPlayersReady
            ? "All Players Ready"
            : "Waiting for all players to be ready"
          : currentPlayerReady
          ? "Waiting for the host to start the game"
          : "Waiting for more players to join"}
      </div>
      <div className="flex-1 flex-grow mb-2 relative scrollbar">
        <AutoSizer disableWidth>
          {({ height }) => (
            <PlayerList
              players={players}
              setPlayers={setPlayers}
              isHost={isHost}
              height={height}
            />
          )}
        </AutoSizer>
      </div>
      {isHost ? (
        <button
          className={`btn btn-primary w-full ${
            canStartGame ? "" : "btn-disabled"
          }`}
          onClick={handleStartGame}
          disabled={!canStartGame}
        >
          Start Game
        </button>
      ) : (
        <button
          className={`btn w-full ${
            currentPlayerReady ? "btn-error" : "btn-primary"
          }`}
          onClick={handlePlayerReady}
        >
          {currentPlayerReady ? "Cancel" : "Ready"}
        </button>
      )}
    </div>
  );
};

export default Lobby;
