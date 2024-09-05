import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PlayerItem from "./PlayerItem";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

interface Player {
  id: string;
  name: string;
  isReady: boolean;
  isHost: boolean;
}

interface PlayerListProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  isHost: boolean;
  height?: number;
}

const SortablePlayerItem: React.FC<{ player: Player; isHost: boolean }> = ({
  player,
  isHost,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: player.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="first:mt-5 last:!mb-5">
      <PlayerItem
        player={player}
        isHost={isHost}
        attributes={attributes}
        listeners={listeners}
      />
    </div>
  );
};

const PlayerList: React.FC<PlayerListProps> = ({
  players,
  setPlayers,
  isHost,
  height = "auto",
}) => {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setPlayers((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext
        items={players.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul
          style={{ height: height }}
          className="space-y-2 overflow-y-scroll overflow-x-hidden after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[20px] after:bg-gradient-to-t after:from-base-100 after:to-transparent before:absolute before:top-0 before:left-0 before:right-0 before:h-[20px] before:bg-gradient-to-t before:from-transparent before:to-base-100"
        >
          {players.map((player) => (
            <SortablePlayerItem
              key={player.id}
              player={player}
              isHost={isHost}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

export default PlayerList;
