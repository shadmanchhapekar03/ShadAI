export type Role = "user" | "assistant";

export interface Attachment {
  id: string;
  name: string;
  type: "file" | "image";
  size: number;
  preview?: string;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  status?: "sending" | "sent" | "error";
  rating?: "like" | "dislike" | null;
  attachments?: Attachment[];
  citations?: string[];
}

export interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

export interface ToolStates {
  webSearch: boolean;
  deepResearch: boolean;
  thinking: boolean;
  agentMode: boolean;
}

export interface AppSettings {
  sidebarCollapsed: boolean;
  theme: "dark" | "light";
  model: string;
}

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

export type View = "welcome" | "chat";
