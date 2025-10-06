import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  FileText,
  XCircle,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReviewResult {
  score: number;
  strengths: string[];
  issues: string[];
  suggestions: string[];
}

export default function ResumeReviewSession() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (uploadedFile.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(uploadedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or DOC file",
          variant: "destructive",
        });
        return;
      }

      setFile(uploadedFile);
      toast({
        title: "Resume uploaded",
        description: `${uploadedFile.name} is ready for analysis`,
      });
    }
  };

  const analyzeResume = () => {
    if (!file) return;

    setIsAnalyzing(true);

    // Simulate AI analysis with realistic timing
    setTimeout(() => {
      // Mock analysis result
      const mockResult: ReviewResult = {
        score: Math.floor(Math.random() * 20) + 75, // Score between 75-95
        strengths: [
          "Clear and concise professional summary",
          "Well-structured work experience section",
          "Quantified achievements with specific metrics",
          "Relevant technical skills section",
          "Professional formatting and layout"
        ],
        issues: [
          "Missing keywords: 'agile methodology', 'cross-functional teams'",
          "Work experience bullets could be more action-oriented",
          "Education section placement could be optimized",
          "Contact information lacks LinkedIn profile link"
        ],
        suggestions: [
          "Add 2-3 more technical keywords relevant to your target role",
          "Start each bullet point with strong action verbs",
          "Include links to your GitHub or portfolio projects",
          "Optimize file name to include your name and 'resume'",
          "Consider adding a brief skills summary at the top",
          "Ensure consistent date formatting throughout",
          "Add specific technologies used in each project"
        ]
      };

      setResult(mockResult);
      setIsAnalyzing(false);
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-primary";
    if (score >= 70) return "text-secondary";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    return "Needs Improvement";
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">AI Resume Review</h1>
            <p className="text-xl text-muted-foreground">
              Get instant ATS compatibility check and improvement suggestions
            </p>
          </div>

          {!result ? (
            <Card className="shadow-medium border-border">
              <CardHeader>
                <CardTitle>Upload Your Resume</CardTitle>
                <CardDescription>
                  Our AI will analyze your resume for ATS compatibility and provide detailed feedback
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-smooth">
                  <input
                    type="file"
                    id="resume-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    {file ? (
                      <>
                        <p className="text-lg font-medium mb-2 text-primary">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • Click to change
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-medium mb-2">Drop your resume here or click to upload</p>
                        <p className="text-sm text-muted-foreground">Supports PDF, DOC, DOCX (Max 5MB)</p>
                      </>
                    )}
                  </label>
                </div>

                <div className="grid md:grid-cols-3 gap-4 pt-6">
                  <Card className="shadow-soft border-border">
                    <CardContent className="pt-6 text-center">
                      <CheckCircle className="h-8 w-8 mx-auto text-primary mb-3" />
                      <h3 className="font-semibold mb-1">ATS Score</h3>
                      <p className="text-sm text-muted-foreground">
                        Compatibility check
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-soft border-border">
                    <CardContent className="pt-6 text-center">
                      <AlertCircle className="h-8 w-8 mx-auto text-secondary mb-3" />
                      <h3 className="font-semibold mb-1">Issue Detection</h3>
                      <p className="text-sm text-muted-foreground">
                        Find and fix problems
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-soft border-border">
                    <CardContent className="pt-6 text-center">
                      <TrendingUp className="h-8 w-8 mx-auto text-accent mb-3" />
                      <h3 className="font-semibold mb-1">Improvements</h3>
                      <p className="text-sm text-muted-foreground">
                        AI-powered suggestions
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Button 
                  className="w-full gradient-primary border-0 hover:opacity-90 transition-smooth" 
                  size="lg"
                  onClick={analyzeResume}
                  disabled={!file || isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Resume...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-5 w-5" />
                      Analyze Resume
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Score Card */}
              <Card className="shadow-large border-border">
                <CardContent className="pt-8">
                  <div className="text-center space-y-4">
                    <div className={`text-7xl font-bold ${getScoreColor(result.score)}`}>
                      {result.score}
                    </div>
                    <div>
                      <p className="text-2xl font-semibold mb-1">{getScoreLabel(result.score)}</p>
                      <p className="text-muted-foreground">ATS Compatibility Score</p>
                    </div>
                    <Progress value={result.score} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              {/* Strengths */}
              <Card className="shadow-medium border-border">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <CardTitle>Strengths ({result.strengths.length})</CardTitle>
                  </div>
                  <CardDescription>What your resume does well</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Issues */}
              <Card className="shadow-medium border-border border-destructive/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-6 w-6 text-destructive" />
                    <CardTitle>Issues Found ({result.issues.length})</CardTitle>
                  </div>
                  <CardDescription>Areas that need attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.issues.map((issue, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Suggestions */}
              <Card className="shadow-medium border-border border-accent/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-accent" />
                    <CardTitle>AI Suggestions ({result.suggestions.length})</CardTitle>
                  </div>
                  <CardDescription>Recommended improvements</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-accent/10 text-accent font-semibold text-sm mt-0.5 flex-shrink-0">
                          {index + 1}
                        </div>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button 
                  className="flex-1 gradient-primary border-0 hover:opacity-90 transition-smooth"
                  onClick={() => {
                    setFile(null);
                    setResult(null);
                  }}
                >
                  Analyze Another Resume
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 transition-smooth"
                  onClick={() => window.print()}
                >
                  Download Report
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
