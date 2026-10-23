import { Flag, Trash2, Undo2 } from 'lucide-react'
import { PillButton } from '../ui/PillButton'
import { useGameStore } from '@/lib/gameStore'

export function CanvasActions() {
    const playing = useGameStore((s) => s.status === 'playing')
    const hasStrokes = useGameStore((s) => s.strokes.length > 0)
    const undo = useGameStore((s) => s.undo)
    const clear = useGameStore((s) => s.clear)
    const giveUp = useGameStore((s) => s.giveUp)

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 rounded-full bg-white/40 p-0.5">
                <PillButton icon={<Undo2 className="size-3.5" />} label="Undo" onClick={undo} disabled={!playing || !hasStrokes} />
                <PillButton icon={<Trash2 className="size-3.5" />} label="Clear" onClick={clear} disabled={!playing || !hasStrokes} />
            </div>
            <div className="rounded-full bg-white/40 p-0.5">
                <PillButton icon={<Flag className="size-3.5" />} label="Give up" onClick={giveUp} disabled={!playing} />
            </div>
        </div>
    )
}
