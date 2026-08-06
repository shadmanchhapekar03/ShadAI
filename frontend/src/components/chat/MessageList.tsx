import * as React from "react";
import { motion } from "framer-motion";
import { ArrowDown, FileText, Link2, Sparkles } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { WelcomeState } from "@/components/chat/WelcomeState";
import { cn } from "@/lib/utils";

export function MessageList() {
  const activeChatId = useChatStore((s) => s.activeChatId);
  const chats = useChatStore((s) => s.chats);
  const isThinking = useChatStore((s) => s.isThinking);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);

  const activeChat = chats.find((c) => c.id === activeChatId);
  const messages = activeChat?.messages ?? [];
  const hasChat = !!activeChat;

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isThinking]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 160;
    setShowScrollButton(!nearBottom);
  };

  if (!hasChat) {
    return <WelcomeState />;
  }

  const totalCitations = messages.reduce(
    (sum, m) => sum + (m.citations?.length ?? 0),
    0
  );
  const totalAttachments = messages.reduce(
    (sum, m) => sum + (m.attachments?.length ?? 0),
    0
  );

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="relative flex-1 overflow-y-auto"
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-3 py-6 sm:px-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand shadow-glow">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">{activeChat.title}</h2>
            <p className="text-sm text-text-secondary">
              Ask anything — I'll help you think it through.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={endRef} />
          </>
        )}
      </div>

      {showScrollButton && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })}
          aria-label="Scroll to bottom"
          className="absolute bottom-4 left-1/2 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-white/10 bg-surface text-text-secondary shadow-panel transition-colors hover:text-text-primary"
        >
          <ArrowDown className="h-4 w-4" />
        </motion.button>
      )}

      {(totalCitations > 0 || totalAttachments > 0) && (
        <div className="pointer-events-none fixed bottom-24 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-surface/90 px-3 py-1.5 text-[11px] text-text-secondary shadow-panel backdrop-blur md:flex">
          {totalAttachments > 0 && (
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3 text-accent" /> {totalAttachments} attachment{totalAttachments > 1 ? "s" : ""}
            </span>
          )}
          {totalCitations > 0 && (
            <span className={cn("flex items-center gap-1", totalAttachments > 0 && "border-l border-white/10 pl-2")}>
              <Link2 className="h-3 w-3 text-accent" /> {totalCitations} source{totalCitations > 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
