import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  LogOut,
  MessageSquareText,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/common/Logo";
import { Avatar } from "@/components/common/Avatar";
import { ConfirmDialog } from "@/components/ui/dialog";
import { useChatStore, useChatGroups } from "@/store/useChatStore";
import { formatTime, timeAgo } from "@/lib/utils";
import type { Chat } from "@/types";

function ChatItem({
  chat,
  active,
  onSelect,
}: {
  chat: Chat;
  active: boolean;
  onSelect: () => void;
}) {
  const renameChat = useChatStore((s) => s.renameChat);
  const deleteChat = useChatStore((s) => s.deleteChat);
  const pushToast = useChatStore((s) => s.pushToast);
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(chat.title);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const commitRename = () => {
    if (draft.trim() && draft.trim() !== chat.title) {
      renameChat(chat.id, draft);
      pushToast("Chat renamed", "success");
    }
    setEditing(false);
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label={`Open chat: ${chat.title}`}
        aria-current={active ? "true" : undefined}
        onClick={() => !editing && onSelect()}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !editing) onSelect();
          if (e.key === "Escape" && editing) setEditing(false);
        }}
        className={cn(
          "group relative flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 transition-colors duration-150",
          active ? "bg-accent/15" : "hover:bg-white/5"
        )}
      >
        <MessageSquareText
          className={cn(
            "h-4 w-4 shrink-0 transition-colors",
            active ? "text-accent" : "text-text-muted group-hover:text-text-secondary"
          )}
        />
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => e.key === "Enter" && commitRename()}
            aria-label="Rename chat"
            className="min-w-0 flex-1 rounded bg-background/80 px-1.5 py-0.5 text-sm text-text-primary outline-none ring-1 ring-accent"
          />
        ) : (
          <>
            <span
              className={cn(
                "min-w-0 flex-1 truncate text-[13px]",
                active ? "font-medium text-text-primary" : "text-text-secondary"
              )}
            >
              {chat.title}
            </span>
            <span className="shrink-0 text-[10px] text-text-muted">
              {timeAgo(chat.updatedAt)}
            </span>
          </>
        )}

        {!editing && (
          <div className="absolute right-1.5 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-md bg-surface/95 p-0.5 shadow-sm group-hover:flex">
            <button
              type="button"
              aria-label={`Rename ${chat.title}`}
              onClick={(e) => {
                e.stopPropagation();
                setEditing(true);
              }}
              className="rounded p-1 text-text-secondary transition-colors hover:bg-white/10 hover:text-text-primary"
            >
              <Pencil className="h-3 w-3" />
            </button>
            <button
              type="button"
              aria-label={`Delete ${chat.title}`}
              onClick={(e) => {
                e.stopPropagation();
                setConfirmOpen(true);
              }}
              className="rounded p-1 text-text-secondary transition-colors hover:bg-red-500/20 hover:text-red-400"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete chat?"
        description={`"${chat.title}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          deleteChat(chat.id);
          pushToast("Chat deleted", "success");
        }}
      />
    </>
  );
}

function HistoryList({ collapsed }: { collapsed: boolean }) {
  const { groups, order } = useChatGroups();
  const activeChatId = useChatStore((s) => s.activeChatId);
  const setActiveChat = useChatStore((s) => s.setActiveChat);
  const setMobileSidebarOpen = useChatStore((s) => s.setMobileSidebarOpen);

  if (collapsed) return null;

  const hasChats = order.some((label) => (groups[label] ?? []).length > 0);

  if (!hasChats) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
        <Search className="h-6 w-6 text-text-muted" />
        <p className="text-sm text-text-secondary">No conversations yet</p>
        <p className="text-xs text-text-muted">Your chats will appear here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 overflow-y-auto px-2 py-2">
      {order.map((label) => {
        const chats = groups[label] ?? [];
        if (!chats.length) return null;
        return (
          <div key={label}>
            <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              {label}
            </p>
            <div className="flex flex-col gap-0.5">
              {chats.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  active={chat.id === activeChatId}
                  onSelect={() => {
                    setActiveChat(chat.id);
                    setMobileSidebarOpen(false);
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Sidebar() {
  const collapsed = useChatStore((s) => s.sidebarCollapsed);
  const mobileOpen = useChatStore((s) => s.mobileSidebarOpen);
  const toggleSidebar = useChatStore((s) => s.toggleSidebar);
  const setMobileSidebarOpen = useChatStore((s) => s.setMobileSidebarOpen);
  const newChat = useChatStore((s) => s.newChat);
  const setSearchQuery = useChatStore((s) => s.setSearchQuery);
  const searchQuery = useChatStore((s) => s.searchQuery);
  const pushToast = useChatStore((s) => s.pushToast);
  const clearAllChats = useChatStore((s) => s.clearAllChats);

  const handleNewChat = () => {
    newChat();
    setMobileSidebarOpen(false);
  };

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <Logo compact={collapsed} />
        {!collapsed && (
          <button
            type="button"
            aria-label="Collapse sidebar"
            onClick={toggleSidebar}
            className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="px-3 pb-3 pt-1">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={handleNewChat}
          aria-label="New chat"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand px-3 py-2.5 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          {!collapsed && <span>New chat</span>}
        </motion.button>
      </div>

      {!collapsed && (
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              aria-label="Search chats"
              className="w-full rounded-lg border border-white/10 bg-background/60 py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1">
        <HistoryList collapsed={collapsed} />
      </div>

      {collapsed && (
        <div className="flex flex-col items-center gap-1 border-t border-white/10 py-3">
          <button
            type="button"
            aria-label="New chat"
            onClick={handleNewChat}
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Search chats"
            onClick={toggleSidebar}
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="border-t border-white/10 p-3">
        {collapsed ? (
          <div className="flex flex-col items-center gap-1">
            <Avatar size="sm" name="Shadman" />
            <button
              type="button"
              aria-label="Settings"
              onClick={() => pushToast("Settings coming soon", "info")}
              className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-white/5">
            <Avatar size="sm" name="Shadman Chhapekar" />
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-[13px] font-medium text-text-primary">Shadman</p>
              <p className="truncate text-[11px] text-text-muted">Pro workspace</p>
            </div>
            <button
              type="button"
              aria-label="Settings"
              onClick={() => pushToast("Settings coming soon", "info")}
              className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Log out"
              onClick={() => pushToast("Logged out (demo)", "success")}
              className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-red-500/15 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 272 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="relative z-30 hidden h-full shrink-0 border-r border-white/10 bg-surface/50 backdrop-blur-xl lg:block"
      >
        {content}
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              aria-hidden="true"
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-white/10 bg-background lg:hidden"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between px-4 pb-2 pt-4">
                  <Logo />
                  <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-white/5"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <div className="px-3 pb-3">
                    <button
                      type="button"
                      onClick={handleNewChat}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand px-3 py-2.5 text-sm font-semibold text-white shadow-glow hover:brightness-110"
                    >
                      <Plus className="h-4 w-4" /> New chat
                    </button>
                  </div>
                  <HistoryList collapsed={false} />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function ChatTimestamp({ date }: { date: Date }) {
  return <span className="text-[10px] text-text-muted">{formatTime(date)}</span>;
}
