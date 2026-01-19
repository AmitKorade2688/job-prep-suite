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
    const { action, interviewContext, conversationHistory, userAnswer } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "generate_question") {
      systemPrompt = `You are an expert interviewer conducting a professional interview. 
Based on the interview context provided by the user (job description, role, topics, etc.), generate relevant interview questions.
Your questions should:
- Be directly relevant to the context provided
- Progress logically based on previous answers
- Test both technical knowledge and soft skills when appropriate
- Be clear and specific

Respond with ONLY a JSON object in this format:
{
  "question": "Your interview question here",
  "questionNumber": <number>,
  "totalQuestions": <total planned questions, usually 5-8>,
  "hint": "A brief hint or what aspect you're testing"
}`;

      userPrompt = `Interview Context: ${interviewContext}

Conversation so far:
${conversationHistory?.map((h: { role: string; content: string }) => `${h.role}: ${h.content}`).join('\n') || 'This is the first question'}

Generate the next interview question.`;
    } else if (action === "analyze_answer") {
      systemPrompt = `You are an expert interview coach analyzing a candidate's response.
Evaluate the answer based on:
- Relevance to the question
- Depth and specificity
- Use of examples
- Communication clarity
- Professional tone

Respond with ONLY a JSON object in this format:
{
  "feedback": "Brief constructive feedback on this specific answer",
  "score": <score from 1-10>,
  "shouldContinue": <true if more questions should be asked, false if interview should end>,
  "followUp": "Optional follow-up or clarification question if needed"
}`;

      userPrompt = `Interview Context: ${interviewContext}

Conversation so far:
${conversationHistory?.map((h: { role: string; content: string }) => `${h.role}: ${h.content}`).join('\n')}

Latest question answered: ${conversationHistory?.[conversationHistory.length - 2]?.content || ''}
Candidate's answer: ${userAnswer}

Analyze this response.`;
    } else if (action === "generate_analytics") {
      systemPrompt = `You are an expert interview coach providing comprehensive interview analysis.
Analyze the complete interview and provide detailed feedback.

Respond with ONLY a JSON object in this format:
{
  "overallScore": <score from 0-100>,
  "metrics": {
    "communication": <0-100>,
    "technicalKnowledge": <0-100>,
    "problemSolving": <0-100>,
    "confidence": <0-100>,
    "professionalism": <0-100>
  },
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "detailedFeedback": "A paragraph of personalized feedback and recommendations",
  "questionAnalysis": [
    {
      "question": "question text",
      "score": <1-10>,
      "feedback": "specific feedback for this answer"
    }
  ]
}`;

      userPrompt = `Interview Context: ${interviewContext}

Complete Interview Transcript:
${conversationHistory?.map((h: { role: string; content: string }) => `${h.role}: ${h.content}`).join('\n')}

Provide comprehensive interview analytics.`;
    }

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
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response");
    }

    const result = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Interview AI error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
