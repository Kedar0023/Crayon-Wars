import { ROUND_SECONDS } from '../../lib/game'
import { useGameStore } from '@/lib/gameStore'

const RADIUS = 8
const CIRC = 2 * Math.PI * RADIUS

export function Timer() {
    const secondsLeft = useGameStore((s) => s.secondsLeft)
    const progress = secondsLeft / ROUND_SECONDS

    return (
        <div
            role="timer"
            aria-label={`${secondsLeft} seconds left`}
            className="flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-2 text-sm font-bold tabular-nums shadow-sm">
            <svg viewBox="0 0 20 20" aria-hidden className="size-5 -rotate-90">
                <circle cx="10" cy="10" r={RADIUS} fill="none" stroke="currentColor" strokeOpacity=".15" strokeWidth="2.5" />
                <circle
                    cx="10"
                    cy="10"
                    r={RADIUS}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={CIRC}
                    strokeDashoffset={CIRC * (1 - progress)}
                    className="transition-[stroke-dashoffset] duration-1000 ease-linear"
                />
            </svg>
            {secondsLeft}s
        </div>
    )
}
