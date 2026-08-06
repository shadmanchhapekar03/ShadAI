import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-brand shadow-glow",
        className
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white">
        <path
          d="M12 3a1 1 0 0 1 1 1v1.5a1 1 0 0 1-2 0V4a1 1 0 0 1 1-1z"
          fill="currentColor"
        />
        <circle cx="12" cy="5.75" r="1.15" fill="currentColor" opacity="0.9" />
        <path
          d="M6.5 9.2a5.5 5.5 0 1 1 11 0v5.6a5.5 5.5 0 0 1-11 0V9.2z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          fill="currentColor"
          opacity="0.15"
        />
        <path
          d="M6.5 12h11M12 14.7v3.3m0 0h-2.4M12 18h2.4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-xl"
        animate={{ boxShadow: ["0 0 0 0 rgba(59,130,246,0.4)", "0 0 0 10px rgba(59,130,246,0)"] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
      />
    </div>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark />
      {!compact && (
        <div className="leading-tight">
          <p className="text-[15px] font-bold tracking-tight text-text-primary">
            Shad<span className="text-gradient">AI</span>
          </p>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-muted">
            Assistant
          </p>
        </div>
      )}
    </div>
  );
}
