

export const llmCards = [
    { label: 'Waiting', name: 'Claude', provider: 'Anthropic', avatar: '31', wins: 4 },
    { label: 'Thinking', name: 'GPT-4.1', provider: 'OpenAI', avatar: '12', wins: 2, guess: 'A sunflower' },
    {
        label: 'Correct',
        name: 'Gemini',
        provider: 'Google',
        avatar: '62',
        wins: 6,
        guess: 'A sunflower',
        correct: true,
    },
    {
        label: 'Missed',
        name: 'Llama',
        provider: 'Meta',
        avatar: '82',
        wins: 1,
        guess: 'A daisy',
        correct: false,
    },
] as const


import { PlayerInfoCard, type PlayerInfoCardProps } from '@/components/ui/PlayerCard'

export const DEMO_PLAYERS: PlayerInfoCardProps[] = [
    // one per status
    { name: 'Jennie', tag: '#A12345', avatar: '00', score: 120, winStreak: 3, status: 'ready', ping: 40, isHost: true, isYou: false, isGuest: false, streakFrozen: false, isNewBest: false, isWinner: false },
    { name: 'Rosé', tag: '#B23456', avatar: '11', score: 85, winStreak: 1, status: 'choosing', ping: 55, isHost: false, isYou: false, isGuest: false, streakFrozen: false, isNewBest: false, isWinner: false },
    { name: 'Jisoo', tag: '#C34567', avatar: '22', score: 210, winStreak: 0, status: 'draw', ping: 32, isHost: false, isYou: false, isGuest: false, streakFrozen: false, isNewBest: true, isWinner: false },
    { name: 'Lisa', tag: '#D45678', avatar: '31', score: 160, winStreak: 2, status: 'guess', ping: 70, isHost: false, isYou: false, isGuest: false, streakFrozen: false, isNewBest: false, isWinner: false },
    { name: 'Jennie', tag: '#A12345', avatar: '00', score: 240, winStreak: 4, status: 'guessed', timeTaken: 2.4, ping: 40, isHost: false, isYou: false, isGuest: false, streakFrozen: false, isNewBest: false, isWinner: false },
    { name: 'Mina', tag: '#E56789', avatar: '42', score: 60, winStreak: 1, status: 'wait', ping: 90, isHost: false, isYou: false, isGuest: false, streakFrozen: false, isNewBest: false, isWinner: false },
    { name: 'PlayerName', tag: '#Hj12C3', avatar: '50', score: 350, winStreak: 3, status: 'reconnecting', ping: 999, isHost: false, isYou: false, isGuest: true, streakFrozen: false, isNewBest: false, isWinner: false },
    { name: 'Sana', tag: '#F67890', avatar: '61', score: 75, winStreak: 1, status: 'disconnected', ping: 0, isHost: false, isYou: false, isGuest: false, streakFrozen: false, isNewBest: false, isWinner: false },

    // flags
    { name: 'Me', tag: '#Y00001', avatar: '92', score: 300, winStreak: 2, status: 'draw', ping: 25, isHost: true, isYou: true, isGuest: false, streakFrozen: false, isNewBest: false, isWinner: false },
    { name: 'Me', tag: '#Y00002', avatar: '12', score: 150, winStreak: 1, status: 'guess', ping: 25, isHost: false, isYou: true, isGuest: true, streakFrozen: false, isNewBest: false, isWinner: false },
    { name: 'Winner', tag: '#R00001', avatar: '20', score: 1250, winStreak: 5, status: 'ready', ping: 30, isHost: false, isYou: false, isGuest: false, rank: 1, streakFrozen: false, isNewBest: true, isWinner: true },
    { name: 'RunnerUp', tag: '#R00002', avatar: '30', score: 980, winStreak: 2, status: 'ready', ping: 45, isHost: false, isYou: false, isGuest: false, rank: 2, streakFrozen: false, isNewBest: false, isWinner: false },
    { name: 'Frosty', tag: '#S00001', avatar: '40', score: 500, winStreak: 6, status: 'wait', ping: 60, isHost: false, isYou: false, isGuest: false, streakFrozen: true, isNewBest: false, isWinner: false },

    // edge cases
    { name: 'Averyveryverylongplayername', tag: '#L00001', avatar: '71', score: 1234567, winStreak: 12, status: 'choosing', ping: 80, isHost: true, isYou: true, isGuest: false, streakFrozen: false, isNewBest: false, isWinner: false },
    { name: 'Newbie', tag: 'Z99999', avatar: '90', score: 0, winStreak: 0, status: 'ready', ping: 50, isHost: false, isYou: false, isGuest: false, streakFrozen: false, isNewBest: false, isWinner: false },
]