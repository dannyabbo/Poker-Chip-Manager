"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

export default function CreateTable() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [minBuyIn, setMinBuyIn] = useState<string | number>(100);
  const [smallBlind, setSmallBlind] = useState<string | number>(1);
  const [bigBlind, setBigBlind] = useState<string | number>(2);
  const [hasTimeLimit, setHasTimeLimit] = useState(false);
  const [timeLimit, setTimeLimit] = useState<string | number>(30);

  const handleCreateTable = () => {
    if (!name || !minBuyIn || !smallBlind || !bigBlind) {
      alert("Please fill in all required fields");
      return;
    }

    if (hasTimeLimit && !timeLimit) {
      alert("Please set a time limit");
      return;
    }

    console.log({
      name,
      minBuyIn,
      smallBlind,
      bigBlind,
      hasTimeLimit,
      timeLimit: hasTimeLimit ? timeLimit : null,
    });

    router.push("/game?state=lobby");
  };

  return (
    <div className="mx-auto">
      <div className="flex items-center mb-4 relative">
        <button
          className="btn btn-neutral btn-sm normal-case absolute left-0"
          onClick={() => router.push("/")}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="" />
          Back
        </button>
        <h2 className="text-xl font-bold w-full text-center">Create Table</h2>
      </div>

      <form className="space-y-4">
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

        <div>
          <label className="label">
            <span className="label-text">Minimum Buy-in</span>
          </label>
          <input
            type="number"
            placeholder="Enter minimum buy-in"
            className="input input-md input-bordered w-full"
            value={minBuyIn}
            onChange={(e) => setMinBuyIn(e.target.value)}
            min={1}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">
              <span className="label-text">Small Blind</span>
            </label>
            <input
              type="number"
              placeholder="Small blind"
              className="input input-md input-bordered w-full"
              value={smallBlind}
              onChange={(e) => setSmallBlind(e.target.value)}
              min={1}
              required
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Big Blind</span>
            </label>
            <input
              type="number"
              placeholder="Big blind"
              className="input input-md input-bordered w-full"
              value={bigBlind}
              onChange={(e) => setBigBlind(e.target.value)}
              min={2}
              required
            />
          </div>
        </div>

        <div className="form-control">
          <label className="label cursor-pointer justify-start">
            <input
              type="checkbox"
              className="toggle mr-4"
              checked={hasTimeLimit}
              onChange={(e) => setHasTimeLimit(e.target.checked)}
            />
            <span className="label-text">Enable Time Limit</span>
          </label>
        </div>

        {hasTimeLimit && (
          <div>
            <label className="label">
              <span className="label-text">Time Limit (seconds)</span>
            </label>
            <input
              type="number"
              placeholder="Enter time limit"
              className="input input-md input-bordered w-full"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              min={10}
              max={300}
            />
          </div>
        )}

        <button
          type="button"
          className="btn btn-primary w-full"
          onClick={handleCreateTable}
        >
          Create Table and Enter Lobby
        </button>
      </form>
    </div>
  );
}
