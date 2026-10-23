import { useEffect } from 'react'
import { useGameStore } from '@/lib/gameStore'

/** Ticks the round clock once per second while the game is playing. */
export function useRoundTimer() {
    const playing = useGameStore((s) => s.status === 'playing')
    const tick = useGameStore((s) => s.tick)

    useEffect(() => {
        if (!playing) return
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [playing, tick])
}
