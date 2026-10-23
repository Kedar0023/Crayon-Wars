import { DOODLES_TODAY } from '../../lib/game'
import { useGameStore } from '@/lib/gameStore'
// import { ModelAvatar } from '../../components/ui/ModelAvatar'
import { ModelCard } from './ModelCard'

export function FieldPanel() {
    const models = useGameStore((s) => s.models)
    return (
        <aside aria-label="The field" className="flex flex-col gap-2 lg:pt-14">
            <div className="flex items-center justify-between px-1 text-[11px] font-medium text-slate-500">
                <h2>The field</h2>
                <span className="flex items-center gap-1.5">
                    <i aria-hidden className="size-1.5 rounded-full bg-live" />
                    {DOODLES_TODAY} doodles today
                </span>
            </div>
            {/* <ul className="flex flex-col gap-2.5">
                {models.map((model) => (
                    <ModelCard
                        key={model.id}
                        model={{
                            name: model.name,
                            provider: model.provider,
                            // avatar: <ModelAvatar shape={model.shape} accent={model.accent} />,
                            wins: model.wins,
                            guess: model.guess,
                            correct: model.correct,
                        }}
                    />
                ))}
            </ul> */}
        </aside>
    )
}
