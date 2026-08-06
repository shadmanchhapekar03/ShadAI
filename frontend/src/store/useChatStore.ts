import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AppSettings,
  Attachment,
  Chat,
  Message,
  ToolStates,
  Toast,
  ToastType,
} from "@/types";
import { generateId, groupLabel } from "@/lib/utils";
import { askShadAI } from "@/lib/api";

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  isGenerating: boolean;
  settings: AppSettings;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  tools: ToolStates;
  toasts: Toast[];
  isThinking: boolean;
  searchQuery: string;

  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setActiveChat: (id: string | null) => void;
  setTool: (key: keyof ToolStates, value: boolean) => void;
  setModel: (model: string) => void;
  toggleTheme: () => void;
  setSearchQuery: (query: string) => void;

  newChat: () => string;
  deleteChat: (id: string) => void;
  renameChat: (id: string, title: string) => void;
  clearAllChats: () => void;

  sendMessage: (content: string, attachments?: Attachment[]) => Promise<void>;
  stopGeneration: () => void;
  rateMessage: (chatId: string, messageId: string, rating: "like" | "dislike") => void;
  regenerateLastResponse: () => Promise<void>;

  pushToast: (title: string, type?: ToastType, description?: string) => void;
  dismissToast: (id: string) => void;
}

const STORAGE_KEY = "shadai-store-v1";

