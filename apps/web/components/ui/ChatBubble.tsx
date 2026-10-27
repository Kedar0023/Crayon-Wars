import { getAvatar, type AvatarCode } from '../characters/registry'
import { CardAvatar } from './PlayerCard'

export interface ChatMessage {
    id: number
    avatar: AvatarCode
    sender: string
    text: string
    isSystem: boolean
}

const ChatBubble = ({ avatar, sender, text, isSystem }: ChatMessage) => {
    if (isSystem) {
        return (
            <div className="flex items-center gap-2 px-2 py-1">
                <div className="h-px flex-1 bg-slate-200" />
                <p className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-slate-500">{text}</p>
                <div className="h-px flex-1 bg-slate-200" />
            </div>
        )
    }

    const accentColor = getAvatar(avatar).color.value;

    return (
        <div className="group flex items-end gap-2 px-1">
            <CardAvatar code={avatar} />
            <div className="relative min-w-0 flex-1">
                <div
                    className="rounded-2xl rounded-bl-sm border border-black/5 bg-white/95 px-3.5 py-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    style={{ borderLeft: `3.5px solid ${accentColor}` }}>
                    <span
                        className="block text-[11px] font-extrabold uppercase leading-none tracking-wider"
                        style={{ color: accentColor }}>
                        {sender}
                    </span>
                    <p className="bubblegum-sans-regular mt-1.5 wrap-break-word text-lg leading-snug tracking-normal text-slate-800">
                        {text}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ChatBubble