import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  destination: string;
}

export default function BackButton({ destination }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      className="btn btn-neutral btn-sm normal-case absolute left-0"
      onClick={() => router.push(destination)}
    >
      <FontAwesomeIcon icon={faChevronLeft} /> Back
    </button>
  );
}
