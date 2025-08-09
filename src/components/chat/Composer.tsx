import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  onSend: (text: string, controller: AbortController) => Promise<void> | void;
  isStreaming: boolean;
  onStop: () => void;
}

export function Composer({ onSend, isStreaming, onStop }: Props) {
  const [value, setValue] = useState("");
  const ctrlRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => ctrlRef.current?.abort();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = value.trim();
    if (!text || isStreaming) return;
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;
    setValue("");
    await onSend(text, ctrl);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // submit
      void handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-2 bg-background">
      <div className="flex items-end gap-2">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask anything..."
          className="min-h-[56px] max-h-48 resize-y"
        />
        {isStreaming ? (
          <Button type="button" variant="destructive" onClick={() => { ctrlRef.current?.abort(); onStop(); }}>
            Stop
          </Button>
        ) : (
          <Button type="submit" variant="hero">
            Send
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground px-2 pt-1">Press Enter to send, Shift+Enter for a new line.</p>
    </form>
  );
}
