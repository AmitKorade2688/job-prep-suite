import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Code, Database, Network, Cpu, Globe, CheckCircle, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const suggestedTopics = [
  { title: "Web Development", icon: Globe, description: "HTML, CSS, JavaScript, React" },
  { title: "Data Structures & Algorithms", icon: Code, description: "Arrays, Trees, Graphs, Sorting" },
  { title: "Database Management (DBMS)", icon: Database, description: "SQL, NoSQL, Normalization" },
  { title: "Computer Networks", icon: Network, description: "TCP/IP, OSI Model, Protocols" },
  { title: "Operating Systems", icon: Cpu, description: "Processes, Memory, File Systems" },
  { title: "Core CS Fundamentals", icon: CheckCircle, description: "OOP, Design Patterns" },
];

export default function MCQTests() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customPrompt, setCustomPrompt] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateTest = async (topic?: string) => {
    const testTopic = topic || customPrompt.trim();
    
    if (!testTopic) {
      toast({
        title: "Enter a topic",
        description: "Please enter what you want to be tested on.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-mcq', {
        body: { 
          topic: testTopic, 
          numberOfQuestions: Math.min(Math.max(numberOfQuestions, 5), 30) 
        }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error("Invalid response from AI");
      }

      // Store questions and algorithm info in sessionStorage and navigate
      sessionStorage.setItem('mcq-questions', JSON.stringify(data.questions));
      sessionStorage.setItem('mcq-topic', testTopic);
      if (data.algorithmInfo) {
        sessionStorage.setItem('mcq-algorithm', JSON.stringify(data.algorithmInfo));
      }
      navigate('/mcq-test-session');

    } catch (error) {
      console.error('Error generating test:', error);
      toast({
        title: "Failed to generate test",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">AI-Powered MCQ Tests</h1>
            <p className="text-xl text-muted-foreground">
              Tell the AI what you want to be tested on, and it will generate questions on the spot
            </p>
          </div>

          {/* Custom Test Generator */}
          <Card className="shadow-large border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Generate Custom Test
              </CardTitle>
              <CardDescription>
                Describe what you want to be tested on, e.g., "15 questions on DBMS normalization and SQL joins"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">What do you want to be tested on?</Label>
                <Textarea
                  id="prompt"
                  placeholder="e.g., 'React hooks and state management', 'DBMS normalization concepts', 'JavaScript async/await and promises'..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[80px]"
                  disabled={isGenerating}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="space-y-2 sm:w-48">
                  <Label htmlFor="questions">Number of Questions</Label>
                  <Input
                    id="questions"
                    type="number"
                    min={5}
                    max={30}
                    value={numberOfQuestions}
                    onChange={(e) => setNumberOfQuestions(parseInt(e.target.value) || 10)}
                    disabled={isGenerating}
                  />
                </div>
                <div className="flex-1 flex items-end">
                  <Button 
                    className="w-full gradient-primary border-0 hover:opacity-90 transition-smooth"
                    onClick={() => handleGenerateTest()}
                    disabled={isGenerating || !customPrompt.trim()}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Questions...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Test
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Topics */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center">Or choose a topic</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestedTopics.map((topic) => {
                const Icon = topic.icon;
                return (
                  <Card 
                    key={topic.title} 
                    className="shadow-soft hover:shadow-medium transition-smooth border-border cursor-pointer group"
                    onClick={() => !isGenerating && handleGenerateTest(topic.title)}
                  >
                    <CardHeader className="pb-3">
                      <Icon className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-smooth" />
                      <CardTitle className="text-lg">{topic.title}</CardTitle>
                      <CardDescription className="text-sm">{topic.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        variant="outline"
                        className="w-full transition-smooth group-hover:bg-primary group-hover:text-primary-foreground"
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          `Generate ${numberOfQuestions} Questions`
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
