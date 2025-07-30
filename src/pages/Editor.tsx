import { useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { OutputPanel } from "@/components/OutputPanel";
import { AIFeedbackPanel } from "@/components/AIFeedbackPanel";
import { executeJavaScript } from "@/utils/codeExecution";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface ExecutionResult {
  output: string[];
  errors: string[];
  timestamp: Date;
  executionTime?: number;
}

export default function Editor() {
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentCode, setCurrentCode] = useState("");

  const handleRunCode = async (code: string) => {
    setCurrentCode(code);
    setIsRunning(true);
    
    try {
      const result = await executeJavaScript(code);
      setExecutionResult(result);
    } catch (error) {
      setExecutionResult({
        output: [],
        errors: [`Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        timestamp: new Date(),
        executionTime: 0,
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-xl font-semibold text-foreground">EduRun Editor</h1>
          </div>
        </div>
      </div>

      {/* Editor Layout */}
      <div className="container mx-auto p-4 h-[calc(100vh-80px)]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          {/* Code Editor */}
          <div className="lg:col-span-2">
            <CodeEditor onRunCode={handleRunCode} />
          </div>
          
          {/* Right Panel */}
          <div className="flex flex-col gap-4">
            {/* Output Panel */}
            <div className="flex-1">
              <OutputPanel result={executionResult} isRunning={isRunning} />
            </div>
            
            {/* AI Feedback Panel */}
            <div className="flex-1">
            <AIFeedbackPanel 
              code={currentCode}
              errors={executionResult?.errors || []}
              hasExecuted={!!executionResult}
            />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}