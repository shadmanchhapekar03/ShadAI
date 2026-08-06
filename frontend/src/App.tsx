import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";
import { Toaster } from "@/components/ui/toast";
import { useChatStore } from "@/store/useChatStore";

function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-accent/[0.07] blur-3xl" />
      <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-violet-500/[0.06] blur-3xl" />
      <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/[0.04] blur-3xl" />
    </div>
  );
}

export default function App() {
  const theme = useChatStore((s) => s.settings.theme);

  return (
    <div className={`relative flex h-full overflow-hidden bg-background text-text-primary ${theme}`}>
      <AmbientBackground />
      <Sidebar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 flex h-full min-w-0 flex-1 flex-col"
      >
        <TopNav />
        <MessageList />
        <ChatInput />
      </motion.main>

      <Toaster />
    </div>
  );
}
