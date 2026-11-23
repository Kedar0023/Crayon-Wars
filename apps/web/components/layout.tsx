export function Footer() {
    return (
        <footer className="flex flex-wrap items-center justify-between gap-2 px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-xs text-slate-500 md:px-8 lg:px-32">
            <p>
                Made by <b className="font-semibold text-slate-700">Kedar0023_</b>
            </p>
            <p className="flex items-center gap-1.5">© 2026 Crayon Wars</p>
        </footer>
    )
}

// ----------------

import { BookOpen, GitBranch, KeyRound, Trophy, UserRound, Volume2, VolumeX } from 'lucide-react'
import { useSoundEnabled } from 'react-sounds'
import { Link } from 'react-router'
import { PillButton } from '@/components/ui/PillButton'

function Logo() {
    return (
        <a href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
            <svg viewBox="0 0 28 16" aria-hidden className="h-4 w-7">
                <path d="M2 11c3-8 6 4 9-2s5-5 8-2" fill="none" stroke="#0b0b0f" strokeWidth="2" strokeLinecap="round" />
                <circle cx="24" cy="5" r="2.5" fill="#ef4b2f" />
            </svg>
            <span className="text-sm">Crayon Wars</span>
        </a>
    )
}

export function Header() {
    const [soundOn, setSoundOn] = useSoundEnabled()

    return (
        <header className="flex items-center justify-between px-4 py-4 pt-[max(1rem,env(safe-area-inset-top))] md:px-8 lg:px-32">
            <Logo />
            <div className="flex items-center gap-2">
                <nav className="flex items-center rounded-full bg-white/40 p-0.5 backdrop-blur" aria-label="Main">
                    <Link to="/leaderboard" aria-label="Leaderboard" className="inline-flex size-9 items-center justify-center rounded-full text-sm font-bold transition hover:bg-white/60 sm:w-auto sm:gap-1.5 sm:px-3">
                        <Trophy className="size-4" /><span className="hidden sm:inline">Leaderboard</span>
                    </Link>
                    <Link to="/how-to-play" aria-label="How to play" className="inline-flex size-9 items-center justify-center rounded-full text-sm font-bold transition hover:bg-white/60 sm:w-auto sm:gap-1.5 sm:px-3">
                        <BookOpen className="size-4" /><span className="hidden sm:inline">How to play</span>
                    </Link>
                    <Link to="/profile" aria-label="Profile" className="inline-flex size-9 items-center justify-center rounded-full text-sm font-bold transition hover:bg-white/60 sm:w-auto sm:gap-1.5 sm:px-3">
                        <UserRound className="size-4" /><span className="hidden sm:inline">Profile</span>
                    </Link>
                    <PillButton
                        icon={soundOn ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
                        label={soundOn ? 'Mute' : 'Unmute'}
                        className="[&>span]:hidden"
                        onClick={() => setSoundOn(!soundOn)}
                    />
                    <PillButton icon={<KeyRound className="size-4" />} label="API key" className="[&>span]:hidden" />
                </nav>
                <div className="rounded-full bg-white/40 p-0.5 backdrop-blur">
                    <PillButton icon={<GitBranch className="size-4" />} label="Source" className="[&>span]:hidden" />
                </div>
            </div>
        </header>
    )
}

// ----------------

import type { ReactNode } from 'react'

export function Shell({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-dvh flex-col bg-sky-bg transition-colors duration-500 ease-in-out motion-reduce:transition-none">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    )
}
