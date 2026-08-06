import * as React from "react";
import { motion } from "framer-motion";
import {
  ArrowUp,
  FileText,
  Globe,
  Image as ImageIcon,
  Loader2,
  Mic,
  Paperclip,
  Plus,
  Radar,
  Send,
  Sparkles,
  Square,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/useChatStore";
import { Tooltip } from "@/components/ui/tooltip";
import { generateId } from "@/lib/utils";
import type { Attachment } from "@/types";

const TOOLS = [
  {
    key: "webSearch" as const,
    label: "Web search",
    icon: Globe,
  },
  {
    key: "deepResearch" as const,
    label: "Deep research",
    icon: Radar,
  },
  {
    key: "thinking" as const,
    label: "Thinking mode",
    icon: Sparkles,
  },
  {
    key: "agentMode" as const,
    label: "Agent mode",
    icon: Zap,
  },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ChatInput() {
  const [value, setValue] = React.useState("");
  const [attachments, setAttachments] = React.useState<Attachment[]>([]);
  const [isRecording, setIsRecording] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  const sendMessage = useChatStore((s) => s.sendMessage);
  const isGenerating = useChatStore((s) => s.isGenerating);
  const stopGeneration = useChatStore((s) => s.stopGeneration);
  const tools = useChatStore((s) => s.tools);
  const setTool = useChatStore((s) => s.setTool);
  const pushToast = useChatStore((s) => s.pushToast);

  const MAX_CHARS = 4000;
  const canSend = value.trim().length > 0 && !isGenerating;

  React.useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [value]);

  const handleSend = async () => {
    const text = value.trim();
    if (!text || isGenerating) return;
    setValue("");
    setAttachments([]);
    setIsExpanded(false);
    await sendMessage(text, attachments.length ? attachments : undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const addAttachments = (files: FileList | null, type: "file" | "image") => {
    if (!files) return;
    const next: Attachment[] = Array.from(files).map((file) => ({
      id: generateId("att"),
      name: file.name,
      type,
      size: file.size,
      preview: type === "image" ? URL.createObjectURL(file) : undefined,
    }));
    setAttachments((prev) => [...prev, ...next].slice(0, 5));
    setIsExpanded(true);
  };

  const handleVoice = async () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    const SpeechRec = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRec) {
      pushToast("Voice input unavailable", "error", "Your browser does not support speech recognition.");
      return;
    }
    const rec = new SpeechRec();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      setValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
      pushToast("Voice captured", "success");
    };
    rec.onerror = () => {
      setIsListening(false);
      pushToast("Voice input failed", "error");
    };
    rec.onend = () => setIsListening(false);
    setIsListening(true);
    rec.start();
  };

  const toggleRecording = () => {
    setIsRecording((r) => {
      const next = !r;
      pushToast(next ? "Recording started" : "Recording stopped", next ? "info" : "success");
      return next;
    });
  };

  return (
    <div className="relative z-10 mx-auto w-full max-w-3xl px-3 pb-4 sm:px-4">
      {attachments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 flex flex-wrap gap-2"
        >
          {attachments.map((att) => (
            <div
              key={att.id}
              className="group relative flex items-center gap-2 rounded-lg border border-white/10 bg-surface px-2.5 py-1.5 text-xs text-text-primary"
            >
              {att.preview ? (
                <img src={att.preview} alt={att.name} className="h-8 w-8 rounded object-cover" />
              ) : (
                <FileText className="h-4 w-4 text-accent" />
              )}
              <span className="max-w-[140px] truncate">{att.name}</span>
              <span className="text-[10px] text-text-muted">{formatBytes(att.size)}</span>
              <button
                type="button"
                aria-label={`Remove ${att.name}`}
                onClick={() => setAttachments((prev) => prev.filter((a) => a.id !== att.id))}
                className="absolute -right-1.5 -top-1.5 rounded-full bg-surface2 p-0.5 text-text-secondary shadow-sm transition-colors hover:text-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <div
          className={cn(
            "relative rounded-2xl border bg-white/[0.04] shadow-panel backdrop-blur-xl transition-all duration-300",
            isExpanded ? "border-accent/40 shadow-glow" : "border-white/10 hover:border-white/20"
          )}
        >
          {attachments.some((a) => a.preview) && (
            <div className="flex gap-2 overflow-x-auto px-3 pt-3">
              {attachments
                .filter((a) => a.preview)
                .map((a) => (
                  <img
                    key={a.id}
                    src={a.preview}
                    alt={a.name}
                    className="h-20 w-20 shrink-0 rounded-lg border border-white/10 object-cover"
                  />
                ))}
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value.slice(0, MAX_CHARS));
              setIsExpanded(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsExpanded(true)}
            placeholder="Ask anything..."
            aria-label="Message input"
            rows={1}
            className="max-h-[220px] w-full resize-none bg-transparent px-4 pb-2 pt-3.5 text-[15px] leading-relaxed text-text-primary placeholder:text-text-muted focus:outline-none"
          />

          <div className="flex items-center justify-between gap-2 px-2.5 pb-2.5 pt-1">
            <div className="flex items-center gap-1">
              <Tooltip label="Attach files">
                <button
                  type="button"
                  aria-label="Attach files"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
              </Tooltip>
              <Tooltip label="Attach images">
                <button
                  type="button"
                  aria-label="Attach images"
                  onClick={() => imageInputRef.current?.click()}
                  className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                >
                  <ImageIcon className="h-4 w-4" />
                </button>
              </Tooltip>
              <Tooltip label={isListening ? "Stop listening" : "Voice input"}>
                <button
                  type="button"
                  aria-label="Voice input"
                  onClick={handleVoice}
                  className={cn(
                    "rounded-lg p-2 transition-colors",
                    isListening
                      ? "bg-accent/20 text-accent"
                      : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                  )}
                >
                  <Mic className="h-4 w-4" />
                </button>
              </Tooltip>

              <div className="mx-1 h-5 w-px bg-white/10" />

              <div className="flex items-center gap-1">
                {TOOLS.map((tool) => (
                  <Tooltip key={tool.key} label={tool.label}>
                    <button
                      type="button"
                      aria-label={tool.label}
                      aria-pressed={tools[tool.key]}
                      onClick={() => setTool(tool.key, !tools[tool.key])}
                      className={cn(
                        "rounded-lg p-2 transition-all duration-200",
                        tools[tool.key]
                          ? "bg-accent/20 text-accent shadow-glow"
                          : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                      )}
                    >
                      <tool.icon className="h-4 w-4" />
                    </button>
                  </Tooltip>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {value.length > 0 && (
                <span className="hidden text-[10px] tabular-nums text-text-muted sm:block">
                  {value.length}/{MAX_CHARS}
                </span>
              )}

              {isGenerating ? (
                <Tooltip label="Stop generating">
                  <motion.button
                    type="button"
                    aria-label="Stop generating"
                    whileTap={{ scale: 0.9 }}
                    onClick={stopGeneration}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-text-primary transition-colors hover:bg-white/20"
                  >
                    <Square className="h-3.5 w-3.5 fill-current" />
                  </motion.button>
                </Tooltip>
              ) : (
                <motion.button
                  type="button"
                  aria-label="Send message"
                  whileTap={{ scale: 0.9 }}
                  animate={canSend ? { scale: 1 } : { scale: 0.9, opacity: 0.5 }}
                  whileHover={canSend ? { scale: 1.05 } : undefined}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  onClick={() => void handleSend()}
                  disabled={!canSend}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
                    canSend
                      ? "bg-gradient-brand text-white shadow-glow hover:brightness-110"
                      : "bg-white/10 text-text-muted"
                  )}
                >
                  {canSend ? <Send className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
                </motion.button>
              )}
            </div>
          </div>

          {isRecording && (
            <div className="flex items-center justify-center gap-2 rounded-b-2xl border-t border-white/10 bg-red-500/10 py-2 text-xs font-medium text-red-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Recording...
            </div>
          )}
        </div>

        <p className="mt-2 text-center text-[11px] text-text-muted">
          ShadAI can make mistakes. Check important information.
        </p>
      </motion.div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        aria-hidden="true"
        onChange={(e) => addAttachments(e.target.files, "file")}
      />
      <input
        ref={imageInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        aria-hidden="true"
        onChange={(e) => addAttachments(e.target.files, "image")}
      />
    </div>
  );
}
