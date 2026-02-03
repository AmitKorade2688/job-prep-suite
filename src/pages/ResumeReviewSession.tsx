import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  FileText,
  XCircle,
  Sparkles,
  Briefcase,
  Tag,
  Brain,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface JobRecommendation {
  title: string;
  matchScore: number;
  matchedKeywords: string[];
}

interface AlgorithmInfo {
  name: string;
  description: string;
  accuracy: string;
}

interface ReviewResult {
  score: number;
  strengths: string[];
  issues: string[];
  suggestions: string[];
  recommendedJobTitles?: JobRecommendation[];
  keywordAnalysis?: {
    present: string[];
    missing: string[];
  };
  sectionAnalysis?: {
    summary: number;
    experience: number;
    skills: number;
    education: number;
    formatting: number;
  };
  algorithmsUsed?: {
    jobMatching: AlgorithmInfo;
    atsScoring: AlgorithmInfo;
  };
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

  const extractTextFromFile = async (file: File): Promise<string> => {
    // For text-based content, we can read it directly
    // For PDF/DOC, we'll extract what we can
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        // Basic text extraction - for PDFs this will get the raw text
        // In production, you'd use a proper PDF parser
        resolve(content || "Unable to extract text from file. Please paste your resume content.");
      };
      reader.onerror = () => {
        resolve("Unable to read file. Please try again or paste your resume content.");
      };
      reader.readAsText(file);
    });
  };

  const analyzeResume = async () => {
    if (!file) return;

    setIsAnalyzing(true);

    try {
      // Extract text from file
      const resumeText = await extractTextFromFile(file);
      
      // Call AI edge function
      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: { resumeText }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult({
        score: data.score || 70,
        strengths: data.strengths || ["Resume analyzed successfully"],
        issues: data.issues || ["No specific issues found"],
        suggestions: data.suggestions || ["Continue improving your resume"],
        recommendedJobTitles: data.recommendedJobTitles || [],
        keywordAnalysis: data.keywordAnalysis || { present: [], missing: [] },
        sectionAnalysis: data.sectionAnalysis || { summary: 70, experience: 70, skills: 70, education: 70, formatting: 70 },
        algorithmsUsed: data.algorithmsUsed
      });
    } catch (error) {
      console.error("Resume analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Could not analyze resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
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
          <div className="max-w-4xl mx-auto space-y-8 px-4 sm:px-6">
            <div className="text-center space-y-4">
              <h1 className="text-3xl sm:text-4xl font-bold">AI Resume Review</h1>
              <p className="text-lg sm:text-xl text-muted-foreground">
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                  <Card className="shadow-soft border-border">
                    <CardContent className="pt-6 text-center">
                      <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-primary mb-3" />
                      <h3 className="font-semibold mb-1 text-sm sm:text-base">ATS Score</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Compatibility check
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-soft border-border">
                    <CardContent className="pt-6 text-center">
                      <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-secondary mb-3" />
                      <h3 className="font-semibold mb-1 text-sm sm:text-base">Issue Detection</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Find and fix problems
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-soft border-border">
                    <CardContent className="pt-6 text-center">
                      <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-accent mb-3" />
                      <h3 className="font-semibold mb-1 text-sm sm:text-base">Improvements</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
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

              {/* Job Title Recommendations */}
              {result.recommendedJobTitles && result.recommendedJobTitles.length > 0 && (
                <Card className="shadow-medium border-border border-primary/20">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-6 w-6 text-primary" />
                      <CardTitle>Recommended Job Titles</CardTitle>
                    </div>
                    <CardDescription>
                      Jobs that best match your resume profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.recommendedJobTitles.map((job, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-muted/30 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-lg">{job.title}</span>
                            <Badge variant={job.matchScore >= 70 ? "default" : job.matchScore >= 40 ? "secondary" : "outline"}>
                              {job.matchScore}% Match
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {job.matchedKeywords.map((keyword, kIndex) => (
                              <Badge key={kIndex} variant="outline" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Progress value={job.matchScore} className="w-full sm:w-24 h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Keywords Analysis */}
              {result.keywordAnalysis && (result.keywordAnalysis.present.length > 0 || result.keywordAnalysis.missing.length > 0) && (
                <Card className="shadow-medium border-border">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Tag className="h-6 w-6 text-secondary" />
                      <CardTitle>Keyword Analysis</CardTitle>
                    </div>
                    <CardDescription>Keywords detected and recommended</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.keywordAnalysis.present.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2 text-primary">✓ Keywords Found</p>
                        <div className="flex flex-wrap gap-2">
                          {result.keywordAnalysis.present.slice(0, 15).map((keyword, index) => (
                            <Badge key={index} variant="default" className="bg-primary/10 text-primary">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {result.keywordAnalysis.missing.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2 text-destructive">✗ Recommended to Add</p>
                        <div className="flex flex-wrap gap-2">
                          {result.keywordAnalysis.missing.slice(0, 10).map((keyword, index) => (
                            <Badge key={index} variant="outline" className="border-destructive/50 text-destructive">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Section Analysis */}
              {result.sectionAnalysis && (
                <Card className="shadow-medium border-border">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-6 w-6 text-accent" />
                      <CardTitle>Section Analysis</CardTitle>
                    </div>
                    <CardDescription>Breakdown by resume section</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {Object.entries(result.sectionAnalysis).map(([section, score]) => (
                        <div key={section} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize font-medium">{section}</span>
                            <span className={score >= 80 ? "text-primary" : score >= 60 ? "text-secondary" : "text-destructive"}>
                              {score}%
                            </span>
                          </div>
                          <Progress value={score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}


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
              <div className="flex flex-col sm:flex-row gap-4">
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
