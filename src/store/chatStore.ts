import { ChatMessage, ChatSession, Settings, UserProfile } from "@/types/chat";

const KEY_USER = "chat:user";
const KEY_SETTINGS = "chat:settings";
const KEY_CHATS_PREFIX = "chat:sessions:"; // + userId

export const defaultSettings: Settings = {
  provider: "ollama",
  baseUrl: "http://localhost:11434",
  model: "llama3.1",
};

function getChatKey(userId: string) {
  return `${KEY_CHATS_PREFIX}${userId}`;
}

// User
export function loadUser(): UserProfile | null {
  const raw = localStorage.getItem(KEY_USER);
  return raw ? (JSON.parse(raw) as UserProfile) : null;
}
export function saveUser(user: UserProfile) {
  localStorage.setItem(KEY_USER, JSON.stringify(user));
}
export function clearUser() {
  localStorage.removeItem(KEY_USER);
}

// Settings
export function loadSettings(): Settings {
  const raw = localStorage.getItem(KEY_SETTINGS);
  return raw ? { ...defaultSettings, ...(JSON.parse(raw) as Settings) } : defaultSettings;
}
export function saveSettings(s: Partial<Settings>) {
  const next = { ...loadSettings(), ...s };
  localStorage.setItem(KEY_SETTINGS, JSON.stringify(next));
  return next;
}

// Sessions
export function listSessions(userId: string): ChatSession[] {
  const raw = localStorage.getItem(getChatKey(userId));
  const sessions = raw ? (JSON.parse(raw) as ChatSession[]) : [];
  return sessions.sort((a, b) => b.updatedAt - a.updatedAt);
}

function writeSessions(userId: string, sessions: ChatSession[]) {
  localStorage.setItem(getChatKey(userId), JSON.stringify(sessions));
}

export function createSession(userId: string, title = "New Chat"): ChatSession {
  const sessions = listSessions(userId);
  const now = Date.now();
  const session: ChatSession = {
    id: crypto.randomUUID(),
    title,
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
  writeSessions(userId, [session, ...sessions]);
  return session;
}

export function getSession(userId: string, id: string): ChatSession | undefined {
  return listSessions(userId).find((s) => s.id === id);
}

export function renameSession(userId: string, id: string, title: string) {
  const sessions = listSessions(userId).map((s) => (s.id === id ? { ...s, title, updatedAt: Date.now() } : s));
  writeSessions(userId, sessions);
}

export function deleteSession(userId: string, id: string) {
  const sessions = listSessions(userId).filter((s) => s.id !== id);
  writeSessions(userId, sessions);
}

export function addMessage(userId: string, id: string, msg: ChatMessage) {
  const sessions = listSessions(userId).map((s) =>
    s.id === id
      ? { ...s, messages: [...s.messages, msg], updatedAt: Date.now() }
      : s
  );
  writeSessions(userId, sessions);
}

export function updateMessage(userId: string, id: string, messageId: string, patch: Partial<ChatMessage>) {
  const sessions = listSessions(userId).map((s) => {
    if (s.id !== id) return s;
    return {
      ...s,
      messages: s.messages.map((m) => (m.id === messageId ? { ...m, ...patch } : m)),
      updatedAt: Date.now(),
    };
  });
  writeSessions(userId, sessions);
}
