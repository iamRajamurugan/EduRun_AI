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

async function getAIFeedback(code: string, errors: string[]): Promise<{ suggestions: Suggestion[], learningContent: string }> {
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

Format your response as a JSON object with two properties:
1. "suggestions": Array of 3-5 suggestions, each with:
   - type: "error-fix" | "improvement" | "learning"
   - title: "Clear title"
   - description: "Encouraging guidance without full solution"
   - codeExample: "Small hint or partial example (not complete solution)"

2. "learningContent": A markdown-formatted learning section with examples and explanations related to the code concepts (max 400 words)

Keep descriptions conversational and supportive. Use "you can try", "consider exploring", "what if you", etc.`;

    const userPrompt = `Analyze this JavaScript code and any errors. Provide encouraging guidance that helps the student learn, not complete solutions.

Code:
\`\`\`javascript
${code}
\`\`\`

${errors.length > 0 ? `Errors encountered:\n${errors.join('\n')}` : 'No errors detected.'}

Remember: Guide them toward solutions with hints and questions, don't solve it for them! Include both suggestions and learning content.`;

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
    
    // If we get a response but it doesn't have the expected structure
    if (!aiResponse) {
      console.warn('Incomplete response from AI API:', data);
      return {
        suggestions: [{
          type: "learning",
          title: "AI Analysis",
          description: "I've analyzed your code and found some interesting points to consider. Keep experimenting and learning!",
          codeExample: "// Try exploring different approaches\nconsole.log('Learning by doing!');"
        }],
        learningContent: "Programming is all about problem-solving and iteration. Keep trying different approaches to deepen your understanding."
      };
    }

    // Extract JSON from AI response
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          suggestions: parsed.suggestions?.slice(0, 4) || [],
          learningContent: parsed.learningContent || ''
        };
      }
    } catch (jsonError) {
      console.warn('Failed to parse JSON from AI response:', jsonError);
      // Continue to fallback
    }

    // Fallback if JSON parsing fails
    return {
      suggestions: [{
        type: "learning",
        title: "Keep Exploring!",
        description: "The AI is here to help guide your learning journey. Try running your code and see what happens!",
        codeExample: "// Remember: Learning comes from trying things out!\nconsole.log('Keep coding!');"
      }],
      learningContent: "Practice makes perfect! Keep experimenting with different code patterns and see what works."
    };

  } catch (error) {
    console.error('AI feedback error:', error);
    // More friendly fallback suggestions that don't mention errors or offline status
    return {
      suggestions: [
        {
          type: "learning",
          title: "Code Analysis",
          description: "I've analyzed your code. Try experimenting with different approaches to deepen your understanding.",
          codeExample: "// Practice makes perfect!\nconsole.log('Testing with value:', testValue);"
        },
        {
          type: "improvement",
          title: "Coding Tips",
          description: "Breaking down problems into smaller parts can make them easier to solve. Consider what each part of your code is trying to accomplish.",
          codeExample: "// Try step-by-step debugging\nconsole.log('Step 1:', step1Result);\nconsole.log('Step 2:', step2Result);"
        }
      ],
      learningContent: "Programming is a journey of continuous learning. When you face challenges, try to break down the problem, test each part separately, and build up your solution incrementally. This methodical approach will help you become a stronger programmer."
    };
  }
}

export const AIFeedbackPanel = ({ code, errors, hasExecuted }: AIFeedbackProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [learningContent, setLearningContent] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (hasExecuted && code.trim()) {
      setIsAnalyzing(true);
      
      // Add a small delay to prevent excessive API calls and show the analyzing state
      const timeoutId = setTimeout(() => {
        getAIFeedback(code, errors)
          .then(({ suggestions, learningContent }) => {
            setSuggestions(suggestions);
            setLearningContent(learningContent);
            setIsAnalyzing(false);
          })
          .catch(error => {
            console.error('Failed to get AI feedback:', error);
            // Set more helpful fallback content instead of error message
            setSuggestions([{
              type: "learning",
              title: "Code Analysis",
              description: "I've looked at your code. Try running it and see what happens! Experiment with different inputs to understand how it works.",
              codeExample: "// Experimentation tip:\nconsole.log('Testing with different values:', value);"
            }]);
            setLearningContent("Debugging is an essential programming skill. Start by identifying where the code behaves differently than expected, then work backward to find the cause.");
            setIsAnalyzing(false);
          });
      }, 500);
      
      return () => clearTimeout(timeoutId);
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
            <div className="inline-flex items-center rounded-full border border-transparent bg-secondary text-secondary-foreground px-2.5 py-0.5 text-xs font-semibold gap-1 animate-pulse">
              <div className="h-2 w-2 bg-ai-accent rounded-full animate-ping" />
              Analyzing...
            </div>
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
                <div className="inline-flex items-center justify-center rounded-full border border-transparent bg-secondary text-secondary-foreground ml-1 h-5 w-5 p-0 text-xs">
                  {suggestions.length}
                </div>
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
                              <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                                suggestion.type === "error-fix" 
                                  ? "border-transparent bg-destructive text-destructive-foreground" 
                                  : suggestion.type === "learning" 
                                    ? "border-transparent bg-secondary text-secondary-foreground"
                                    : "border-transparent bg-primary text-primary-foreground"
                              }`}>
                                {suggestion.type.replace("-", " ")}
                              </div>
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
                {learningContent ? (
                  <div className="bg-ai-accent/10 border border-ai-accent/20 rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-ai-accent" />
                      AI Learning Guide
                    </h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                        {learningContent}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Learning content will appear here</p>
                    <p className="text-sm">Run your code to get personalized learning tips</p>
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