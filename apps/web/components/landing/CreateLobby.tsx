import { useEffect, useRef, useState } from 'react'

export type Difficulty = 'easy' | 'medium' | 'hard'
export type DrawTime = 30 | 45 | 60 // seconds

export interface LobbyConfig {
    isPrivate: boolean // true = invite code only, false = also joinable via "Join random lobby"
    difficulty: Difficulty
    rounds: number
    drawTime: DrawTime
    hints: boolean
    nsfw: boolean
}

export const DEFAULT_LOBBY_CONFIG: LobbyConfig = {
    isPrivate: false,
    difficulty: 'easy',
    rounds: 3,
    drawTime: 45,
    hints: true,
    nsfw: false,
}

const MIN_ROUNDS = 1
const MAX_ROUNDS = 10

// ---------- small building blocks ----------

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1.5">
        <span className="text-sm font-bold text-neutral-900">{label}</span>
        {children}
        {hint && <span className="text-xs font-medium text-neutral-500">{hint}</span>}
    </div>
)

function Segmented<T extends string | number | boolean>({
    value,
    options,
    onChange,
    label,
}: {
    value: T
    options: { value: T; label: string }[]
    onChange: (v: T) => void
    label: string
}) {
    return (
        <div role="radiogroup" aria-label={label} className="flex gap-1 rounded-full bg-sky-100 p-1">
            {options.map((o) => {
                const active = o.value === value
                return (
                    <button
                        key={String(o.value)}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => onChange(o.value)}
                        className={`flex-1 rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                            active ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-600 hover:bg-white/70'
                        }`}>
                        {o.label}
                    </button>
                )
            })}
        </div>
    )
}

const ToggleRow = ({
    label,
    hint,
    checked,
    onChange,
}: {
    label: string
    hint: string
    checked: boolean
    onChange: (v: boolean) => void
}) => (
    <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
            <span className="text-sm font-bold text-neutral-900">{label}</span>
            <span className="text-xs font-medium text-neutral-500">{hint}</span>
        </div>
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            onClick={() => onChange(!checked)}
            className={`relative h-7 w-12 shrink-0 rounded-full transition ${checked ? 'bg-neutral-900' : 'bg-neutral-300'}`}>
            <span
                className={`absolute left-1 top-1 size-5 rounded-full bg-white shadow transition-transform ${
                    checked ? 'translate-x-5' : ''
                }`}
            />
        </button>
    </div>
)

const StepButton = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        type="button"
        {...props}
        className="flex size-9 items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-neutral-900 transition hover:bg-sky-200 disabled:pointer-events-none disabled:opacity-40">
        {children}
    </button>
)

// ---------- dialog ----------

interface Props {
    open: boolean
    onClose: () => void
    onCreate: (config: LobbyConfig) => void
}

