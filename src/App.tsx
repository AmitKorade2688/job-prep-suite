import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MockInterview from "./pages/MockInterview";
import MCQTests from "./pages/MCQTests";
import ResumeBuilder from "./pages/ResumeBuilder";
import ResumeReview from "./pages/ResumeReview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/mock-interview" element={<MockInterview />} />
          <Route path="/mcq-tests" element={<MCQTests />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/resume-review" element={<ResumeReview />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