const createTitle = (content: string): string => {
  const cleaned = content.trim().replace(/\s+/g, " ");
  return cleaned.length > 42 ? `${cleaned.slice(0, 42)}…` : cleaned || "New chat";
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => {
      let abortController: AbortController | null = null;

      const pushToast = (title: string, type: ToastType = "info", description?: string) => {
        const id = generateId("toast");
        set((s) => ({ toasts: [...s.toasts, { id, title, type, description }] }));
        setTimeout(() => get().dismissToast(id), 4000);
      };

      const appendOrUpdateMessage = (
        chatId: string,
        message: Message,
        replace?: boolean
      ) => {
        set((s) => ({
          chats: s.chats.map((c) => {
            if (c.id !== chatId) return c;
            const exists = c.messages.some((m) => m.id === message.id);
            return {
              ...c,
              updatedAt: new Date(),
              messages: exists
                ? c.messages.map((m) => (m.id === message.id ? message : m))
                : replace
                  ? [...c.messages.slice(0, -1), message]
                  : [...c.messages, message],
            };
          }),
        }));
      };

      return {
        chats: [],
        activeChatId: null,
        isGenerating: false,
        isThinking: false,
        sidebarCollapsed: false,
        mobileSidebarOpen: false,
        settings: {
          sidebarCollapsed: false,
          theme: "dark",
          model: "ShadAI Pro — GPT-4o",
        },
        tools: {
          webSearch: false,
          deepResearch: false,
          thinking: false,
          agentMode: false,
        },
        toasts: [],
        searchQuery: "",

        setSidebarCollapsed: (collapsed) =>
          set({ sidebarCollapsed: collapsed, settings: { ...get().settings, sidebarCollapsed: collapsed } }),
        toggleSidebar: () => {
          const next = !get().sidebarCollapsed;
          set({ sidebarCollapsed: next, settings: { ...get().settings, sidebarCollapsed: next } });
        },
        setSearchQuery: (query) => set({ searchQuery: query }),
        setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
        setActiveChat: (id) => set({ activeChatId: id }),
        setTool: (key, value) => set((s) => ({ tools: { ...s.tools, [key]: value } })),
        setModel: (model) => set((s) => ({ settings: { ...s.settings, model } })),
        toggleTheme: () =>
          set((s) => ({
            settings: {
              ...s.settings,
              theme: s.settings.theme === "dark" ? "light" : "dark",
            },
          })),

        newChat: () => {
          const id = generateId("chat");
          const now = new Date();
          set((s) => ({
            chats: [
              { id, title: "New chat", createdAt: now, updatedAt: now, messages: [] },
              ...s.chats,
            ],
            activeChatId: id,
          }));
          return id;
        },

        deleteChat: (id) => {
          set((s) => {
            const remaining = s.chats.filter((c) => c.id !== id);
            return {
              chats: remaining,
              activeChatId: s.activeChatId === id ? null : s.activeChatId,
            };
          });
        },

        renameChat: (id, title) =>
          set((s) => ({
            chats: s.chats.map((c) => (c.id === id ? { ...c, title: title.trim() || c.title } : c)),
          })),

        clearAllChats: () => set({ chats: [], activeChatId: null }),

        sendMessage: async (content, attachments) => {
          const text = content.trim();
          if (!text || get().isGenerating) return;

          let chatId = get().activeChatId;
          if (!chatId) {
            chatId = get().newChat();
            set((s) => ({
              chats: s.chats.map((c) =>
                c.id === chatId ? { ...c, title: createTitle(text) } : c
              ),
            }));
          } else {
            const chat = get().chats.find((c) => c.id === chatId);
            if (chat && chat.messages.length === 0) {
              get().renameChat(chatId, createTitle(text));
            }
          }

          const userMessage: Message = {
            id: generateId("msg"),
            role: "user",
            content: text,
            timestamp: new Date(),
            status: "sent",
            attachments,
          };
          appendOrUpdateMessage(chatId, userMessage);

          set({ isGenerating: true, isThinking: true });
          abortController = new AbortController();

          const assistantId = generateId("msg");
          const assistantMessage: Message = {
            id: assistantId,
            role: "assistant",
            content: "",
            timestamp: new Date(),
            status: "sending",
          };
          appendOrUpdateMessage(chatId, assistantMessage);

          try {
            const full = await askShadAI({ question: text, signal: abortController.signal });

            appendOrUpdateMessage(
              chatId,
              {
                ...assistantMessage,
                content: full,
                status: "sent",
                citations: extractCitations(full),
              },
              true
            );
          } catch (err) {
            if ((err as Error).name === "AbortError") {
              appendOrUpdateMessage(
                chatId,
                { ...assistantMessage, status: "sent" },
                true
              );
            } else {
              appendOrUpdateMessage(
                chatId,
                {
                  ...assistantMessage,
                  content:
                    "I'm sorry, I couldn't reach the model. Please check that the ShadAI backend is running and try again.",
                  status: "error",
                },
                true
              );
              pushToast("Request failed", "error", "Could not reach the ShadAI backend.");
            }
          } finally {
            abortController = null;
            set({ isGenerating: false, isThinking: false });
          }
        },

        stopGeneration: () => {
          abortController?.abort();
          set({ isGenerating: false, isThinking: false });
        },

        rateMessage: (chatId, messageId, rating) =>
          set((s) => ({
            chats: s.chats.map((c) =>
              c.id !== chatId
                ? c
                : {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === messageId
                        ? { ...m, rating: m.rating === rating ? null : rating }
                        : m
                    ),
                  }
            ),
          })),

        regenerateLastResponse: async () => {
          const { activeChatId, chats, isGenerating } = get();
          if (isGenerating || !activeChatId) return;
          const chat = chats.find((c) => c.id === activeChatId);
          const lastUser = [...chat?.messages ?? []].reverse().find((m) => m.role === "user");
          if (!lastUser) return;

          set((s) => ({
            chats: s.chats.map((c) =>
              c.id === activeChatId ? { ...c, messages: c.messages.slice(0, -1) } : c
            ),
          }));

          await get().sendMessage(lastUser.content, lastUser.attachments);
        },

        pushToast,
        dismissToast: (id) =>
          set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
      };
    },
    {
      name: STORAGE_KEY,
      partialize: (s) => ({
        chats: s.chats,
        settings: s.settings,
        tools: s.tools,
      }),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<ChatState>;
        const chats = (saved.chats ?? []).map((chat) => ({
          ...chat,
          createdAt: new Date(String(chat.createdAt)),
          updatedAt: new Date(String(chat.updatedAt)),
          messages: chat.messages.map((m) => ({
            ...m,
            timestamp: new Date(String(m.timestamp)),
          })),
        }));
        return {
          ...current,
          ...saved,
          chats,
        };
      },
    }
  )
);

function extractCitations(content: string): string[] {
  const urls = content.match(/https?:\/\/[^\s)\]]+/g);
  return urls ? urls.filter((u) => !u.endsWith(".")) : [];
}

export const useChatGroups = () => {
  const searchQuery = useChatStore((s) => s.searchQuery);
  const chats = useChatStore((s) => s.chats);
  const groups: Record<string, Chat[]> = {};
  const filtered = searchQuery
    ? chats.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : chats;
  for (const chat of filtered) {
    const label = groupLabel(chat.updatedAt);
    (groups[label] ??= []).push(chat);
  }
  const order = ["Today", "Yesterday", "Last 7 Days", "Older Chats"];
  return { groups, order };
};
