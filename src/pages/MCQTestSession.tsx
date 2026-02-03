import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, ArrowLeft, Brain, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface AnswerRecord {
  answer: number | null;
  difficulty: 'easy' | 'medium' | 'hard';
  wasCorrect: boolean;
}

type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Item Response Theory (IRT) Inspired Adaptive Testing Algorithm
 * 
 * This algorithm adapts question difficulty based on user performance:
 * - Start with EASY questions
 * - Correct answer → increase difficulty (easy→medium→hard)
 * - Wrong answer on hard → decrease difficulty
 * - Tracks consecutive correct/wrong answers for smoother transitions
 */
const useAdaptiveDifficulty = (questions: Question[]) => {
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('easy');
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [usedQuestionIndices, setUsedQuestionIndices] = useState<Set<number>>(new Set());
  const [orderedQuestions, setOrderedQuestions] = useState<Question[]>([]);
  const [difficultyHistory, setDifficultyHistory] = useState<Difficulty[]>([]);

  // Initialize with first easy question
  useEffect(() => {
    if (questions.length > 0 && orderedQuestions.length === 0) {
      const firstQuestion = getNextQuestion('easy', questions, new Set());
      if (firstQuestion) {
        setOrderedQuestions([firstQuestion.question]);
        setUsedQuestionIndices(new Set([firstQuestion.index]));
        setDifficultyHistory(['easy']);
      }
    }
  }, [questions]);

  const getNextQuestion = (difficulty: Difficulty, allQuestions: Question[], used: Set<number>): { question: Question; index: number } | null => {
    // First try to find a question of the target difficulty
    const targetQuestions = allQuestions
      .map((q, i) => ({ question: q, index: i }))
      .filter(item => item.question.difficulty === difficulty && !used.has(item.index));
    
    if (targetQuestions.length > 0) {
      return targetQuestions[Math.floor(Math.random() * targetQuestions.length)];
    }

    // Fallback: try adjacent difficulties
    const fallbackOrder: Difficulty[] = difficulty === 'easy' 
      ? ['medium', 'hard'] 
      : difficulty === 'hard' 
        ? ['medium', 'easy'] 
        : ['easy', 'hard'];
    
    for (const fallback of fallbackOrder) {
      const fallbackQuestions = allQuestions
        .map((q, i) => ({ question: q, index: i }))
        .filter(item => item.question.difficulty === fallback && !used.has(item.index));
      
      if (fallbackQuestions.length > 0) {
        return fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
      }
    }

    // Last resort: any unused question
    const remaining = allQuestions
      .map((q, i) => ({ question: q, index: i }))
      .filter(item => !used.has(item.index));
    
    return remaining.length > 0 ? remaining[0] : null;
  };

  const processAnswer = useCallback((wasCorrect: boolean) => {
    let newDifficulty = currentDifficulty;
    
    if (wasCorrect) {
      setConsecutiveCorrect(prev => prev + 1);
      setConsecutiveWrong(0);
      
      // Increase difficulty after correct answer
      if (currentDifficulty === 'easy') {
        newDifficulty = 'medium';
      } else if (currentDifficulty === 'medium') {
        newDifficulty = 'hard';
      }
      // Already at hard, stay at hard
    } else {
      setConsecutiveWrong(prev => prev + 1);
      setConsecutiveCorrect(0);
      
      // Decrease difficulty after wrong answer on hard
      if (currentDifficulty === 'hard') {
        newDifficulty = 'medium';
      } else if (currentDifficulty === 'medium' && consecutiveWrong >= 1) {
        newDifficulty = 'easy';
      }
    }

    setCurrentDifficulty(newDifficulty);
    
    // Add next question based on new difficulty
    const nextQ = getNextQuestion(newDifficulty, questions, usedQuestionIndices);
    if (nextQ) {
      setOrderedQuestions(prev => [...prev, nextQ.question]);
      setUsedQuestionIndices(prev => new Set([...prev, nextQ.index]));
      setDifficultyHistory(prev => [...prev, newDifficulty]);
    }
  }, [currentDifficulty, questions, usedQuestionIndices, consecutiveWrong]);

  return {
    currentDifficulty,
    orderedQuestions,
    difficultyHistory,
    processAnswer,
    consecutiveCorrect,
    consecutiveWrong
  };
};

const getDifficultyColor = (difficulty: Difficulty) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-500/10 text-green-600 border-green-500/30';
    case 'medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30';
    case 'hard': return 'bg-red-500/10 text-red-600 border-red-500/30';
  }
};

const getDifficultyIcon = (difficulty: Difficulty) => {
  switch (difficulty) {
    case 'easy': return <TrendingDown className="h-3 w-3" />;
    case 'medium': return <Minus className="h-3 w-3" />;
    case 'hard': return <TrendingUp className="h-3 w-3" />;
  }
};

