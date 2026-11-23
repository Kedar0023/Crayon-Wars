import { useMemo, useState } from 'react'
import { Crown, Flame, Medal, Trophy } from 'lucide-react'
import { Avatar } from '../../components/landing/primitives'
import { SubpageLayout } from '../../components/landing/SubpageLayout'

const LEADERS = [
    { name: 'Jennie', avatar: '00', points: 8420, wins: 48, streak: 9 },
    { name: 'Mina', avatar: '42', points: 7910, wins: 44, streak: 6 },
    { name: 'Jisoo', avatar: '22', points: 7280, wins: 39, streak: 4 },
    { name: 'Lisa', avatar: '31', points: 6840, wins: 35, streak: 3 },
    { name: 'Rosé', avatar: '11', points: 6210, wins: 32, streak: 2 },
    { name: 'Mochi', avatar: '62', points: 5900, wins: 29, streak: 5 },
    { name: 'Pip', avatar: '70', points: 5340, wins: 25, streak: 1 },
] as const

const PERIODS = ['Today', 'This week', 'All time'] as const
type Period = (typeof PERIODS)[number]

export default function Leaderboard() {
    const [period, setPeriod] = useState<Period>('This week')
    const leaders = useMemo(() => {
        const multiplier = period === 'Today' ? 0.18 : period === 'All time' ? 1.7 : 1
        return LEADERS.map((player) => ({ ...player, points: Math.round(player.points * multiplier) }))
            .sort((a, b) => b.points - a.points)
    }, [period])

    return (
        <SubpageLayout eyebrow="The sketch-off" title="Leaderboard" description="A little friendly rivalry. Time filters preview a sample set of scores.">
            <section aria-label="Leaderboard" className="flex flex-col gap-3">
                <div className="flex w-fit gap-1 rounded-full bg-white/50 p-1" role="tablist" aria-label="Leaderboard time period">
                    {PERIODS.map((item) => (
                        <button
                            key={item}
                            type="button"
                            role="tab"
                            aria-selected={period === item}
                            onClick={() => setPeriod(item)}
                            className={`rounded-full px-4 py-2 text-sm font-bold transition ${period === item ? 'bg-ink text-white shadow-sm' : 'text-slate-600 hover:bg-white'}`}>
                            {item}
                        </button>
                    ))}
                </div>

                {leaders.map((player, index) => (
                    <article key={player.name} className={`doodle-item-enter flex items-center gap-3 rounded-3xl p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:gap-5 ${index === 0 ? 'bg-amber-100' : 'bg-white/75'}`} style={{ animationDelay: `${index * 45}ms` }}>
                        <span className="grid size-9 shrink-0 place-items-center text-sm font-black text-slate-500">
                            {index === 0 ? <Crown className="size-5 text-amber-600" /> : index === 1 ? <Medal className="size-5 text-slate-400" /> : index === 2 ? <Medal className="size-5 text-amber-800" /> : `#${index + 1}`}
                        </span>
                        <Avatar code={player.avatar} className="size-12 shrink-0 sm:size-14" />
                        <div className="min-w-0 flex-1">
                            <h2 className="truncate font-extrabold">{player.name}</h2>
                            <p className="text-xs font-semibold text-slate-500">{player.wins} wins</p>
                        </div>
                        <span className="hidden items-center gap-1 rounded-full bg-white/75 px-3 py-1 text-xs font-bold text-orange-700 sm:inline-flex">
                            <Flame className="size-3.5" /> {player.streak}
                        </span>
                        <p className="shrink-0 text-right">
                            <span className="block text-lg font-black tabular-nums">{player.points.toLocaleString()}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">points</span>
                        </p>
                    </article>
                ))}
                <p className="flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-500">
                    <Trophy className="size-4" /> Scores shown for demonstration only
                </p>
            </section>
        </SubpageLayout>
    )
}
