import { useState } from "react";
import { Link } from "react-router";
import { ChevronDown, LogOut, Pencil, Trophy, User, Volume2, VolumeX } from "lucide-react";
import type { Profile } from "./types";
import { Avatar } from "./primitives";

type HeaderProps = {
  profile: Profile;
  signedIn: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
};

export function Header({ profile, signedIn, onSignIn, onSignOut }: HeaderProps) {
  const [muted, setMuted] = useState(false);
  const [menu, setMenu] = useState(false);

  return (
    <header className="flex items-center justify-between gap-3">
      <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold lowercase tracking-[-0.04em]">
        <span className="grid size-9 place-items-center rounded-xl bg-black text-white"><Pencil className="size-5 -rotate-12" /></span>
        crayon wars
      </Link>

      <div className="relative flex items-center gap-1 rounded-full bg-white/60 p-1 backdrop-blur" onKeyDown={(event) => event.key === "Escape" && setMenu(false)}>
        <Link to="/leaderboard" className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-bold hover:bg-white">
          <Trophy className="size-4" /> <span className="hidden sm:inline">Leaderboard</span>
        </Link>
        <button aria-label={muted ? "Unmute" : "Mute"} onClick={() => setMuted(!muted)} className="grid size-9 place-items-center rounded-full hover:bg-white">
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>

        {signedIn ? (
          <>
            <button onClick={() => setMenu(!menu)} aria-expanded={menu} aria-haspopup="menu" className="flex h-9 items-center gap-2 rounded-full bg-white pl-1 pr-3 text-left">
              <Avatar code={profile.avatar} className="size-7" />
              <span className="hidden text-sm font-bold leading-none sm:block">
                {profile.name}
                <span className="ml-1.5 font-semibold text-black/45">{profile.tag}</span>
              </span>
              <ChevronDown className="size-4" />
            </button>
            {menu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
                <div role="menu" className="absolute right-0 top-12 z-20 w-44 rounded-2xl bg-[#F4F4F4] p-1.5 shadow-xl">
                  <Link role="menuitem" to="/profile" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold hover:bg-black/5"><User className="size-4" />Profile</Link>
                  <button role="menuitem" onClick={() => { setMenu(false); onSignOut(); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold hover:bg-black/5"><LogOut className="size-4" />Sign out</button>
                </div>
              </>
            )}
          </>
        ) : (
          <button onClick={onSignIn} className="h-9 rounded-full bg-black px-4 text-sm font-bold text-white transition hover:bg-neutral-800 active:scale-95">Sign in</button>
        )}
      </div>
    </header>
  );
}