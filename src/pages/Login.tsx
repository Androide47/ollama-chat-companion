import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveUser } from "@/store/chatStore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    const id = crypto.randomUUID();
    saveUser({ id, email, name });
    navigate("/chat", { replace: true });
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 border rounded-lg p-6 bg-card">
        <header>
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="text-sm text-muted-foreground">Local-only demo login. We can upgrade to Supabase auth anytime.</p>
        </header>
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <Button type="submit" variant="hero" className="w-full">Continue</Button>
      </form>
    </div>
  );
};

export default Login;