export default function MCQTestSession() {
  const navigate = useNavigate();
  
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [topic, setTopic] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [algorithmInfo, setAlgorithmInfo] = useState<any>(null);

  const { 
    currentDifficulty, 
    orderedQuestions, 
    difficultyHistory,
    processAnswer 
  } = useAdaptiveDifficulty(allQuestions);

  useEffect(() => {
    // Load questions from sessionStorage
    const storedQuestions = sessionStorage.getItem('mcq-questions');
    const storedTopic = sessionStorage.getItem('mcq-topic');
    const storedAlgorithm = sessionStorage.getItem('mcq-algorithm');
    
    if (!storedQuestions) {
      navigate('/mcq-tests');
      return;
    }

    try {
      const parsedQuestions = JSON.parse(storedQuestions);
      setAllQuestions(parsedQuestions);
      setTopic(storedTopic || 'MCQ Test');
      if (storedAlgorithm) {
        setAlgorithmInfo(JSON.parse(storedAlgorithm));
      }
      // Set timer: 2 minutes per question
      setTimeLeft(parsedQuestions.length * 120);
    } catch {
      navigate('/mcq-tests');
    }
  }, [navigate]);

  useEffect(() => {
    if (showResult || allQuestions.length === 0) return;
    
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
  }, [showResult, allQuestions.length]);

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

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const currentQ = orderedQuestions[currentQuestion];
    const wasCorrect = selectedAnswer === currentQ.correctAnswer;
    
    // Record this answer
    const newRecord: AnswerRecord = {
      answer: selectedAnswer,
      difficulty: currentQ.difficulty,
      wasCorrect
    };
    setAnswerRecords(prev => [...prev, newRecord]);
    setIsAnswered(true);
    
    // Process for adaptive algorithm (will queue next question)
    if (currentQuestion < allQuestions.length - 1) {
      processAnswer(wasCorrect);
    }
  };

  const handleNext = () => {
    if (currentQuestion < orderedQuestions.length - 1 && currentQuestion < allQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const handleFinish = () => {
    setShowResult(true);
    // Clear sessionStorage
    sessionStorage.removeItem('mcq-questions');
    sessionStorage.removeItem('mcq-topic');
    sessionStorage.removeItem('mcq-algorithm');
  };

  const calculateScore = () => {
    return answerRecords.filter(r => r.wasCorrect).length;
  };

  const calculateDifficultyStats = () => {
    const stats = { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } };
    answerRecords.forEach(record => {
      stats[record.difficulty].total++;
      if (record.wasCorrect) stats[record.difficulty].correct++;
    });
    return stats;
  };

  if (allQuestions.length === 0 || orderedQuestions.length === 0) {
    return null;
  }

  const totalQuestions = Math.min(orderedQuestions.length, allQuestions.length);
  const questionsAnswered = answerRecords.length;
  const progress = ((currentQuestion + 1) / allQuestions.length) * 100;
  const score = calculateScore();
  const percentage = questionsAnswered > 0 ? ((score / questionsAnswered) * 100).toFixed(1) : '0';
  const difficultyStats = calculateDifficultyStats();

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
                  You scored {score} out of {questionsAnswered}
                </p>
                <div className="flex justify-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-primary">
                    <CheckCircle className="h-4 w-4" /> {score} Correct
                  </span>
                  <span className="flex items-center gap-1 text-destructive">
                    <XCircle className="h-4 w-4" /> {questionsAnswered - score} Wrong
                  </span>
                </div>
              </div>

              {/* Difficulty Breakdown */}
              <Card className="bg-muted/30 border">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Adaptive Difficulty Analysis</CardTitle>
                  </div>
                  <CardDescription>Performance breakdown by difficulty level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
                      <div key={diff} className={`p-3 rounded-lg border ${getDifficultyColor(diff)}`}>
                        <div className="flex items-center gap-1 mb-1">
                          {getDifficultyIcon(diff)}
                          <span className="capitalize font-medium text-sm">{diff}</span>
                        </div>
                        <p className="text-2xl font-bold">
                          {difficultyStats[diff].total > 0 
                            ? Math.round((difficultyStats[diff].correct / difficultyStats[diff].total) * 100)
                            : 0}%
                        </p>
                        <p className="text-xs opacity-70">
                          {difficultyStats[diff].correct}/{difficultyStats[diff].total} correct
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>


              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {orderedQuestions.slice(0, questionsAnswered).map((q, index) => {
                  const record = answerRecords[index];
                  const isCorrect = record?.wasCorrect;
                  
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
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">Q{index + 1}</span>
                              <Badge variant="outline" className={`text-xs ${getDifficultyColor(q.difficulty)}`}>
                                {getDifficultyIcon(q.difficulty)}
                                <span className="ml-1 capitalize">{q.difficulty}</span>
                              </Badge>
                            </div>
                            <p className="mb-2">{q.question}</p>
                            <p className="text-sm text-muted-foreground">
                              Your answer: <span className={isCorrect ? 'text-primary font-medium' : 'text-destructive font-medium'}>
                                {record?.answer !== null ? q.options[record.answer] : 'Not answered'}
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

  const currentQ = orderedQuestions[currentQuestion];
  const isLastQuestion = currentQuestion >= allQuestions.length - 1;

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
                <p className="text-sm text-muted-foreground">Adaptive AI Test</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={`${getDifficultyColor(currentDifficulty)}`}>
                {getDifficultyIcon(currentDifficulty)}
                <span className="ml-1 capitalize">{currentDifficulty}</span>
              </Badge>
              <div className="flex items-center gap-2 text-muted-foreground bg-muted px-3 py-2 rounded-lg">
                <Clock className="h-5 w-5" />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestion + 1} of {allQuestions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="shadow-medium">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={`${getDifficultyColor(currentQ.difficulty)}`}>
                  {getDifficultyIcon(currentQ.difficulty)}
                  <span className="ml-1 capitalize">{currentQ.difficulty}</span>
                </Badge>
              </div>
              <CardTitle className="text-xl leading-relaxed mt-3">{currentQ.question}</CardTitle>
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
                {!isAnswered ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="flex-1 gradient-primary border-0 hover:opacity-90 transition-smooth"
                  >
                    Submit Answer
                  </Button>
                ) : isLastQuestion ? (
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
