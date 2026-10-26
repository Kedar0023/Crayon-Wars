import { create } from 'zustand'
import { INITIAL_DIFFICULTY, INITIAL_STREAK, INITIAL_WORD, MODELS, ROUND_SECONDS } from '../lib/game'
import { DEFAULT_AVATAR_CODE, type AvatarCode } from '../components/characters/registry'
import type { Difficulty, GameStatus, ModelPlayer, Stroke } from './types'

interface GameState {
    word: string
    difficulty: Difficulty
    streak: number
    secondsLeft: number
    status: GameStatus
    models: ModelPlayer[]
    avatarCode: AvatarCode
    strokes: Stroke[]
    soundOn: boolean
    tick: () => void
    giveUp: () => void
    toggleSound: () => void
    setAvatarCode: (avatarCode: AvatarCode) => void
    addStroke: (stroke: Stroke) => void
    undo: () => void
    clear: () => void
}

export const useGameStore = create<GameState>((set) => ({
    word: INITIAL_WORD,
    difficulty: INITIAL_DIFFICULTY,
    streak: INITIAL_STREAK,
    secondsLeft: ROUND_SECONDS,
    status: 'playing',
    models: MODELS,
    avatarCode: DEFAULT_AVATAR_CODE,
    strokes: [],
    soundOn: true,
    tick: () =>
        set((s) => {
            if (s.status !== 'playing') return s
            const secondsLeft = s.secondsLeft - 1
            return secondsLeft <= 0 ? { secondsLeft: 0, status: 'timeout' } : { secondsLeft }
        }),
    giveUp: () => set((s) => (s.status === 'playing' ? { status: 'gave_up' } : s)),
    toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
    setAvatarCode: (avatarCode) => set({ avatarCode }),
    addStroke: (stroke) => set((s) => ({ strokes: [...s.strokes, stroke] })),
    undo: () => set((s) => ({ strokes: s.strokes.slice(0, -1) })),
    clear: () => set({ strokes: [] }),
}))
