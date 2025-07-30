import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, FileCode, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SavedCode {
  id: string;
  title: string;
  code: string;
  language: string;
  created_at: string;
  updated_at: string;
}

interface SavedFilesListProps {
  onLoadCode: (code: string, title: string) => void;
  refreshTrigger?: number;
}

export function SavedFilesList({ onLoadCode, refreshTrigger }: SavedFilesListProps) {
  const [savedFiles, setSavedFiles] = useState<SavedCode[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSavedFiles = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("saved_code")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load saved files",
        variant: "destructive",
      });
    } else {
      setSavedFiles(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSavedFiles();
  }, [user]);

  useEffect(() => {
    if (refreshTrigger) {
      fetchSavedFiles();
    }
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("saved_code")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
      fetchSavedFiles();
    }
  };

  const handleLoad = (file: SavedCode) => {
    onLoadCode(file.code, file.title);
    toast({
      title: "Success",
      description: `Loaded "${file.title}"`,
    });
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="h-5 w-5" />
            Saved Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Please sign in to view your saved files
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="h-5 w-5" />
            Saved Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCode className="h-5 w-5" />
          Saved Files ({savedFiles.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {savedFiles.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No saved files yet. Save your first code file!
          </p>
        ) : (
          savedFiles.map((file) => (
            <div
              key={file.id}
              className="border border-border rounded-lg p-3 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{file.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(file.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLoad(file)}
                  >
                    Load
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(file.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}