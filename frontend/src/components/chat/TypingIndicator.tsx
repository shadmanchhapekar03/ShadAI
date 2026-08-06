import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function TypingIndicator({ label = "AI is thinking..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-3" role="status" aria-label={label}>
      <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-surface px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-accent"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
      <motion.span
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        className="flex items-center gap-1.5 text-xs font-medium text-text-secondary"
      >
        <Sparkles className="h-3.5 w-3.5 text-accent" />
        {label}
      </motion.span>
    </div>
  );
}
