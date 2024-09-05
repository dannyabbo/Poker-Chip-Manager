import { Suspense } from "react";
import GamePageContent from "@/components/GamePageContent"; // Create this component

export default function GamePage() {
  return (
    <Suspense
      fallback={<span className="loading loading-spinner loading-lg"></span>}
    >
      <GamePageContent />
    </Suspense>
  );
}
