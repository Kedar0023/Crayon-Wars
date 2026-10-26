import { Flame, Snowflake } from 'lucide-react'
import GoldMedal from '@/assets/gold_medal.svg' // 37x50
import SilverMedal from '@/assets/medal.svg' // 37x50
import { getAvatar, type AvatarCode } from '../characters/registry'

type PlayerStatus = 'ready' | 'choosing' | 'draw' | 'guess' | 'guessed' | 'wait' | 'reconnecting' | 'disconnected'

const STATUS_LABEL: Partial<Record<PlayerStatus, string>> = {
    ready: 'Ready',
    choosing: 'Picking Word …',
    draw: 'Drawing …',
    wait: 'Waiting …',
    reconnecting: 'Reconnecting …',
    disconnected: 'Disconnected',
}

export interface PlayerInfoCardProps {
    name: string
    tag: string // ex #A12345   base 62
    avatar: AvatarCode
    score: number
    winStreak: number
    status: PlayerStatus
    ping: number
    isHost: boolean
    timeTaken?: number // time taken to correct guess

    // UI-only flags
    isYou: boolean
    isGuest: boolean
    rank?: 1 | 2 // 1 = gold, 2 = silver
    streakFrozen: boolean // snowflake instead of flame
    isNewBest: boolean
    isWinner: boolean
}

/*
 * Everything is sized in `cqw` (1cqw = 1% of the card's width), so the card
 * scales proportionally with its parent. Design baseline: 406px wide (1cqw ≈ 4.06px).
 */

const Pill = ({ className, children }: { className: string; children: React.ReactNode }) => (
    <span className={`shrink-0 rounded-[1.6cqw] px-[2cqw] py-[0.4cqw] text-[2.5cqw] font-semibold leading-[3.4cqw] ${className}`}>
        {children}
    </span>
)

export const CardAvatar = ({ code, className = 'size-12' }: { code: AvatarCode; className?: string }) => {
    const { color, face } = getAvatar(code)
    const Face = face.component

    return (
        <div className={`flex ${className} shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50`}>
            <Face aria-hidden="true" background={color.value} radius={20} followCursor={false} className={className} />
        </div>
    )
}

export const PlayerInfoCard = ({
    name,
    tag,
    avatar,
    score,
    winStreak,
    status,
    isHost,
    timeTaken,
    isYou,
    isGuest,
    rank,
    streakFrozen,
    isNewBest,
}: PlayerInfoCardProps) => {
    const avatarColor = getAvatar(avatar).color.value
    const disconnected = status === 'disconnected'
    const Medal = rank === 1 ? GoldMedal : rank === 2 ? SilverMedal : null
    const StreakIcon = streakFrozen ? Snowflake : Flame

    const streakStyle = streakFrozen
        ? 'stroke-cyan-400'
        : winStreak > 0
          ? 'fill-red-400 stroke-orange-500'
          : 'fill-neutral-300 stroke-neutral-400' // 0 streak: dimmed flame

    return (
        // outer = size container (so children can use cqw); inner = visual card
        <div className="size-full" style={{ containerType: 'inline-size' }}>
            <div
                aria-disabled={disconnected}
                className={`flex size-full items-center gap-[3cqw] rounded-3xl bg-neutral-100 p-[2cqw] pr-[4cqw] shadow-sm transition ${
                    disconnected ? 'opacity-60 grayscale' : 'hover:-translate-y-0.5 hover:shadow-md hover:ring-2 hover:ring-sky-500'
                }`}>
                {/* Avatar */}
                <div className="relative aspect-square w-[16cqw] shrink-0">
                    {isNewBest && (
                        <span className="absolute left-[-2cqw] top-[-2.5cqw] z-10 rotate-[-10deg] animate-[badge-pulse_1.5s_ease-in-out_infinite] whitespace-nowrap rounded-full bg-black px-[2cqw] py-[0.6cqw] text-[2.5cqw] font-semibold leading-none text-white shadow-md">
                            New Best!
                        </span>
                    )}
                    <CardAvatar code={avatar} className="size-full" />
                    {Medal && (
                        <img
                            src={Medal}
                            alt=""
                            aria-hidden="true"
                            className="absolute bottom-[-3cqw] left-[-2.5cqw] z-10 h-[12.3cqw] w-[9.1cqw]"
                        />
                    )}
                </div>

                {/* Info */}
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-[1.5cqw] self-stretch py-[1cqw] text-neutral-900">
                    <div className="min-w-0">
                        <div className="flex items-center gap-[1.5cqw]">
                            <p className="min-w-0 flex-1 truncate text-[5.4cqw] font-extrabold leading-[1.1] tracking-tight">
                                {name.charAt(0).toUpperCase() + name.slice(1)}
                            </p>
                            {isHost && <Pill className="bg-neutral-900 text-white">Host</Pill>}
                            {isGuest && <Pill className="bg-cyan-500 text-white">Guest</Pill>}
                            {isYou && <Pill className="bg-white text-neutral-900 ring-1 ring-neutral-900/30">You</Pill>}
                        </div>
                        <p className="mt-[0.5cqw] truncate text-[3.2cqw] font-medium leading-none text-neutral-500">
                            #{tag.replace('#', '')}
                        </p>
                    </div>

                    <div className="flex items-end justify-between gap-[2cqw]">
                        <div className="flex h-[5.5cqw] min-w-0 items-center whitespace-nowrap text-[3.5cqw] font-medium leading-none text-neutral-500">
                            {status === 'guess' && (
                                <span className="flex gap-[1cqw] rounded-full bg-sky-100 px-[2cqw] py-[1.2cqw]">
                                    {[0, 1, 2].map((i) => (
                                        <span
                                            key={i}
                                            className="size-[2cqw] animate-bounce rounded-full"
                                            style={{ animationDelay: `${i * 150}ms`, backgroundColor: avatarColor }}
                                        />
                                    ))}
                                </span>
                            )}
                            {status === 'guessed' && timeTaken !== undefined && (
                                <span className="text-neutral-900">{timeTaken.toFixed(1)} s</span>
                            )}
                            {STATUS_LABEL[status] && (
                                <span className={`truncate ${status === 'reconnecting' ? 'animate-pulse' : ''}`}>
                                    {STATUS_LABEL[status]}
                                </span>
                            )}
                        </div>
                        <p className="shrink-0 whitespace-nowrap leading-none tabular-nums">
                            <span className="text-[5.9cqw] font-bold tracking-tight">{score.toLocaleString()}</span>
                            <span className="ml-[1cqw] text-[4cqw] font-semibold text-neutral-500">pt</span>
                        </p>
                    </div>
                </div>

                {/* Streak */}
                <div className="relative my-[1.5cqw] flex shrink-0 items-center self-stretch border-l border-dashed border-neutral-400 pl-[4cqw] pr-[3cqw]">
                    <StreakIcon className={`size-[13.5cqw] ${streakStyle}`} strokeWidth={1.5} aria-hidden />
                    <span className="absolute bottom-[-0.5cqw] right-0 text-[5.2cqw] font-semibold leading-none">
                        x{winStreak}
                    </span>
                </div>
            </div>
        </div>
    )
}
