import { ChatMessage } from "@/types/chat";
import { cn } from "@/lib/utils";

interface Props {
  msg: ChatMessage;
}

export function MessageBubble({ msg }: Props) {
  const isUser = msg.role === "user";
  return (
    <div className={cn("w-full flex", isUser ? "justify-end" : "justify-start")}>      
      <article
        className={cn(
          "max-w-[80%] rounded-lg border px-4 py-3 text-sm leading-relaxed shadow-sm",
          isUser
            ? "bg-secondary text-foreground"
            : "bg-card text-foreground"
        )}
      >
        <div className="prose-chat whitespace-pre-wrap">{msg.content}</div>
        <time className="mt-2 block text-[0.7rem] text-muted-foreground">
          {new Date(msg.createdAt).toLocaleTimeString()}
        </time>
      </article>
    </div>
  );
}
