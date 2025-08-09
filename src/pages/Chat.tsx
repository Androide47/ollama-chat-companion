import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { Sidebar } from "@/components/chat/Sidebar";
import { Composer } from "@/components/chat/Composer";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { addMessage, createSession, deleteSession, getSession, listSessions, loadSettings, loadUser, renameSession, updateMessage } from "@/store/chatStore";
import { ChatMessage } from "@/types/chat";
import { streamOllamaChat } from "@/lib/stream";
import { Button } from "@/components/ui/button";

const Chat = () => {
  const navigate = useNavigate();
  const params = useParams();
  const user = loadUser();
  const [sessions, setSessions] = useState(() => (user ? listSessions(user.id) : []));
  const [isStreaming, setIsStreaming] = useState(false);
  const settings = loadSettings();
  const activeId = params.id as string | undefined;
  const [titleEditing, setTitleEditing] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    setSessions(listSessions(user.id));
  }, []);

  const active = useMemo(() => {
    if (!user) return undefined;
    if (activeId) return getSession(user.id, activeId);
    const s = sessions[0] ?? createSession(user.id);
    if (!activeId) navigate(`/chat/${s.id}`, { replace: true });
    return s;
  }, [activeId, sessions, user, navigate]);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.messages.length]);

  const refresh = () => user && setSessions(listSessions(user.id));

  const handleNew = () => {
    if (!user) return;
    const n = createSession(user.id);
    refresh();
    navigate(`/chat/${n.id}`);
  };

  const handleSelect = (id: string) => navigate(`/chat/${id}`);

  const onSend = async (text: string, ctrl: AbortController) => {
    if (!user || !active) return;
    setIsStreaming(true);

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: Date.now(),
    };
    addMessage(user.id, active.id, userMsg);

    const toSend = (getSession(user.id, active.id)?.messages || []).map(m => ({ role: m.role, content: m.content }));

    const assistantMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      createdAt: Date.now(),
    };
    addMessage(user.id, active.id, assistantMsg);
    refresh();

    try {
      await streamOllamaChat({
        baseUrl: settings.baseUrl,
        model: settings.model,
        messages: toSend,
        signal: ctrl.signal,
        onToken: (chunk) => {
          updateMessage(user.id, active.id, assistantMsg.id, { content: (getSession(user.id, active.id)?.messages.find(m=>m.id===assistantMsg.id)?.content || "") + chunk });
          // rename with first line
          const current = getSession(user.id, active.id);
          if (current && current.title === "New Chat" && current.messages.length > 0) {
            const preview = userMsg.content.split("\n")[0].slice(0, 40);
            renameSession(user.id, active.id, preview || "New Chat");
          }
          refresh();
        },
      });
    } catch (e) {
      updateMessage(user.id, active.id, assistantMsg.id, { content: `Error: ${(e as Error).message}` });
    } finally {
      setIsStreaming(false);
      refresh();
    }
  };

  const onStop = () => {
    setIsStreaming(false);
  };

  if (!user || !active) return null;

  return (
    <ChatLayout
      sidebar={<Sidebar sessions={sessions} activeId={active.id} onNew={handleNew} onSelect={handleSelect} />}
    >
      <div className="mx-auto w-full max-w-3xl h-[calc(100vh-12rem)] flex flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto pr-1 space-y-4">
          {active.messages.length === 0 && (
            <div className="grid place-items-center h-full text-center">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Start a conversation</h2>
                <p className="text-muted-foreground">Your messages will appear here.</p>
              </div>
            </div>
          )}
          {active.messages.map((m) => (
            <MessageBubble key={m.id} msg={m} />
          ))}
        </div>
        <div className="mt-4">
          <Composer onSend={onSend} isStreaming={isStreaming} onStop={onStop} />
          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
            <span>Model: {settings.model}</span>
            <Button variant="outline" size="sm" onClick={() => { deleteSession(user.id, active.id); refresh(); navigate('/chat'); }}>Delete chat</Button>
          </div>
        </div>
      </div>
    </ChatLayout>
  );
};

export default Chat;
