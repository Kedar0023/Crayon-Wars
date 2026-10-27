import type { AvatarCode } from '../characters/registry'
import { getAvatar } from '../characters/registry'

export const CardAvatar = ({ code, className = 'size-12' }: { code: AvatarCode; className?: string }) => {
    const { color, face } = getAvatar(code)
    const Face = face.component

    return (
        <div className={`flex ${className} shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50`}>
            <Face aria-hidden="true" background={color.value} radius={20} followCursor={false} className={className} />
        </div>
    )
}

// --------------------------------------------------------------------------------

interface LlmInfoCardProps {
    name: string
    provider: string
    avatar: AvatarCode
    wins: number
    guess?: string | null
    correct?: boolean | null
}

export function LlmInfoCard({ name, provider, avatar, wins, guess = null, correct = null }: LlmInfoCardProps) {
    const status = correct === true ? 'Correct' : correct === false ? 'Missed' : guess ? 'Thinking' : 'Waiting'
    const statusClass =
        correct === true
            ? 'bg-emerald-100 text-emerald-700'
            : correct === false
              ? 'bg-rose-100 text-rose-700'
              : guess
                ? 'bg-amber-100 text-amber-700'
                : 'text-slate-400'

    return (
        <ul className="rounded-2xl border border-white/70 bg-white/95 p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-3">
                <CardAvatar code={avatar} />

                <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-baseline gap-1.5">
                        <p className="truncate text-sm font-bold text-slate-900">{name}</p>
                        <p className="truncate text-xs text-slate-400">{provider}</p>
                    </div>
                    <p
                        className={`truncate text-base font-bold leading-tight ${correct === false ? 'text-slate-400 line-through' : guess ? 'text-slate-900' : 'font-medium text-slate-400'}`}>
                        {guess ?? 'Watching the drawing'}
                    </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass}`}>
                        {status === 'Thinking' && (
                            <span aria-hidden="true" className="mr-1 inline-block size-1.5 animate-pulse rounded-full bg-amber-500" />
                        )}
                        {status}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                        {wins} {wins === 1 ? 'win' : 'wins'}
                    </span>
                </div>
            </div>
        </ul>
    )
}

// ----
