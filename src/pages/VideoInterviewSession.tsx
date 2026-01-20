import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Video, Mic, MicOff, VideoOff, CheckCircle, AlertCircle, Play, Loader2, Flag, Volume2 } from "lucide-react";
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

export default function VideoInterviewSession() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<"setup" | "interview" | "results">("setup");
  const [interviewContext, setInterviewContext] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [conversationHistory, setConversationHistory] = useState<ConversationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (stage === "interview") {
      startCamera();
    }
    return () => {
      stopCamera();
      window.speechSynthesis.cancel();
    };
  }, [stage]);

  const speakQuestion = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
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
          totalQuestions: numberOfQuestions,
          isFirstQuestion: true,
        },
      });

      if (error) throw error;

      setCurrentQuestion(data.question);
      setQuestionNumber(1);
      setConversationHistory([{ role: "interviewer", content: data.question }]);
      setStage("interview");
      
      // Speak the first question
      setTimeout(() => speakQuestion(data.question), 500);
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
    if (currentAnswer.trim().length < 10) {
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
      // First analyze the answer
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

      // Check if we should continue or end
      if (questionNumber >= numberOfQuestions) {
        await generateAnalytics(newHistory);
        return;
      }

      // Generate next question
      const { data: questionData, error: questionError } = await supabase.functions.invoke("interview-ai", {
        body: {
          action: "generate_question",
          interviewContext,
          conversationHistory: newHistory,
          totalQuestions: numberOfQuestions,
          currentQuestionNumber: questionNumber + 1,
        },
      });

      if (questionError) throw questionError;

      setCurrentQuestion(questionData.question);
      setQuestionNumber(questionNumber + 1);
      setConversationHistory([
        ...newHistory,
        { role: "interviewer", content: questionData.question },
      ]);

      // Speak the next question
      speakQuestion(questionData.question);

      toast({
        title: "Answer submitted",
        description: `Moving to question ${questionNumber + 1} of ${numberOfQuestions}`,
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
    window.speechSynthesis.cancel();
    stopCamera();
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
      stopCamera();
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
              <h1 className="text-3xl font-bold">Video Interview Setup</h1>
              <p className="text-muted-foreground">
                Set up your AI-powered video interview
              </p>
            </div>

            <Card className="shadow-medium border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  Interview Details
                </CardTitle>
                <CardDescription>
                  Provide the job description and interview preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="context">Job Description / Interview Context</Label>
                  <Textarea
                    id="context"
                    placeholder="Example: Software Engineer interview for a fintech startup. Focus on React, Node.js, system design, and behavioral questions. The role requires 3+ years of experience..."
                    value={interviewContext}
                    onChange={(e) => setInterviewContext(e.target.value)}
                    className="min-h-[180px] resize-none"
                  />
                  <div className="text-sm text-muted-foreground">
                    {interviewContext.length} characters (minimum 20)
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numQuestions">Number of Questions</Label>
                  <Input
                    id="numQuestions"
                    type="number"
                    min={3}
                    max={15}
                    value={numberOfQuestions}
                    onChange={(e) => setNumberOfQuestions(Math.min(15, Math.max(3, parseInt(e.target.value) || 5)))}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Choose between 3-15 questions
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="font-semibold text-sm">How it works:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>AI will ask you questions verbally (text-to-speech)</li>
                    <li>Interview starts with "Tell me about yourself"</li>
                    <li>Answer each question on camera, then type your response</li>
                    <li>AI analyzes your answers and provides detailed feedback</li>
                    <li>You can finish the interview anytime</li>
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
              onClick={() => navigate('/mock-interview')}
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
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Video Interview</h1>
            <p className="text-muted-foreground">
              Question {questionNumber} of {numberOfQuestions}
            </p>
            <Progress value={(questionNumber / numberOfQuestions) * 100} className="h-2" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="shadow-medium border-border">
              <CardHeader>
                <CardTitle>Your Video</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                  {!videoEnabled && (
                    <div className="absolute inset-0 bg-muted flex items-center justify-center">
                      <VideoOff className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  {isRecording && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-destructive text-white px-3 py-1 rounded-full">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      Recording
                    </div>
                  )}
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleVideo}
                    className={!videoEnabled ? "bg-destructive text-white" : ""}
                  >
                    {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleAudio}
                    className={!audioEnabled ? "bg-destructive text-white" : ""}
                  >
                    {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => speakQuestion(currentQuestion)}
                    disabled={isSpeaking}
                    title="Replay question"
                  >
                    <Volume2 className={`h-4 w-4 ${isSpeaking ? 'animate-pulse text-primary' : ''}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-medium border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  AI Interviewer
                  {isSpeaking && (
                    <span className="text-sm font-normal text-primary animate-pulse flex items-center gap-1">
                      <Volume2 className="h-4 w-4" /> Speaking...
                    </span>
                  )}
                </CardTitle>
                <CardDescription>Listen to the question and provide your answer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="min-h-[100px] bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg">
                  <p className="text-lg font-medium">{currentQuestion}</p>
                </div>

                <Textarea
                  placeholder="Type your answer here after responding on video..."
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  className="min-h-[120px] resize-none"
                  disabled={isLoading}
                />

                <div className="space-y-3">
                  <Button
                    className="w-full gradient-primary border-0 hover:opacity-90 transition-smooth"
                    size="lg"
                    onClick={submitAnswer}
                    disabled={isLoading || currentAnswer.length < 10}
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

                <div className="text-sm text-muted-foreground space-y-2">
                  <p className="font-semibold">Tips:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Maintain eye contact with the camera</li>
                    <li>Speak clearly and at a moderate pace</li>
                    <li>Use the STAR method for behavioral questions</li>
                    <li>Click the speaker icon to replay the question</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
