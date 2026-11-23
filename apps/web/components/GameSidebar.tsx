import { useState, useRef, useEffect, type FormEvent } from 'react'
import { Check, SendHorizontal, UserRound, X } from 'lucide-react'
import { cn } from '../lib/cn'
import { DEMO_MSG, DEMO_PLAYERS } from '../lib/demo_data'
import { PlayerInfoCard, CardAvatar } from '@/components/ui/PlayerCard'
import type { ChatMessage } from './ui/ChatBubble'
import ChatBubble from './ui/ChatBubble'
import { DEFAULT_PROFILE } from './landing/types'

const TABS = ['players', 'chat'] as const
type Tab = (typeof TABS)[number]

const PlayersTab = ({ onSelect }: { onSelect: (player: (typeof DEMO_PLAYERS)[number]) => void }) => {
    return (
        <div className="field-scrollbar flex h-full min-h-0 flex-col gap-2 overflow-y-auto">
            <p className="px-1 text-xs font-semibold text-slate-500">Choose a player to view their card.</p>
            <ul className="flex flex-col gap-1">
                {DEMO_PLAYERS.slice(0, 8).map((player, index) => (
                    <li
                        key={`${player.tag}-${index}`}
                        className="doodle-row-enter"
                        style={{ animationDelay: `${Math.min(index * 45, 450)}ms` }}>
                        <button
                            type="button"
                            aria-label={`View ${player.name}'s player card`}
                            onClick={() => onSelect(player)}
                            className="block w-full rounded-2xl text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700">
                            <PlayerInfoCard {...player} />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
// ----------------

const ChatTab = ({ messages }: { messages: ChatMessage[] }) => {
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }, [messages.length])

    return (
        <div ref={scrollRef} className="field-scrollbar flex h-full min-h-0 flex-col gap-2.5 overflow-y-auto">
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                    <span className="text-3xl">💬</span>
                    <p className="text-sm font-medium text-slate-400">No messages yet</p>
                    <p className="text-xs text-slate-400">Say something to the field!</p>
                </div>
            ) : (
                messages.map((msg, index) => (
                    <div
                        key={msg.id}
                        className="doodle-item-enter"
                        style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}>
                        <ChatBubble {...msg} />
                    </div>
                ))
            )}
        </div>
    )
}

// ----------------

export function GameSidebar() {
    const [activeTab, setActiveTab] = useState<Tab>('players')
    const [messages, setMessages] = useState<ChatMessage[]>(DEMO_MSG)
    const [message, setMessage] = useState('')
    const [selectedPlayer, setSelectedPlayer] = useState<(typeof DEMO_PLAYERS)[number] | null>(null)
    const [friendRequested, setFriendRequested] = useState(false)

    useEffect(() => {
        if (!selectedPlayer) return
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setSelectedPlayer(null)
        }
        window.addEventListener('keydown', closeOnEscape)
        return () => window.removeEventListener('keydown', closeOnEscape)
    }, [selectedPlayer])

    const handleSend = (event: FormEvent) => {
        event.preventDefault()
        const trimmed = message.trim()
        if (!trimmed) return
        setMessages((current) => [...current, {
            id: Math.max(0, ...current.map((item) => item.id)) + 1,
            avatar: DEFAULT_PROFILE.avatar,
            sender: 'You',
            text: trimmed,
            isSystem: false,
        }])
        setMessage('')
        setActiveTab('chat')
    }

    return (
        <aside
            aria-label="The field"
            className="flex min-h-88 max-h-[calc(100vh-7rem)] flex-col gap-2 overflow-hidden lg:h-full lg:min-h-0 lg:max-h-none lg:pt-8 lg:contain-[size]">
            <nav role="tablist" aria-label="Game sidebar" className="flex items-center rounded-full bg-white/40 p-0.5 backdrop-blur">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === tab}
                        id={`${tab}-tab`}
                        aria-controls={`${tab}-panel`}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            'inline-flex min-h-8 flex-1 items-center justify-center rounded-full px-3.5 text-sm font-medium capitalize transition-all duration-200 ease-out',
                            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 active:scale-[0.98]',
                            activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-white/60',
                        )}>
                        {tab}
                    </button>
                ))}
            </nav>

            <div className="min-h-0 flex-1 overflow-hidden" role="tabpanel" id={`${activeTab}-panel`} aria-labelledby={`${activeTab}-tab`}>
                {activeTab === 'players'
                    ? <PlayersTab onSelect={(player) => { setSelectedPlayer(player); setFriendRequested(false) }} />
                    : <ChatTab messages={messages} />}
            </div>

            <form onSubmit={handleSend} className="mt-auto rounded-2xl bg-white/40 p-2 backdrop-blur">
                <div className="flex items-center gap-1.5">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={180}
                    aria-label="Chat message"
                    placeholder="Say something kind…"
                    className="min-w-0 flex-1 bg-transparent px-3 py-1.5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
                <button
                    type="submit"
                    aria-label="Send message"
                    disabled={!message.trim()}
                    className={cn(
                        'inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-all duration-150 ease-out active:scale-95 disabled:cursor-not-allowed disabled:opacity-50',
                        message.trim() ? 'bg-ink text-white' : 'text-slate-400 hover:bg-white/60',
                    )}>
                    <SendHorizontal className="size-4" />
                </button>
                </div>
                <p className="px-3 pt-1 text-right text-[10px] font-medium text-slate-500">{message.length}/180</p>
            </form>

            {selectedPlayer && (
                <div className="fixed inset-0 z-30 grid place-items-center bg-ink/40 p-4" onClick={() => setSelectedPlayer(null)}>
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="player-detail-title"
                        onClick={(event) => event.stopPropagation()}
                        className="doodle-scale-enter w-full max-w-sm rounded-3xl bg-[#fffefa] p-5 shadow-xl">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <CardAvatar code={selectedPlayer.avatar} className="size-14" />
                                <div>
                                    <h2 id="player-detail-title" className="font-extrabold">{selectedPlayer.name}</h2>
                                    <p className="text-xs font-semibold text-slate-500">{selectedPlayer.tag}</p>
                                </div>
                            </div>
                            <button type="button" aria-label="Close player details" onClick={() => setSelectedPlayer(null)} className="grid size-8 place-items-center rounded-full hover:bg-slate-100"><X className="size-4" /></button>
                        </div>
                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl bg-sky-50 p-3"><p className="text-xs font-semibold text-slate-500">Score</p><p className="mt-1 font-black">{selectedPlayer.score.toLocaleString()} pts</p></div>
                            <div className="rounded-2xl bg-amber-50 p-3"><p className="text-xs font-semibold text-slate-500">Win streak</p><p className="mt-1 font-black">{selectedPlayer.winStreak} rounds</p></div>
                        </div>
                        <p className="mt-4 text-sm text-slate-600">Currently {selectedPlayer.status === 'ready' ? 'ready to play' : selectedPlayer.status === 'disconnected' ? 'disconnected' : 'in this game'}.</p>
                        <button
                            type="button"
                            onClick={() => setFriendRequested(!friendRequested)}
                            className={`mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-bold transition ${friendRequested ? 'bg-emerald-100 text-emerald-900' : 'bg-ink text-white hover:bg-slate-800'}`}>
                            {friendRequested ? <Check className="size-4" /> : <UserRound className="size-4" />}
                            {friendRequested ? 'Request sent' : 'Add friend'}
                        </button>
                        <p className="mt-2 text-center text-[10px] font-medium text-slate-400">Player details and friend requests are demo interactions.</p>
                    </section>
                </div>
            )}
        </aside>
    )
}
