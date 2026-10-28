import { useRef, useState } from 'react'
import { getStroke } from 'perfect-freehand'
import { useGameStore } from '@/lib/gameStore'
import type { Point, Stroke } from '@/lib/types'

const CANVAS_SIZE = 1000
const INK_COLORS = ['#171717', '#ef4b2f', '#2f6df6', '#22c78a', '#f5a31a'] as const
const STROKE_OPTIONS = {
    size: 12,
    thinning: 0.55,
    smoothing: 0.8,
    streamline: 1,
    simulatePressure: false,
}

function strokePath(stroke: Stroke) {
    const outline = getStroke(stroke.points, { ...STROKE_OPTIONS, size: stroke.size })
    if (outline.length === 0) return ''

    return `M ${outline.map(([x, y]) => `${x},${y}`).join(' L ')} Z`
}

function toPoint(event: React.PointerEvent<SVGSVGElement>): Point {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * CANVAS_SIZE
    const y = ((event.clientY - rect.top) / rect.height) * CANVAS_SIZE

    return [
        Math.max(0, Math.min(CANVAS_SIZE, x)),
        Math.max(0, Math.min(CANVAS_SIZE, y)),
        event.pointerType === 'mouse' ? 0.5 : event.pressure || 0.5,
    ]
}

export function CanvasCard() {
    const strokes = useGameStore((state) => state.strokes)
    const addStroke = useGameStore((state) => state.addStroke)
    const canDraw = useGameStore((state) => state.status === 'playing')
    const [activeColor, setActiveColor] = useState<(typeof INK_COLORS)[number]>(INK_COLORS[0])
    const [activeStroke, setActiveStroke] = useState<Stroke | null>(null)
    const pointerId = useRef<number | null>(null)
    const activeStrokeRef = useRef<Stroke | null>(null)

    const handlePointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
        if (!canDraw || event.button !== 0) return

        event.currentTarget.setPointerCapture(event.pointerId)
        const stroke: Stroke = {
            points: [toPoint(event)],
            color: activeColor,
            size: STROKE_OPTIONS.size,
        }
        pointerId.current = event.pointerId
        activeStrokeRef.current = stroke
        setActiveStroke(stroke)
    }

    const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
        if (pointerId.current !== event.pointerId || !activeStrokeRef.current) return

        const stroke = { ...activeStrokeRef.current, points: [...activeStrokeRef.current.points, toPoint(event)] }
        activeStrokeRef.current = stroke
        setActiveStroke(stroke)
    }

    const finishStroke = (event: React.PointerEvent<SVGSVGElement>) => {
        if (pointerId.current !== event.pointerId) return

        if (activeStrokeRef.current) addStroke(activeStrokeRef.current)
        pointerId.current = null
        activeStrokeRef.current = null
        setActiveStroke(null)
    }

    return (
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-slate-900/5 bg-[#fffefa] shadow-[0_8px_28px_rgba(15,23,42,0.08)]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                    backgroundImage: 'radial-gradient(#94a3b8 0.8px, transparent 0.8px)',
                    backgroundSize: '22px 22px',
                }}
            />
            <svg
                aria-label="Drawing canvas"
                className={`absolute inset-0 size-full touch-none ${canDraw ? 'cursor-crosshair' : 'cursor-not-allowed'}`}
                viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={finishStroke}
                onPointerCancel={finishStroke}>
                {strokes.map((stroke, index) => (
                    <path key={index} d={strokePath(stroke)} fill={stroke.color} />
                ))}
                {activeStroke && <path d={strokePath(activeStroke)} fill={activeStroke.color} />}
            </svg>
            <div
                aria-label="Ink color"
                className="absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-slate-900/5 bg-white/90 p-1.5 shadow-md shadow-slate-900/5 backdrop-blur"
                role="group">
                {INK_COLORS.map((color) => (
                    <button
                        key={color}
                        type="button"
                        aria-label={`Use ${color} ink`}
                        aria-pressed={activeColor === color}
                        className={`size-7 rounded-full border-2 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 ${
                            activeColor === color ? 'border-white ring-2 ring-slate-900/70' : 'border-white'
                        }`}
                        disabled={!canDraw}
                        onClick={() => setActiveColor(color)}
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
            {!canDraw && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm">
                    Round ended
                </div>
            )}
        </div>
    )
}
