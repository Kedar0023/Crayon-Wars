export type Difficulty = 'easy' | 'medium' | 'hard'
export type GameStatus = 'playing' | 'won' | 'gave_up' | 'timeout'
export type AvatarShape = 'circle' | 'squircle' | 'triangle' | 'pill' | 'drop' | 'blob' | 'star'
export type ModelAccent = 'kimi' | 'qwen' | 'glm' | 'minimax' | 'deepseek' | 'muse' | 'nemotron'

export interface ModelPlayer {
    id: string
    name: string
    provider: string
    shape: AvatarShape
    accent: ModelAccent
    /** null = still watching */
    guess: string | null
    /** false = guess was wrong (rendered struck-through) */
    correct: boolean | null
    wins: number
}

/** perfect-freehand point: [x, y, pressure] */
export type Point = [number, number, number]
export type Stroke = Point[]
