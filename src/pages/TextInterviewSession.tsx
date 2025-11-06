import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const interviewQuestions = [
  "Why are you interested in this position?",
  "What are your key technical skills and how have you applied them?",
  "Describe a time when you failed and what you learned from it.",
  "How do you stay updated with industry trends and technologies?",
  "What questions do you have for us about the role or company?"
];

export default function TextInterviewSession() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const submitAnswer = () => {
    if (currentAnswer.trim().length < 50) {
      toast({
        title: "Answer too short",
        description: "Please provide a more detailed answer (minimum 50 characters)",
        variant: "destructive",
      });
      return;
    }

    setAnswers([...answers, currentAnswer]);
    setCurrentAnswer("");
    
    toast({
      title: "Answer Submitted",
      description: "Moving to the next question",
    });

    if (currentQuestion < interviewQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 500);
    } else {
      setTimeout(() => setShowResults(true), 500);
    }
  };

  if (showResults) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="shadow-large border-border">
              <CardContent className="pt-8">
                <div className="text-center space-y-4">
                  <CheckCircle className="h-16 w-16 mx-auto text-primary" />
                  <h2 className="text-3xl font-bold">Interview Complete!</h2>
                  <p className="text-muted-foreground">
                    Excellent work! Here's your written communication analysis
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-medium border-border">
              <CardHeader>
                <CardTitle>Writing Analysis</CardTitle>
                <CardDescription>AI analysis of your written responses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Grammar & Spelling</span>
                    <span className="text-primary font-semibold">95%</span>
                  </div>
                  <Progress value={95} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Answer Structure</span>
                    <span className="text-primary font-semibold">88%</span>
                  </div>
                  <Progress value={88} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Relevance</span>
                    <span className="text-primary font-semibold">90%</span>
                  </div>
                  <Progress value={90} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Professional Tone</span>
                    <span className="text-primary font-semibold">92%</span>
                  </div>
                  <Progress value={92} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-medium border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Excellent grammar and professional writing style</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Well-structured responses with clear points</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Good use of specific examples to support answers</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-medium border-border border-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-secondary" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>Consider adding more quantifiable achievements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>Use more action verbs to make answers more impactful</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>Keep answers more concise while maintaining detail</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Button 
              className="w-full gradient-primary border-0 hover:opacity-90 transition-smooth"
              onClick={() => window.location.href = '/mock-interview'}
            >
              Start New Interview
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Text Interview</h1>
            <p className="text-muted-foreground">
              Question {currentQuestion + 1} of {interviewQuestions.length}
            </p>
            <Progress value={((currentQuestion) / interviewQuestions.length) * 100} className="h-2" />
          </div>

          <Card className="shadow-medium border-border">
            <CardHeader>
              <CardTitle>Interview Question</CardTitle>
              <CardDescription>Type your detailed answer below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
                <p className="text-lg font-medium">{interviewQuestions[currentQuestion]}</p>
              </div>

              <div className="space-y-4">
                <Textarea
                  placeholder="Type your answer here... (minimum 50 characters)"
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{currentAnswer.length} characters</span>
                  <span>{currentAnswer.trim().split(/\s+/).filter(word => word.length > 0).length} words</span>
                </div>
              </div>

              <Button
                className="w-full gradient-primary border-0 hover:opacity-90 transition-smooth"
                size="lg"
                onClick={submitAnswer}
                disabled={currentAnswer.trim().length < 50}
              >
                <Send className="mr-2 h-5 w-5" />
                Submit Answer
              </Button>

              <div className="text-sm text-muted-foreground space-y-2 bg-muted p-4 rounded-lg">
                <p className="font-semibold">Writing Tips:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Use the STAR method (Situation, Task, Action, Result)</li>
                  <li>Be specific with examples and achievements</li>
                  <li>Maintain a professional tone throughout</li>
                  <li>Proofread before submitting</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
