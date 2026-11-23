import { useState } from 'react'
import { ArrowLeft, Check, Clipboard, Play, Users } from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { DEFAULT_PROFILE, type Profile } from '../../components/landing/types'
import { DEFAULT_LOBBY_CONFIG, type LobbyConfig } from '../../components/landing/CreateLobby'
import { Avatar, Card } from '../../components/landing/primitives'
import { Shell } from '../../components/layout'

type LobbyNavigationState = {
    profile?: Profile
    lobbyConfig?: LobbyConfig
}

const GUESTS = [
    { name: 'Mochi', avatar: '00' },
    { name: 'Pip', avatar: '31' },
] as const

export default function Lobby() {
    const { room = 'NEW01' } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const state = location.state as LobbyNavigationState | null
    const profile = state?.profile ?? DEFAULT_PROFILE
    const config = state?.lobbyConfig ?? DEFAULT_LOBBY_CONFIG
    const [ready, setReady] = useState(true)
    const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(room)
            setCopyState('copied')
        } catch (error) {
            console.error('Could not copy lobby code:', error)
            setCopyState('error')
        }
    }

    const startGame = () => navigate('/', { state: { lobbyConfig: config, room } })

    return (
        <Shell>
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:px-6 lg:py-12">
                <Link to="/main" className="inline-flex w-fit items-center gap-2 text-sm font-bold text-slate-700 transition hover:text-ink">
                    <ArrowLeft className="size-4" /> Back to lobby browser
                </Link>

                <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                    <Card>
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <span className="rounded-full bg-live/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-800">Waiting room</span>
                                <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Your crew is here.</h1>
                                <p className="mt-2 text-sm text-slate-600">Share the room code, then get ready to draw.</p>
                            </div>
                            <Users className="size-8 text-slate-400" aria-hidden />
                        </div>

                        <div className="mt-8 rounded-3xl bg-sky-100 p-5 text-center">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Room code</p>
                            <div className="mt-2 flex items-center justify-center gap-3">
                                <span className="text-4xl font-black tracking-[0.25em]">{room}</span>
                                <button
                                    type="button"
                                    aria-label="Copy room code"
                                    onClick={copyCode}
                                    className="grid size-10 place-items-center rounded-full bg-white transition hover:-translate-y-0.5 hover:shadow-sm">
                                    {copyState === 'copied' ? <Check className="size-4 text-emerald-700" /> : <Clipboard className="size-4" />}
                                </button>
                            </div>
                            <p role={copyState === 'error' ? 'alert' : 'status'} className="mt-2 min-h-5 text-xs font-semibold text-slate-500">
                                {copyState === 'copied' ? 'Code copied!' : copyState === 'error' ? 'Could not copy—select the code to share it.' : 'Friends can join with this code'}
                            </p>
                        </div>

                        <div className="mt-6 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-lg font-extrabold">Players <span className="text-sm font-semibold text-slate-500">({GUESTS.length + 1}/8)</span></p>
                                <p className="text-sm text-slate-500">Waiting for your crew</p>
                            </div>
                            <button
                                type="button"
                                role="switch"
                                aria-checked={ready}
                                onClick={() => setReady(!ready)}
                                className={`rounded-full px-4 py-2 text-sm font-bold transition ${ready ? 'bg-emerald-100 text-emerald-900' : 'bg-white text-slate-600 ring-1 ring-slate-200'}`}>
                                {ready ? 'Ready' : 'Not ready'}
                            </button>
                        </div>

                        <ul className="mt-4 flex flex-col gap-2">
                            {[{ ...profile, ready }, ...GUESTS.map((guest) => ({ ...guest, ready: true }))].map((player) => (
                                <li key={player.name} className="flex items-center gap-3 rounded-2xl bg-white/80 p-3">
                                    <Avatar code={player.avatar} className="size-11" />
                                    <span className="min-w-0 flex-1 truncate font-bold">{player.name}{player.name === profile.name ? ' (you)' : ''}</span>
                                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${player.ready ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                                        {player.ready ? 'Ready' : 'Getting ready'}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <button
                            type="button"
                            onClick={startGame}
                            disabled={!ready}
                            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-40">
                            <Play className="size-4 fill-current" /> Start game
                        </button>
                        <p className="mt-2 text-center text-xs text-slate-500">Demo lobby · players are sample UI</p>
                    </Card>

                    <Card>
                        <h2 className="text-xl font-extrabold">Game settings</h2>
                        <p className="mt-1 text-sm text-slate-500">A quick look at this round’s setup.</p>
                        <dl className="mt-5 divide-y divide-slate-200/80">
                            {[
                                ['Visibility', config.isPrivate ? 'Private' : 'Public'],
                                ['Difficulty', config.difficulty],
                                ['Drawing time', `${config.drawTime} seconds`],
                                ['Rounds', String(config.rounds)],
                                ['Hints', config.hints ? 'On' : 'Off'],
                                ['NSFW words', config.nsfw ? 'On' : 'Off'],
                            ].map(([label, value]) => (
                                <div key={label} className="flex items-center justify-between gap-3 py-3 text-sm">
                                    <dt className="font-semibold text-slate-500">{label}</dt>
                                    <dd className="font-bold capitalize">{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </Card>
                </div>
            </div>
        </Shell>
    )
}
