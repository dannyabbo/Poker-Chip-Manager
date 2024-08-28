"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const navigateToGame = (action: "create" | "join") => {
    router.push(`/game?action=${action}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-5xl font-bold mb-4">
          <span className="">PotManager</span>
          <span className="text-secondary text-base">.app</span>
        </h1>
        <p className="text-base-content mb-8 max-w-sm mx-auto">
          Manage buy-ins, bets, and payouts with ease for your in-person texas hold'em games.
        </p>
        <div className="space-y-4">
          <button
            className="btn btn-primary w-full"
            onClick={() => navigateToGame("create")}
          >
            Create Table
          </button>
          <button
            className="btn btn-secondary w-full"
            onClick={() => navigateToGame("join")}
          >
            Join Table
          </button>
        </div>
      </div>
    </div>
  );
}
