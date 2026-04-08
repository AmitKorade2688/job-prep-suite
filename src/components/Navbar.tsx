import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Home, MessageSquare, FileText, FileCheck, ClipboardList, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/mock-interview", label: "Mock Interview", icon: MessageSquare },
  { path: "/mcq-tests", label: "MCQ Tests", icon: ClipboardList },
  { path: "/resume-builder", label: "Resume Builder", icon: FileText },
  { path: "/resume-review", label: "Resume Review", icon: FileCheck },
];

export const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full glass">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 transition-smooth hover:opacity-80">
            <div className="relative">
              <div className="gradient-primary rounded-xl p-2 shadow-glow">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="absolute -inset-1 gradient-primary rounded-xl opacity-20 blur-md -z-10" />
            </div>
            <span className="text-xl font-bold tracking-tight">Careermate AI</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "transition-smooth relative rounded-lg",
                      isActive 
                        ? "bg-primary/10 text-primary hover:bg-primary/15" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="mr-1.5 h-4 w-4" />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute -bottom-0.5 left-2 right-2 h-0.5 gradient-primary rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <Button className="hidden sm:inline-flex gradient-primary border-0 hover:opacity-90 transition-smooth shadow-glow text-sm" size="sm">
              Get Started
            </Button>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border glass overflow-hidden"
          >
            <div className="container mx-auto px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start transition-smooth",
                        isActive && "bg-primary/10 text-primary"
                      )}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
              <Button className="w-full gradient-primary border-0 mt-2 sm:hidden" size="sm">
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
