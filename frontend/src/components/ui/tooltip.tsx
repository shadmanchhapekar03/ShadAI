import * as React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface TooltipProps {
  label: string;
  side?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
  shortcut?: string;
  className?: string;
}

const sideMap = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

export function Tooltip({ label, side = "top", children, shortcut, className }: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 });

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            role="tooltip"
            initial={{ opacity: 0, scale: 0.9, rotateX: rotateX.get(), rotateY: rotateY.get() }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "pointer-events-none absolute z-[100] whitespace-nowrap rounded-md border border-white/10 bg-surface px-2.5 py-1.5 text-xs font-medium text-text-primary shadow-panel",
              sideMap[side],
              className
            )}
          >
            {label}
            {shortcut && (
              <span className="ml-2 rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-text-secondary">
                {shortcut}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
