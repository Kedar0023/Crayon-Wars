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

import { CalendarDays, GitBranch, KeyRound, Trophy, Volume2, VolumeX } from 'lucide-react'
import { useGameStore } from '@/lib/gameStore'
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
    const soundOn = useGameStore((s) => s.soundOn)
    const toggleSound = useGameStore((s) => s.toggleSound)

    return (
        <header className="flex items-center justify-between px-4 py-4 pt-[max(1rem,env(safe-area-inset-top))] md:px-8 lg:px-32">
            <Logo />
            <div className="flex items-center gap-2">
                <nav className="flex items-center rounded-full bg-white/40 p-0.5 backdrop-blur" aria-label="Main">
                    <PillButton icon={<CalendarDays className="size-4" />} label="Daily" collapseLabel />
                    <PillButton icon={<Trophy className="size-4" />} label="Leaderboard" collapseLabel />
                    <PillButton
                        icon={soundOn ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
                        label={soundOn ? 'Mute' : 'Unmute'}
                        className="[&>span]:hidden"
                        onClick={toggleSound}
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
