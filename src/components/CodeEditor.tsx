import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  Play, 
  Save, 
  Settings, 
  Copy, 
  Download, 
  Maximize2, 
  RotateCcw,
  FileText,
  Code2,
  Palette,
  ChevronDown
} from "lucide-react";

interface Language {
  id: string;
  name: string;
  extension: string;
  template: string;
}

interface CodeEditorProps {
  onRunCode: (code: string) => void;
  initialCode?: string;
  onCodeChange?: (code: string) => void;
  hasErrors?: boolean;
}

export const CodeEditor = ({ onRunCode, initialCode, onCodeChange, hasErrors = false }: CodeEditorProps) => {
  const languages: Language[] = [
    {
      id: 'javascript',
      name: 'JavaScript',
      extension: 'js',
      template: `// Welcome to EduRun! 
// Write your JavaScript code here and click Run to execute

function greetStudent(name) {
  return "Hello, " + name + "! Welcome to EduRun!";
}

console.log(greetStudent("Coder"));

// Try creating a simple function that adds two numbers
function addNumbers(a, b) {
  return a + b;
}

console.log("5 + 3 =", addNumbers(5, 3));`
    },
    {
      id: 'python',
      name: 'Python',
      extension: 'py',
      template: `# Welcome to EduRun!
# Write your Python code here and click Run to execute

def greet_student(name):
    return f"Hello, {name}! Welcome to EduRun!"

print(greet_student("Coder"))

# Try creating a simple function that adds two numbers
def add_numbers(a, b):
    return a + b

print(f"5 + 3 = {add_numbers(5, 3)}")`
    },
    {
      id: 'java',
      name: 'Java',
      extension: 'java',
      template: `// Welcome to EduRun!
// Write your Java code here and click Run to execute

public class Main {
    public static void main(String[] args) {
        System.out.println(greetStudent("Coder"));
        System.out.println("5 + 3 = " + addNumbers(5, 3));
    }
    
    public static String greetStudent(String name) {
        return "Hello, " + name + "! Welcome to EduRun!";
    }
    
    public static int addNumbers(int a, int b) {
        return a + b;
    }
}`
    },
    {
      id: 'cpp',
      name: 'C++',
      extension: 'cpp',
      template: `// Welcome to EduRun!
// Write your C++ code here and click Run to execute

#include <iostream>
#include <string>
using namespace std;

string greetStudent(string name) {
    return "Hello, " + name + "! Welcome to EduRun!";
}

int addNumbers(int a, int b) {
    return a + b;
}

int main() {
    cout << greetStudent("Coder") << endl;
    cout << "5 + 3 = " << addNumbers(5, 3) << endl;
    return 0;
}`
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      extension: 'ts',
      template: `// Welcome to EduRun!
// Write your TypeScript code here and click Run to execute

function greetStudent(name: string): string {
  return \`Hello, \${name}! Welcome to EduRun!\`;
}

console.log(greetStudent("Coder"));

// Try creating a simple function that adds two numbers
function addNumbers(a: number, b: number): number {
  return a + b;
}

console.log(\`5 + 3 = \${addNumbers(5, 3)}\`);`
    }
  ];

  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [code, setCode] = useState(initialCode || languages[0].template);
  const [fontSize, setFontSize] = useState(14);
  const [activeTab, setActiveTab] = useState(`main.${languages[0].extension}`);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Update code when initialCode changes (prevent flickering)
  useEffect(() => {
    if (initialCode !== undefined && initialCode !== code && initialCode.trim() !== "") {
      setCode(initialCode);
    }
  }, [initialCode]);

  // Call onCodeChange when code changes (debounced to prevent flickering)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onCodeChange?.(code);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [code, onCodeChange]);

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    setCode(language.template);
    setActiveTab(`main.${language.extension}`);
  };

  const handleRun = () => {
    onRunCode(code);
  };

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
  };

  const resetCode = () => {
    setCode(selectedLanguage.template);
  };

  const getLineNumbers = () => {
    const lines = code.split('\n');
    return Array.from({ length: lines.length }, (_, i) => i + 1);
  };

  return (
    <div className="h-full flex flex-col bg-card/30 border border-border/50 rounded-lg overflow-hidden shadow-glass">
      {/* Enhanced Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground tracking-tight">Code Editor</h2>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm" className="gap-2 hover:bg-secondary/80">
                  <Badge variant="secondary" className="px-2 py-1 text-xs font-medium">
                    {selectedLanguage.name}
                  </Badge>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-48 bg-popover/95 backdrop-blur-md border border-border/50 shadow-lg z-50"
              >
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.id}
                    onClick={() => handleLanguageChange(language)}
                    className={`cursor-pointer hover:bg-accent/50 transition-colors ${
                      selectedLanguage.id === language.id ? 'bg-accent/30 text-accent-foreground' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{language.name}</span>
                      <span className="text-xs text-muted-foreground">.{language.extension}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Badge variant="outline" className="px-2 py-1 text-xs">
              {code.split('\n').length} lines
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={copyCode} className="gap-2 hover:bg-accent/50">
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button variant="ghost" size="sm" onClick={resetCode} className="gap-2 hover:bg-accent/50">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <div className="w-px h-6 bg-border/50" />
          <Button variant="outline" size="sm" className="gap-2 hover:bg-accent/50">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button 
            onClick={handleRun}
            className="gap-2 bg-gradient-primary hover:opacity-90 transition-all duration-300 shadow-glass hover:shadow-lg px-6"
          >
            <Play className="h-4 w-4" />
            Run Code
          </Button>
        </div>
      </div>

      {/* File Tabs */}
      <div className="border-b border-border/30 bg-muted/20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="h-10 p-1 bg-transparent border-none rounded-none">
            <TabsTrigger 
              value={activeTab} 
              className="relative px-4 py-2 data-[state=active]:bg-card/80 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none border-b-2 border-transparent transition-all duration-200"
            >
              <FileText className="h-4 w-4 mr-2" />
              {activeTab}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Editor Controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/10 border-b border-border/20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Font size:</span>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 hover:bg-accent/50"
                onClick={() => setFontSize(Math.max(10, fontSize - 1))}
              >
                -
              </Button>
              <span className="w-6 text-center text-xs">{fontSize}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 hover:bg-accent/50"
                onClick={() => setFontSize(Math.min(20, fontSize + 1))}
              >
                +
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>UTF-8</span>
          <div className="w-px h-4 bg-border/50" />
          <span>{selectedLanguage.name}</span>
        </div>
      </div>

      {/* Code Input Area with Line Numbers */}
      <div className={`flex-1 flex transition-all duration-300 ${
        hasErrors 
          ? 'bg-gradient-to-br from-destructive/10 via-destructive/5 to-destructive/15 border-destructive/20' 
          : 'bg-gradient-to-br from-card/40 via-card/30 to-card/50'
      }`}>
        {/* Line Numbers */}
        <div 
          ref={lineNumbersRef}
          className="flex-shrink-0 w-12 bg-muted/20 border-r border-border/30 overflow-hidden"
          style={{ fontSize: `${fontSize}px` }}
        >
          <div className="p-2 pt-4 font-mono text-right text-muted-foreground/70 leading-6 select-none">
            {getLineNumbers().map((lineNum) => (
              <div key={lineNum} className="hover:text-muted-foreground transition-colors">
                {lineNum}
              </div>
            ))}
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onScroll={handleScroll}
            className={`w-full h-full p-4 pt-4 bg-transparent font-mono resize-none border-none outline-none placeholder:text-muted-foreground/50 transition-colors duration-300 ${
              hasErrors ? 'text-foreground' : 'text-foreground'
            }`}
            placeholder="// Start coding here..."
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: '1.5',
              tabSize: 2,
            }}
          />
          {hasErrors && (
            <div className="absolute top-2 right-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-destructive/20 border border-destructive/30 rounded text-xs text-destructive-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                Errors detected
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-t border-border/30 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Line {code.substring(0, code.indexOf(code.split('\n')[0]) + 1).split('\n').length}, Column 1</span>
          <span>Spaces: 2</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{selectedLanguage.name}</span>
          <span>UTF-8</span>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              hasErrors ? 'bg-destructive' : 'bg-success'
            }`} />
            <span className={hasErrors ? 'text-destructive' : ''}>{hasErrors ? 'Errors' : 'Ready'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};