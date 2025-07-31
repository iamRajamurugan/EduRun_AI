import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

interface SaveCodeDialogProps {
  code: string;
  language: string;
  onSave?: () => void;
}

export function SaveCodeDialog({ code, language, onSave }: SaveCodeDialogProps) {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!user || !title.trim() || !code.trim()) return;

    setSaving(true);
    const { error } = await supabase
      .from("saved_code")
      .insert({
        user_id: user.id,
        title: title.trim(),
        code: code,
        language: language
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save code",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Code saved successfully!",
      });
      setTitle("");
      setOpen(false);
      onSave?.();
    }
    setSaving(false);
  };

  if (!user) {
    return (
      <Button variant="outline" disabled>
        <Save className="h-4 w-4 mr-2" />
        Save Code
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={!code.trim()}>
          <Save className="h-4 w-4 mr-2" />
          Save Code
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Code</DialogTitle>
          <DialogDescription>
            Give your code a name so you can find it later.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">File Name</Label>
            <Input
              id="title"
              placeholder="e.g., My First Script"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!title.trim() || saving}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}