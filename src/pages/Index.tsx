import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Brain, 
  MessageSquare, 
  ClipboardList, 
  FileText, 
  FileCheck,
  Zap,
  Target,
  TrendingUp
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "AI Mock Interviews",
    description: "Practice with realistic AI-powered interviews featuring both verbal and non-verbal feedback to improve your performance.",
    link: "/mock-interview",
    gradient: "from-blue-500 to-purple-500"
  },
  {
    icon: ClipboardList,
    title: "Adaptive MCQ Tests",
    description: "Take comprehensive tests on Web Dev, CS Fundamentals, OS, DBMS, and Networks with adaptive difficulty levels.",
    link: "/mcq-tests",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: FileText,
    title: "Resume Builder",
    description: "Create professional, ATS-friendly resumes with AI assistance and multiple customizable templates.",
    link: "/resume-builder",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    icon: FileCheck,
    title: "Resume Review",
    description: "Get instant AI-powered ATS compatibility checks and detailed improvement suggestions for your resume.",
    link: "/resume-review",
    gradient: "from-rose-500 to-orange-500"
  },
];

const benefits = [
  {
    icon: Zap,
    title: "All-in-One Platform",
    description: "Everything you need for job preparation in one unified ecosystem"
  },
  {
    icon: Target,
    title: "Personalized Learning",
    description: "Adaptive paths that adjust to your skill level and progress"
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Continuous monitoring with detailed analytics and insights"
  },
];

export default function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="gradient-hero py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Brain className="h-4 w-4" />
              <span>AI-Powered Career Preparation</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Your Complete Job Prep
              <br />
              <span className="gradient-primary bg-clip-text text-transparent">
                All Under One Roof
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Master interviews, ace technical tests, and craft perfect resumes with our unified AI-powered platform. 
              Save time, reduce costs, and boost your career prospects.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="gradient-primary border-0 hover:opacity-90 transition-smooth text-lg px-8">
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 transition-smooth">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Comprehensive Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to succeed in your job search journey, powered by advanced AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} to={feature.link}>
                  <Card className="h-full shadow-soft hover:shadow-large transition-smooth border-border cursor-pointer group">
                    <CardHeader>
                      <div className={`inline-flex w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} items-center justify-center mb-4 group-hover:scale-110 transition-smooth`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" className="transition-smooth group-hover:text-primary">
                        Learn More →
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Why Choose Careermate AI?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A unified platform that saves time, reduces costs, and delivers consistent results
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title} className="shadow-soft border-border text-center">
                  <CardContent className="pt-8">
                    <div className="inline-flex w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="gradient-primary shadow-large border-0">
            <CardContent className="p-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Accelerate Your Career?
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Join thousands of successful candidates who prepared with Careermate AI
              </p>
              <Button size="lg" variant="secondary" className="text-lg px-8 hover:scale-105 transition-smooth">
                Start Your Free Trial
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
