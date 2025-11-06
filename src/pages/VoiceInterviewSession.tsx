import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, StopCircle, CheckCircle, AlertCircle, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const interviewQuestions = [
  "Tell me about a time you had to work under pressure.",
  "How do you handle conflicts with team members?",
  "What motivates you in your professional life?",
  "Describe your ideal work environment.",
  "How do you prioritize tasks when managing multiple projects?"
];

export default function VoiceInterviewSession() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const { toast } = useToast();

  const playQuestion = () => {
    const utterance = new SpeechSynthesisUtterance(interviewQuestions[currentQuestion]);
    window.speechSynthesis.speak(utterance);
    
    toast({
      title: "Playing Question",
      description: "Listen carefully to the question",
    });
  };

  const startRecording = () => {
    setIsRecording(true);
    toast({
      title: "Recording Started",
      description: "Speak your answer clearly",
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    setAnswers([...answers, `Answer to question ${currentQuestion + 1}`]);
    
    toast({
      title: "Recording Stopped",
      description: "Your answer has been saved",
    });

    if (currentQuestion < interviewQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 1000);
    } else {
      setTimeout(() => setShowResults(true), 1000);
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
                    Well done! Here's your voice analysis
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-medium border-border">
              <CardHeader>
                <CardTitle>Voice Analysis</CardTitle>
                <CardDescription>AI analysis of your verbal communication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Speech Clarity</span>
                    <span className="text-primary font-semibold">88%</span>
                  </div>
                  <Progress value={88} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Pace & Rhythm</span>
                    <span className="text-primary font-semibold">82%</span>
                  </div>
                  <Progress value={82} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Confidence</span>
                    <span className="text-primary font-semibold">85%</span>
                  </div>
                  <Progress value={85} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Answer Structure</span>
                    <span className="text-primary font-semibold">90%</span>
                  </div>
                  <Progress value={90} className="h-3" />
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
                    <span>Clear pronunciation and articulation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Good use of pauses for emphasis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Professional and confident tone</span>
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
                    <span>Reduce speaking speed slightly for better clarity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>Work on varying vocal tone to maintain engagement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>Minimize use of filler words</span>
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
            <h1 className="text-3xl font-bold">Voice Interview</h1>
            <p className="text-muted-foreground">
              Question {currentQuestion + 1} of {interviewQuestions.length}
            </p>
            <Progress value={(currentQuestion / interviewQuestions.length) * 100} className="h-2" />
          </div>

          <Card className="shadow-medium border-border">
            <CardHeader>
              <CardTitle>Interview Question</CardTitle>
              <CardDescription>Listen to the question and record your answer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-6 rounded-lg text-center">
                <p className="text-lg font-medium mb-4">{interviewQuestions[currentQuestion]}</p>
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

                {!isRecording ? (
                  <Button
                    className="w-full gradient-primary border-0 hover:opacity-90 transition-smooth"
                    size="lg"
                    onClick={startRecording}
                  >
                    <Mic className="mr-2 h-5 w-5" />
                    Start Recording Answer
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-destructive hover:bg-destructive/90 text-white"
                    size="lg"
                    onClick={stopRecording}
                  >
                    <StopCircle className="mr-2 h-5 w-5" />
                    Stop Recording
                  </Button>
                )}
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
