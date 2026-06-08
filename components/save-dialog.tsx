"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Save } from "lucide-react";

interface SaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultName: string;
  onSave: (name: string) => void;
  type?: "lesson-plan" | "ipdp";
}

export function SaveDialog({ open, onOpenChange, defaultName, onSave, type = "lesson-plan" }: SaveDialogProps) {
  const [name, setName] = useState(defaultName);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) {
      setName(defaultName);
      setSaved(false);
    }
  }, [open, defaultName]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    setSaved(true);
    setTimeout(() => {
      onOpenChange(false);
      setSaved(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Save className="h-4 w-4 text-indigo-600" />
            Save {type === "lesson-plan" ? "Lesson Plan" : "IPDP Session"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder={type === "lesson-plan" ? "e.g. Fractions Intro – 5th Grade" : "e.g. IPDP 2026–2027"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={!name.trim() || saved}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 gap-2"
            >
              {saved ? (
                <><CheckCircle className="h-4 w-4" /> Saved!</>
              ) : (
                <><Save className="h-4 w-4" /> Save</>
              )}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
