import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MockInterview from "./pages/MockInterview";
import VideoInterviewSession from "./pages/VideoInterviewSession";
import TextInterviewSession from "./pages/TextInterviewSession";
import MCQTests from "./pages/MCQTests";
import MCQTestSession from "./pages/MCQTestSession";
import ResumeBuilder from "./pages/ResumeBuilder";
import ResumeBuilderSession from "./pages/ResumeBuilderSession";
import ResumeReview from "./pages/ResumeReview";
import ResumeReviewSession from "./pages/ResumeReviewSession";
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
          <Route path="/video-interview" element={<VideoInterviewSession />} />
          <Route path="/text-interview" element={<TextInterviewSession />} />
          <Route path="/mcq-tests" element={<MCQTests />} />
          <Route path="/mcq-test-session" element={<MCQTestSession />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/resume-builder-session" element={<ResumeBuilderSession />} />
          <Route path="/resume-review" element={<ResumeReview />} />
          <Route path="/resume-review-session" element={<ResumeReviewSession />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
