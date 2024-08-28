// src/components/JoinTable.tsx
"use client";

import { useState, useRef, KeyboardEvent, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faHashtag,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

export default function JoinTable() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState(["", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    inputRefs[activeIndex].current?.focus();
  }, [activeIndex]);

  const handleInputChange = (index: number, value: string) => {
    if (!/^[a-zA-Z0-9]*$/.test(value)) return; // Allow alphanumeric characters

    const newRoomCode = [...roomCode];
    newRoomCode[index] = value;
    setRoomCode(newRoomCode);

    if (value !== "" && index < 3) {
      setActiveIndex(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      const newRoomCode = [...roomCode];

      if (newRoomCode[index] === "" && index > 0) {
        // If current input is empty, move to previous and clear it
        newRoomCode[index - 1] = "";
        setActiveIndex(index - 1);
      } else {
        // Clear current input
        newRoomCode[index] = "";
      }

      setRoomCode(newRoomCode);
    } else if (e.key === "ArrowLeft" && index > 0) {
      setActiveIndex(index - 1);
    } else if (e.key === "ArrowRight" && index < 3) {
      setActiveIndex(index + 1);
    }
  };

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
        <button
          className="btn btn-sm normal-case absolute left-0"
          onClick={() => router.push("/")}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
          Back
        </button>
        <h2 className="text-xl font-bold w-full text-center">Join Table</h2>
      </div>
      <form className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">
              <FontAwesomeIcon icon={faHashtag} className="mr-2" />
              Room Code
            </span>
          </label>
          <div className="grid grid-cols-4 gap-4">
            {roomCode.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className={`input input-md text-center ${
                  roomCode[index] !== ""
                    ? "input-ghost bg-base-200"
                    : "input-bordered"
                } ${
                  index === activeIndex
                    ? "cursor-pointer pointer-events-auto"
                    : "cursor-not-allowed pointer-events-none"
                } `}
                value={digit}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(index, e.target.value)
                }
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                  handleKeyDown(index, e)
                }
                required
              />
            ))}
          </div>
        </div>
        <div>
          <label className="label">
            <span className="label-text">
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Your Name
            </span>
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
