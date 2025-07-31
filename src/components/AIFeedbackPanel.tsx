import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Lightbulb, BookOpen, TrendingUp, Sparkles, MessageSquare } from "lucide-react";

interface AIFeedbackProps {
  code: string;
  errors: string[];
  hasExecuted: boolean;
}

interface Suggestion {
  type: "improvement" | "error-fix" | "learning";
  title: string;
  description: string;
  codeExample?: string;
}

const GEMINI_API_KEY = "AIzaSyDEboPrzph5AlS84SQsZNRcGNGsRwHkaGo";

async function getAIFeedback(code: string, errors: string[]): Promise<Suggestion[]> {
  try {
    const systemPrompt = `You are an encouraging JavaScript coding mentor. Your goal is to guide students toward solutions without giving them complete answers. 

IMPORTANT GUIDELINES:
- NEVER provide complete working code solutions
- Instead, give hints, point out where to look, and suggest what concepts to explore
- Ask leading questions that help students think through problems
- Encourage experimentation and learning from mistakes
- Focus on understanding WHY something works, not just HOW
- Point students toward the right direction with small nudges
- Celebrate small victories and progress
- Make learning feel achievable and fun

When analyzing code and errors:
1. Point out WHAT TYPE of error it is and WHERE to look
2. Suggest WHICH concepts they should review or practice
3. Give small hints about the RIGHT DIRECTION to explore
4. Encourage them to try different approaches
5. Explain the THINKING PROCESS behind problem-solving

Format your response as a JSON array of suggestions with this structure:
[{"type": "error-fix" | "improvement" | "learning", "title": "Clear title", "description": "Encouraging guidance without full solution", "codeExample": "Small hint or partial example (not complete solution)"}]

Keep descriptions conversational and supportive. Use "you can try", "consider exploring", "what if you", etc.`;

    const userPrompt = `Analyze this JavaScript code and any errors. Provide encouraging guidance that helps the student learn, not complete solutions.

Code:
\`\`\`javascript
${code}
\`\`\`

${errors.length > 0 ? `Errors encountered:\n${errors.join('\n')}` : 'No errors detected.'}

Remember: Guide them toward solutions with hints and questions, don't solve it for them!`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\n${userPrompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        }
      })
    });

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Extract JSON from AI response
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const suggestions = JSON.parse(jsonMatch[0]);
      return suggestions.slice(0, 4); // Limit to 4 suggestions
    }

    // Fallback if JSON parsing fails
    return [{
      type: "learning",
      title: "Keep Exploring!",
      description: "The AI is here to help guide your learning journey. Try running your code and see what happens!",
      codeExample: "// Remember: Learning comes from trying things out!\nconsole.log('Keep coding!');"
    }];

  } catch (error) {
    console.error('AI feedback error:', error);
    // Fallback suggestions
    return [{
      type: "learning",
      title: "AI Assistant Offline",
      description: "Don't worry! Use this as an opportunity to debug on your own. Look at error messages carefully and try to understand what they're telling you.",
      codeExample: "// Debugging tip:\nconsole.log('Check your variables:', yourVariable);"
    }];
  }
}

export const AIFeedbackPanel = ({ code, errors, hasExecuted }: AIFeedbackProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (hasExecuted) {
      setIsAnalyzing(true);
      
      getAIFeedback(code, errors)
        .then(aiSuggestions => {
          setSuggestions(aiSuggestions);
          setIsAnalyzing(false);
        })
        .catch(error => {
          console.error('Failed to get AI feedback:', error);
          setIsAnalyzing(false);
        });
    }
  }, [code, errors, hasExecuted]);

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "error-fix": return <MessageSquare className="h-4 w-4 text-destructive" />;
      case "improvement": return <TrendingUp className="h-4 w-4 text-warning" />;
      case "learning": return <Lightbulb className="h-4 w-4 text-ai-accent" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case "error-fix": return "destructive";
      case "improvement": return "default";
      case "learning": return "secondary";
      default: return "default";
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* AI Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-ai/10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bot className="h-5 w-5 text-ai-accent" />
              {isAnalyzing && (
                <Sparkles className="h-3 w-3 text-ai-accent absolute -top-1 -right-1 animate-pulse" />
              )}
            </div>
            <h2 className="text-lg font-semibold text-foreground">AI Assistant</h2>
          </div>
          {isAnalyzing && (
            <Badge variant="secondary" className="gap-1 animate-pulse">
              <div className="h-2 w-2 bg-ai-accent rounded-full animate-ping" />
              Analyzing...
            </Badge>
          )}
        </div>
      </div>

      {/* AI Content */}
      <div className="flex-1 p-4">
        <Tabs defaultValue="suggestions" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="suggestions" className="flex items-center justify-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span>Suggestions</span>
              {suggestions.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                  {suggestions.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center justify-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Learning</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions" className="flex-1 mt-4">
            <Card className="h-full bg-gradient-glass border-border/50 shadow-ai backdrop-blur-sm">
              <div className="p-4 h-full overflow-auto">
                {suggestions.length === 0 && !isAnalyzing ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>AI suggestions will appear here</p>
                    <p className="text-sm">Run your code to get personalized feedback</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {suggestions.map((suggestion, index) => (
                      <div 
                        key={index}
                        className="p-4 bg-card/50 border border-border/50 rounded-lg hover:bg-card/70 transition-all duration-300"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getSuggestionIcon(suggestion.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="font-semibold text-foreground">{suggestion.title}</h3>
                              <Badge variant={getSuggestionColor(suggestion.type)} className="text-xs">
                                {suggestion.type.replace("-", " ")}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{suggestion.description}</p>
                            {suggestion.codeExample && (
                              <div className="bg-muted/30 p-3 rounded-md border border-border/30 overflow-x-auto">
                                <pre className="text-xs font-mono text-foreground whitespace-pre-wrap leading-relaxed">
                                  {suggestion.codeExample}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="learning" className="flex-1 mt-4">
            <Card className="h-full bg-gradient-glass border-border/50 shadow-ai backdrop-blur-sm">
              <div className="p-4 h-full overflow-auto">
                <div className="space-y-4">
                  <div className="p-4 bg-ai-accent/10 border border-ai-accent/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <BookOpen className="h-5 w-5 text-ai-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-2">JavaScript Fundamentals</h3>
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          Master the basics: variables, functions, and control structures form the foundation of all programming.
                        </p>
                        <div className="bg-muted/30 p-3 rounded-md overflow-x-auto">
                          <pre className="text-xs font-mono text-foreground leading-relaxed">
{`// Variables store data
let message = "Hello, World!";

// Functions perform actions
function greet(name) {
  return "Hello, " + name;
}

// Control structures make decisions
if (message.length > 0) {
  console.log(greet("Student"));
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <TrendingUp className="h-5 w-5 text-success" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-2">Debugging Best Practices</h3>
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          Learn to read error messages, use console.log strategically, and break problems into smaller parts.
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-success mt-1">•</span>
                            <span>Read error messages carefully - they tell you exactly what's wrong</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-success mt-1">•</span>
                            <span>Use console.log to check variable values</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-success mt-1">•</span>
                            <span>Test small pieces of code one at a time</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-success mt-1">•</span>
                            <span>Check for typos in variable and function names</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};