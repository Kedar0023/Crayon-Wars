import { BadgeCheck, Flag, Pause, Play, Trash2, Undo2 } from 'lucide-react'
import { PillButton } from '../ui/PillButton'
import { useGameStore } from '@/lib/gameStore'

export function CanvasActions() {
    const playing = useGameStore((s) => s.status === 'playing')
    const canEditCanvas = useGameStore((s) => s.playerRole === 'drawer')
    const hasStrokes = useGameStore((s) => s.strokes.length > 0)
    const undo = useGameStore((s) => s.undo)
    const clear = useGameStore((s) => s.clear)
    const giveUp = useGameStore((s) => s.giveUp)
    const winRound = useGameStore((s) => s.winRound)
    const pauseRound = useGameStore((s) => s.pauseRound)
    const resumeRound = useGameStore((s) => s.resumeRound)
    const paused = useGameStore((s) => s.status === 'paused')

    return (
        <div className="doodle-bar-enter flex items-center justify-between">
            <div className="flex items-center gap-1 rounded-full bg-white/40 p-0.5">
                <PillButton icon={<Undo2 className="size-3.5" />} label="Undo" onClick={undo} disabled={!playing || !canEditCanvas || !hasStrokes} />
                <PillButton icon={<Trash2 className="size-3.5" />} label="Clear" onClick={clear} disabled={!playing || !canEditCanvas || !hasStrokes} />
            </div>
            <div className="flex items-center gap-1 rounded-full bg-white/40 p-0.5">
                <PillButton icon={<BadgeCheck className="size-3.5" />} label="AI guessed it" onClick={winRound} disabled={!playing} />
                <PillButton icon={paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />} label={paused ? 'Resume' : 'Pause'} onClick={paused ? resumeRound : pauseRound} disabled={!playing && !paused} />
                <PillButton icon={<Flag className="size-3.5" />} label="Give up" onClick={giveUp} disabled={!playing} />
            </div>
        </div>
    )
}
