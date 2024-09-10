import { useState } from "react";

interface CreateTableFormProps {
  isSubmitting: boolean;
}

export default function CreateTableForm({
  isSubmitting,
}: CreateTableFormProps) {
  const [name, setName] = useState("");
  const [minBuyIn, setMinBuyIn] = useState<number>(100);
  const [smallBlind, setSmallBlind] = useState<number>(1);
  const [bigBlind, setBigBlind] = useState<number>(2);
  const [hasTimeLimit, setHasTimeLimit] = useState(false);
  const [timeLimit, setTimeLimit] = useState<number>(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">
          <span className="label-text">Your Name</span>
        </label>
        <input
          type="text"
          placeholder="Enter your name"
          className="input input-bordered w-full"
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
          className="input input-bordered w-full"
          value={minBuyIn}
          onChange={(e) => setMinBuyIn(Number(e.target.value))}
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
            className="input input-bordered w-full"
            value={smallBlind}
            onChange={(e) => setSmallBlind(Number(e.target.value))}
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
            className="input input-bordered w-full"
            value={bigBlind}
            onChange={(e) => setBigBlind(Number(e.target.value))}
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
            className="input input-bordered w-full"
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            min={10}
            max={300}
          />
        </div>
      )}
      <button
        type="submit"
        className={`btn btn-primary w-full ${isSubmitting ? "" : ""}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Create Table and Enter Lobby"}
      </button>
    </form>
  );
}
