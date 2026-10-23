import { useEffect, useRef, type SVGProps } from 'react'

export type FaceProps = SVGProps<SVGSVGElement> & {
    background?: string
    radius?: number
    followCursor?: boolean
}

// viewBox  : 0 0 100 100
const EYE_X = [32, 68] as const
const EYE_Y = 47
const EYE_R = 13
const PUPIL_R = 8.6
const TRAVEL = EYE_R - PUPIL_R - 0.4 // how far a pupil can slide inside the eye
const INK = '#171717'

const rand = (a: number, b: number) => a + Math.random() * (b - a)
const clampLen = (x: number, y: number) => {
    const d = Math.hypot(x, y)
    return d > 1 ? { x: x / d, y: y / d } : { x, y }
}

const Happy = ({ background = '#E7A3B3', radius = 0, followCursor = true, onClick, onKeyDown, ...props }: FaceProps) => {
    const root = useRef<SVGSVGElement>(null)
    const surprise = useRef<() => void>(() => {})

    useEffect(() => {
        const svg = root.current
        if (!svg) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        const all = (sel: string) => Array.from(svg.querySelectorAll<SVGElement>(sel))
        const one = (sel: string) => svg.querySelector<SVGElement>(sel)!

        const pupils = all('[data-part="pupil"]')
        const irises = all('[data-part="iris"]')
        const lids = all('[data-part="lid"]')
        const face = one('[data-part="face"]')
        const browL = one('[data-part="brow-l"]')
        const browR = one('[data-part="brow-r"]')
        const mouth = one('[data-part="mouth"]')
        const mouthO = one('[data-part="mouth-o"]')

        // ── state
        let alive = true
        let lastInteraction = -1e9
        let activeAnimation: AbortController | null = null
        const lifecycle = new AbortController()
        let lidBase = 1
        let gaze = { x: 0, y: 0 }
        let browMood = { ly: 0, lr: 0, ry: 0, rr: 0 }

        const wait = (ms: number, signal: AbortSignal) =>
            new Promise<boolean>((resolve) => {
                if (signal.aborted) {
                    resolve(false)
                    return
                }

                let timeout: ReturnType<typeof setTimeout>
                const finish = (completed: boolean) => {
                    clearTimeout(timeout)
                    signal.removeEventListener('abort', onAbort)
                    resolve(completed)
                }
                const onAbort = () => finish(false)
                timeout = setTimeout(() => finish(true), ms)
                signal.addEventListener('abort', onAbort, { once: true })
            })

        // primitives
        const renderBrows = () => {
            const lift = gaze.y * 1.1 // looking up lifts brows a touch
            browL.style.transform = `translate(0px, ${lift + browMood.ly}px) rotate(${browMood.lr}deg)`
            browR.style.transform = `translate(0px, ${lift + browMood.ry}px) rotate(${browMood.rr}deg)`
        }

        const look = (x: number, y: number) => {
            gaze = clampLen(x, y)
            pupils.forEach((p) => (p.style.transform = `translate(${gaze.x * TRAVEL}px, ${gaze.y * TRAVEL}px)`))
            face.style.transform = `translate(${gaze.x * 1.2}px, ${gaze.y * 0.9}px)`
            lidBase = 1 - Math.max(0, gaze.y) * 0.14 // looking down droops the lids a bit
            lids.forEach((l) => (l.style.transform = `scaleY(${lidBase})`))
            renderBrows()
        }

        const brows = (m: Partial<typeof browMood>) => {
            browMood = { ly: 0, lr: 0, ry: 0, rr: 0, ...m }
            renderBrows()
        }

        const setMouth = (sx = 1, ty = 0, rot = 0) => {
            mouth.style.transform = `translate(0px, ${ty}px) rotate(${rot}deg) scaleX(${sx})`
        }

        const pursed = (on: boolean) => {
            mouth.style.opacity = on ? '0' : '1'
            mouthO.style.opacity = on ? '1' : '0'
            mouthO.style.transform = on ? 'scale(1)' : 'scale(0.3)'
        }

        const rest = () => {
            look(0, 0)
            brows({})
            setMouth()
            pursed(false)
            irises.forEach((i) => (i.style.transform = 'scale(1)'))
        }

        const blink = async (signal: AbortSignal, slow = false) => {
            lids.forEach((l) => {
                l.style.transitionDuration = slow ? '0.28s' : '0.08s'
                l.style.transform = 'scaleY(0.06)'
            })
            if (await wait(slow ? 220 : 110, signal)) {
                lids.forEach((l) => (l.style.transform = `scaleY(${lidBase})`))
                await wait(slow ? 280 : 90, signal)
            }
            lids.forEach((l) => (l.style.transitionDuration = ''))
        }

        // behaviours
        const glance = async (signal: AbortSignal) => {
            look(rand(-1, 1), rand(-0.8, 0.8))
            if (!(await wait(rand(700, 1800), signal))) return
            if (Math.random() < 0.4) look(0, 0)
        }

        const lookAround = async (signal: AbortSignal) => {
            look(-1, 0.1)
            if (!(await wait(650, signal))) return
            look(1, 0.1)
            if (!(await wait(750, signal))) return
            look(0.1, -0.9)
            brows({ ly: -1.6, ry: -1.6 })
            if (!(await wait(600, signal))) return
            rest()
        }

        const shifty = async (signal: AbortSignal) => {
            brows({ ly: 1, lr: 6, ry: 1, rr: -6 })
            for (const x of [-1, 1, -1, 1]) {
                look(x, 0)
                if (!(await wait(240, signal))) return
            }
            rest()
        }

        const curious = async (signal: AbortSignal) => {
            const s = Math.random() < 0.5 ? -1 : 1
            look(s * 0.95, -0.55)
            brows(s < 0 ? { ly: -2.4, lr: -5, ry: 0.3 } : { ry: -2.4, rr: 5, ly: 0.3 })
            setMouth(0.85, 0, s * 6)
            if (!(await wait(rand(1200, 1900), signal))) return
            rest()
        }

        const smirk = async (signal: AbortSignal) => {
            setMouth(1.25, -0.4, -9)
            brows({ ry: -1.8, rr: 4, ly: 0.8 })
            look(0.3, 0.2)
            if (!(await wait(rand(1300, 2000), signal))) return
            rest()
        }

        const hmm = async (signal: AbortSignal) => {
            pursed(true)
            look(-0.5, -0.9)
            brows({ ly: -1.4, ry: -1.4 })
            if (!(await wait(rand(1000, 1500), signal))) return
            rest()
        }

        const drowsy = async (signal: AbortSignal) => {
            look(0, 0.5)
            brows({ ly: 1.4, ry: 1.4, lr: 4, rr: -4 })
            lids.forEach((l) => (l.style.transform = 'scaleY(0.55)'))
            lidBase = 0.55
            if (!(await wait(1100, signal))) return
            await blink(signal, true)
            if (!(await wait(500, signal))) return
            lidBase = 1
            rest()
        }

        const surpriseAnimation = async (signal: AbortSignal) => {
            look(0, -0.2)
            brows({ ly: -3.8, ry: -3.8, lr: -4, rr: 4 })
            irises.forEach((i) => (i.style.transform = 'scale(0.72)'))
            lids.forEach((l) => (l.style.transform = 'scaleY(1.08)'))
            pursed(true)
            if (!(await wait(1000, signal))) return
            rest()
        }

        const runAnimation = async (animation: (signal: AbortSignal) => Promise<void>) => {
            activeAnimation?.abort()
            const controller = new AbortController()
            activeAnimation = controller
            try {
                await animation(controller.signal)
            } finally {
                if (activeAnimation === controller) activeAnimation = null
            }
            return !controller.signal.aborted
        }

        const table: Array<[number, (signal: AbortSignal) => Promise<void>]> = [
            [6, glance],
            [2, lookAround],
            [2, curious],
            [1, shifty],
            [1, smirk],
            [1, hmm],
            [1, drowsy],
        ]
        const total = table.reduce((n, [w]) => n + w, 0)
        const pick = () => {
            let r = Math.random() * total
            for (const [w, fn] of table) if ((r -= w) <= 0) return fn
            return glance
        }

        // ── loops ────────────────────────────────────────────────────────────────
        const animate = async () => {
            await wait(500, lifecycle.signal)
            while (alive && !lifecycle.signal.aborted) {
                if (performance.now() - lastInteraction < 2500) {
                    if (!(await wait(250, lifecycle.signal))) return
                    continue
                }

                const completed = await runAnimation(pick())
                if (!alive) return
                if (completed && Math.random() < 0.2) await runAnimation((signal) => blink(signal))
                await wait(rand(500, 1500), lifecycle.signal)
            }
        }
        void animate()

        surprise.current = () => {
            lastInteraction = performance.now()
            rest()
            void runAnimation(surpriseAnimation)
        }

        // ── pointer tracking ─────────────────────────────────────────────────────
        const onMove = (e: PointerEvent) => {
            const r = svg.getBoundingClientRect()
            const dx = e.clientX - (r.left + r.width / 2)
            const dy = e.clientY - (r.top + r.height * 0.47)
            const d = Math.hypot(dx, dy) || 1
            const k = Math.min(1, d / (r.width * 0.6))
            activeAnimation?.abort()
            rest()
            look((dx / d) * k, (dy / d) * k)
            lastInteraction = performance.now()
        }
        if (followCursor) window.addEventListener('pointermove', onMove, { passive: true })

        return () => {
            alive = false
            lifecycle.abort()
            activeAnimation?.abort()
            surprise.current = () => {}
            window.removeEventListener('pointermove', onMove)
        }
    }, [followCursor])

    return (
        <svg
            {...props}
            ref={root}
            viewBox="0 0 100 100"
            data-face="alive"
            role="button"
            aria-label={props['aria-label'] ?? 'Friendly animated face'}
            tabIndex={props.tabIndex ?? 0}
            onClick={(e) => {
                onClick?.(e)
                surprise.current()
            }}
            onKeyDown={(e) => {
                onKeyDown?.(e)
                if (!e.defaultPrevented && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    e.currentTarget.dispatchEvent(new MouseEvent('click', { bubbles: true }))
                }
            }}>
            <style>{`
        [data-face="alive"] [data-part] { transition-property: transform, opacity; }
        [data-face="alive"] [data-part="face"]  { transition-duration: .7s; transition-timing-function: ease-out; }
        [data-face="alive"] [data-part="pupil"] { transition-duration: .17s; transition-timing-function: cubic-bezier(.2,.9,.3,1.25); }
        [data-face="alive"] [data-part="iris"]  { transition-duration: .25s; transform-box: fill-box; transform-origin: center; }
        [data-face="alive"] [data-part="lid"]   { transition-duration: .09s; transition-timing-function: ease-in; transform-box: fill-box; transform-origin: center; }
        [data-face="alive"] [data-part^="brow"] { transition-duration: .38s; transition-timing-function: cubic-bezier(.3,1.5,.5,1); transform-box: fill-box; transform-origin: center; }
        [data-face="alive"] [data-part="mouth"] { transition-duration: .5s; transition-timing-function: ease; transform-box: fill-box; transform-origin: center; }
        [data-face="alive"] [data-part="mouth-o"] { transition-duration: .22s; transform-box: fill-box; transform-origin: center; opacity: 0; transform: scale(.3); }
                [data-face="alive"]:focus-visible { outline: 2px solid #171717; outline-offset: 3px; }
                [data-face="alive"]:focus:not(:focus-visible) { outline: none; }
                @media (prefers-reduced-motion: reduce) {
                    [data-face="alive"] [data-part] { transition: none !important; animation: none !important; }
                }
        @media (prefers-reduced-motion: no-preference) {
          [data-face="alive"] [data-part="float"] { animation: alive-float 7s ease-in-out infinite; }
        }
        @keyframes alive-float {
          0%,100% { transform: translate(0, 0) }
          33%     { transform: translate(.4px, -.7px) }
          66%     { transform: translate(-.4px, .4px) }
        }
      `}</style>

            <rect width="100" height="100" rx={radius} fill={background} />

            <g data-part="float">
                <g data-part="face">
                    {/* eyebrows */}
                    <path
                        data-part="brow-l"
                        d="M25 24.6 Q31 21.4 37.6 21.9"
                        fill="none"
                        stroke={INK}
                        strokeWidth="2.6"
                        strokeLinecap="round"
                    />
                    <path
                        data-part="brow-r"
                        d="M62.4 21.9 Q69 21.4 75 24.6"
                        fill="none"
                        stroke={INK}
                        strokeWidth="2.6"
                        strokeLinecap="round"
                    />

                    {/* eyes */}
                    {EYE_X.map((cx) => (
                        <g key={cx} data-part="lid">
                            <circle cx={cx} cy={EYE_Y} r={EYE_R} fill="#fff" />
                            <g data-part="pupil">
                                <circle data-part="iris" cx={cx} cy={EYE_Y} r={PUPIL_R} fill={INK} />
                            </g>
                        </g>
                    ))}

                    {/* mouth */}
                    <path
                        data-part="mouth"
                        d="M43.6 60 Q50 61.6 56.4 59.8"
                        fill="none"
                        stroke={INK}
                        strokeWidth="2.6"
                        strokeLinecap="round"
                    />
                    <ellipse data-part="mouth-o" cx="50" cy="61" rx="2.6" ry="3.3" fill={INK} />
                </g>
            </g>
        </svg>
    )
}

export default Happy
