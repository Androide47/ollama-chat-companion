export type Role = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
}

export interface Settings {
  provider: "ollama";
  baseUrl: string;
  model: string;
}
