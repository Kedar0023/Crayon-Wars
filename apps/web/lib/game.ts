import type { Difficulty, ModelPlayer } from './types'

export const ROUND_SECONDS = 60
export const INITIAL_WORD = 'cloud'
export const INITIAL_DIFFICULTY: Difficulty = 'easy'
export const INITIAL_STREAK = 3
export const DOODLES_TODAY = 5

export const DIFFICULTY_LEVEL: Record<Difficulty, number> = { easy: 1, medium: 2, hard: 3 }

export const MODELS: ModelPlayer[] = [
    { id: 'kimi', name: 'Kimi K3', provider: 'Moonshot', shape: 'circle', accent: 'kimi', guess: null, correct: null, wins: 2 },
    { id: 'qwen', name: 'Qwen3.8 Flash', provider: 'Qwen', shape: 'squircle', accent: 'qwen', guess: null, correct: null, wins: 0 },
    { id: 'glm', name: 'GLM-5.3 Flash', provider: 'Z.ai', shape: 'triangle', accent: 'glm', guess: null, correct: null, wins: 0 },
    { id: 'minimax', name: 'MiniMax M3', provider: 'MiniMax', shape: 'pill', accent: 'minimax', guess: 'banana', correct: null, wins: 0 },
    {
        id: 'deepseek',
        name: 'DeepSeek V4.1 Flash',
        provider: 'DeepSeek',
        shape: 'drop',
        accent: 'deepseek',
        guess: 'moon',
        correct: false,
        wins: 1,
    },
    { id: 'muse', name: 'Muse Glimmer', provider: 'Meta', shape: 'blob', accent: 'muse', guess: 'banana', correct: null, wins: 0 },
    {
        id: 'nemotron',
        name: 'Nemotron 3.5 Super',
        provider: 'NVIDIA',
        shape: 'star',
        accent: 'nemotron',
        guess: 'smile',
        correct: null,
        wins: 0,
    },
]
