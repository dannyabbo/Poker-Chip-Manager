import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
} from "react-beautiful-dnd";
import {
  StarIcon,
  Bars3Icon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/solid";
import AutoSizer from "react-virtualized-auto-sizer";

// Types
interface Player {
  id: string;
  name: string;
  isReady: boolean;
  isHost: boolean;
}

const Lobby: React.FC = () => {
  const [isHost, setIsHost] = useState(true);
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "Danny", isReady: true, isHost: true },
    { id: "2", name: "Mike Jackson", isReady: true, isHost: false },
    { id: "3", name: "Justin", isReady: false, isHost: false },
    { id: "4", name: "haris", isReady: false, isHost: false },
    { id: "5", name: "haris", isReady: false, isHost: false },
    { id: "6", name: "haris", isReady: false, isHost: false },
    { id: "7", name: "haris", isReady: false, isHost: false },
    { id: "8", name: "haris", isReady: false, isHost: false },
    { id: "9", name: "haris", isReady: false, isHost: false },
    { id: "10", name: "haris", isReady: false, isHost: false },
    { id: "11", name: "haris", isReady: false, isHost: false },
    { id: "12", name: "haris", isReady: false, isHost: false },
    { id: "13", name: "haris", isReady: false, isHost: false },
    { id: "14", name: "haris", isReady: false, isHost: false },
    { id: "15", name: "haris", isReady: false, isHost: false },
    { id: "16", name: "haris", isReady: false, isHost: false },
    { id: "17", name: "haris", isReady: false, isHost: false },
    { id: "18", name: "haris", isReady: false, isHost: false },
    { id: "19", name: "haris", isReady: false, isHost: false },
    { id: "20", name: "haris", isReady: false, isHost: false },
    { id: "21", name: "haris", isReady: false, isHost: false },
    { id: "22", name: "haris", isReady: false, isHost: false },
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

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newPlayers = Array.from(players);
    const [reorderedPlayer] = newPlayers.splice(result.source.index, 1);
    newPlayers.splice(result.destination.index, 0, reorderedPlayer);

    setPlayers(newPlayers);
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

      <div className="text-sm mb-4">
        {isHost
          ? allPlayersReady
            ? "All Players Ready"
            : "Waiting for all players to be ready"
          : currentPlayerReady
          ? "Waiting for the host to start the game"
          : "Waiting for more players to join"}
      </div>
      <div className="flex-1 flex-grow mb-2">
        <AutoSizer disableWidth>
          {({ height }) => (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="players">
                {(provided: DroppableProvided) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{ height: height }}
                    className={`space-y-2 overflow-y-auto`}
                  >
                    {players.map((player, index) => (
                      <Draggable
                        key={player.id}
                        draggableId={player.id}
                        index={index}
                        isDragDisabled={!isHost}
                      >
                        {(provided: DraggableProvided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center bg-neutral p-2 rounded-2xl"
                          >
                            {isHost && (
                              <span
                                {...provided.dragHandleProps}
                                className="ml-1"
                              >
                                <ChevronUpDownIcon className="h-6 w-6 text-gray-500" />
                              </span>
                            )}
                            <span className="flex-grow ml-2">
                              {player.name}
                            </span>

                            {player.isHost && (
                              <StarIcon className="h-8 w-8 text-info" />
                            )}
                            {player.isReady && !player.isHost && (
                              <CheckCircleIcon className="h-8 w-8 text-primary" />
                            )}
                            {!player.isReady && !player.isHost && (
                              <XCircleIcon className="h-8 w-8 text-base-100" />
                            )}
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
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
