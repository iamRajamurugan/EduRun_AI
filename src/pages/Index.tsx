import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Code, Brain, Zap, ArrowRight, CheckCircle, LogIn, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">EduRun</h1>
            </div>
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    Welcome back!
                  </span>
                  <Button variant="ghost" size="sm" onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 leading-tight">
            Write. Run. Learn.{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Debug Smarter.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Bridge the gap between code execution and understanding with AI-powered feedback. 
            Learn from errors, improve your debugging skills, and master programming concepts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button size="lg" className="gap-3 text-lg px-10 py-4 h-14 shadow-glass hover:shadow-ai transition-all duration-300" asChild>
              <Link to="/editor">
                <Play className="h-6 w-6" />
                Start Coding
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="gap-3 text-lg px-10 py-4 h-14 border-2 hover:bg-muted/20 transition-all duration-300" asChild>
              <Link to="/demo">
                <ArrowRight className="h-6 w-6" />
                View Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Everything you need to learn coding
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional-grade tools designed for educational excellence
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <Card className="group p-8 bg-gradient-glass border-border/50 shadow-glass backdrop-blur-sm hover:shadow-ai transition-all duration-500 hover:-translate-y-2">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="p-4 bg-primary/20 rounded-2xl group-hover:bg-primary/30 transition-all duration-300">
                <Code className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground">Smart Editor</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Write code with syntax highlighting, auto-completion, and real-time error detection. 
                  Support for JavaScript, Python, and more languages.
                </p>
              </div>
            </div>
          </Card>

          {/* Feature 2 */}
          <Card className="group p-8 bg-gradient-glass border-border/50 shadow-glass backdrop-blur-sm hover:shadow-ai transition-all duration-500 hover:-translate-y-2">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="p-4 bg-ai-accent/20 rounded-2xl group-hover:bg-ai-accent/30 transition-all duration-300">
                <Brain className="h-8 w-8 text-ai-accent" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground">AI Feedback</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get instant explanations for errors, suggestions for improvements, and learn 
                  debugging techniques from our AI teaching assistant.
                </p>
              </div>
            </div>
          </Card>

          {/* Feature 3 */}
          <Card className="group p-8 bg-gradient-glass border-border/50 shadow-glass backdrop-blur-sm hover:shadow-ai transition-all duration-500 hover:-translate-y-2">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="p-4 bg-success/20 rounded-2xl group-hover:bg-success/30 transition-all duration-300">
                <Zap className="h-8 w-8 text-success" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground">Instant Execution</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Run your code instantly and see results in real-time. Safe execution environment 
                  with detailed output and performance metrics.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Why choose EduRun?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Designed specifically for learners with proven educational methodologies
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 p-2 bg-success/20 rounded-xl group-hover:bg-success/30 transition-all duration-300">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">Learn from Mistakes</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Transform errors into learning opportunities with detailed explanations and fix suggestions.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 p-2 bg-success/20 rounded-xl group-hover:bg-success/30 transition-all duration-300">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">Build Debugging Skills</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Develop systematic debugging approaches with guided practice and real-time feedback.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 p-2 bg-success/20 rounded-xl group-hover:bg-success/30 transition-all duration-300">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">Safe Environment</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Practice coding in a secure sandbox with no setup required. Just open and start coding.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 p-2 bg-success/20 rounded-xl group-hover:bg-success/30 transition-all duration-300">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">Instant Feedback</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Get immediate insights on code quality, performance, and best practices.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 p-2 bg-success/20 rounded-xl group-hover:bg-success/30 transition-all duration-300">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">Track Progress</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Monitor your coding journey with execution history and improvement tracking.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 p-2 bg-success/20 rounded-xl group-hover:bg-success/30 transition-all duration-300">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">Student-Friendly</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Designed specifically for learners with intuitive interface and educational focus.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to start your coding journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            Join thousands of students who are already learning to code smarter with EduRun.
          </p>
          <Button size="lg" className="gap-3 text-lg px-10 py-4 h-14 shadow-glass hover:shadow-ai transition-all duration-300" asChild>
            <Link to="/editor">
              <Play className="h-6 w-6" />
              Start Coding Now
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Code className="h-4 w-4" />
            <span>EduRun - Smart Code Execution Platform</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
