import { ReactNode } from "react";
import { SettingsDialog } from "./SettingsDialog";
import { Button } from "@/components/ui/button";

interface Props {
  sidebar: ReactNode;
  children: ReactNode;
}

export function ChatLayout({ sidebar, children }: Props) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[18rem_1fr]">
      {sidebar}
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex items-center justify-between h-14">
            <div className="font-semibold">Ollama Chat</div>
            <div className="flex items-center gap-2">
              <SettingsDialog />
              <a href="/" className="hidden sm:block">
                <Button variant="outline">Home</Button>
              </a>
            </div>
          </div>
        </header>
        <main className="container flex-1 py-6">{children}</main>
      </div>
    </div>
  );
}
