import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Layout, Sparkles, Download, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const templates = [
  { icon: Layout, title: "Professional", description: "Clean and formal design", color: "text-primary" },
  { icon: Sparkles, title: "Modern", description: "Contemporary styling", color: "text-secondary" },
  { icon: FileText, title: "Minimal", description: "Simple and elegant", color: "text-accent" },
];

export default function ResumeBuilder() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          <motion.div 
            className="text-center space-y-4"
            initial="hidden" animate="visible" variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wider mb-2">
                <div className="w-8 h-px bg-primary" />
                Build Your Future
                <div className="w-8 h-px bg-primary" />
              </div>
            </motion.div>
            <motion.h1 className="text-4xl md:text-5xl font-bold" variants={fadeInUp} transition={{ duration: 0.5 }}>
              Resume Builder
            </motion.h1>
            <motion.p className="text-lg text-muted-foreground max-w-2xl mx-auto" variants={fadeInUp} transition={{ duration: 0.5 }}>
              Create professional ATS-friendly resumes with AI assistance
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeInUp} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card className="shadow-large border-border relative overflow-hidden">
              <div className="absolute top-0 left-0 w-48 h-48 bg-secondary/5 rounded-full translate-y-[-50%] translate-x-[-50%] blur-3xl" />
              <CardHeader className="relative">
                <CardTitle className="text-xl">Build Your Resume</CardTitle>
                <CardDescription className="text-base">
                  Choose a template and let AI help you craft the perfect resume
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 relative">
                <motion.div 
                  className="grid md:grid-cols-3 gap-4"
                  initial="hidden" whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                >
                  {templates.map((template) => {
                    const Icon = template.icon;
                    return (
                      <motion.div key={template.title} variants={fadeInUp} transition={{ duration: 0.4 }}>
                        <Card className="shadow-soft hover:shadow-large transition-smooth cursor-pointer border-2 border-transparent hover:border-primary/30 group relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-0 group-hover:opacity-[0.03] transition-smooth" />
                          <CardContent className="pt-6 text-center relative">
                            <div className="inline-flex w-14 h-14 rounded-2xl bg-primary/10 items-center justify-center mb-3 group-hover:scale-110 transition-bounce">
                              <Icon className={`h-7 w-7 ${template.color}`} />
                            </div>
                            <h3 className="font-semibold mb-2">{template.title}</h3>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>

                <Button 
                  className="w-full gradient-primary border-0 hover:opacity-90 transition-smooth shadow-glow h-12 text-base" 
                  size="lg"
                  onClick={() => navigate('/resume-builder-session')}
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Start Building Resume
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
