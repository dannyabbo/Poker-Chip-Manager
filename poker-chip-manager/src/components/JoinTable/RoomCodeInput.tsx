import {
  useState,
  useRef,
  KeyboardEvent,
  ChangeEvent,
  useEffect,
  useMemo,
} from "react";

interface RoomCodeInputProps {
  roomCode: string[];
  setRoomCode: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function RoomCodeInput({
  roomCode,
  setRoomCode,
}: RoomCodeInputProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.map(() => null);
  }, []);

  useEffect(() => {
    if (inputRefs.current[activeIndex]) {
      inputRefs.current[activeIndex]?.focus();
    }
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

  return (
    <div className="grid grid-cols-4 gap-4">
      {roomCode.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            if (inputRefs.current) {
              inputRefs.current[index] = el;
            }
          }}
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
          }`}
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
  );
}
