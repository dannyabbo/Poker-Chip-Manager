"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "../common/BackButton";
import PageTitle from "../common/PageTitle";
import RoomCodeInput from "./RoomCodeInput";

export default function JoinTable() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState(["", "", "", ""]);

  const handleJoinTable = () => {
    const fullRoomCode = roomCode.join("");
    if (!name || fullRoomCode.length !== 4) {
      alert("Please fill in all required fields");
      return;
    }
    console.log({ name, roomCode: fullRoomCode });
    router.push(`/game?state=playing&table=${fullRoomCode}`);
  };

  return (
    <div className="mx-auto">
      <div className="flex items-center mb-4 relative">
        <BackButton destination="/" />
        <PageTitle title="Join Table" />
      </div>
      <form className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Room Code</span>
          </label>
          <RoomCodeInput roomCode={roomCode} setRoomCode={setRoomCode} />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Your Name</span>
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            className="input input-md input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button
          type="button"
          className="btn btn-primary w-full"
          onClick={handleJoinTable}
        >
          Join Table
        </button>
      </form>
    </div>
  );
}
