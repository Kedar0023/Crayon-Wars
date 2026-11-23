import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import { Card } from './primitives'
import { Shell } from '../layout'

export function SubpageLayout({ eyebrow, title, description, children }: {
    eyebrow: string
    title: string
    description: string
    children: ReactNode
}) {
    return (
        <Shell>
            <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 md:px-6 lg:py-12">
                <Link to="/main" className="inline-flex w-fit items-center gap-2 text-sm font-bold text-slate-700 transition hover:text-ink">
                    <ArrowLeft className="size-4" /> Back to Crayon Wars
                </Link>
                <Card>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">{eyebrow}</p>
                    <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">{title}</h1>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">{description}</p>
                </Card>
                {children}
            </main>
        </Shell>
    )
}
