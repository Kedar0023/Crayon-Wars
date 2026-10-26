import type { Route } from './+types/home'
import { Shell } from '@/components/layout'
import { CanvasActions } from '../../components/canvas/CanvasActions'
import { CanvasCard } from '../../components/canvas/CanvasCard'
import { FieldPanel } from '../../features/game/FieldPanel'
import { useRoundTimer } from '../../features/game/useRoundTimer'
import { WordHeader } from '../../features/game/WordHeader'

export function meta({}: Route.MetaArgs) {
    return [{ title: 'Crayon Wars' }, { name: 'description', content: 'Doodle Derby game page' }]
}

// ----------------

export default function Home() {
    useRoundTimer()

    return (
        <Shell>
            <div className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-4 md:px-6 lg:grid-cols-[37.5rem_minmax(0,1fr)] lg:justify-center lg:gap-8 lg:py-8 xl:grid-cols-[37.5rem_26rem]">
                <section className="flex flex-col gap-3">
                    <WordHeader />
                    <CanvasCard />
                    <CanvasActions />
                </section>
                <FieldPanel />
            </div>
        </Shell>
    )
}
