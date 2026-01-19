import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, CheckCircle, AlertCircle, Volume2, Play, Loader2, Flag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ConversationItem {
  role: "interviewer" | "candidate";
  content: string;
}

interface Analytics {
  overallScore: number;
  metrics: {
    communication: number;
    technicalKnowledge: number;
    problemSolving: number;
    confidence: number;
    professionalism: number;
  };
  strengths: string[];
  improvements: string[];
  detailedFeedback: string;
  questionAnalysis: Array<{
    question: string;
    score: number;
    feedback: string;
  }>;
}

export default function VoiceInterviewSession() {
  const [stage, setStage] = useState<"setup" | "interview" | "results">("setup");
  const [interviewContext, setInterviewContext] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [isRecording, setIsRecording] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const { toast } = useToast();

  const playQuestion = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentQuestion);
      window.speechSynthesis.speak(utterance);
      toast({
        title: "Playing Question",
        description: "Listen carefully to the question",
      });
    }
  };

  const startInterview = async () => {
    if (interviewContext.trim().length < 20) {
      toast({
        title: "More details needed",
        description: "Please provide more context about the interview (minimum 20 characters)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("interview-ai", {
        body: {
          action: "generate_question",
          interviewContext,
          conversationHistory: [],
        },
      });

      if (error) throw error;

      setCurrentQuestion(data.question);
      setQuestionNumber(data.questionNumber || 1);
      setTotalQuestions(data.totalQuestions || 5);
      setConversationHistory([{ role: "interviewer", content: data.question }]);
      setStage("interview");
    } catch (error) {
      console.error("Error starting interview:", error);
      toast({
        title: "Error",
        description: "Failed to start interview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (currentAnswer.trim().length < 20) {
      toast({
        title: "Answer too short",
        description: "Please provide a more detailed answer",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setIsRecording(false);

    const newHistory = [
      ...conversationHistory,
      { role: "candidate" as const, content: currentAnswer },
    ];
    setConversationHistory(newHistory);

    try {
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke("interview-ai", {
        body: {
          action: "analyze_answer",
          interviewContext,
          conversationHistory: newHistory,
          userAnswer: currentAnswer,
        },
      });

      if (analysisError) throw analysisError;

      setCurrentAnswer("");

      if (!analysisData.shouldContinue || questionNumber >= totalQuestions) {
        await generateAnalytics(newHistory);
        return;
      }

      const { data: questionData, error: questionError } = await supabase.functions.invoke("interview-ai", {
        body: {
          action: "generate_question",
          interviewContext,
          conversationHistory: newHistory,
        },
      });

      if (questionError) throw questionError;

      setCurrentQuestion(questionData.question);
      setQuestionNumber(questionData.questionNumber || questionNumber + 1);
      setConversationHistory([
        ...newHistory,
        { role: "interviewer", content: questionData.question },
      ]);

      toast({
        title: "Answer submitted",
        description: "Moving to the next question",
      });
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast({
        title: "Error",
        description: "Failed to process answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const finishInterview = async () => {
    setIsLoading(true);
    await generateAnalytics(conversationHistory);
  };

  const generateAnalytics = async (history: ConversationItem[]) => {
    try {
      const { data, error } = await supabase.functions.invoke("interview-ai", {
        body: {
          action: "generate_analytics",
          interviewContext,
          conversationHistory: history,
        },
      });

      if (error) throw error;

      setAnalytics(data);
      setStage("results");
    } catch (error) {
      console.error("Error generating analytics:", error);
      toast({
        title: "Error",
        description: "Failed to generate analytics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (stage === "setup") {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Voice Interview Setup</h1>
              <p className="text-muted-foreground">
                Describe the interview context to get started
              </p>
            </div>

            <Card className="shadow-medium border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-primary" />
                  Interview Context
                </CardTitle>
                <CardDescription>
                  Provide details about the role, job description, or topics you want to practice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Example: Product Manager interview at a tech company. Focus on product strategy, user research, data-driven decision making, and stakeholder management..."
                  value={interviewContext}
                  onChange={(e) => setInterviewContext(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
                <div className="text-sm text-muted-foreground">
                  {interviewContext.length} characters
                </div>

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="font-semibold text-sm">Suggestions:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Include the job title and company type</li>
                    <li>Mention specific skills or technologies</li>
                    <li>Add any particular areas you want to focus on</li>
                    <li>Paste a job description for more relevant questions</li>
                  </ul>
                </div>

                <Button
                  className="w-full gradient-primary border-0 hover:opacity-90 transition-smooth"
                  size="lg"
                  onClick={startInterview}
                  disabled={isLoading || interviewContext.length < 20}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Preparing Interview...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Start Interview
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (stage === "results" && analytics) {
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
                    Overall Score: <span className="text-primary font-bold text-2xl">{analytics.overallScore}%</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-medium border-border">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>AI-powered analysis of your interview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(analytics.metrics).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-primary font-semibold">{value}%</span>
                    </div>
                    <Progress value={value} className="h-3" />
                  </div>
                ))}
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
                  {analytics.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
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
                  {analytics.improvements.map((improvement, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-medium border-border">
              <CardHeader>
                <CardTitle>Detailed Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{analytics.detailedFeedback}</p>
              </CardContent>
            </Card>

            {analytics.questionAnalysis && analytics.questionAnalysis.length > 0 && (
              <Card className="shadow-medium border-border">
                <CardHeader>
                  <CardTitle>Question-by-Question Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analytics.questionAnalysis.map((qa, idx) => (
                    <div key={idx} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <p className="font-medium mb-1">Q{idx + 1}: {qa.question}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-muted-foreground">Score:</span>
                        <span className="text-primary font-semibold">{qa.score}/10</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{qa.feedback}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

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
            <h1 className="text-3xl font-bold">Voice Interview</h1>
            <p className="text-muted-foreground">
              Question {questionNumber} of {totalQuestions}
            </p>
            <Progress value={(questionNumber / totalQuestions) * 100} className="h-2" />
          </div>

          <Card className="shadow-medium border-border">
            <CardHeader>
              <CardTitle>Interview Question</CardTitle>
              <CardDescription>Listen to the question and provide your answer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg text-center">
                <p className="text-lg font-medium mb-4">{currentQuestion}</p>
                <Button
                  variant="outline"
                  onClick={playQuestion}
                  className="transition-smooth"
                >
                  <Volume2 className="mr-2 h-4 w-4" />
                  Play Question
                </Button>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className={`w-32 h-32 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center ${isRecording ? 'animate-pulse' : ''}`}>
                    {isRecording ? (
                      <Mic className="h-16 w-16 text-white" />
                    ) : (
                      <MicOff className="h-16 w-16 text-white" />
                    )}
                  </div>
                  {isRecording && (
                    <div className="absolute -top-2 -right-2 flex items-center gap-1 bg-destructive text-white px-2 py-1 rounded-full text-sm">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      REC
                    </div>
                  )}
                </div>
              </div>

              <Textarea
                placeholder="Type your answer here..."
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                className="min-h-[150px] resize-none"
                disabled={isLoading}
              />

              <div className="space-y-3">
                <Button
                  className="w-full gradient-primary border-0 hover:opacity-90 transition-smooth"
                  size="lg"
                  onClick={submitAnswer}
                  disabled={isLoading || currentAnswer.length < 20}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Submit Answer
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-destructive text-destructive hover:bg-destructive hover:text-white"
                  onClick={finishInterview}
                  disabled={isLoading || conversationHistory.length < 2}
                >
                  <Flag className="mr-2 h-5 w-5" />
                  Finish Interview
                </Button>
              </div>

              <div className="text-sm text-muted-foreground space-y-2 bg-muted p-4 rounded-lg">
                <p className="font-semibold">Voice Interview Tips:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Find a quiet environment</li>
                  <li>Speak at a natural, moderate pace</li>
                  <li>Structure your answers with clear points</li>
                  <li>Take a brief pause before starting your answer</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
