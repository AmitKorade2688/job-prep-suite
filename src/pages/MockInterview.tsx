import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, MessageSquare, TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
};

const interviewTypes = [
  {
    icon: Video,
    title: "Video Interview",
    description: "Full interview experience with AI asking questions verbally and analyzing your responses via webcam",
    action: "Start Video Interview",
    route: "/video-interview",
    gradient: "from-primary to-secondary"
  },
  {
    icon: MessageSquare,
    title: "Text Interview",
    description: "Practice answering questions in written format with detailed AI feedback and suggestions",
    action: "Start Text Interview",
    route: "/text-interview",
    gradient: "from-secondary to-accent"
  },
  {
    icon: TrendingUp,
    title: "Interview Analytics",
    description: "Review your past interviews, track improvement over time, and identify areas to focus on",
    action: "View Analytics",
    route: null,
    gradient: "from-accent to-primary"
  }
];

export default function MockInterview() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto space-y-12">
          <motion.div 
            className="text-center space-y-4"
            initial="hidden" animate="visible" variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wider mb-2">
                <div className="w-8 h-px bg-primary" />
                Practice Makes Perfect
                <div className="w-8 h-px bg-primary" />
              </div>
            </motion.div>
            <motion.h1 className="text-4xl md:text-5xl font-bold" variants={fadeInUp} transition={{ duration: 0.5 }}>
              AI Mock Interview
            </motion.h1>
            <motion.p className="text-lg text-muted-foreground max-w-2xl mx-auto" variants={fadeInUp} transition={{ duration: 0.5 }}>
              Practice with AI-powered interviews featuring real-time feedback and comprehensive analytics
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {interviewTypes.map((type) => {
              const Icon = type.icon;
              return (
                <motion.div key={type.title} variants={fadeInUp} transition={{ duration: 0.5 }}>
                  <Card className="shadow-soft hover:shadow-large transition-smooth border-border h-full group relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-0 group-hover:opacity-[0.04] transition-smooth`} />
                    <CardHeader className="relative">
                      <div className="inline-flex w-14 h-14 rounded-2xl bg-primary/10 items-center justify-center mb-4 group-hover:scale-110 transition-bounce">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{type.title}</CardTitle>
                      <CardDescription className="leading-relaxed">{type.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                      <Button 
                        className={type.route ? "w-full gradient-primary border-0 hover:opacity-90 transition-smooth shadow-glow" : "w-full transition-smooth"}
                        variant={type.route ? "default" : "outline"}
                        onClick={() => type.route && navigate(type.route)}
                      >
                        {type.action}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
