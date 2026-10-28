import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: ReactNode
    label: string
    // Hide the text on small screens (icon-only), keep it for accessibility.
    collapseLabel?: boolean
}

export function PillButton({ icon, label, collapseLabel, className, ...rest }: PillButtonProps) {
    return (
        <button
            type="button"
            aria-label={label}
            className={cn(
                'inline-flex min-h-8 items-center justify-center gap-1.5 rounded-full px-3.5 text-sm font-medium',
                'text-slate-600 transition-all duration-150 ease-out hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-2',
                'focus-visible:outline-slate-700 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none',
                className,
            )}
            {...rest}>
            {icon}
            <span className={cn(collapseLabel && 'hidden sm:inline')}>{label}</span>
        </button>
    )
}
