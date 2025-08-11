import { ChatMessage } from "@/types/chat";

export interface StreamArgs {
  baseUrl: string;
  model: string;
  messages: Pick<ChatMessage, "role" | "content">[];
  signal?: AbortSignal;
  onToken: (chunk: string) => void;
}

// Stream from Ollama's /api/chat endpoint (JSONL streaming)
export async function streamOllamaChat({ baseUrl, model, messages, signal, onToken }: StreamArgs) {
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, stream: true }),
    signal,
  });

  if (!res.ok || !res.body) {
    throw new Error(`Ollama request failed: ${res.status} ${res.statusText}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      const t = line.trim();
      if (!t) continue;
      try {
        const json = JSON.parse(t);
        const content = json?.message?.content ?? "";
        if (content) onToken(content);
      } catch (_) {
        // ignore malformed partials
      }
    }
  }

  // Flush remaining buffer
  const t = buffer.trim();
  if (t) {
    try {
      const json = JSON.parse(t);
      const content = json?.message?.content ?? "";
      if (content) onToken(content);
    } catch (_) {}
  }
}
