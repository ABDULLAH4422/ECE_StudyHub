// Supabase Edge Function: ai-tutor
// Serves Gemini API responses to ECE StudyHub students with conversation context.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

const SYSTEM_INSTRUCTION = `You are the ECE StudyHub AI Tutor for the Department of Electrical & Computer Engineering at RUET (Rajshahi University of Engineering & Technology).

Your role:
- Guide undergraduate students through ECE subjects (Electrical Circuits, Electronics, Signals & Systems, Digital Logic, Microprocessors, Communication Systems, Control Systems, DSP, VLSI, and Computer Engineering).
- Explain technical concepts clearly, methodically, and with step-by-step logic.
- Break down circuit numericals (e.g., Thevenin, Norton, KVL, KCL, mesh/nodal analysis) clearly with intermediate steps and units.
- Explain engineering formulas, derivations, and exam revision topics.
- Be encouraging, polite, and academically rigorous.
- Format responses cleanly with concise markdown, bullet points, and code/math blocks where helpful.`;

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const messages: Message[] = Array.isArray(body?.messages) ? body.messages : [];

    // Fallback if a single prompt string was sent
    if (messages.length === 0 && body?.prompt) {
      messages.push({ role: "user", content: String(body.prompt) });
    }

    if (messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No messages provided in the request body." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Retrieve Gemini API Key from Supabase Edge Function secrets
    const apiKey =
      Deno.env.get("GEMINI_API_KEY") ||
      Deno.env.get("VITE_GEMINI_API_KEY") ||
      Deno.env.get("GOOGLE_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error:
            "GEMINI_API_KEY secret is not set in Supabase Edge Functions. Please configure it in your Supabase Dashboard under Project Settings > Edge Functions > Secrets.",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Transform conversation history to Gemini contents format
    // Roles: "user" or "model"
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    // Take the most recent messages (up to 12) to keep context fast and within token budget
    const contextMessages = messages.slice(-12);

    for (const msg of contextMessages) {
      if (msg.role === "system") continue;
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }

    // Call Google Gemini API (gemini-1.5-flash)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1200,
        },
      }),
    });

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      const errMsg = data?.error?.message || "Failed to generate AI response from Gemini API.";
      return new Response(
        JSON.stringify({ error: errMsg }),
        { status: geminiRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I was unable to formulate a response. Please try rephrasing your question.";

    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error?.message || "An unexpected error occurred in the AI tutor function." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
