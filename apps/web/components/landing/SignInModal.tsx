import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./primitives";

type SignInModalProps = {
  onClose: () => void;
  onDone: () => void;
};

export function SignInModal({ onClose, onDone }: SignInModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="si-title" onClick={(event) => event.stopPropagation()} className="w-full max-w-sm rounded-3xl bg-[#F4F4F4] p-6">
        <div className="mb-1 flex items-center justify-between">
          <h2 id="si-title" className="text-2xl font-extrabold tracking-[-0.04em]">Sign in</h2>
          <button aria-label="Close" onClick={onClose} className="grid size-8 place-items-center rounded-full hover:bg-black/5"><X className="size-5" /></button>
        </div>
        <p className="mb-5 text-sm text-black/60">Keep your stats and play against AI models.</p>
        <div className="flex flex-col gap-2">
          <Button variant="primary" autoFocus onClick={onDone}>Continue with Google</Button>
          <Button onClick={onDone}>Continue with Discord</Button>
        </div>
      </div>
    </div>
  );
}