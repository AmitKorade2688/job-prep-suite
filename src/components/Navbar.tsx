import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Home, MessageSquare, FileText, FileCheck, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/mock-interview", label: "Mock Interview", icon: MessageSquare },
  { path: "/mcq-tests", label: "MCQ Tests", icon: ClipboardList },
  { path: "/resume-builder", label: "Resume Builder", icon: FileText },
  { path: "/resume-review", label: "Resume Review", icon: FileCheck },
];

export const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 transition-smooth hover:opacity-80">
            <div className="gradient-primary rounded-lg p-2">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Careermate AI</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "transition-smooth",
                      isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          <Button className="gradient-primary border-0 hover:opacity-90 transition-smooth">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};
