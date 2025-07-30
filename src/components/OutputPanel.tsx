import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, AlertCircle, Terminal, Trash2 } from "lucide-react";

interface ExecutionResult {
  output: string[];
  errors: string[];
  timestamp: Date;
  executionTime?: number;
}

interface OutputPanelProps {
  result: ExecutionResult | null;
  isRunning: boolean;
}

export const OutputPanel = ({ result, isRunning }: OutputPanelProps) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (result) {
      setLogs(prev => [...prev, ...result.output]);
    }
  }, [result]);

  const clearOutput = () => {
    setLogs([]);
  };

  const getStatusIcon = () => {
    if (isRunning) return <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />;
    if (!result) return <Terminal className="h-4 w-4 text-muted-foreground" />;
    if (result.errors.length > 0) return <XCircle className="h-4 w-4 text-destructive" />;
    return <CheckCircle className="h-4 w-4 text-success" />;
  };

  const getStatusText = () => {
    if (isRunning) return "Running...";
    if (!result) return "Ready";
    if (result.errors.length > 0) return "Error";
    return "Success";
  };

  const getStatusColor = () => {
    if (isRunning) return "default";
    if (!result) return "secondary";
    if (result.errors.length > 0) return "destructive";
    return "default";
  };

  return (
    <div className="h-full flex flex-col">
      {/* Output Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <h2 className="text-lg font-semibold text-foreground">Output</h2>
          </div>
          <Badge variant={getStatusColor()} className="gap-1">
            {getStatusText()}
            {result?.executionTime && (
              <span className="text-xs opacity-75">
                ({result.executionTime}ms)
              </span>
            )}
          </Badge>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearOutput}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </div>

      {/* Output Content */}
      <div className="flex-1 p-4">
        <Tabs defaultValue="console" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="console" className="flex items-center justify-center gap-2">
              <Terminal className="h-4 w-4" />
              <span>Console</span>
            </TabsTrigger>
            <TabsTrigger value="errors" className="flex items-center justify-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>Errors</span>
              {result?.errors.length ? (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                  {result.errors.length}
                </Badge>
              ) : null}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="console" className="flex-1 mt-4">
            <Card className="h-full bg-gradient-glass border-border/50 shadow-glass backdrop-blur-sm">
              <div className="p-4 h-full overflow-auto">
                {logs.length === 0 && !isRunning ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Console output will appear here</p>
                    <p className="text-sm">Click "Run Code" to execute your program</p>
                  </div>
                ) : (
                  <div className="space-y-2 font-mono text-sm">
                    {logs.map((log, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="text-muted-foreground flex-shrink-0 min-w-[2rem] text-right">
                          {index + 1}:
                        </span>
                        <span className="text-foreground break-all leading-relaxed">
                          {log}
                        </span>
                      </div>
                    ))}
                    {isRunning && (
                      <div className="flex items-center gap-2 text-primary">
                        <div className="animate-pulse">●</div>
                        <span>Executing...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="errors" className="flex-1 mt-4">
            <Card className="h-full bg-gradient-glass border-border/50 shadow-glass backdrop-blur-sm">
              <div className="p-4 h-full overflow-auto">
                {!result?.errors.length ? (
                  <div className="text-center text-muted-foreground py-8">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success opacity-50" />
                    <p>No errors detected</p>
                    <p className="text-sm">Your code executed successfully!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {result.errors.map((error, index) => (
                      <div 
                        key={index} 
                        className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
                      >
                        <div className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-mono text-sm text-destructive break-all">
                              {error}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};