import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Play, 
  Brain, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Terminal,
  FileText,
  Settings,
  Save
} from "lucide-react";
import { Link } from "react-router-dom";

interface DemoStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
  highlight?: string;
}

const demoSteps: DemoStep[] = [
  {
    id: 1,
    title: "Welcome to EduRun",
    description: "Learn how to write, run, and debug code with AI assistance",
    icon: Code,
    content: (
      <div className="space-y-4">
        <div className="bg-gradient-primary/10 border border-primary/20 rounded-lg p-6 text-center">
          <Code className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Smart Code Learning Platform</h3>
          <p className="text-muted-foreground">
            EduRun combines code execution with AI-powered feedback to help you learn programming more effectively.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-card rounded-lg border">
            <Terminal className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="font-medium">Write Code</p>
          </div>
          <div className="text-center p-4 bg-card rounded-lg border">
            <Play className="h-8 w-8 text-success mx-auto mb-2" />
            <p className="font-medium">Execute</p>
          </div>
          <div className="text-center p-4 bg-card rounded-lg border">
            <Brain className="h-8 w-8 text-ai-accent mx-auto mb-2" />
            <p className="font-medium">Learn</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Code Editor Interface",
    description: "Familiarize yourself with the powerful code editor",
    icon: FileText,
    highlight: "editor",
    content: (
      <div className="space-y-4">
        <Card className="p-4 bg-card border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Code Editor</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm">
                <Play className="h-4 w-4 mr-2" />
                Run Code
              </Button>
            </div>
          </div>
          <div className="bg-muted/50 p-4 rounded-md font-mono text-sm">
            <div className="text-muted-foreground mb-2">// Welcome to EduRun!</div>
            <div className="text-blue-400">console</div>
            <span className="text-muted-foreground">.</span>
            <span className="text-yellow-400">log</span>
            <span className="text-muted-foreground">(</span>
            <span className="text-green-400">"Hello, World!"</span>
            <span className="text-muted-foreground">);</span>
          </div>
        </Card>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Badge variant="secondary">Features</Badge>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Syntax highlighting</li>
              <li>• Auto-completion</li>
              <li>• Error detection</li>
              <li>• Multiple languages</li>
            </ul>
          </div>
          <div className="space-y-2">
            <Badge variant="secondary">Actions</Badge>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Save your work</li>
              <li>• Adjust settings</li>
              <li>• Run code instantly</li>
              <li>• View results</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Code Execution",
    description: "See how your code runs in real-time with detailed output",
    icon: Play,
    highlight: "output",
    content: (
      <div className="space-y-4">
        <Card className="p-4 bg-card border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Output Panel</h3>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              ✓ Success
            </Badge>
          </div>
          <div className="bg-muted/50 p-4 rounded-md">
            <div className="font-mono text-sm space-y-2">
              <div className="text-muted-foreground">$ Running JavaScript code...</div>
              <div className="text-foreground">Hello, World!</div>
              <div className="text-success">✓ Execution completed successfully</div>
              <div className="text-muted-foreground text-xs">Execution time: 12ms</div>
            </div>
          </div>
        </Card>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-success/10 rounded-lg border border-success/20">
            <CheckCircle className="h-6 w-6 text-success mx-auto mb-2" />
            <p className="text-sm font-medium">Clean Output</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <Terminal className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Console Logs</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg border">
            <Settings className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium">Performance</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "AI-Powered Feedback",
    description: "Get intelligent insights and debugging help from AI",
    icon: Brain,
    highlight: "ai",
    content: (
      <div className="space-y-4">
        <Card className="p-4 bg-gradient-to-br from-ai-accent/10 to-primary/10 border border-ai-accent/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-ai-accent/20 rounded-lg">
              <Brain className="h-5 w-5 text-ai-accent" />
            </div>
            <h3 className="text-lg font-semibold">AI Teaching Assistant</h3>
          </div>
          <div className="space-y-3">
            <div className="bg-card/80 p-3 rounded-md">
              <p className="text-sm font-medium text-ai-accent mb-1">Code Analysis</p>
              <p className="text-sm text-muted-foreground">
                Your code executed successfully! The console.log statement properly outputs "Hello, World!" to the console.
              </p>
            </div>
            <div className="bg-card/80 p-3 rounded-md">
              <p className="text-sm font-medium text-primary mb-1">Learning Tip</p>
              <p className="text-sm text-muted-foreground">
                Try experimenting with variables: <code className="bg-muted px-1 rounded">let name = "Your Name"</code>
              </p>
            </div>
          </div>
        </Card>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Badge className="bg-ai-accent/20 text-ai-accent border-ai-accent/30">AI Features</Badge>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Error explanations</li>
              <li>• Code suggestions</li>
              <li>• Best practices</li>
              <li>• Learning guidance</li>
            </ul>
          </div>
          <div className="space-y-2">
            <Badge className="bg-primary/20 text-primary border-primary/30">Benefits</Badge>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Faster debugging</li>
              <li>• Better understanding</li>
              <li>• Skill improvement</li>
              <li>• Instant help</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "Complete Workflow",
    description: "Put it all together - the full development cycle",
    icon: CheckCircle,
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-4 p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">1</div>
              <span className="text-sm">Write</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center text-success-foreground text-sm font-bold">2</div>
              <span className="text-sm">Run</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-ai-accent rounded-full flex items-center justify-center text-ai-accent-foreground text-sm font-bold">3</div>
              <span className="text-sm">Learn</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <Code className="h-8 w-8 text-primary mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Write Code</h4>
            <p className="text-sm text-muted-foreground">Use our smart editor with syntax highlighting and auto-completion</p>
          </Card>
          
          <Card className="p-4 text-center">
            <Play className="h-8 w-8 text-success mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Execute & Debug</h4>
            <p className="text-sm text-muted-foreground">Run your code instantly and see detailed execution results</p>
          </Card>
          
          <Card className="p-4 text-center">
            <Brain className="h-8 w-8 text-ai-accent mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Learn with AI</h4>
            <p className="text-sm text-muted-foreground">Get intelligent feedback and improve your programming skills</p>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-lg font-medium mb-4">Ready to start your coding journey?</p>
          <Button size="lg" className="gap-2" asChild>
            <Link to="/editor">
              <Play className="h-5 w-5" />
              Try EduRun Now
            </Link>
          </Button>
        </div>
      </div>
    )
  }
];

export default function Demo() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const currentStepData = demoSteps[currentStep];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">EduRun Demo</h1>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="bg-card/30 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep + 1} of {demoSteps.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(((currentStep + 1) / demoSteps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
            />
          </div>
          
          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {demoSteps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => goToStep(index)}
                className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-all duration-200 ${
                  index === currentStep 
                    ? 'bg-primary/10 text-primary' 
                    : index < currentStep 
                      ? 'text-success hover:bg-success/10' 
                      : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  index === currentStep
                    ? 'border-primary bg-primary text-primary-foreground'
                    : index < currentStep
                      ? 'border-success bg-success text-success-foreground'
                      : 'border-muted-foreground/30 bg-background'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span className="text-xs font-medium hidden sm:block">{step.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Current Step Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <currentStepData.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold text-foreground">{currentStepData.title}</h1>
                <p className="text-lg text-muted-foreground">{currentStepData.description}</p>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {currentStepData.content}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={prevStep} 
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {demoSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToStep(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep 
                      ? 'bg-primary w-6' 
                      : index < currentStep 
                        ? 'bg-success' 
                        : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>

            {currentStep === demoSteps.length - 1 ? (
              <Button asChild className="gap-2">
                <Link to="/editor">
                  <Play className="h-4 w-4" />
                  Start Coding
                </Link>
              </Button>
            ) : (
              <Button onClick={nextStep} className="gap-2">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}