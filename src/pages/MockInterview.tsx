import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, MessageSquare, TrendingUp } from "lucide-react";

export default function MockInterview() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">AI Mock Interview</h1>
            <p className="text-xl text-muted-foreground">
              Practice with AI-powered interviews featuring real-time feedback and analytics
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-soft hover:shadow-medium transition-smooth border-border">
              <CardHeader>
                <Video className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Video Interview</CardTitle>
                <CardDescription>
                  Full interview experience with AI asking questions verbally and analyzing your responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full gradient-primary border-0 hover:opacity-90 transition-smooth"
                  onClick={() => navigate('/video-interview')}
                >
                  Start Video Interview
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-smooth border-border">
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-accent mb-2" />
                <CardTitle>Text Interview</CardTitle>
                <CardDescription>
                  Practice answering questions in written format with detailed feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full gradient-primary border-0 hover:opacity-90 transition-smooth"
                  onClick={() => navigate('/text-interview')}
                >
                  Start Text Interview
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-smooth border-border">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Interview Analytics</CardTitle>
                <CardDescription>
                  Review your past interviews and track improvement over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full transition-smooth">
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
