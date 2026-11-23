import { Card } from '../../components/landing/primitives'
import { SubpageLayout } from '../../components/landing/SubpageLayout'

const SECTIONS = [
    ['Play fair', 'Keep room chat friendly, respect other players, and do not use drawings or messages to harass or harm anyone.'],
    ['Prototype experience', 'Game rooms, player actions, scores, and leaderboard entries shown here are UI demonstrations. Availability and behavior may change as the product develops.'],
    ['Your content', 'Only share drawings and messages you are comfortable showing to people in your room. Do not post private or sensitive information.'],
    ['Not final legal terms', 'This page is placeholder product copy for the UI prototype, not a binding agreement or legal advice.'],
]

export default function Terms() {
    return (
        <SubpageLayout eyebrow="The fine print" title="Terms of play" description="A few simple ground rules for this Crayon Wars UI preview.">
            <Card className="divide-y divide-slate-200/80">
                {SECTIONS.map(([title, text]) => (
                    <section key={title} className="py-5 first:pt-0 last:pb-0">
                        <h2 className="font-extrabold">{title}</h2>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
                    </section>
                ))}
            </Card>
        </SubpageLayout>
    )
}
