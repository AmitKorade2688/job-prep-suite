import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Database, Network, Cpu, Globe, CheckCircle } from "lucide-react";

const testCategories = [
  {
    title: "Web Development",
    description: "HTML, CSS, JavaScript, React, Node.js",
    icon: Globe,
    questions: 50,
    duration: "60 min",
  },
  {
    title: "Data Structures & Algorithms",
    description: "Arrays, Trees, Graphs, Sorting, Searching",
    icon: Code,
    questions: 40,
    duration: "45 min",
  },
  {
    title: "Database Management",
    description: "SQL, NoSQL, Normalization, Transactions",
    icon: Database,
    questions: 35,
    duration: "40 min",
  },
  {
    title: "Computer Networks",
    description: "TCP/IP, OSI Model, Protocols, Security",
    icon: Network,
    questions: 30,
    duration: "35 min",
  },
  {
    title: "Operating Systems",
    description: "Processes, Threads, Memory, File Systems",
    icon: Cpu,
    questions: 30,
    duration: "35 min",
  },
  {
    title: "Core CS Fundamentals",
    description: "OOP, Design Patterns, System Design",
    icon: CheckCircle,
    questions: 45,
    duration: "50 min",
  },
];

export default function MCQTests() {
  const navigate = useNavigate();

  const handleStartTest = (category: string) => {
    navigate(`/mcq-test-session?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">MCQ Test Series</h1>
            <p className="text-xl text-muted-foreground">
              Adaptive tests that adjust to your skill level and track progress
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.title} className="shadow-soft hover:shadow-medium transition-smooth border-border">
                  <CardHeader>
                    <Icon className="h-10 w-10 text-primary mb-3" />
                    <CardTitle>{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{category.questions} Questions</span>
                      <span>{category.duration}</span>
                    </div>
                    <Button 
                      className="w-full gradient-primary border-0 hover:opacity-90 transition-smooth"
                      onClick={() => handleStartTest(category.title)}
                    >
                      Start Test
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
