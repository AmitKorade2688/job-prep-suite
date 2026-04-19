import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Brain, 
  MessageSquare, 
  ClipboardList, 
  FileText, 
  FileCheck,
  Zap,
  Target,
  TrendingUp,
  ArrowRight,
  Sparkles
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "AI Mock Interviews",
    description: "Practice with realistic AI-powered interviews featuring both verbal and non-verbal feedback to improve your performance.",
    link: "/mock-interview",
    gradient: "from-primary to-secondary",
    iconBg: "bg-primary/10"
  },
  {
    icon: ClipboardList,
    title: "Adaptive MCQ Tests",
    description: "Take comprehensive tests on Web Dev, CS Fundamentals, OS, DBMS, and Networks with adaptive difficulty levels.",
    link: "/mcq-tests",
    gradient: "from-secondary to-accent",
    iconBg: "bg-secondary/10"
  },
  {
    icon: FileText,
    title: "Resume Builder",
    description: "Create professional, ATS-friendly resumes with AI assistance and multiple customizable templates.",
    link: "/resume-builder",
    gradient: "from-accent to-primary",
    iconBg: "bg-accent/10"
  },
  {
    icon: FileCheck,
    title: "Resume Review",
    description: "Get instant AI-powered ATS compatibility checks and detailed improvement suggestions for your resume.",
    link: "/resume-review",
    gradient: "from-primary to-accent",
    iconBg: "bg-primary/10"
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

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-accent/5 rounded-full blur-2xl animate-float" />
        
        <div className="relative container mx-auto max-w-6xl px-4 py-24 md:py-32">
          <motion.div 
            className="text-center space-y-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full text-sm font-medium text-primary mb-6">
                <Sparkles className="h-4 w-4" />
                <span>AI-Powered Career Preparation</span>
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight"
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              Your Complete Job Prep
              <br />
              <span className="text-gradient">
                All Under One Roof
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              Master interviews, ace technical tests, and craft perfect resumes with our unified AI-powered platform. 
              Save time, reduce costs, and boost your career prospects.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              <Link to="/mock-interview">
                <Button size="lg" className="gradient-primary border-0 hover:opacity-90 transition-smooth text-lg px-8 h-13 shadow-glow">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-8 max-w-lg mx-auto pt-8"
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              {[
                { value: "10K+", label: "Users" },
                { value: "50K+", label: "Interviews" },
                { value: "95%", label: "Success Rate" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center space-y-4 mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wider">
              <div className="w-8 h-px bg-primary" />
              Features
              <div className="w-8 h-px bg-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">Everything You Need</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools powered by advanced AI to prepare you for every step
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} variants={fadeInUp} transition={{ duration: 0.5 }}>
                  <Link to={feature.link}>
                    <Card className="h-full shadow-soft hover:shadow-large transition-smooth border-border cursor-pointer group relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-smooth`} />
                      <CardHeader className="relative">
                        <div className={`inline-flex w-14 h-14 rounded-2xl ${feature.iconBg} items-center justify-center mb-4 group-hover:scale-110 transition-bounce`}>
                          <Icon className="h-7 w-7 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-primary font-medium text-sm group-hover:gap-3 gap-2 transition-smooth">
                          Explore Feature
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-smooth" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-muted/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
        
        <div className="container mx-auto max-w-6xl relative">
          <motion.div 
            className="text-center space-y-4 mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wider">
              <div className="w-8 h-px bg-primary" />
              Why Us
              <div className="w-8 h-px bg-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">Why Choose Careermate AI?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A unified platform that saves time, reduces costs, and delivers consistent results
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <motion.div key={benefit.title} variants={fadeInUp} transition={{ duration: 0.5 }}>
                  <Card className="shadow-soft border-border text-center h-full hover:shadow-medium transition-smooth group">
                    <CardContent className="pt-10 pb-8 px-8">
                      <div className="inline-flex w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center mb-6 group-hover:scale-110 transition-bounce">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <Card className="gradient-primary shadow-glow border-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <CardContent className="p-12 md:p-16 text-center text-white relative">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  Ready to Accelerate Your Career?
                </h2>
                <p className="text-lg mb-10 opacity-90 max-w-xl mx-auto">
                  Join thousands of successful candidates who prepared with Careermate AI
                </p>
                <Link to="/mock-interview">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-10 h-13 font-semibold shadow-large">
                    Start Your Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="gradient-primary rounded-lg p-1.5">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-sm">Careermate AI</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 Careermate AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
