import { useEffect, useRef, type SVGProps } from 'react'

export type LoveFaceProps = SVGProps<SVGSVGElement> & {
    background?: string
    radius?: number
    followCursor?: boolean
}

// ── geometry (viewBox 0 0 100 100) ────────────────────────────────────────────
const EYE_X = [32, 68] as const
const EYE_Y = 45
const EYE_R = 12.5
const PUPIL_R = 8.4
const TRAVEL = EYE_R - PUPIL_R - 0.4
const INK = '#2a0f1f'
const PINK = '#ff2d6f'
const HEART = 'M0 4 C-7 -1 -4 -7 0 -3.2 C4 -7 7 -1 0 4 Z' // centered on (0,0)
const BIG_HEART = 'M0 9 C-14 -1 -8 -14 0 -6.5 C8 -14 14 -1 0 9 Z'
const NS = 'http://www.w3.org/2000/svg'

const rand = (a: number, b: number) => a + Math.random() * (b - a)
const clampLen = (x: number, y: number) => {
    const d = Math.hypot(x, y)
    return d > 1 ? { x: x / d, y: y / d } : { x, y }
}

const LoveFace = ({ background = '#ffc2d9', radius = 0, followCursor = true, onClick, onKeyDown, ...props }: LoveFaceProps) => {
    const root = useRef<SVGSVGElement>(null)
    const burst = useRef<() => void>(() => {})

    useEffect(() => {
        const svg = root.current
        if (!svg) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        const all = (sel: string) => Array.from(svg.querySelectorAll<SVGElement>(sel))
        const one = (sel: string) => svg.querySelector<SVGElement>(sel)!

        const eyes = all('[data-part="eye"]')
        const arcs = all('[data-part="arc"]')
        const pupils = all('[data-part="pupil"]')
        const heartEyes = all('[data-part="heart-eye"]')
        const blush = all('[data-part="blush"]')
        const face = one('[data-part="face"]')
        const browL = one('[data-part="brow-l"]')
        const browR = one('[data-part="brow-r"]')
        const smile = one('[data-part="smile"]')
        const kiss = one('[data-part="kiss"]')
        const hearts = one('[data-part="hearts"]')

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
            pupils.forEach((p) => (p.style.transform = `translate(${gaze.x * TRAVEL}px, ${gaze.y * TRAVEL}px)`))
            face.style.transform = `translate(${gaze.x * 1.2}px, ${gaze.y * 0.9}px)`
            renderBrows()
        }

        const brows = (m: Partial<typeof browMood> = {}) => {
            browMood = { ly: 0, lr: 0, ry: 0, rr: 0, ...m }
            renderBrows()
        }

        const setSmile = (sx = 1, ty = 0, rot = 0) => {
            smile.style.transform = `translate(0px, ${ty}px) rotate(${rot}deg) scaleX(${sx})`
        }

        const pucker = (on: boolean) => {
            smile.style.opacity = on ? '0' : '1'
            kiss.style.opacity = on ? '1' : '0'
            kiss.style.transform = on ? 'scale(1)' : 'scale(0.3)'
        }

        // happy ^ ^ eyes: which = 0 | 1 | undefined (both)
        const happyEyes = (on: boolean, which?: number) => {
            ;[0, 1].forEach((i) => {
                const hit = on && (which === undefined || which === i)
                eyes[i].style.opacity = hit ? '0' : '1'
                arcs[i].style.opacity = hit ? '1' : '0'
            })
        }

        const loveEyes = (on: boolean) => {
            pupils.forEach((p) => (p.style.opacity = on ? '0' : '1'))
            heartEyes.forEach((h) => {
                h.style.opacity = on ? '1' : '0'
                h.style.transform = on ? 'scale(1)' : 'scale(0.3)'
            })
        }

        const flush = (level = 0) => {
            blush.forEach((b) => {
                b.style.opacity = String(0.55 + level * 0.35)
                b.style.transform = `scale(${1 + level * 0.18})`
            })
        }

        const rest = () => {
            look(0, 0)
            brows()
            setSmile()
            pucker(false)
            happyEyes(false)
            loveEyes(false)
            flush(0)
            eyes.forEach((e) => (e.style.transform = 'scaleY(1)'))
        }

        const blink = async (signal: AbortSignal) => {
            eyes.forEach((e) => (e.style.transform = 'scaleY(0.06)'))
            if (await wait(110, signal)) {
                eyes.forEach((e) => (e.style.transform = 'scaleY(1)'))
                await wait(90, signal)
            }
            eyes.forEach((e) => (e.style.transitionDuration = ''))
        }

        // floating heart (Web Animations, auto-removed)
        const heart = (x: number, y: number, dx: number, dy: number, s = 1, ms = 1800, big = false) => {
            const p = document.createElementNS(NS, 'path')
            p.setAttribute('d', big ? BIG_HEART : HEART)
            p.setAttribute('fill', Math.random() < 0.7 ? PINK : '#ff7aa8')
            p.style.opacity = '0'
            hearts.appendChild(p)
            const sc = big ? s * 0.5 : s
            const a = p.animate(
                [
                    { transform: `translate(${x}px, ${y}px) scale(${sc * 0.3})`, opacity: 0 },
                    { transform: `translate(${x + dx * 0.25}px, ${y + dy * 0.25}px) scale(${sc})`, opacity: 1, offset: 0.2 },
                    { transform: `translate(${x + dx}px, ${y + dy}px) scale(${sc * 1.1}) rotate(${dx > 0 ? 14 : -14}deg)`, opacity: 0 },
                ],
                { duration: ms, easing: 'ease-out' },
            )
            decorations.add(a)
            a.onfinish = () => {
                decorations.delete(a)
                p.remove()
            }
        }

        const cancelDecorations = () => {
            decorations.forEach((animation) => {
                animation.onfinish = null
                animation.cancel()
            })
            decorations.clear()
            hearts.replaceChildren()
        }

        // ── behaviours ───────────────────────────────────────────────────────────
        const glance = async (signal: AbortSignal) => {
            look(rand(-1, 1), rand(-0.8, 0.8))
            if (!(await wait(rand(700, 1800), signal))) return
            if (Math.random() < 0.4) look(0, 0)
        }

        // 🥰 eyes closed, cheeks glowing, hearts drifting up
        const dreamy = async (signal: AbortSignal) => {
            happyEyes(true)
            flush(1)
            brows({ ly: -1.6, ry: -1.6, lr: -5, rr: 5 })
            setSmile(1.12, 0.3, 0)
            for (let i = 0; i < 3; i++) {
                heart(rand(14, 86), rand(20, 34), rand(-6, 6), -rand(14, 22), rand(0.8, 1.2), 2000)
                if (!(await wait(450, signal))) return
            }
            if (!(await wait(700, signal))) return
            rest()
        }

        const loveStruck = async (signal: AbortSignal) => {
            loveEyes(true)
            flush(1)
            brows({ ly: -2.4, ry: -2.4 })
            setSmile(1.1, 0.4, 0)
            heart(50, 30, rand(-10, 10), -22, 1.1, 1800)
            if (!(await wait(rand(1400, 2000), signal))) return
            rest()
        }

        // 😘 wink + pucker + flying heart
        const blowKiss = async (signal: AbortSignal) => {
            happyEyes(true, 1)
            pucker(true)
            brows({ ry: -2.2, rr: 4, ly: 0.4 })
            look(0.2, 0.1)
            flush(0.5)
            if (!(await wait(420, signal))) return
            heart(50, 65, 26, -34, 1.4, 1500, true)
            if (!(await wait(900, signal))) return
            rest()
        }

        const shy = async (signal: AbortSignal) => {
            look(-0.7, 0.8)
            flush(1)
            brows({ ly: -1.2, lr: -7, ry: -1.2, rr: 7 })
            setSmile(0.85, 0, 0)
            if (!(await wait(rand(1200, 1800), signal))) return
            rest()
        }

        const giggle = async (signal: AbortSignal) => {
            happyEyes(true)
            setSmile(1.2, 0.5, 0)
            flush(0.7)
            for (const x of [-1, 1, -1, 1, 0]) {
                face.style.transform = `translate(${x * 1.2}px, ${x === 0 ? 0 : -0.8}px)`
                if (!(await wait(140, signal))) return
            }
            heart(rand(30, 70), 24, rand(-8, 8), -16, 0.9, 1500)
            if (!(await wait(500, signal))) return
            rest()
        }

        const burstAnimation = async (signal: AbortSignal) => {
            happyEyes(true, 1)
            pucker(true)
            flush(1)
            brows({ ly: -3, ry: -3, lr: -4, rr: 4 })
            for (let i = 0; i < 6; i++) {
                heart(50 + rand(-6, 6), 62, rand(-34, 34), -rand(22, 44), rand(0.9, 1.5), rand(1100, 1700))
                if (!(await wait(110, signal))) return
            }
            if (!(await wait(600, signal))) return
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
            [2, dreamy],
            [2, loveStruck],
            [3, blowKiss],
            [2, shy],
            [2, giggle],
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
                if (completed && Math.random() < 0.2) await runAnimation(blink)
                await wait(rand(500, 1500), lifecycle.signal)
            }
        }
        void animate()

        // ambient tiny hearts
        ;(async () => {
            while (alive && !lifecycle.signal.aborted) {
                if (!(await wait(rand(2500, 5000), lifecycle.signal))) return
                if (performance.now() - lastInteraction >= 2500) {
                    heart(rand(10, 90), rand(78, 92), rand(-6, 6), -rand(24, 40), rand(0.6, 0.9), 2600)
                }
            }
        })()

        burst.current = () => {
            lastInteraction = performance.now()
            activeAnimation?.abort()
            cancelDecorations()
            rest()
            void runAnimation(burstAnimation)
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
            burst.current = () => {}
            window.removeEventListener('pointermove', onMove)
        }
    }, [followCursor])

    return (
        <svg
            {...props}
            ref={root}
            viewBox="0 0 100 100"
            data-face="love"
            role="button"
            aria-label={props['aria-label'] ?? 'Loving animated face blowing kisses'}
            tabIndex={props.tabIndex ?? 0}
            onClick={(e) => {
                onClick?.(e)
                burst.current()
            }}
            onKeyDown={(e) => {
                onKeyDown?.(e)
                if (!e.defaultPrevented && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    e.currentTarget.dispatchEvent(new MouseEvent('click', { bubbles: true }))
                }
            }}>
            <style>{`
        [data-face="love"] [data-part] { transition-property: transform, opacity; }
        [data-face="love"] [data-part="face"]  { transition-duration: .7s; transition-timing-function: ease-out; }
        [data-face="love"] [data-part="pupil"] { transition-duration: .17s; transition-timing-function: cubic-bezier(.2,.9,.3,1.25); }
        [data-face="love"] [data-part="eye"]   { transition-duration: .09s; transition-timing-function: ease-in; transform-box: fill-box; transform-origin: center; }
        [data-face="love"] [data-part="arc"]   { transition-duration: .15s; opacity: 0; }
        [data-face="love"] [data-part="heart-eye"] { transition-duration: .3s; transition-timing-function: cubic-bezier(.3,1.6,.5,1); transform-box: fill-box; transform-origin: center; opacity: 0; transform: scale(.3); }
        [data-face="love"] [data-part="blush"] { transition-duration: .5s; opacity: .55; transform-box: fill-box; transform-origin: center; }
        [data-face="love"] [data-part^="brow"] { transition-duration: .38s; transition-timing-function: cubic-bezier(.3,1.5,.5,1); transform-box: fill-box; transform-origin: center; }
        [data-face="love"] [data-part="smile"] { transition-duration: .5s; transition-timing-function: ease; transform-box: fill-box; transform-origin: center; }
        [data-face="love"] [data-part="kiss"]  { transition-duration: .22s; transition-timing-function: cubic-bezier(.3,1.6,.5,1); transform-box: fill-box; transform-origin: center; opacity: 0; transform: scale(.3); }
                [data-face="love"]:focus-visible { outline: 2px solid #171717; outline-offset: 3px; }
                [data-face="love"]:focus:not(:focus-visible) { outline: none; }
                @media (prefers-reduced-motion: reduce) {
                    [data-face="love"] [data-part] { transition: none !important; animation: none !important; }
                }
        @media (prefers-reduced-motion: no-preference) {
          [data-face="love"] [data-part="float"] { animation: love-float 6s ease-in-out infinite; }
          [data-face="love"] [data-part="blush"] { animation: love-pulse 3.2s ease-in-out infinite; }
        }
        @keyframes love-float {
          0%,100% { transform: translate(0, 0) }
          33%     { transform: translate(.4px, -.7px) }
          66%     { transform: translate(-.4px, .4px) }
        }
        @keyframes love-pulse {
          0%,100% { filter: none }
          50%     { filter: brightness(1.12) }
        }
      `}</style>

            <rect width="100" height="100" rx={radius} fill={background} />

            <g data-part="float">
                <g data-part="face">
                    {/* cheeks */}
                    <ellipse data-part="blush" cx="19" cy="60" rx="9" ry="5.6" fill="#ff5c8a" />
                    <ellipse data-part="blush" cx="81" cy="60" rx="9" ry="5.6" fill="#ff5c8a" />

                    {/* eyebrows */}
                    <path data-part="brow-l" d="M24 26 Q31 22.5 39 24" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
                    <path data-part="brow-r" d="M61 24 Q69 22.5 76 26" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />

                    {/* eyes */}
                    {EYE_X.map((cx) => (
                        <g key={cx}>
                            <g data-part="eye">
                                <circle cx={cx} cy={EYE_Y} r={EYE_R} fill="#fff" />
                                <g data-part="pupil">
                                    <circle cx={cx} cy={EYE_Y} r={PUPIL_R} fill={INK} />
                                    <circle cx={cx - 2.6} cy={EYE_Y - 2.8} r="2.4" fill="#fff" />
                                    <circle cx={cx + 2.4} cy={EYE_Y + 2.4} r="1.1" fill="#fff" opacity=".8" />
                                </g>
                            </g>
                            {/* happy ^ ^ */}
                            <path
                                data-part="arc"
                                d={`M${cx - 9} ${EYE_Y + 3} Q${cx} ${EYE_Y - 9} ${cx + 9} ${EYE_Y + 3}`}
                                fill="none"
                                stroke={INK}
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                            {/* heart eyes */}
                            <g transform={`translate(${cx} ${EYE_Y})`}>
                                <path data-part="heart-eye" d={BIG_HEART} fill={PINK} />
                            </g>
                        </g>
                    ))}

                    {/* mouth */}
                    <path data-part="smile" d="M40 61 Q50 70 60 61" fill="none" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
                    <ellipse data-part="kiss" cx="50" cy="65" rx="3.2" ry="3.8" fill={INK} />
                </g>

                {/* floating hearts (drawn above the face) */}
                <g data-part="hearts" />
            </g>
        </svg>
    )
}

export default LoveFace
