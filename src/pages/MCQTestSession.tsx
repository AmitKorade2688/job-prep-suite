import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function MCQTestSession() {
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [topic, setTopic] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    // Load questions from sessionStorage
    const storedQuestions = sessionStorage.getItem('mcq-questions');
    const storedTopic = sessionStorage.getItem('mcq-topic');
    
    if (!storedQuestions) {
      navigate('/mcq-tests');
      return;
    }

    try {
      const parsedQuestions = JSON.parse(storedQuestions);
      setQuestions(parsedQuestions);
      setTopic(storedTopic || 'MCQ Test');
      setAnswers(new Array(parsedQuestions.length).fill(null));
      // Set timer: 2 minutes per question
      setTimeLeft(parsedQuestions.length * 120);
    } catch {
      navigate('/mcq-tests');
    }
  }, [navigate]);

  useEffect(() => {
    if (showResult || questions.length === 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResult, questions.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!isAnswered) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
      setIsAnswered(false);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
      setIsAnswered(false);
    }
  };

  const handlePrevious = () => {
    if (selectedAnswer !== null && !isAnswered) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
    }

    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
      setIsAnswered(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
      setIsAnswered(true);
    }
  };

  const handleFinish = () => {
    if (selectedAnswer !== null && !isAnswered) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
    }
    setShowResult(true);
    // Clear sessionStorage
    sessionStorage.removeItem('mcq-questions');
    sessionStorage.removeItem('mcq-topic');
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index]?.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  if (questions.length === 0) {
    return null;
  }

  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const score = calculateScore();
  const percentage = ((score / totalQuestions) * 100).toFixed(1);

  if (showResult) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <Card className="max-w-3xl mx-auto shadow-large">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Test Completed!</CardTitle>
              <p className="text-muted-foreground mt-2">Topic: {topic}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold gradient-primary bg-clip-text text-transparent">
                  {percentage}%
                </div>
                <p className="text-xl text-muted-foreground">
                  You scored {score} out of {totalQuestions}
                </p>
                <div className="flex justify-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-primary">
                    <CheckCircle className="h-4 w-4" /> {score} Correct
                  </span>
                  <span className="flex items-center gap-1 text-destructive">
                    <XCircle className="h-4 w-4" /> {totalQuestions - score} Wrong
                  </span>
                </div>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {questions.map((q, index) => {
                  const userAnswer = answers[index];
                  const isCorrect = userAnswer === q.correctAnswer;
                  
                  return (
                    <Card key={index} className={`border-2 ${isCorrect ? 'border-primary/30 bg-primary/5' : 'border-destructive/30 bg-destructive/5'}`}>
                      <CardContent className="pt-6 space-y-3">
                        <div className="flex items-start gap-2">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium mb-2">Q{index + 1}: {q.question}</p>
                            <p className="text-sm text-muted-foreground">
                              Your answer: <span className={isCorrect ? 'text-primary font-medium' : 'text-destructive font-medium'}>
                                {userAnswer !== null ? q.options[userAnswer] : 'Not answered'}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p className="text-sm mt-1">
                                Correct answer: <span className="text-primary font-medium">{q.options[q.correctAnswer]}</span>
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground mt-2 p-2 bg-muted/50 rounded italic">
                              💡 {q.explanation}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  className="flex-1 gradient-primary border-0 hover:opacity-90 transition-smooth"
                  onClick={() => navigate('/mcq-tests')}
                >
                  Take Another Test
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 transition-smooth"
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/mcq-tests')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">{topic}</h1>
                <p className="text-sm text-muted-foreground">AI Generated Test</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground bg-muted px-3 py-2 rounded-lg">
              <Clock className="h-5 w-5" />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestion + 1} of {totalQuestions}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="text-xl leading-relaxed">{currentQ.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup 
                value={selectedAnswer?.toString()} 
                onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                disabled={isAnswered}
              >
                {currentQ.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentQ.correctAnswer;
                  const showFeedback = isAnswered;

                  return (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 border rounded-lg p-4 transition-smooth ${
                        !showFeedback && isSelected ? 'border-primary bg-primary/5' : ''
                      } ${
                        !showFeedback && !isSelected ? 'border-border hover:border-primary/50 cursor-pointer' : ''
                      } ${
                        showFeedback && isCorrect ? 'border-primary bg-primary/10' : ''
                      } ${
                        showFeedback && isSelected && !isCorrect ? 'border-destructive bg-destructive/10' : ''
                      }`}
                      onClick={() => !isAnswered && handleAnswerSelect(index)}
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label 
                        htmlFor={`option-${index}`} 
                        className="flex-1 cursor-pointer text-base"
                      >
                        {option}
                      </Label>
                      {showFeedback && isCorrect && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                      {showFeedback && isSelected && !isCorrect && (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                  );
                })}
              </RadioGroup>

              {isAnswered && (
                <Card className="bg-muted/50 border-muted">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium mb-1 flex items-center gap-2">
                      💡 Explanation
                    </p>
                    <p className="text-sm text-muted-foreground">{currentQ.explanation}</p>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="transition-smooth"
                >
                  Previous
                </Button>
                
                {!isAnswered ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="flex-1 gradient-primary border-0 hover:opacity-90 transition-smooth"
                  >
                    Submit Answer
                  </Button>
                ) : currentQuestion === totalQuestions - 1 ? (
                  <Button
                    onClick={handleFinish}
                    className="flex-1 gradient-primary border-0 hover:opacity-90 transition-smooth"
                  >
                    Finish Test
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="flex-1 gradient-primary border-0 hover:opacity-90 transition-smooth"
                  >
                    Next Question
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
