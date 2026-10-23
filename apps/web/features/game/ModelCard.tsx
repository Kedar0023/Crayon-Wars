import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface ModelCardModel {
    name: string
    provider: string
    avatar: ReactNode
    wins: number
    guess: string | null
    correct: boolean | null
}

function ModelStatus({ guess, correct }: Pick<ModelCardModel, 'guess' | 'correct'>) {
    if (correct === true) {
        return <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Correct</span>
    }

    if (correct === false) {
        return <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">Missed</span>
    }

    if (!guess) {
        return <span className="text-xs font-medium text-slate-400">Waiting</span>
    }

    return (
        <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
            <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-amber-500" />
            Thinking
        </span>
    )
}

export function ModelCard({ model }: { model: ModelCardModel }) {
    return (
        <li className="rounded-2xl border border-white/70 bg-white/95 p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-slate-50">{model.avatar}</div>

                <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-baseline gap-1.5">
                        <p className="truncate text-sm font-bold text-slate-900">{model.name}</p>
                        <p className="truncate text-xs text-slate-400">{model.provider}</p>
                    </div>
                    <p
                        className={cn(
                            'truncate text-base font-bold leading-tight',
                            model.correct === false ? 'text-slate-400 line-through' : 'text-slate-900',
                            !model.guess && 'font-medium text-slate-400',
                        )}>
                        {model.guess ?? 'Watching the drawing'}
                    </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                    <ModelStatus guess={model.guess} correct={model.correct} />
                    <span className="text-[11px] font-medium text-slate-400">
                        {model.wins} {model.wins === 1 ? 'win' : 'wins'}
                    </span>
                </div>
            </div>
        </li>
    )
}
