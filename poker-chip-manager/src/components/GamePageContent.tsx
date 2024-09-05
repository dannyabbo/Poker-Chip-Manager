"use client";

import { useSearchParams } from "next/navigation";
import CreateTable from "@/components/CreateTable/CreateTable";
import JoinTable from "@/components/JoinTable/JoinTable";
import Lobby from "@/components/Lobby/Lobby";
import GameScreen from "@/components/GameScreen/GameScreen";

export default function GamePageContent() {
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const gameState = searchParams.get("state") || "setup";

  const renderContent = () => {
    switch (gameState) {
      case "setup":
        return action === "create" ? <CreateTable /> : <JoinTable />;
      case "lobby":
        return <Lobby />;
      case "playing":
        return <GameScreen />;
      default:
        return <p className="text-error">Invalid game state</p>;
    }
  };

  return (
    <div className="w-full min-h-svh max-h-screen mx-auto p-4 max-w-md flex flex-col">
      <h2 className="text-2xl font-bold mb-6">
        <span className="">PotManager</span>
        <span className="text-secondary text-base">.app</span>
      </h2>
      <div className="flex flex-col flex-grow">{renderContent()}</div>
    </div>
  );
}
