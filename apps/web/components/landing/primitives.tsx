import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { getAvatar } from "../characters/registry";
import type { AvatarCode } from "../characters/registry";

export function Avatar({ code, className = "" }: { code: AvatarCode; className?: string }) {
  const { color, face } = getAvatar(code);
  const Face = face.component;

  return (
    <Face
      aria-hidden="true"
      background={color.value}
      radius={22}
      className={`aspect-square shrink-0 ${className}`}
    />
  );
}

export function Tag({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "cyan" }) {
  return (
    <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold leading-4 text-white ${tone === "dark" ? "bg-black" : "bg-[#14B8E6]"}`}>
      {children}
    </span>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  icon?: ReactNode;
};

export function Button({ variant = "secondary", loading, icon, children, className = "", disabled, ...rest }: ButtonProps) {
  const variants = {
    primary: "bg-black text-white hover:bg-neutral-800",
    secondary: "bg-white text-black ring-1 ring-black/10 hover:bg-neutral-100",
    ghost: "bg-transparent text-black hover:bg-black/5",
  };

  return (
    <button
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-bold tracking-tight transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black active:translate-y-px active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none ${variants[variant]} ${className}`}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl bg-[#F4F4F4] p-5 shadow-[0_2px_0_rgba(0,0,0,0.04)] sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

export function Divider() {
  return <div className="my-5 border-t border-dashed border-black/25" />;
}