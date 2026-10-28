import { Flame } from 'lucide-react'
import { DIFFICULTY_LEVEL } from '../../lib/game'
import { cn } from '../../lib/cn'
import { useGameStore } from '@/lib/gameStore'
import { Timer } from './Timer'

function DifficultyPill() {
    const difficulty = useGameStore((s) => s.difficulty)
    const level = DIFFICULTY_LEVEL[difficulty]
    return (
        <span className="doodle-scale-enter flex items-center gap-1.5 rounded-full bg-white/50 px-2 py-0.5 text-[11px] font-medium text-slate-500">
            <span aria-hidden className="flex gap-0.5">
                {[1, 2, 3].map((i) => (
                    <i key={i} className={cn('size-1 rounded-full transition-colors duration-200', i <= level ? 'bg-ink' : 'bg-slate-400/60')} />
                ))}
            </span>
            {difficulty}
        </span>
    )
}

// ----------------

function StreakBadge() {
    const streak = useGameStore((s) => s.streak)
    return (
        <span
            aria-label={`${streak} win streak`}
            className="doodle-scale-enter flex items-center gap-1 rounded-full bg-ink px-2 py-0.5 text-[11px] font-bold text-white">
            <Flame className="size-3 fill-orange-500 text-orange-500" aria-hidden />
            {streak}
        </span>
    )
}

// ----------------

export function WordHeader() {
    const word = useGameStore((s) => s.word)
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                Your word <DifficultyPill /> <StreakBadge />
            </div>
            <div className="flex items-center justify-between gap-3">
                <h1 key={word} className="doodle-item-enter text-5xl font-black leading-none tracking-tighter">{word}</h1>
                <Timer />
            </div>
        </div>
    )
}
