import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Code, Database, Network, Cpu, Globe, CheckCircle, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const suggestedTopics = [
  { title: "Web Development", icon: Globe, description: "HTML, CSS, JavaScript, React" },
  { title: "Data Structures & Algorithms", icon: Code, description: "Arrays, Trees, Graphs, Sorting" },
  { title: "Database Management (DBMS)", icon: Database, description: "SQL, NoSQL, Normalization" },
  { title: "Computer Networks", icon: Network, description: "TCP/IP, OSI Model, Protocols" },
  { title: "Operating Systems", icon: Cpu, description: "Processes, Memory, File Systems" },
  { title: "Core CS Fundamentals", icon: CheckCircle, description: "OOP, Design Patterns" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

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

      if (error) throw error;
      if (data.error) throw new Error(data.error);
      if (!data.questions || !Array.isArray(data.questions)) throw new Error("Invalid response from AI");

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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto space-y-12">
          <motion.div 
            className="text-center space-y-4"
            initial="hidden" animate="visible" variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wider mb-2">
                <div className="w-8 h-px bg-primary" />
                Test Your Knowledge
                <div className="w-8 h-px bg-primary" />
              </div>
            </motion.div>
            <motion.h1 className="text-4xl md:text-5xl font-bold" variants={fadeInUp} transition={{ duration: 0.5 }}>
              AI-Powered MCQ Tests
            </motion.h1>
            <motion.p className="text-lg text-muted-foreground max-w-2xl mx-auto" variants={fadeInUp} transition={{ duration: 0.5 }}>
              Tell the AI what you want to be tested on, and it will generate adaptive questions on the spot
            </motion.p>
          </motion.div>

          {/* Custom Test Generator */}
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card className="shadow-large border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="inline-flex w-10 h-10 rounded-xl bg-primary/10 items-center justify-center">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  Generate Custom Test
                </CardTitle>
                <CardDescription className="text-base">
                  Describe what you want to be tested on, e.g., "15 questions on DBMS normalization and SQL joins"
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 relative">
                <div className="space-y-2">
                  <Label htmlFor="prompt">What do you want to be tested on?</Label>
                  <Textarea
                    id="prompt"
                    placeholder="e.g., 'React hooks and state management', 'DBMS normalization concepts', 'JavaScript async/await and promises'..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="min-h-[80px] transition-smooth focus:shadow-glow"
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
                      className="w-full gradient-primary border-0 hover:opacity-90 transition-smooth shadow-glow h-11"
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
          </motion.div>

          {/* Quick Topics */}
          <div className="space-y-6">
            <motion.h2 
              className="text-2xl font-bold text-center"
              initial="hidden" whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              Or choose a topic
            </motion.h2>
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
              initial="hidden" whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {suggestedTopics.map((topic) => {
                const Icon = topic.icon;
                return (
                  <motion.div key={topic.title} variants={fadeInUp} transition={{ duration: 0.4 }}>
                    <Card 
                      className="shadow-soft hover:shadow-large transition-smooth border-border cursor-pointer group relative overflow-hidden h-full"
                      onClick={() => !isGenerating && handleGenerateTest(topic.title)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-0 group-hover:opacity-[0.04] transition-smooth" />
                      <CardHeader className="pb-3 relative">
                        <div className="inline-flex w-12 h-12 rounded-2xl bg-primary/10 items-center justify-center mb-2 group-hover:scale-110 transition-bounce">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{topic.title}</CardTitle>
                        <CardDescription className="text-sm">{topic.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="relative">
                        <Button 
                          variant="outline"
                          className="w-full transition-smooth group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary"
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              Generate {numberOfQuestions} Questions
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
