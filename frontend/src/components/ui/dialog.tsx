import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: DialogProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[120] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onOpenChange(false);
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              "w-full max-w-md rounded-t-2xl border border-white/10 bg-surface shadow-panel sm:rounded-2xl",
              className
            )}
          >
            <div className="flex items-start justify-between gap-4 p-5 pb-2">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
                {description && (
                  <p className="mt-0.5 text-sm text-text-secondary">{description}</p>
                )}
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => onOpenChange(false)}
                className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-5 py-3">{children}</div>
            {footer && (
              <div className="flex justify-end gap-2 border-t border-white/10 bg-white/[0.02] px-5 py-4 sm:rounded-b-2xl">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  destructive = true,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  destructive?: boolean;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      className="max-w-sm"
      footer={
        <>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className={
              destructive
                ? "rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-600"
                : "rounded-lg bg-gradient-brand px-4 py-2 text-sm font-medium text-white hover:brightness-110"
            }
          >
            {confirmLabel}
          </button>
        </>
      }
    />
  );
}
