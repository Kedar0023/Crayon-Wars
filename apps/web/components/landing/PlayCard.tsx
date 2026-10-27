import { useRef, useState, type FormEvent } from "react";
import { AlertCircle, ArrowRight, Bot, Lock, Loader2, Plus, Shuffle, X } from "lucide-react";
import type { JoinResult } from "./types";
import { Button, Card, Divider, Tag } from "./primitives";

type PlayCardProps = {
  signedIn: boolean;
  onCreateLobby: () => void;
  onJoinRandom: (signal: AbortSignal) => Promise<"joined" | "none">;
  onJoinCode: (code: string) => Promise<JoinResult>;
  onPlayAI: () => void;
  onSignIn: () => void;
};

const CODE_LEN = 5;
const CODE_ERRORS: Record<Exclude<JoinResult, "ok">, string> = {
  not_found: "No room with that code. Check it and try again.",
  full: "That room is full. Join a random lobby or create your own.",
  started: "That game already started. Create a lobby to play now.",
};

export function PlayCard(props: PlayCardProps) {
  const [random, setRandom] = useState<"idle" | "searching" | "none">("idle");
  const abort = useRef<AbortController | null>(null);
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);

  const searchRandom = async () => {
    const controller = new AbortController();
    abort.current = controller;
    setRandom("searching");
    try {
      setRandom((await props.onJoinRandom(controller.signal)) === "none" ? "none" : "idle");
    } catch {
      setRandom("idle");
    }
  };

  const cancel = () => {
    abort.current?.abort();
    setRandom("idle");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (code.length < CODE_LEN) return setCodeError(`Room codes have ${CODE_LEN} characters.`);
    setJoining(true);
    const result = await props.onJoinCode(code);
    setJoining(false);
    if (result !== "ok") setCodeError(CODE_ERRORS[result]);
  };

  return (
    <Card>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-3xl font-extrabold tracking-[-0.04em]">Play</h2>
        <Tag tone="cyan">Guests welcome</Tag>
      </div>

      <div className="flex flex-col gap-3">
        <Button variant="primary" className="h-14 text-base" icon={<Plus className="size-5" />} onClick={props.onCreateLobby}>
          Create new lobby
        </Button>

        {random === "idle" && (
          <Button icon={<Shuffle className="size-4" />} onClick={searchRandom}>Join random lobby</Button>
        )}
        {random === "searching" && (
          <div className="flex h-12 items-center gap-2 rounded-full bg-white pl-5 pr-1.5 text-[15px] font-bold ring-1 ring-black/10" role="status">
            <Loader2 className="size-4 animate-spin" /> Searching for a lobby…
            <Button variant="ghost" className="ml-auto h-9 px-3 text-sm" icon={<X className="size-4" />} onClick={cancel}>Cancel</Button>
          </div>
        )}
        {random === "none" && (
          <div className="rounded-2xl border-2 border-dashed border-black/25 p-4" role="status">
            <p className="font-bold">No open lobbies right now.</p>
            <p className="mb-3 text-sm text-black/60">Start one and others can join you.</p>
            <div className="flex gap-2">
              <Button variant="primary" className="h-10 px-4 text-sm" onClick={props.onCreateLobby}>Create one</Button>
              <Button variant="ghost" className="h-10 px-4 text-sm" onClick={searchRandom}>Try again</Button>
            </div>
          </div>
        )}
      </div>

      <Divider />

      <form onSubmit={submit} noValidate>
        <div className="flex gap-2">
          <input
            aria-label="Room code"
            aria-invalid={!!codeError}
            aria-describedby={codeError ? "code-error" : undefined}
            value={code}
            maxLength={CODE_LEN}
            placeholder="Room code"
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            onChange={(event) => { setCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")); setCodeError(null); }}
            className={`h-12 min-w-0 flex-1 rounded-full bg-white px-5 text-lg font-extrabold tracking-[0.3em] outline-none ring-1 transition placeholder:text-[15px] placeholder:font-bold placeholder:tracking-normal placeholder:text-black/35 focus:ring-2 focus:ring-black ${codeError ? "ring-2 ring-red-500" : "ring-black/10"}`}
          />
          <Button type="submit" variant="primary" loading={joining} disabled={code.length === 0}>Join</Button>
        </div>
        {codeError && (
          <p id="code-error" role="alert" className="mt-2 flex items-start gap-1.5 text-sm font-semibold text-red-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0" /> {codeError}
          </p>
        )}
        <p className="mt-2 text-xs text-black/45">Demo codes: DEMO1 joins, FULL1 is full, LIVE1 already started.</p>
      </form>

      <Divider />

      <div className="group relative">
        <button
          onClick={props.signedIn ? props.onPlayAI : props.onSignIn}
          aria-describedby={props.signedIn ? undefined : "ai-lock"}
          className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left ring-1 ring-black/10 transition hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black active:scale-[0.99]"
        >
          <span className={`grid size-11 place-items-center rounded-xl ${props.signedIn ? "bg-black text-white" : "bg-black/10 text-black/50"}`}>
            <Bot className="size-5" />
          </span>
          <span className="flex-1">
            <span className={`block font-bold ${props.signedIn ? "" : "text-black/55"}`}>Play with AI</span>
            <span className="block text-sm text-black/50">Race language models at drawing</span>
          </span>
          {props.signedIn ? <ArrowRight className="size-5" /> : <Lock className="size-5 text-black/50" />}
        </button>
        {!props.signedIn && (
          <span id="ai-lock" role="tooltip" className="pointer-events-none absolute -top-9 right-2 rounded-lg bg-black px-2.5 py-1 text-xs font-semibold text-white opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
            Sign in to play
          </span>
        )}
      </div>
    </Card>
  );
}