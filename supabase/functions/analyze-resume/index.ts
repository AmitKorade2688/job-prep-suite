import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText } = await req.json();
    
    if (!resumeText || resumeText.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Resume text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert resume reviewer and ATS (Applicant Tracking System) specialist. Analyze the provided resume and provide detailed feedback.

You MUST respond with a valid JSON object in exactly this format (no markdown, no code blocks, just raw JSON):
{
  "score": <number between 0-100>,
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "issues": ["<issue 1>", "<issue 2>", ...],
  "suggestions": ["<suggestion 1>", "<suggestion 2>", ...]
}

Scoring criteria:
- 90-100: Excellent ATS compatibility, strong keywords, clear formatting
- 80-89: Very good, minor improvements needed
- 70-79: Good, some issues to address
- 60-69: Average, needs significant improvements
- Below 60: Needs major revision

Analyze for:
1. ATS Compatibility: Keywords, formatting, section headers
2. Content Quality: Action verbs, quantified achievements, clarity
3. Structure: Logical flow, appropriate sections, professional formatting
4. Relevance: Industry-specific keywords, skills alignment
5. Professional Presentation: Contact info, grammar, consistency

Provide at least 3 strengths, 3 issues, and 5 actionable suggestions.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Please analyze this resume:\n\n${resumeText}` },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response
    let result;
    try {
      // Clean the response - remove any markdown code blocks if present
      const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
      result = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Return a fallback response
      result = {
        score: 70,
        strengths: ["Resume was successfully processed", "Content was readable"],
        issues: ["AI analysis encountered formatting issues"],
        suggestions: ["Try uploading a cleaner version of your resume", "Ensure your resume is in plain text format"]
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("analyze-resume error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
