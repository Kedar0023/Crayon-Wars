import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AVATAR_COLORS, AVATAR_FACES, createAvatarCode, getAvatar, type AvatarCode } from "../../components/characters/registry";
import { AvatarPicker } from "../../components/landing/AvatarPicker";
import { Header } from "../../components/landing/Header";
import { PlayCard } from "../../components/landing/PlayCard";
import { CreateLobbyDialog, type LobbyConfig } from "../../components/landing/CreateLobby";
import { SignInModal } from "../../components/landing/SignInModal";
import { DEFAULT_PROFILE, PAGE_BACKGROUNDS, type JoinResult, type Profile } from "../../components/landing/types";

export const meta = () => [{ title: "Crayon Wars" }];
export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&display=swap",
  },
];

const FONT = '"Bricolage Grotesque", ui-rounded, system-ui, sans-serif';
const CODE_LEN = 5;
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const STORAGE_KEY = "crayonwars.profile";

const pick = <T,>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)];
const randomCode = (length = CODE_LEN) => Array.from({ length }, () => pick([...CHARS])).join("");
const randomTag = () => `#${randomCode(6)}`;

const isAvatarCode = (value: unknown): value is AvatarCode => {
  if (typeof value !== "string") return false;
  try {
    getAvatar(value);
    return true;
  } catch {
    return false;
  }
};

function useProfile() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Profile>;
        setProfile({
          name: typeof saved.name === "string" ? saved.name : DEFAULT_PROFILE.name,
          tag: typeof saved.tag === "string" ? saved.tag : randomTag(),
          avatar: isAvatarCode(saved.avatar) ? saved.avatar : DEFAULT_PROFILE.avatar,
        });
      } else {
        setProfile({ ...DEFAULT_PROFILE, tag: randomTag() });
      }
    } catch {
      setProfile({ ...DEFAULT_PROFILE, tag: randomTag() });
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      return;
    }
  }, [profile, ready]);

  return [profile, (patch: Partial<Profile>) => setProfile((current) => ({ ...current, ...patch }))] as const;
}

const wait = (milliseconds: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(resolve, milliseconds);
    signal?.addEventListener("abort", () => {
      clearTimeout(timeout);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });

export default function LandingPage() {
  const navigate = useNavigate();
  const [profile, patchProfile] = useProfile();
  const [signedIn, setSignedIn] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [open, setOpen] = useState(false);
  const attempts = useRef(0);
  const page = PAGE_BACKGROUNDS[getAvatar(profile.avatar).colorIndex];

  const enter = (room: string, extra = "", lobbyConfig?: LobbyConfig) =>
    navigate(`/lobby/${room}${extra}`, {
      state: lobbyConfig ? { profile, lobbyConfig } : { profile },
    });

  const createLobby = (config: LobbyConfig) => enter(randomCode(), "", config);

  const onJoinRandom = async (signal: AbortSignal) => {
    await wait(2200, signal);
    if (++attempts.current % 2 === 1) return "none" as const;
    enter(randomCode());
    return "joined" as const;
  };

  const onJoinCode = async (code: string): Promise<JoinResult> => {
    await wait(600);
    if (code === "FULL1") return "full";
    if (code === "LIVE1") return "started";
    if (code === "DEMO1") {
      enter(code);
      return "ok";
    }
    return "not_found";
  };

  const randomizeAvatar = () => {
    const colorIndex = Math.floor(Math.random() * AVATAR_COLORS.length);
    const faceIndex = Math.floor(Math.random() * AVATAR_FACES.length);
    patchProfile({ avatar: createAvatarCode(colorIndex, faceIndex), tag: randomTag() });
  };

  const onSignIn = () => setShowSignIn(true);
  const onPlayAI = () => enter(randomCode(), "?mode=ai");

  return (
    <div className="min-h-dvh transition-colors duration-500 motion-reduce:transition-none" style={{ backgroundColor: page, fontFamily: FONT }}>
      <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 pb-6 pt-4 text-black sm:px-6">
        <Header profile={profile} signedIn={signedIn} onSignIn={onSignIn} onSignOut={() => setSignedIn(false)} />

        <main className="flex-1 py-8 sm:py-12">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h1 className="text-5xl font-extrabold lowercase leading-[0.92] tracking-[-0.055em] sm:text-7xl">
              pick a face,<br />pick a fight.
            </h1>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-sm font-bold backdrop-blur">
              <span className="size-2 rounded-full bg-emerald-500" /> 1,240 drawing now
            </span>
          </div>

          <div className="grid items-start gap-5 lg:grid-cols-[1.1fr_1fr]">
            <AvatarPicker
              profile={profile}
              onChange={patchProfile}
              signedIn={signedIn}
              onRandomize={randomizeAvatar}
            />
            <PlayCard
              signedIn={signedIn}
              onCreateLobby={() => setOpen(true)}
              onJoinRandom={onJoinRandom}
              onJoinCode={onJoinCode}
              onPlayAI={onPlayAI}
              onSignIn={onSignIn}
            />
          </div>
        </main>

        <footer className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-bold text-black/70">
          <Link to="/how-to-play" className="hover:text-black">How to play</Link>
          <Link to="/privacy" className="hover:text-black">Privacy</Link>
          <Link to="/terms" className="hover:text-black">Terms</Link>
          <a href="https://discord.gg/your-invite" target="_blank" rel="noreferrer" className="hover:text-black">Discord</a>
        </footer>
      </div>

      {showSignIn && (
        <SignInModal
          onClose={() => setShowSignIn(false)}
          onDone={() => { setSignedIn(true); setShowSignIn(false); }}
        />
      )}
      <CreateLobbyDialog
        open={open}
        onClose={() => setOpen(false)}
        onCreate={(config) => {
          createLobby(config);
          setOpen(false);
        }}
      />
    </div>
  );
}
