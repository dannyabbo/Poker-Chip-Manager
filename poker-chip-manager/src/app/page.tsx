"use client";
import { socket } from "@/utils/socket";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();

  const navigateToGame = (action: "create" | "join") => {
    router.push(`/game?action=${action}`);
  };

  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <div className=" flex flex-grow min-h-svh flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-5xl font-bold mb-4">
          <span className="">PotManager</span>
          <span className="text-secondary text-base">.app</span>
        </h1>
        <p className="text-base-content mb-8 max-w-sm mx-auto">
          Manage buy-ins, bets, and payouts with ease for your in-person texas
          hold&apos;em games.
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
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
    </div>
  );
}
