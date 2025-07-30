import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel 
} from "@/components/ui/dropdown-menu";
import { Trash2, FileText, Calendar, FolderOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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

  const handleDeleteFile = async (id: string) => {
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

  const handleLoadCode = (file: SavedCode) => {
    onLoadCode(file.code, file.title);
    toast({
      title: "Success",
      description: `Loaded "${file.title}"`,
    });
  };

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FolderOpen className="h-4 w-4" />
          Saved Files
          {savedFiles.length > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
              {savedFiles.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Saved Code Files</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            Loading saved files...
          </div>
        ) : savedFiles.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No saved files yet
          </div>
        ) : (
          <ScrollArea className="max-h-[300px]">
            {savedFiles.map((file) => (
              <DropdownMenuItem
                key={file.id}
                className="p-0 focus:bg-accent/50"
              >
                <div className="w-full p-3 flex items-start justify-between gap-2">
                  <div 
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => handleLoadCode(file)}
                  >
                    <h4 className="font-medium text-sm truncate" title={file.title}>
                      {file.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                        {file.language}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(file.created_at), 'MMM d')}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto hover:bg-destructive/10 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFile(file.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}