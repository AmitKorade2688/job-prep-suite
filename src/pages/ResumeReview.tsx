import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, CheckCircle, AlertCircle, TrendingUp, FileCheck } from "lucide-react";

export default function ResumeReview() {
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

          <Card className="shadow-medium border-border">
            <CardHeader>
              <CardTitle>Upload Your Resume</CardTitle>
              <CardDescription>
                Our AI will analyze your resume for ATS compatibility and provide detailed feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-smooth cursor-pointer">
                <Upload className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">Drop your resume here or click to upload</p>
                <p className="text-sm text-muted-foreground">Supports PDF, DOC, DOCX (Max 5MB)</p>
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

              <Button className="w-full gradient-primary border-0 hover:opacity-90 transition-smooth" size="lg">
                <FileCheck className="mr-2 h-5 w-5" />
                Analyze Resume
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
