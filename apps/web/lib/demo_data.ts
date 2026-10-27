

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
import type { ChatMessage } from '@/components/ui/ChatBubble'

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



export const DEMO_MSG: ChatMessage[] = [
    { id: 1, avatar: '00', sender: 'Jennie', text: 'gl everyone', isSystem: false },
    { id: 2, avatar: '11', sender: 'Rosé', text: 'this is so hard lol', isSystem: false },
    { id: 3, avatar: '00', sender: 'System', text: 'jisoo set a new best!', isSystem: true },
    { id: 4, avatar: '31', sender: 'Lisa', text: 'wait i think i know this one', isSystem: false },
    { id: 5, avatar: '00', sender: 'Jennie', text: 'too easy', isSystem: false },
    { id: 6, avatar: '22', sender: 'Jisoo', text: 'no way!! lets gooo', isSystem: false },
    { id: 7, avatar: '31', sender: 'Lisa', text: 'the shape is definitely a sunflower', isSystem: false },
    { id: 8, avatar: '11', sender: 'Rosé', text: 'i was about to guess that too', isSystem: false },
    { id: 9, avatar: '00', sender: 'System', text: 'lisa is drawing the next round', isSystem: true },
    { id: 10, avatar: '00', sender: 'Jennie', text: 'omg this one is making me dizzy', isSystem: false },
    { id: 11, avatar: '22', sender: 'Jisoo', text: 'same, but i am still trying', isSystem: false },
    { id: 12, avatar: '31', sender: 'Lisa', text: 'the petals look like they are floating', isSystem: false },
    { id: 13, avatar: '00', sender: 'Jennie', text: 'i swear the last prompt was easier', isSystem: false },
    { id: 14, avatar: '11', sender: 'Rosé', text: 'nah this is pure chaos', isSystem: false },
    { id: 15, avatar: '22', sender: 'Jisoo', text: 'fine, i will just keep scribbling until it works', isSystem: false },
    { id: 16, avatar: '31', sender: 'Lisa', text: 'the color palette is giving me flashbacks', isSystem: false },
    { id: 17, avatar: '00', sender: 'Jennie', text: 'bro why is every object in this game a weird blob', isSystem: false },
    { id: 18, avatar: '11', sender: 'Rosé', text: 'because the prompt is cursed', isSystem: false },
    { id: 19, avatar: '22', sender: 'Jisoo', text: 'i am not drawing a banana again', isSystem: false },
    { id: 20, avatar: '31', sender: 'Lisa', text: 'you definitely drew a banana last round', isSystem: false },
    { id: 21, avatar: '00', sender: 'Jennie', text: 'that was a very confident banana', isSystem: false },
    { id: 22, avatar: '11', sender: 'Rosé', text: 'it looked like a moon with anxiety', isSystem: false },
    { id: 23, avatar: '00', sender: 'System', text: 'round 4 starting in 5 seconds', isSystem: true },
    { id: 24, avatar: '22', sender: 'Jisoo', text: 'please just give me one normal object this time', isSystem: false },
]