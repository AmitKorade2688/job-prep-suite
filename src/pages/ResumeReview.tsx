import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, CheckCircle, AlertCircle, TrendingUp, FileCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const features = [
  { icon: CheckCircle, title: "ATS Score", description: "Compatibility check against ATS systems", color: "text-primary" },
  { icon: AlertCircle, title: "Issue Detection", description: "Find and fix formatting problems", color: "text-secondary" },
  { icon: TrendingUp, title: "Improvements", description: "AI-powered improvement suggestions", color: "text-accent" },
];

export default function ResumeReview() {
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
                AI Analysis
                <div className="w-8 h-px bg-primary" />
              </div>
            </motion.div>
            <motion.h1 className="text-4xl md:text-5xl font-bold" variants={fadeInUp} transition={{ duration: 0.5 }}>
              AI Resume Review
            </motion.h1>
            <motion.p className="text-lg text-muted-foreground max-w-2xl mx-auto" variants={fadeInUp} transition={{ duration: 0.5 }}>
              Get instant ATS compatibility check and improvement suggestions
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeInUp} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card className="shadow-large border-border relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <CardHeader className="relative">
                <CardTitle className="text-xl">Upload Your Resume</CardTitle>
                <CardDescription className="text-base">
                  Our AI will analyze your resume for ATS compatibility and provide detailed feedback
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 relative">
                <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-primary/50 hover:bg-primary/[0.02] transition-smooth cursor-pointer group">
                  <div className="inline-flex w-20 h-20 rounded-2xl bg-primary/10 items-center justify-center mb-4 group-hover:scale-110 transition-bounce">
                    <Upload className="h-10 w-10 text-primary" />
                  </div>
                  <p className="text-lg font-semibold mb-2">Drop your resume here or click to upload</p>
                  <p className="text-sm text-muted-foreground">Supports PDF, DOC, DOCX (Max 5MB)</p>
                </div>

                <motion.div 
                  className="grid md:grid-cols-3 gap-4"
                  initial="hidden" whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                >
                  {features.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <motion.div key={feature.title} variants={fadeInUp} transition={{ duration: 0.4 }}>
                        <Card className="shadow-soft border-border text-center hover:shadow-medium transition-smooth group">
                          <CardContent className="pt-6">
                            <div className="inline-flex w-12 h-12 rounded-2xl bg-primary/10 items-center justify-center mb-3 group-hover:scale-110 transition-bounce">
                              <Icon className={`h-6 w-6 ${feature.color}`} />
                            </div>
                            <h3 className="font-semibold mb-1">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>

                <Button 
                  className="w-full gradient-primary border-0 hover:opacity-90 transition-smooth shadow-glow h-12 text-base" 
                  size="lg"
                  onClick={() => navigate('/resume-review-session')}
                >
                  <FileCheck className="mr-2 h-5 w-5" />
                  Analyze Resume
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
