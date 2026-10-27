export const NotFound = () => (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-sky-300 p-6 text-center text-neutral-900">
        {/* 4 [avatar face] 4 */}
        <div className="flex items-center gap-2 text-[clamp(96px,22vw,200px)] font-extrabold leading-none tracking-tighter">
            <span>4</span>
            <span className="flex size-[0.8em] items-center justify-center gap-[0.09em] rounded-[0.2em] bg-violet-400 shadow-sm">
                {[0, 1].map((i) => (
                    <span key={i} className="flex size-[0.17em] items-center justify-center rounded-full bg-white">
                        <span className="size-[0.08em] rounded-full bg-neutral-900" />
                    </span>
                ))}
            </span>
            <span>4</span>
        </div>
        <a
            href="/"
            className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            Back to lobby
        </a>
    </main>
)

export default NotFound
