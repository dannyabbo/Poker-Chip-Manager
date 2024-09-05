import React from "react";
import {
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/solid";

interface PlayerItemProps {
  player: {
    id: string;
    name: string;
    isReady: boolean;
    isHost: boolean;
  };
  isHost: boolean;
  attributes?: any;
  listeners?: any;
}

const PlayerItem: React.FC<PlayerItemProps> = ({
  player,
  isHost,
  attributes,
  listeners,
}) => {
  return (
    <li className="flex items-center bg-neutral p-2 rounded-2xl">
      {isHost && (
        <span className="ml-1 cursor-grab" {...attributes} {...listeners}>
          <ChevronUpDownIcon className="h-6 w-6 text-gray-500" />
        </span>
      )}
      <span className="flex-grow ml-2">{player.name}</span>
      {player.isHost && <StarIcon className="h-8 w-8 text-info" />}
      {player.isReady && !player.isHost && (
        <CheckCircleIcon className="h-8 w-8 text-primary" />
      )}
      {!player.isReady && !player.isHost && (
        <XCircleIcon className="h-8 w-8 text-base-100" />
      )}
    </li>
  );
};

export default PlayerItem;
