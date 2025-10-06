import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Layout, Sparkles, Download } from "lucide-react";

export default function ResumeBuilder() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Resume Builder</h1>
            <p className="text-xl text-muted-foreground">
              Create professional ATS-friendly resumes with AI assistance
            </p>
          </div>

          <Card className="shadow-medium border-border">
            <CardHeader>
              <CardTitle>Build Your Resume</CardTitle>
              <CardDescription>
                Choose a template and let AI help you craft the perfect resume
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="shadow-soft hover:shadow-medium transition-smooth cursor-pointer border-2 border-transparent hover:border-primary">
                  <CardContent className="pt-6 text-center">
                    <Layout className="h-12 w-12 mx-auto text-primary mb-3" />
                    <h3 className="font-semibold mb-2">Professional</h3>
                    <p className="text-sm text-muted-foreground">
                      Clean and formal design
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-soft hover:shadow-medium transition-smooth cursor-pointer border-2 border-transparent hover:border-primary">
                  <CardContent className="pt-6 text-center">
                    <Sparkles className="h-12 w-12 mx-auto text-secondary mb-3" />
                    <h3 className="font-semibold mb-2">Modern</h3>
                    <p className="text-sm text-muted-foreground">
                      Contemporary styling
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-soft hover:shadow-medium transition-smooth cursor-pointer border-2 border-transparent hover:border-primary">
                  <CardContent className="pt-6 text-center">
                    <FileText className="h-12 w-12 mx-auto text-accent mb-3" />
                    <h3 className="font-semibold mb-2">Minimal</h3>
                    <p className="text-sm text-muted-foreground">
                      Simple and elegant
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Button className="w-full gradient-primary border-0 hover:opacity-90 transition-smooth" size="lg">
                <FileText className="mr-2 h-5 w-5" />
                Start Building Resume
              </Button>

              <div className="flex items-center justify-center gap-4 pt-4">
                <Button variant="outline" className="transition-smooth">
                  <Download className="mr-2 h-4 w-4" />
                  Import from LinkedIn
                </Button>
                <Button variant="outline" className="transition-smooth">
                  <Download className="mr-2 h-4 w-4" />
                  Upload Existing Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
