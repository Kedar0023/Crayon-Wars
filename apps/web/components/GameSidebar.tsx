import { useState, useRef, useEffect } from 'react'
import { SendHorizontal } from 'lucide-react'
import { cn } from '../lib/cn'
import { DEMO_MSG, DEMO_PLAYERS } from '../lib/demo_data'
import { PlayerInfoCard, CardAvatar } from '@/components/ui/PlayerCard'
import type { ChatMessage } from './ui/ChatBubble'
import ChatBubble from './ui/ChatBubble'

const TABS = ['players', 'chat'] as const
type Tab = (typeof TABS)[number]

const PlayersTab = ()=> {
    return (
        <div className="field-scrollbar flex h-full min-h-0 flex-col gap-2 overflow-y-auto">
            <ul className="flex flex-col gap-2.5">
                {DEMO_PLAYERS.map((player, index) => (
                    <PlayerInfoCard key={`${player.tag}-${index}`} {...player} />
                ))}
            </ul>
        </div>
    )
}
// ----------------

const ChatTab = ()=> {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [messages] = useState<ChatMessage[]>(DEMO_MSG)

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
                messages.map((msg) => <ChatBubble key={msg.id} {...msg} />)
            )}
        </div>
    )
}

// ----------------

export function GameSidebar() {
    const [activeTab, setActiveTab] = useState<Tab>('players')
    const [message, setMessage] = useState('')

    const handleSend = () => {
        const trimmed = message.trim()
        if (!trimmed) return
        // TODO: wire up to actual chat
        setMessage('')
    }

    return (
        <aside
            aria-label="The field"
            className="flex min-h-88 max-h-[calc(100vh-7rem)] flex-col gap-2 overflow-hidden lg:h-full lg:min-h-0 lg:max-h-none lg:pt-8 lg:contain-[size]">
            <nav className="flex items-center rounded-full bg-white/40 p-0.5 backdrop-blur">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            'inline-flex min-h-8 flex-1 items-center justify-center rounded-full px-3.5 text-sm font-medium capitalize transition',
                            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 active:scale-95',
                            activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-white/60',
                        )}>
                        {tab}
                    </button>
                ))}
            </nav>

            <div className="min-h-0 flex-1 overflow-hidden">{activeTab === 'players' ? <PlayersTab /> : <ChatTab />}</div>

            <div className="mt-auto flex items-center gap-1.5 rounded-full bg-white/40 p-0.5 backdrop-blur">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message…"
                    className="min-w-0 flex-1 bg-transparent px-3 py-1.5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
                <button
                    onClick={handleSend}
                    className={cn(
                        'inline-flex size-8 shrink-0 items-center justify-center rounded-full transition active:scale-90',
                        message.trim() ? 'bg-ink text-white' : 'text-slate-400 hover:bg-white/60',
                    )}>
                    <SendHorizontal className="size-4" />
                </button>
            </div>
        </aside>
    )
}
