import { ArrowRight, Brush, Eye, Lightbulb, Timer } from 'lucide-react'
import { Link } from 'react-router'
import { Card } from '../../components/landing/primitives'
import { SubpageLayout } from '../../components/landing/SubpageLayout'

const STEPS = [
    { icon: Eye, title: 'Get your secret word', text: 'When you are the artist, your word is shown at the top. Keep it secret—your friends and AI players are guessing.' },
    { icon: Brush, title: 'Draw it your way', text: 'Pick an ink color and sketch on the canvas. Use Undo to take back a stroke or Clear to start your drawing over.' },
    { icon: Lightbulb, title: 'Guess from the chat', text: 'When someone else draws, type your guess in the chat. The faster you guess correctly, the more points you earn.' },
    { icon: Timer, title: 'Beat the clock', text: 'Each round has a timer. Finish the set with the most points to take the top spot on the leaderboard.' },
]

export default function HowToPlay() {
    return (
        <SubpageLayout eyebrow="Quick guide" title="How to play" description="Big doodles, quick guesses, and absolutely no artistic skill required.">
            <section className="grid gap-4 sm:grid-cols-2">
                {STEPS.map(({ icon: Icon, title, text }, index) => (
                    <Card key={title} className="doodle-item-enter relative overflow-hidden" >
                        <span className="absolute right-5 top-4 text-5xl font-black text-slate-200" aria-hidden="true">0{index + 1}</span>
                        <span className="grid size-12 place-items-center rounded-2xl bg-sky-100"><Icon className="size-5" /></span>
                        <h2 className="mt-5 text-xl font-extrabold">{title}</h2>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
                    </Card>
                ))}
            </section>
            <Card className="flex flex-wrap items-center justify-between gap-4 bg-amber-100">
                <div><h2 className="font-extrabold">Ready to make a masterpiece?</h2><p className="mt-1 text-sm text-slate-600">A stick figure totally counts.</p></div>
                <Link to="/main" className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800">Let’s play <ArrowRight className="size-4" /></Link>
            </Card>
        </SubpageLayout>
    )
}
