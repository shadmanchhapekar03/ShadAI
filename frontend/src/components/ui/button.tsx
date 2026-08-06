import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg" | "icon" | "iconSm";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-brand text-white shadow-glow hover:shadow-glow hover:brightness-110",
  secondary:
    "bg-surface text-text-primary hover:bg-surface2 border border-white/10",
  ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/5",
  outline:
    "bg-transparent border border-white/15 text-text-primary hover:border-white/30 hover:bg-white/5",
  danger:
    "bg-transparent text-red-400 hover:bg-red-500/10 hover:text-red-300",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
  iconSm: "h-8 w-8",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", whileTap, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileTap={whileTap ?? { scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200 focus-ring disabled:pointer-events-none disabled:opacity-50 select-none",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
