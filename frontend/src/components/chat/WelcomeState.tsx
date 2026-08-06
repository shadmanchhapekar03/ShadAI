import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Braces,
  Lightbulb,
  Rocket,
  TrendingUp,
} from "lucide-react";
import { LogoMark } from "@/components/common/Logo";
import { useChatStore } from "@/store/useChatStore";

const PROMPTS = [
  {
    icon: Lightbulb,
    title: "Explain Machine Learning",
    description: "Simple, intuitive explanation with examples",
    gradient: "from-blue-500/20 to-cyan-500/10",
  },
  {
    icon: Rocket,
    title: "Generate a Business Plan",
    description: "Complete plan for a startup idea",
    gradient: "from-violet-500/20 to-purple-500/10",
  },
  {
    icon: TrendingUp,
    title: "Create a Marketing Strategy",
    description: "Growth plan with channels and KPIs",
    gradient: "from-emerald-500/20 to-teal-500/10",
  },
  {
    icon: Braces,
    title: "Build a React App",
    description: "Architecture, components, and best practices",
    gradient: "from-amber-500/20 to-orange-500/10",
  },
];

function FloatingPrompt({ icon: Icon, className, style }: { icon: typeof Bot; className: string; style: React.CSSProperties }) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0], rotate: [0, 3, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className={className}
      style={style}
      aria-hidden="true"
    >
      <Icon className="h-4 w-4" />
    </motion.div>
  );
}

export function WelcomeState() {
  const newChat = useChatStore((s) => s.newChat);
  const sendMessage = useChatStore((s) => s.sendMessage);

  const handlePrompt = async (prompt: string) => {
    await sendMessage(prompt);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center px-4 py-8">
      <div className="relative mb-8 flex flex-col items-center text-center">
        <div className="relative mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="relative z-10 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-brand shadow-glow"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10 text-white">
              <path
                d="M6.5 9.2a5.5 5.5 0 1 1 11 0v5.6a5.5 5.5 0 0 1-11 0V9.2z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="currentColor"
                opacity="0.25"
              />
              <path d="M6.5 12h11M12 14.7v3.3m0 0h-2.4M12 18h2.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </motion.div>
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-3xl bg-accent/40"
            animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          />
          <FloatingPrompt
            icon={Lightbulb}
            className="absolute -left-8 top-2 z-20 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-surface text-amber-400 shadow-panel"
            style={{ animationDelay: "0.5s" }}
          />
          <FloatingPrompt
            icon={BarChart3}
            className="absolute -right-9 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-surface text-emerald-400 shadow-panel"
            style={{ animationDelay: "1.2s" }}
          />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
        >
          How can I help you <span className="text-gradient">today?</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.4 }}
          className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary sm:text-base"
        >
          ShadAI is your intelligent assistant for research, writing, coding, and problem-solving.
          Ask anything and get precise, well-reasoned answers.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.4 }}
        className="grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {PROMPTS.map((prompt) => (
          <motion.button
            key={prompt.title}
            type="button"
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            onClick={() => handlePrompt(prompt.title)}
            className={`group flex items-start gap-3 rounded-2xl border border-white/10 bg-gradient-to-br p-4 text-left transition-colors duration-200 hover:border-accent/40 hover:bg-white/[0.04] ${prompt.gradient}`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-accent transition-transform duration-200 group-hover:scale-110">
              <prompt.icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-text-primary">{prompt.title}</span>
              <span className="mt-0.5 block text-xs text-text-secondary">{prompt.description}</span>
            </span>
            <ArrowRight className="ml-auto mt-1 h-4 w-4 shrink-0 text-text-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent" />
          </motion.button>
        ))}
      </motion.div>

      <motion.button
        type="button"
        onClick={() => newChat()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium text-text-muted transition-colors hover:text-text-secondary"
      >
        <LogoMark className="h-5 w-5" />
        Start with a blank canvas
      </motion.button>
    </div>
  );
}