export const CreateLobbyDialog = ({ open, onClose, onCreate }: Props) => {
    const ref = useRef<HTMLDialogElement>(null)
    const [cfg, setCfg] = useState<LobbyConfig>(DEFAULT_LOBBY_CONFIG)
    const set = <K extends keyof LobbyConfig>(key: K, value: LobbyConfig[K]) => setCfg((c) => ({ ...c, [key]: value }))

    // native <dialog>: gives focus trap, Esc to close and a ::backdrop for free
    useEffect(() => {
        const el = ref.current
        if (!el) return
        if (open && !el.open) {
            setCfg(DEFAULT_LOBBY_CONFIG)
            el.showModal()
        } else if (!open && el.open) {
            el.close()
        }
    }, [open])

    return (
        <dialog
            ref={ref}
            onClose={onClose}
            onClick={(e) => e.target === ref.current && onClose()} // click on backdrop
            className="m-auto w-[min(92vw,440px)] rounded-[28px] bg-neutral-100 p-0 text-neutral-900 shadow-xl backdrop:bg-black/40">
            <div className="flex flex-col gap-5 p-6">
                <h2 className="text-2xl font-extrabold tracking-tight">New lobby</h2>

                <Field
                    label="Visibility"
                    hint={cfg.isPrivate ? 'Only players with the invite code can join.' : 'Anyone can join via “Join random lobby”.'}>
                    <Segmented
                        label="Visibility"
                        value={cfg.isPrivate}
                        onChange={(v) => set('isPrivate', v)}
                        options={[
                            { value: false, label: 'Public' },
                            { value: true, label: 'Private' },
                        ]}
                    />
                </Field>

                <Field label="Word difficulty">
                    <div role="radiogroup" aria-label="Word difficulty" className="grid grid-cols-3 gap-2">
                        {([
                            { value: 'easy', label: 'Easy', detail: 'Warm-up' },
                            { value: 'medium', label: 'Medium', detail: 'A little tricky' },
                            { value: 'hard', label: 'Hard', detail: 'Brain-bender' },
                        ] as const).map((option) => {
                            const active = cfg.difficulty === option.value
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    role="radio"
                                    aria-checked={active}
                                    onClick={() => set('difficulty', option.value)}
                                    className={`rounded-2xl border-2 p-3 text-left transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ${
                                        active ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-transparent bg-white text-neutral-900 hover:border-neutral-300'
                                    }`}>
                                    <span className="block text-sm font-extrabold">{option.label}</span>
                                    <span className={`mt-0.5 block text-[11px] font-medium ${active ? 'text-white/70' : 'text-neutral-500'}`}>{option.detail}</span>
                                </button>
                            )
                        })}
                    </div>
                </Field>

                <Field label="Drawing time">
                    <div role="radiogroup" aria-label="Drawing time" className="grid grid-cols-3 gap-2">
                        {([
                            { value: 30, unit: 'sec', detail: 'Quick sketch' },
                            { value: 45, unit: 'sec', detail: 'Just right' },
                            { value: 60, unit: 'sec', detail: 'Take your time' },
                        ] as const).map((option) => {
                            const active = cfg.drawTime === option.value
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    role="radio"
                                    aria-checked={active}
                                    onClick={() => set('drawTime', option.value)}
                                    className={`rounded-2xl border-2 px-3 py-2.5 text-center transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ${
                                        active ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-transparent bg-white text-neutral-900 hover:border-neutral-300'
                                    }`}>
                                    <span className="flex items-baseline justify-center gap-1">
                                        <span className="text-xl font-extrabold tabular-nums">{option.value}</span>
                                        <span className={`text-xs font-bold ${active ? 'text-white/70' : 'text-neutral-500'}`}>{option.unit}</span>
                                    </span>
                                    <span className={`mt-0.5 block text-[11px] font-medium ${active ? 'text-white/70' : 'text-neutral-500'}`}>{option.detail}</span>
                                </button>
                            )
                        })}
                    </div>
                </Field>

                <Field label="Rounds">
                    <div className="flex items-center gap-3">
                        <StepButton aria-label="Fewer rounds" disabled={cfg.rounds <= MIN_ROUNDS} onClick={() => set('rounds', cfg.rounds - 1)}>
                            −
                        </StepButton>
                        <span className="w-8 text-center text-xl font-bold tabular-nums">{cfg.rounds}</span>
                        <StepButton aria-label="More rounds" disabled={cfg.rounds >= MAX_ROUNDS} onClick={() => set('rounds', cfg.rounds + 1)}>
                            +
                        </StepButton>
                    </div>
                </Field>

                <div className="flex flex-col gap-4 border-t border-dashed border-neutral-400 pt-4">
                    <ToggleRow label="Hints" hint="Reveal letters as time runs out." checked={cfg.hints} onChange={(v) => set('hints', v)} />
                    <ToggleRow label="NSFW words" hint="Allow adult-only words." checked={cfg.nsfw} onChange={(v) => set('nsfw', v)} />
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full bg-sky-100 px-5 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-sky-200">
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => onCreate(cfg)}
                        className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        Create lobby
                    </button>
                </div>
            </div>
        </dialog>
    )
}