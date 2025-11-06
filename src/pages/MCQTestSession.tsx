import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Clock } from "lucide-react";

// Sample questions for each category
const questionBank: Record<string, Array<{
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}>> = {
  "Web Development": [
    {
      question: "What does CSS stand for?",
      options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
      correctAnswer: 1,
      explanation: "CSS stands for Cascading Style Sheets, which is used to style HTML documents."
    },
    {
      question: "Which HTML tag is used for the largest heading?",
      options: ["<heading>", "<h6>", "<h1>", "<head>"],
      correctAnswer: 2,
      explanation: "The <h1> tag defines the most important heading in HTML."
    },
    {
      question: "What is the correct syntax for referring to an external script called 'app.js'?",
      options: ["<script href='app.js'>", "<script name='app.js'>", "<script src='app.js'>", "<script file='app.js'>"],
      correctAnswer: 2,
      explanation: "The src attribute is used to specify the URL of an external script file."
    },
    {
      question: "Which JavaScript method is used to select an element by ID?",
      options: ["getElementById()", "querySelector()", "selectElement()", "findById()"],
      correctAnswer: 0,
      explanation: "document.getElementById() is the standard method to select elements by ID."
    },
    {
      question: "What does the 'box-sizing: border-box' property do?",
      options: ["Adds borders", "Includes padding and border in width", "Creates a box", "Removes margins"],
      correctAnswer: 1,
      explanation: "border-box makes width include padding and borders, making sizing more predictable."
    }
  ],
  "Data Structures & Algorithms": [
    {
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      correctAnswer: 1,
      explanation: "Binary search has a time complexity of O(log n) as it divides the search space in half each iteration."
    },
    {
      question: "Which data structure uses LIFO principle?",
      options: ["Queue", "Stack", "Array", "Tree"],
      correctAnswer: 1,
      explanation: "Stack follows Last In First Out (LIFO) principle."
    },
    {
      question: "What is the worst-case time complexity of Quick Sort?",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
      correctAnswer: 2,
      explanation: "Quick Sort has a worst-case time complexity of O(n²) when the pivot selection is poor."
    }
  ],
  "Database Management": [
    {
      question: "What does SQL stand for?",
      options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "Sequential Query Language"],
      correctAnswer: 0,
      explanation: "SQL stands for Structured Query Language."
    },
    {
      question: "Which SQL keyword is used to retrieve data?",
      options: ["GET", "FETCH", "SELECT", "RETRIEVE"],
      correctAnswer: 2,
      explanation: "SELECT is used to retrieve data from a database."
    },
    {
      question: "What is a primary key?",
      options: ["A key that can be null", "A unique identifier for a record", "A foreign key reference", "An index"],
      correctAnswer: 1,
      explanation: "A primary key uniquely identifies each record in a database table."
    }
  ],
  "Computer Networks": [
    {
      question: "What does HTTP stand for?",
      options: ["HyperText Transfer Protocol", "High Transfer Text Protocol", "HyperText Transmission Protocol", "High Tech Transfer Protocol"],
      correctAnswer: 0,
      explanation: "HTTP stands for HyperText Transfer Protocol."
    },
    {
      question: "Which layer of OSI model is responsible for routing?",
      options: ["Transport Layer", "Network Layer", "Data Link Layer", "Application Layer"],
      correctAnswer: 1,
      explanation: "The Network Layer (Layer 3) is responsible for routing packets between networks."
    },
    {
      question: "What is the default port for HTTPS?",
      options: ["80", "8080", "443", "21"],
      correctAnswer: 2,
      explanation: "HTTPS uses port 443 by default."
    }
  ],
  "Operating Systems": [
    {
      question: "What is a process?",
      options: ["A program in execution", "A stored program", "A compiled code", "A system call"],
      correctAnswer: 0,
      explanation: "A process is a program in execution."
    },
    {
      question: "Which scheduling algorithm is best for minimizing average waiting time?",
      options: ["FCFS", "SJF", "Round Robin", "Priority"],
      correctAnswer: 1,
      explanation: "Shortest Job First (SJF) minimizes average waiting time."
    },
    {
      question: "What is virtual memory?",
      options: ["RAM", "ROM", "Storage technique using disk space as RAM", "Cache memory"],
      correctAnswer: 2,
      explanation: "Virtual memory uses disk space to extend available RAM."
    }
  ],
  "Core CS Fundamentals": [
    {
      question: "What is encapsulation in OOP?",
      options: ["Inheritance", "Hiding internal details", "Polymorphism", "Abstraction"],
      correctAnswer: 1,
      explanation: "Encapsulation is the bundling of data and methods while hiding internal details."
    },
    {
      question: "Which design pattern ensures a class has only one instance?",
      options: ["Factory", "Singleton", "Observer", "Decorator"],
      correctAnswer: 1,
      explanation: "Singleton pattern ensures a class has only one instance."
    },
    {
      question: "What does API stand for?",
      options: ["Application Programming Interface", "Advanced Programming Interface", "Application Process Interface", "Automated Programming Interface"],
      correctAnswer: 0,
      explanation: "API stands for Application Programming Interface."
    }
  ]
};

export default function MCQTestSession() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get("category") || "Web Development";
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isAnswered, setIsAnswered] = useState(false);

  const questions = questionBank[category] || questionBank["Web Development"];
  const totalQuestions = questions.length;

  useEffect(() => {
    setAnswers(new Array(totalQuestions).fill(null));
  }, [totalQuestions]);

  useEffect(() => {
    if (showResult) return;
    
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
  }, [showResult]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
      setIsAnswered(false);
    }

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
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
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const score = calculateScore();
  const percentage = ((score / totalQuestions) * 100).toFixed(1);

  if (showResult) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto shadow-large">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Test Completed!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold gradient-primary bg-clip-text text-transparent">
                  {percentage}%
                </div>
                <p className="text-xl text-muted-foreground">
                  You scored {score} out of {totalQuestions}
                </p>
              </div>

              <div className="space-y-4">
                {questions.map((q, index) => {
                  const userAnswer = answers[index];
                  const isCorrect = userAnswer === q.correctAnswer;
                  
                  return (
                    <Card key={index} className={`border-2 ${isCorrect ? 'border-primary/20' : 'border-destructive/20'}`}>
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
                              Your answer: {userAnswer !== null ? q.options[userAnswer] : 'Not answered'}
                            </p>
                            {!isCorrect && (
                              <p className="text-sm text-primary mt-1">
                                Correct answer: {q.options[q.correctAnswer]}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground mt-2 italic">
                              {q.explanation}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="flex gap-4">
                <Button 
                  className="flex-1 gradient-primary border-0 hover:opacity-90 transition-smooth"
                  onClick={() => window.location.reload()}
                >
                  Retake Test
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 transition-smooth"
                  onClick={() => navigate('/mcq-tests')}
                >
                  Back to Tests
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
            <h1 className="text-2xl font-bold">{category}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5" />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestion + 1} of {totalQuestions}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} />
          </div>

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="text-xl">{currentQ.question}</CardTitle>
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
                      className={`flex items-center space-x-3 border rounded-lg p-4 transition-smooth cursor-pointer ${
                        isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                      } ${
                        showFeedback && isCorrect ? 'border-primary bg-primary/10' : ''
                      } ${
                        showFeedback && isSelected && !isCorrect ? 'border-destructive bg-destructive/10' : ''
                      }`}
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label 
                        htmlFor={`option-${index}`} 
                        className="flex-1 cursor-pointer"
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
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium mb-1">Explanation:</p>
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
