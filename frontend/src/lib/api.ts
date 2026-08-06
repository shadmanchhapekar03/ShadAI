import type { ToolStates } from "@/types";

interface ChatResponse {
  message: string;
}

export interface AskParams {
  question: string;
  tools?: ToolStates;
  onStream?: (chunk: string) => void;
  signal?: AbortSignal;
}

/**
 * Calls the FastAPI backend `/chat` endpoint.
 * The backend does not stream yet, so we fake a natural token-by-token
 * reveal client-side for a premium streaming feel. Switch to SSE/WebSocket
 * when the backend supports it.
 */
export async function askShadAI({ question, signal }: AskParams): Promise<string> {
  const controller = new AbortController();
  if (signal) {
    signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
    signal: controller.signal,
  });

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  const data = (await res.json()) as ChatResponse;
  return data.message;
}
