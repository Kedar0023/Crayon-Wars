import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useSoundOnChange } from 'react-sounds'
import type { Route } from './+types/home'
import { Confetti, type ConfettiRef } from '../../components/animation/confetti'
import { Shell } from '@/components/layout'
import { CanvasActions } from '../../components/canvas/CanvasActions'
import { CanvasCard } from '../../components/canvas/CanvasCard'
import { GameSidebar } from '../../components/GameSidebar'
import { useRoundTimer } from '../../features/game/useRoundTimer'
import { WordHeader } from '../../features/game/WordHeader'
import { useGameStore } from '@/lib/gameStore'
import type { LobbyConfig } from '../../components/landing/CreateLobby'
import { ROUND_SECONDS } from '../../lib/game'

export function meta({}: Route.MetaArgs) {
    return [{ title: 'Crayon Wars' }, { name: 'description', content: 'Doodle Derby game page' }]
}

// ----------------

export default function Home() {
    const location = useLocation()
    const navigate = useNavigate()
    const state = location.state as { lobbyConfig?: LobbyConfig } | null
    const totalRounds = Math.max(1, Math.min(10, state?.lobbyConfig?.rounds ?? 3))
    const drawTime = state?.lobbyConfig?.drawTime ?? ROUND_SECONDS
    const status = useGameStore((s) => s.status)
    const startRound = useGameStore((s) => s.startRound)
    const beginCountdown = useGameStore((s) => s.beginCountdown)
    const resumeRound = useGameStore((s) => s.resumeRound)
    const [round, setRound] = useState(1)
    const [countdown, setCountdown] = useState<number | null>(null)
    const [confirmLeave, setConfirmLeave] = useState(false)
    const confettiRef = useRef<ConfettiRef>(null)

    useRoundTimer()

    useSoundOnChange('ui/button_soft', countdown, { initial: false, volume: 0.3 })
    useSoundOnChange('ui/success_chime', status === 'won', { initial: false, volume: 0.5 })
    useSoundOnChange('ui/pop_close', status === 'timeout' || status === 'gave_up', { initial: false, volume: 0.35 })

    useEffect(() => {
        if (status !== 'countdown') {
            setCountdown(null)
            return
        }

        setCountdown(3)
        const interval = window.setInterval(() => {
            setCountdown((current) => current === null ? null : Math.max(current - 1, 0))
        }, 1000)
        return () => window.clearInterval(interval)
    }, [status])

    useEffect(() => {
        if (status !== 'countdown' || countdown !== 0) return
        const timeout = window.setTimeout(() => startRound(drawTime), 500)
        return () => window.clearTimeout(timeout)
    }, [countdown, status, startRound, drawTime])

    useEffect(() => {
        if (status !== 'won') return
        void confettiRef.current?.fire({
            particleCount: 140,
            spread: 100,
            startVelocity: 42,
            origin: { x: 0.5, y: 0.28 },
            colors: ['#ef4b2f', '#7c5cfa', '#22c78a', '#f5a31a', '#2f6df6'],
        })
    }, [status])

    const continueGame = () => {
        if (round >= totalRounds) setRound(1)
        else setRound((current) => current + 1)
        beginCountdown()
    }

    return (
        <Shell>
            <Confetti
                ref={confettiRef}
                manualstart
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 z-50 size-full"
            />
            <div className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-4 md:px-6 lg:grid-cols-[37.5rem_minmax(0,1fr)] lg:justify-center lg:gap-8 lg:py-8 xl:grid-cols-[37.5rem_26rem]">
                <section className="flex flex-col gap-3">
                    <p className="w-fit rounded-full bg-white/50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-600">Round {round} of {totalRounds}</p>
                    <WordHeader />
                    <CanvasCard />
                    <CanvasActions />
                </section>
                <GameSidebar />
            </div>

            {countdown !== null && (
                <div className="doodle-fade-in fixed inset-0 z-40 grid place-items-center bg-ink/35 p-4" role="status" aria-live="assertive">
                    <div className="doodle-scale-enter text-center text-white">
                        <p className="text-sm font-bold uppercase tracking-[0.3em]">Get ready</p>
                        <p key={countdown} className="doodle-scale-enter mt-2 text-8xl font-black tabular-nums sm:text-9xl">{countdown > 0 ? countdown : 'Go!'}</p>
                    </div>
                </div>
            )}

            {status === 'paused' && (
                <div className="doodle-fade-in fixed inset-0 z-40 grid place-items-center bg-ink/40 p-4">
                    <section role="dialog" aria-modal="true" aria-labelledby="pause-title" className="doodle-scale-enter w-full max-w-sm rounded-3xl bg-[#fffefa] p-6 text-center shadow-xl">
                        {confirmLeave ? (
                            <>
                                <h2 id="pause-title" className="text-2xl font-black">Leave this game?</h2>
                                <p className="mt-2 text-sm text-slate-600">Your current round will end.</p>
                                <div className="mt-6 flex gap-2">
                                    <button type="button" onClick={() => setConfirmLeave(false)} className="h-11 flex-1 rounded-full bg-slate-100 px-4 text-sm font-bold hover:bg-slate-200">Stay here</button>
                                    <button type="button" onClick={() => navigate('/main')} className="h-11 flex-1 rounded-full bg-ink px-4 text-sm font-bold text-white hover:bg-slate-800">Leave game</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 id="pause-title" className="text-2xl font-black">Take a breather</h2>
                                <p className="mt-2 text-sm text-slate-600">The round timer is paused.</p>
                                <div className="mt-6 flex flex-col gap-2">
                                    <button type="button" onClick={resumeRound} className="h-11 rounded-full bg-ink px-4 text-sm font-bold text-white hover:bg-slate-800">Resume round</button>
                                    <button type="button" onClick={() => setConfirmLeave(true)} className="h-11 rounded-full bg-slate-100 px-4 text-sm font-bold hover:bg-slate-200">Leave game</button>
                                </div>
                            </>
                        )}
                    </section>
                </div>
            )}

            {(status === 'won' || status === 'gave_up' || status === 'timeout') && (
                <div className="doodle-fade-in fixed inset-0 z-40 grid place-items-center bg-ink/40 p-4">
                    <section role="dialog" aria-modal="true" aria-labelledby="result-title" className="doodle-scale-enter w-full max-w-md rounded-3xl bg-[#fffefa] p-6 text-center shadow-xl sm:p-8">
                        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-amber-100 text-3xl" aria-hidden="true">
                            {status === 'won' ? '🎉' : status === 'timeout' ? '⏱️' : '🖍️'}
                        </span>
                        <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Round {round} of {totalRounds}</p>
                        <h2 id="result-title" className="mt-1 text-3xl font-black">{round >= totalRounds ? 'Game complete!' : status === 'won' ? 'They guessed it!' : status === 'timeout' ? 'Time’s up!' : 'Round over'}</h2>
                        <p className="mt-2 text-sm text-slate-600">
                            {round >= totalRounds ? 'That’s a wrap. Play another set or head back to the lobby.' : status === 'won' ? 'A model spotted your drawing. Nice work!' : 'The next sketch is just around the corner.'}
                        </p>
                        <div className="mt-6 rounded-2xl bg-sky-100 p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Your round score</p>
                            <p className="mt-1 text-3xl font-black tabular-nums">{status === 'won' ? '+250' : '+0'} <span className="text-sm font-bold">pts</span></p>
                        </div>
                        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                            <button type="button" onClick={continueGame} className="h-11 flex-1 rounded-full bg-ink px-4 text-sm font-bold text-white hover:bg-slate-800">
                                {round >= totalRounds ? 'Play again' : 'Next round'}
                            </button>
                            <button type="button" onClick={() => navigate('/main')} className="h-11 flex-1 rounded-full bg-slate-100 px-4 text-sm font-bold hover:bg-slate-200">Back to lobby</button>
                        </div>
                    </section>
                </div>
            )}
        </Shell>
    )
}
