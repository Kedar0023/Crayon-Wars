import { useEffect, useId, useRef, type SVGProps } from 'react'

export type CoolFaceProps = SVGProps<SVGSVGElement> & {
    background?: string
    radius?: number
    followCursor?: boolean
}

// ── geometry (viewBox 0 0 100 100) ────────────────────────────────────────────
const LENS_X = [32, 68] as const
const LENS_Y = 47
const LENS = 'M-16 -10 H16 V1 Q16 11 8 11 H-8 Q-16 11 -16 1 Z' // centered on (0,0)
const INK = '#171717'

const rand = (a: number, b: number) => a + Math.random() * (b - a)
const clampLen = (x: number, y: number) => {
    const d = Math.hypot(x, y)
    return d > 1 ? { x: x / d, y: y / d } : { x, y }
}

const CoolFace = ({ background = '#E5C467', radius = 0, followCursor = true, onClick, onKeyDown, ...props }: CoolFaceProps) => {
    const root = useRef<SVGSVGElement>(null)
    const react = useRef<() => void>(() => {})
    const uid = useId().replace(/:/g, '')

    useEffect(() => {
        const svg = root.current
        if (!svg) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        const all = (sel: string) => Array.from(svg.querySelectorAll<SVGElement>(sel))
        const one = (sel: string) => svg.querySelector<SVGElement>(sel)!

        const gleams = all('[data-part="gleam"]')
        const glints = all('[data-part="glint"]')
        const face = one('[data-part="face"]')
        const glasses = one('[data-part="glasses"]')
        const browL = one('[data-part="brow-l"]')
        const browR = one('[data-part="brow-r"]')
        const smirk = one('[data-part="smirk"]')
        const grin = one('[data-part="grin"]')

        // ── state ────────────────────────────────────────────────────────────────
        let alive = true
        let lastInteraction = -1e9
        let activeAnimation: AbortController | null = null
        const lifecycle = new AbortController()
        const decorations = new Set<Animation>()
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

        // ── primitives ───────────────────────────────────────────────────────────
        const renderBrows = () => {
            const lift = gaze.y * 1.1
            browL.style.transform = `translate(0px, ${lift + browMood.ly}px) rotate(${browMood.lr}deg)`
            browR.style.transform = `translate(0px, ${lift + browMood.ry}px) rotate(${browMood.rr}deg)`
        }

        const look = (x: number, y: number) => {
            gaze = clampLen(x, y)
            face.style.transform = `translate(${gaze.x * 1.6}px, ${gaze.y * 1.1}px)`
            glints.forEach((g) => (g.style.transform = `translate(${gaze.x * 4}px, ${gaze.y * 1.5}px)`))
            renderBrows()
        }

        const brows = (m: Partial<typeof browMood> = {}) => {
            browMood = { ly: 0, lr: 0, ry: 0, rr: 0, ...m }
            renderBrows()
        }

        const mouth = (sx = 1, ty = 0, rot = 0) => {
            smirk.style.transform = `translate(0px, ${ty}px) rotate(${rot}deg) scaleX(${sx})`
        }

        const grinOn = (on: boolean) => {
            smirk.style.opacity = on ? '0' : '1'
            grin.style.opacity = on ? '1' : '0'
            grin.style.transform = on ? 'scale(1)' : 'scale(0.7)'
        }

        const shades = (ty = 0, rot = 0) => {
            glasses.style.transform = `translate(0px, ${ty}px) rotate(${rot}deg)`
        }

        const shine = (ms = 1000) =>
            gleams.forEach((g) => {
                const animation = g.animate([{ transform: 'translateX(-30px)' }, { transform: 'translateX(30px)' }], {
                    duration: ms,
                    easing: 'ease-in-out',
                })
                decorations.add(animation)
                animation.onfinish = () => decorations.delete(animation)
            })

        const cancelDecorations = () => {
            decorations.forEach((animation) => {
                animation.onfinish = null
                animation.cancel()
            })
            decorations.clear()
        }

        const rest = () => {
            look(0, 0)
            brows()
            mouth()
            grinOn(false)
            shades()
        }

        // ── behaviours ───────────────────────────────────────────────────────────
        const glance = async (signal: AbortSignal) => {
            look(rand(-1, 1), rand(-0.8, 0.8))
            if (!(await wait(rand(700, 1800), signal))) return
            if (Math.random() < 0.4) look(0, 0)
        }

        const sweep = async (signal: AbortSignal) => {
            shine(1100)
            look(-0.6, 0)
            if (!(await wait(550, signal))) return
            look(0.6, 0)
            if (!(await wait(650, signal))) return
            rest()
        }

        const browPop = async (signal: AbortSignal) => {
            brows({ ly: -2.8, ry: -2.8 })
            if (!(await wait(rand(800, 1200), signal))) return
            rest()
        }

        const browWiggle = async (signal: AbortSignal) => {
            for (let i = 0; i < 3; i++) {
                brows({ ly: -2.6, ry: 0.4 })
                if (!(await wait(190, signal))) return
                brows({ ly: 0.4, ry: -2.6 })
                if (!(await wait(190, signal))) return
            }
            grinOn(true)
            shine(800)
            if (!(await wait(700, signal))) return
            rest()
        }

        const skeptical = async (signal: AbortSignal) => {
            const s = Math.random() < 0.5 ? -1 : 1
            brows(s < 0 ? { ly: -2.8, lr: -6, ry: 1.2 } : { ry: -2.8, rr: 6, ly: 1.2 })
            mouth(1.2, -0.4, s * -8)
            if (!(await wait(rand(1200, 1900), signal))) return
            rest()
        }

        const bigSmirk = async (signal: AbortSignal) => {
            mouth(1.3, -0.6, -10)
            brows({ ry: -2, rr: 5, ly: 1 })
            shades(0, -2)
            look(0.4, 0.1)
            if (!(await wait(rand(1400, 2200), signal))) return
            rest()
        }

        const pushUp = async (signal: AbortSignal) => {
            shades(4, 0)
            if (!(await wait(220, signal))) return
            shades(-1.5, 0)
            shine(700)
            brows({ ly: -1.2, ry: -1.2 })
            if (!(await wait(rand(700, 1000), signal))) return
            rest()
        }

        const nod = async (signal: AbortSignal) => {
            for (let i = 0; i < 2; i++) {
                look(0, 0.7)
                if (!(await wait(260, signal))) return
                look(0, -0.1)
                if (!(await wait(260, signal))) return
            }
            mouth(1.2, -0.4, -8)
            if (!(await wait(500, signal))) return
            rest()
        }

        // click: big grin + shine + brows up
        const reaction = async (signal: AbortSignal) => {
            grinOn(true)
            brows({ ly: -3.4, ry: -3.4, lr: -4, rr: 4 })
            shades(-2, 0)
            shine(700)
            if (!(await wait(1200, signal))) return
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
            [2, sweep],
            [2, browPop],
            [2, browWiggle],
            [2, skeptical],
            [2, bigSmirk],
            [2, pushUp],
            [1, nod],
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

                await runAnimation(pick())
                if (!alive) return
                await wait(rand(500, 1500), lifecycle.signal)
            }
        }
        void animate()

        // ambient shine every few seconds
        ;(async () => {
            while (alive && !lifecycle.signal.aborted) {
                if (!(await wait(rand(3500, 7000), lifecycle.signal))) return
                if (performance.now() - lastInteraction >= 2500) shine(rand(900, 1300))
            }
        })()

        react.current = () => {
            lastInteraction = performance.now()
            activeAnimation?.abort()
            cancelDecorations()
            rest()
            void runAnimation(reaction)
        }

        // ── pointer tracking ─────────────────────────────────────────────────────
        const onMove = (e: PointerEvent) => {
            const r = svg.getBoundingClientRect()
            const dx = e.clientX - (r.left + r.width / 2)
            const dy = e.clientY - (r.top + r.height * 0.47)
            const d = Math.hypot(dx, dy) || 1
            const k = Math.min(1, d / (r.width * 0.6))
            activeAnimation?.abort()
            cancelDecorations()
            rest()
            look((dx / d) * k, (dy / d) * k)
            lastInteraction = performance.now()
        }
        if (followCursor) window.addEventListener('pointermove', onMove, { passive: true })

        return () => {
            alive = false
            lifecycle.abort()
            activeAnimation?.abort()
            cancelDecorations()
            react.current = () => {}
            window.removeEventListener('pointermove', onMove)
        }
    }, [followCursor])

    return (
        <svg
            {...props}
            ref={root}
            viewBox="0 0 100 100"
            data-face="cool"
            role="button"
            aria-label={props['aria-label'] ?? 'Cool animated face wearing sunglasses'}
            tabIndex={props.tabIndex ?? 0}
            onClick={(e) => {
                onClick?.(e)
                react.current()
            }}
            onKeyDown={(e) => {
                onKeyDown?.(e)
                if (!e.defaultPrevented && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    e.currentTarget.dispatchEvent(new MouseEvent('click', { bubbles: true }))
                }
            }}>
            <style>{`
        [data-face="cool"] [data-part] { transition-property: transform, opacity; }
        [data-face="cool"] [data-part="face"]    { transition-duration: .7s; transition-timing-function: ease-out; }
        [data-face="cool"] [data-part="glint"]   { transition-duration: .5s; transition-timing-function: ease-out; }
        [data-face="cool"] [data-part="glasses"] { transition-duration: .35s; transition-timing-function: cubic-bezier(.3,1.4,.5,1); transform-box: fill-box; transform-origin: center; }
        [data-face="cool"] [data-part^="brow"]   { transition-duration: .38s; transition-timing-function: cubic-bezier(.3,1.5,.5,1); transform-box: fill-box; transform-origin: center; }
        [data-face="cool"] [data-part="smirk"]   { transition-duration: .5s; transition-timing-function: ease; transform-box: fill-box; transform-origin: center; }
        [data-face="cool"] [data-part="grin"]    { transition-duration: .25s; transform-box: fill-box; transform-origin: center; opacity: 0; transform: scale(.7); }
                [data-face="cool"]:focus-visible { outline: 2px solid #171717; outline-offset: 3px; }
                [data-face="cool"]:focus:not(:focus-visible) { outline: none; }
                @media (prefers-reduced-motion: reduce) {
                    [data-face="cool"] [data-part] { transition: none !important; animation: none !important; }
                }
        @media (prefers-reduced-motion: no-preference) {

          [data-face="cool"] [data-part="float"] { animation: cool-float 7s ease-in-out infinite; }
        }
        @keyframes cool-float {
          0%,100% { transform: translate(0, 0) }
          33%     { transform: translate(.4px, -.7px) }
          66%     { transform: translate(-.4px, .4px) }
        }
      `}</style>

            <defs>
                {LENS_X.map((cx) => (
                    <clipPath key={cx} id={`${uid}-lens-${cx}`}>
                        <path d={LENS} transform={`translate(${cx} ${LENS_Y})`} />
                    </clipPath>
                ))}
            </defs>

            <rect width="100" height="100" rx={radius} fill={background} />

            <g data-part="float">
                <g data-part="face">
                    {/* eyebrows */}
                    <path data-part="brow-l" d="M23 26 Q31 21.5 40 22.5" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
                    <path data-part="brow-r" d="M60 22.5 Q69 21.5 77 26" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />

                    {/* sunglasses */}
                    <g data-part="glasses">
                        <path d="M48 41 Q50 39 52 41" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
                        <path d="M16 42 L4 40" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
                        <path d="M84 42 L96 40" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
                        {LENS_X.map((cx) => (
                            <g key={cx}>
                                <path
                                    d={LENS}
                                    transform={`translate(${cx} ${LENS_Y})`}
                                    fill="#0b0b10"
                                    stroke={INK}
                                    strokeWidth="1.8"
                                    strokeLinejoin="round"
                                />
                                <g clipPath={`url(#${uid}-lens-${cx})`}>
                                    <g data-part="glint">
                                        <g data-part="gleam">
                                            <path
                                                d={`M${cx - 9} ${LENS_Y + 11} L${cx - 1} ${LENS_Y - 11} L${cx + 3} ${LENS_Y - 11} L${cx - 5} ${LENS_Y + 11} Z`}
                                                fill="#fff"
                                                opacity=".32"
                                            />
                                            <path
                                                d={`M${cx + 2} ${LENS_Y + 11} L${cx + 10} ${LENS_Y - 11} L${cx + 12} ${LENS_Y - 11} L${cx + 4} ${LENS_Y + 11} Z`}
                                                fill="#fff"
                                                opacity=".18"
                                            />
                                        </g>
                                    </g>
                                </g>
                                {/* static top-left highlight */}
                                <path
                                    d={`M${cx - 12} ${LENS_Y - 6} Q${cx - 11} ${LENS_Y - 8} ${cx - 8} ${LENS_Y - 8}`}
                                    fill="none"
                                    stroke="#fff"
                                    strokeWidth="1.4"
                                    strokeLinecap="round"
                                    opacity=".6"
                                />
                            </g>
                        ))}
                    </g>

                    {/* smirk (right side higher) */}
                    <path data-part="smirk" d="M42.5 63 Q50 64.5 58 59" fill="none" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
                    {/* grin */}
                    <path
                        data-part="grin"
                        d="M39 59 Q50 72 61 57 Q50 62 39 59 Z"
                        fill={INK}
                        stroke={INK}
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                    />
                </g>
            </g>
        </svg>
    )
}

export default CoolFace
