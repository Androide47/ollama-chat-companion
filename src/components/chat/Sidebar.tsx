import { ChatSession } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Props {
  sessions: ChatSession[];
  activeId?: string;
  onNew: () => void;
  onSelect: (id: string) => void;
}

export function Sidebar({ sessions, activeId, onNew, onSelect }: Props) {
  return (
    <aside className="hidden md:flex md:w-72 flex-col border-r bg-sidebar">
      <div className="p-3 border-b">
        <Button variant="hero" className="w-full" onClick={onNew}>New Chat</Button>
      </div>
      <ScrollArea className="flex-1 p-2">
        <div className="flex flex-col gap-1">
          {sessions.length === 0 && (
            <p className="text-sm text-muted-foreground px-2">No chats yet</p>
          )}
          {sessions.map((s) => (
            <button
              key={s.id}
              className={cn(
                "text-left rounded-md px-3 py-2 text-sm hover:bg-accent",
                activeId === s.id && "bg-accent"
              )}
              onClick={() => onSelect(s.id)}
            >
              <div className="font-medium truncate">{s.title}</div>
              <div className="text-xs text-muted-foreground truncate">
                {new Date(s.updatedAt).toLocaleString()}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
