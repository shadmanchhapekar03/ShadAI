import * as React from "react";
import { motion } from "framer-motion";
import {
  Check,
  Copy,
  FileText,
  Image as ImageIcon,
  Link2,
  RefreshCw,
  Share,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { cn, copyToClipboard, formatTime } from "@/lib/utils";
import type { Message } from "@/types";
import { useChatStore } from "@/store/useChatStore";
import { MarkdownRenderer } from "@/components/chat/MarkdownRenderer";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { Tooltip } from "@/components/ui/tooltip";

function AssistantAvatar() {
  return (
    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-brand shadow-glow">
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white">
        <path
          d="M6.5 9.2a5.5 5.5 0 1 1 11 0v5.6a5.5 5.5 0 0 1-11 0V9.2z"
          stroke="currentColor"
          strokeWidth="1.6"
          fill="currentColor"
          opacity="0.2"
        />
        <path d="M6.5 12h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  children,
  active,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Tooltip label={label}>
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className={cn(
          "rounded-md p-1.5 transition-colors",
          active
            ? "text-accent"
            : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
        )}
      >
        {children}
      </button>
    </Tooltip>
  );
}

export function MessageBubble({ message }: { message: Message }) {
  const rateMessage = useChatStore((s) => s.rateMessage);
  const regenerateLastResponse = useChatStore((s) => s.regenerateLastResponse);
  const pushToast = useChatStore((s) => s.pushToast);
  const activeChatId = useChatStore((s) => s.activeChatId);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(message.content);
    if (ok) {
      setCopied(true);
      pushToast("Copied to clipboard", "success");
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: "ShadAI response", text: message.content });
    } else {
      const ok = await copyToClipboard(message.content);
      pushToast(ok ? "Link copied to clipboard" : "Sharing failed", ok ? "success" : "error");
    }
  };

  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("group flex w-full gap-3", isUser && "justify-end")}
    >
      {!isUser && <AssistantAvatar />}

      <div className={cn("flex max-w-full flex-col sm:max-w-[85%]", isUser && "items-end")}>
        <div
          className={cn(
            "relative rounded-2xl",
            isUser
              ? "bg-gradient-brand px-4 py-2.5 text-white shadow-bubble"
              : "w-full"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{message.content}</p>
          ) : message.status === "sending" && !message.content ? (
            <div className="py-1">
              <TypingIndicator />
            </div>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}

          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {message.attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1.5 text-xs text-white/90 backdrop-blur"
                >
                  {att.type === "image" ? (
                    <ImageIcon className="h-3.5 w-3.5" />
                  ) : (
                    <FileText className="h-3.5 w-3.5" />
                  )}
                  <span className="max-w-[120px] truncate sm:max-w-[200px]">{att.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {message.citations && message.citations.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.citations.slice(0, 4).map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-text-secondary transition-colors hover:border-accent/40 hover:text-accent"
              >
                <Link2 className="h-3 w-3" />
                {new URL(url).hostname}
              </a>
            ))}
          </div>
        )}

        <div
          className={cn(
            "mt-1 flex items-center gap-0.5",
            isUser ? "justify-end" : "justify-start"
          )}
        >
          <span className="px-1.5 text-[10px] text-text-muted">
            {formatTime(message.timestamp)}
          </span>

          {!isUser && (
            <>
              <ActionButton label="Copy response" onClick={handleCopy}>
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </ActionButton>
              <ActionButton label="Regenerate response" onClick={regenerateLastResponse}>
                <RefreshCw className="h-3.5 w-3.5" />
              </ActionButton>
              <ActionButton
                label="Like"
                active={message.rating === "like"}
                onClick={() => activeChatId && rateMessage(activeChatId, message.id, "like")}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
              </ActionButton>
              <ActionButton
                label="Dislike"
                active={message.rating === "dislike"}
                onClick={() => activeChatId && rateMessage(activeChatId, message.id, "dislike")}
              >
                <ThumbsDown className="h-3.5 w-3.5" />
              </ActionButton>
              <ActionButton label="Share response" onClick={handleShare}>
                <Share className="h-3.5 w-3.5" />
              </ActionButton>
            </>
          )}
        </div>

        {message.status === "error" && (
          <button
            type="button"
            onClick={regenerateLastResponse}
            className="mt-1 flex items-center gap-1.5 text-xs text-red-400 transition-colors hover:text-red-300"
          >
            <X className="h-3 w-3" /> Failed — click to retry
          </button>
        )}
      </div>
    </motion.div>
  );
}
