import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Video, Mic, MicOff, VideoOff, StopCircle, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const interviewQuestions = [
  "Tell me about yourself and your background.",
  "What are your greatest strengths and how do they apply to this role?",
  "Describe a challenging project you worked on and how you overcame obstacles.",
  "Where do you see yourself in 5 years?",
  "Why should we hire you for this position?"
];

export default function VideoInterviewSession() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

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
      videoTrack.enabled = !videoTrack.enabled;
      setVideoEnabled(videoTrack.enabled);
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setAudioEnabled(audioTrack.enabled);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    toast({
      title: "Recording Started",
      description: "Your answer is being recorded",
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
      setTimeout(() => {
        stopCamera();
        setShowResults(true);
      }, 1000);
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
                    Great job! Here's your performance analysis
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-medium border-border">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>AI analysis of your interview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Confidence Level</span>
                    <span className="text-primary font-semibold">85%</span>
                  </div>
                  <Progress value={85} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Eye Contact</span>
                    <span className="text-primary font-semibold">78%</span>
                  </div>
                  <Progress value={78} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Speech Clarity</span>
                    <span className="text-primary font-semibold">92%</span>
                  </div>
                  <Progress value={92} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Body Language</span>
                    <span className="text-primary font-semibold">80%</span>
                  </div>
                  <Progress value={80} className="h-3" />
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
                    <span>Excellent articulation and clear communication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Confident body language and professional demeanor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Well-structured answers with concrete examples</span>
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
                    <span>Try to maintain more consistent eye contact</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>Reduce filler words like "um" and "uh"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>Keep answers more concise and focused</span>
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
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Video Interview</h1>
            <p className="text-muted-foreground">
              Question {currentQuestion + 1} of {interviewQuestions.length}
            </p>
            <Progress value={(currentQuestion / interviewQuestions.length) * 100} className="h-2" />
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
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-medium border-border">
              <CardHeader>
                <CardTitle>Interview Question</CardTitle>
                <CardDescription>Take your time and answer thoughtfully</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="min-h-[150px] flex items-center">
                  <p className="text-lg font-medium">{interviewQuestions[currentQuestion]}</p>
                </div>

                <div className="space-y-3">
                  {!isRecording ? (
                    <Button
                      className="w-full gradient-primary border-0 hover:opacity-90 transition-smooth"
                      size="lg"
                      onClick={startRecording}
                    >
                      <Video className="mr-2 h-5 w-5" />
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

                <div className="text-sm text-muted-foreground space-y-2">
                  <p className="font-semibold">Tips:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Maintain eye contact with the camera</li>
                    <li>Speak clearly and at a moderate pace</li>
                    <li>Use the STAR method (Situation, Task, Action, Result)</li>
                    <li>Keep answers between 1-2 minutes</li>
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
