import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

export function Dropdown({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        containerRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block" ref={containerRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownTrigger({
  children,
  className,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  const ctx = React.useContext(DropdownContext)!;
  return (
    <button
      ref={ctx.triggerRef}
      type="button"
      aria-label={ariaLabel}
      aria-haspopup="menu"
      aria-expanded={ctx.open}
      onClick={() => ctx.setOpen(!ctx.open)}
      className={cn("focus-ring", className)}
    >
      {children}
    </button>
  );
}

export function DropdownContent({
  children,
  className,
  align = "start",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "end";
}) {
  const ctx = React.useContext(DropdownContext)!;
  const trigger = ctx.triggerRef.current;

  if (!trigger) return null;

  const rect = trigger.getBoundingClientRect();
  const top = rect.bottom + 8;
  const left = align === "end" ? rect.right : rect.left;

  return createPortal(
    <AnimatePresence>
      {ctx.open && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.15 }}
          role="menu"
          className={cn(
            "fixed z-[90] min-w-[12rem] overflow-hidden rounded-xl border border-white/10 bg-surface/95 backdrop-blur-xl shadow-panel",
            className
          )}
          style={{ top, left }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function DropdownItem({
  children,
  onClick,
  className,
  icon,
  danger,
  shortcut,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  danger?: boolean;
  shortcut?: string;
}) {
  const ctx = React.useContext(DropdownContext)!;
  return (
    <button
      type="button"
      role="menuitem"
      onClick={() => {
        onClick?.();
        ctx.setOpen(false);
      }}
      className={cn(
        "flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm transition-colors duration-150",
        danger
          ? "text-red-400 hover:bg-red-500/10"
          : "text-text-primary hover:bg-white/5",
        className
      )}
    >
      {icon && <span className="text-text-secondary">{icon}</span>}
      <span className="flex-1">{children}</span>
      {shortcut && <kbd className="text-[10px] text-text-muted">{shortcut}</kbd>}
    </button>
  );
}

export function DropdownLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3.5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
      {children}
    </p>
  );
}

export function DropdownSeparator() {
  return <div className="my-1 h-px bg-white/10" />;
}
