import { useState, useRef, useEffect } from 'react'
import { SendHorizontal } from 'lucide-react'
import { DOODLES_TODAY } from '../../lib/game'
import { CardAvatar } from '../../components/ui/InfoCard'
import { getAvatar, type AvatarCode } from '../../components/characters/registry'
import { cn } from '../../lib/cn'
import { DEMO_PLAYERS } from '../../lib/demo_data'
import { PlayerInfoCard } from '@/components/ui/PlayerCard'

const playerMap = Object.fromEntries(DEMO_PLAYERS.map((p) => [p.name, p]))

// ----------------

const TABS = ['players', 'chat'] as const
type Tab = (typeof TABS)[number]

// ----------------

interface ChatMessage {
    id: number
    sender: string
    text: string
    isSystem?: boolean
}

const demoMessages: ChatMessage[] = [
    { id: 1, sender: 'jennie', text: 'gl everyone' },
    { id: 2, sender: 'rosé', text: 'this is so hard lol' },
    { id: 3, sender: 'system', text: 'jisoo set a new best!', isSystem: true },
    { id: 4, sender: 'lisa', text: 'wait i think i know this one' },
    { id: 5, sender: 'jennie', text: 'too easy' },
    { id: 6, sender: 'jisoo', text: 'no way!! lets gooo' },
    { id: 7, sender: 'lisa', text: 'the shape is definitely a sunflower' },
    { id: 8, sender: 'rosé', text: 'i was about to guess that too' },
    { id: 9, sender: 'system', text: 'lisa is drawing the next round', isSystem: true },
    { id: 10, sender: 'jennie', text: 'omg this one is making me dizzy' },
    { id: 11, sender: 'jisoo', text: 'same, but i am still trying' },
    { id: 12, sender: 'lisa', text: 'the petals look like they are floating' },
    { id: 13, sender: 'jennie', text: 'i swear the last prompt was easier' },
    { id: 14, sender: 'rosé', text: 'nah this is pure chaos' },
    { id: 15, sender: 'jisoo', text: 'fine, i will just keep scribbling until it works' },
    { id: 16, sender: 'lisa', text: 'the color palette is giving me flashbacks' },
    { id: 17, sender: 'jennie', text: 'bro why is every object in this game a weird blob' },
    { id: 18, sender: 'rosé', text: 'because the prompt is cursed' },
    { id: 19, sender: 'jisoo', text: 'i am not drawing a banana again' },
    { id: 20, sender: 'lisa', text: 'you definitely drew a banana last round' },
    { id: 21, sender: 'jennie', text: 'that was a very confident banana' },
    { id: 22, sender: 'rosé', text: 'it looked like a moon with anxiety' },
    { id: 23, sender: 'system', text: 'round 4 starting in 5 seconds', isSystem: true },
    { id: 24, sender: 'jisoo', text: 'please just give me one normal object this time' },
]
// ----------------

function ChatBubble({ msg }: { msg: ChatMessage }) {
    if (msg.isSystem) {
        return (
            <div className="flex items-center gap-2 px-2 py-1">
                <div className="h-px flex-1 bg-slate-200" />
                <p className="shrink-0 text-[10px]  tracking-wide text-slate-400 uppercase">
                    {msg.text}
                </p>
                <div className="h-px flex-1 bg-slate-200" />
            </div>
        )
    }

    const player = playerMap[msg.sender]
    const avatarCode = player?.avatar ?? ('00' as AvatarCode)
    const accentColor = getAvatar(avatarCode).color.value

    return (
        <div className="group flex items-end gap-2 px-1">
            <CardAvatar code={avatarCode} />
            <div className="relative min-w-0 flex-1">
                <div
                    className="rounded-2xl rounded-bl-sm border border-black/5 bg-white/95 px-3.5 py-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    style={{ borderLeft: `3.5px solid ${accentColor}` }}
                >
                    <span
                        className="block text-xs font-bold leading-none"
                        style={{ color: accentColor }}
                    >
                        {msg.sender}
                    </span>
                    <p className="bubblegum-sans-regular mt-1 text-lg leading-tight tracking-wide text-slate-800">
                        {msg.text}
                    </p>
                </div>
            </div>
        </div>
    )
}

// ----------------

function PlayersTab() {
    return (
        <div className="field-scrollbar flex h-full min-h-0 flex-col gap-2 overflow-y-auto">
            <ul className="flex flex-col gap-2.5">
                {DEMO_PLAYERS.map((player, index) => (
                    <PlayerInfoCard
                        key={`${player.tag}-${index}`}
                        {...player}
                    />
                ))}
            </ul>
        </div>
    )
}

// ----------------

function ChatTab() {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [messages] = useState<ChatMessage[]>(demoMessages)

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
                messages.map((msg) => <ChatBubble key={msg.id} msg={msg} />)
            )}
        </div>
    )
}

// ----------------

export function FieldPanel() {
    const [activeTab, setActiveTab] = useState<Tab>('players')
    const [message, setMessage] = useState('')

    const handleSend = () => {
        const trimmed = message.trim()
        if (!trimmed) return
        // TODO: wire up to actual chat
        setMessage('')
    }

    return (
        <aside aria-label="The field" className="flex min-h-88 max-h-[calc(100vh-7rem)] flex-col gap-2 overflow-hidden lg:h-full lg:min-h-0 lg:max-h-none lg:pt-8 lg:[contain:size]">
            <nav className="flex items-center rounded-full bg-white/40 p-0.5 backdrop-blur">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            'inline-flex min-h-8 flex-1 items-center justify-center rounded-full px-3.5 text-sm font-medium capitalize transition',
                            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 active:scale-95',
                            activeTab === tab
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:bg-white/60',
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </nav>

            <div className="min-h-0 flex-1 overflow-hidden">
                {activeTab === 'players' ? <PlayersTab /> : <ChatTab />}
            </div>

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
                        message.trim()
                            ? 'bg-ink text-white'
                            : 'text-slate-400 hover:bg-white/60',
                    )}
                >
                    <SendHorizontal className="size-4" />
                </button>
            </div>
        </aside>
    )
}
