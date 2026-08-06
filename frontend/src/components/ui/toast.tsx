import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { cn } from "@/lib/utils";
import type { ToastType } from "@/types";

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
  error: <XCircle className="h-4 w-4 text-red-400" />,
  info: <Info className="h-4 w-4 text-accent" />,
};

const borderMap: Record<ToastType, string> = {
  success: "border-emerald-500/30",
  error: "border-red-500/30",
  info: "border-accent/30",
};

export function Toaster() {
  const toasts = useChatStore((s) => s.toasts);
  const dismissToast = useChatStore((s) => s.dismissToast);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      aria-live="polite"
      className="pointer-events-none fixed right-4 top-4 z-[200] flex w-full max-w-sm flex-col gap-2"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-xl border bg-surface/95 p-4 shadow-panel backdrop-blur-xl",
              borderMap[toast.type]
            )}
            role="status"
          >
            <span className="mt-0.5 shrink-0">{iconMap[toast.type]}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-text-primary">{toast.title}</p>
              {toast.description && (
                <p className="mt-0.5 text-xs text-text-secondary">{toast.description}</p>
              )}
            </div>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 rounded-md p-1 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}
