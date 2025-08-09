import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loadSettings, saveSettings } from "@/store/chatStore";

export function SettingsDialog() {
  const initial = loadSettings();
  const [baseUrl, setBaseUrl] = useState(initial.baseUrl);
  const [model, setModel] = useState(initial.model);

  const handleSave = () => {
    saveSettings({ baseUrl, model });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Settings</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ollama Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="base">Base URL</Label>
            <Input id="base" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="http://localhost:11434" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="model">Model</Label>
            <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="llama3.1" />
          </div>
          <div className="pt-2">
            <Button onClick={handleSave} className="w-full" variant="default">Save</Button>
          </div>
          <p className="text-xs text-muted-foreground">Ensure your Ollama endpoint allows CORS for this origin.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
