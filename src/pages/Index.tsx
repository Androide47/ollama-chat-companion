import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="container py-6">
        <nav className="flex items-center justify-between">
          <div className="font-semibold tracking-tight">Ollama Chatbot</div>
          <Link to="/login" className="text-sm underline-offset-4 hover:underline">Sign in</Link>
        </nav>
      </header>

      <main className="container grid place-items-center py-16">
        <section className="max-w-2xl text-center">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Real-time Ollama Chatbot with History
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            A beautiful, fast, and private chat experience. Stream tokens live, keep your chats organized, and bring your own Ollama endpoint.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/login">
              <Button variant="default" size="lg">Get Started</Button>
            </Link>
            <Link to="/chat">
              <Button variant="outline" size="lg">Open Chat</Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
