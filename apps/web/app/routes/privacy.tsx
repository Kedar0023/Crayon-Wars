import { Card } from '../../components/landing/primitives'
import { SubpageLayout } from '../../components/landing/SubpageLayout'

const SECTIONS = [
    ['What this demo stores', 'Your display name, player tag, and avatar may be saved in local browser storage so your player card can be restored on this device.'],
    ['What is not connected', 'This UI prototype does not send profile edits, sample scores, or chat messages to a game server. Sample leaderboard, player, and chat content is illustrative.'],
    ['Your choices', 'You can edit your profile from the Profile screen or clear this site’s local storage in your browser settings to remove saved profile details.'],
    ['Questions', 'This page is placeholder product copy for the UI prototype and is not legal advice or a final privacy notice.'],
]

export default function Privacy() {
    return (
        <SubpageLayout eyebrow="The fine print" title="Privacy" description="A plain-language preview of what the Crayon Wars UI stores and what remains a demo.">
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
