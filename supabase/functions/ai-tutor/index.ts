// Supabase Edge Function: ai-tutor
// Calls Google Interactions API with gemini-3.8-flash using GEMINI_API_KEY from Supabase Secrets.
// Seamlessly falls back to comprehensive predefined demo responses if the API is unavailable or returns 503/429.

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

/**
 * Extracts generated text from Google's Interactions API response payload.
 */
function extractReplyText(data: any): string {
  if (!data) return "";

  // 1. Direct output_text field
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  // 2. Direct text field
  if (typeof data.text === "string" && data.text.trim()) {
    return data.text.trim();
  }

  // 3. outputs array (standard in Interactions API)
  if (Array.isArray(data.outputs) && data.outputs.length > 0) {
    const parts: string[] = [];
    for (const out of data.outputs) {
      if (typeof out === "string") {
        parts.push(out);
      } else if (typeof out?.text === "string") {
        parts.push(out.text);
      } else if (typeof out?.content === "string") {
        parts.push(out.content);
      } else if (Array.isArray(out?.content)) {
        for (const c of out.content) {
          if (typeof c?.text === "string") parts.push(c.text);
          else if (typeof c === "string") parts.push(c);
        }
      }
    }
    const combined = parts.join("\n\n").trim();
    if (combined) return combined;
  }

  // 4. steps array (agentic execution steps)
  if (Array.isArray(data.steps) && data.steps.length > 0) {
    const parts: string[] = [];
    for (const step of data.steps) {
      if (Array.isArray(step?.content)) {
        for (const item of step.content) {
          if (typeof item?.text === "string") parts.push(item.text);
          else if (typeof item === "string") parts.push(item);
        }
      } else if (typeof step?.text === "string") {
        parts.push(step.text);
      } else if (typeof step?.output === "string") {
        parts.push(step.output);
      }
    }
    const combined = parts.join("\n\n").trim();
    if (combined) return combined;
  }

  // 5. candidates array (fallback if legacy format)
  if (Array.isArray(data.candidates) && data.candidates.length > 0) {
    const part = data.candidates[0]?.content?.parts?.[0]?.text;
    if (typeof part === "string" && part.trim()) {
      return part.trim();
    }
  }

  return "";
}

/**
 * Predefined demo answers for academic ECE subjects.
 */
function generatePredefinedDemoReply(rawPrompt: string): string {
  const q = rawPrompt.toLowerCase().trim();

  // 1. Practice MCQs / Multiple Choice / Quizzes
  if (q.includes("mcq") || q.includes("multiple choice") || q.includes("quiz")) {
    return [
      "Here are 5 practice MCQs for Digital Logic Design (Karnaugh Maps):",
      "",
      "1. A K-map is primarily used to:",
      "   A) Store data   B) Simplify Boolean expressions   C) Generate clock pulses   D) Convert analog signals",
      "2. In a 4-variable K-map, adjacent cells differ by:",
      "   A) 2 bits   B) 4 bits   C) 1 bit   D) 0 bits",
      "3. The maximum grouping size in a K-map follows the pattern:",
      "   A) 3, 5, 7   B) 1, 2, 3, 4   C) 1, 2, 4, 8, 16   D) 2, 6, 10",
      "4. The term 'don't care' in a K-map is filled with:",
      "   A) 0   B) 1   C) X   D) —",
      "5. Simplifying AB + AB' gives:",
      "   A) A   B) B   C) AB   D) 0",
      "",
      "Answers: 1-B, 2-C, 3-C, 4-C, 5-A",
      "",
      "Want 10 more, or MCQs on a different course (e.g. Circuit Analysis, Digital Electronics)?",
    ].join("\n");
  }

  // 2. Numerical / Problem Solving Step-by-Step
  if (q.includes("solve") || q.includes("problem") || q.includes("numerical")) {
    return [
      "Let's solve it step by step. Here's a typical Thevenin's theorem problem:",
      "",
      "Problem: Find the Thevenin equivalent seen by the 6 Ω load in a circuit with a 12 V source, 2 Ω and 4 Ω series resistors.",
      "",
      "Step 1 — Remove the load (6 Ω).",
      "Step 2 — Open-circuit voltage: Vth = 12 × 4 / (2 + 4) = 8 V.",
      "Step 3 — Short the source: Rth = 2 Ω ∥ 4 Ω = (2 × 4) / (2 + 4) ≈ 1.33 Ω.",
      "Step 4 — Reconnect the load: I = Vth / (Rth + 6) = 8 / 7.33 ≈ 1.09 A.",
      "",
      "Paste your own problem and I'll walk through it line by line.",
    ].join("\n");
  }

  // 3. Study Plan / Schedule / Preparation
  if (q.includes("study plan") || q.includes("schedule") || q.includes("plan")) {
    return [
      "Here's a 2-week study plan for your upcoming exam:",
      "",
      "Week 1 — Build the foundation",
      "• Day 1–2: Revise lecture notes + slides (active recall, don't just re-read)",
      "• Day 3–4: Work through textbook examples by hand",
      "• Day 5: Solve 20 previous-year short questions",
      "• Day 6–7: Identify weak topics from your mistakes",
      "",
      "Week 2 — Exam conditioning",
      "• Day 8–10: Two full timed past papers",
      "• Day 11–12: Redo every wrong answer without notes",
      "• Day 13: Formula sheet + quick flashcards",
      "• Day 14: Rest, light revision, sleep well",
      "",
      "Tell me the course name and I'll tailor this plan to the syllabus.",
    ].join("\n");
  }

  // 4. Summaries & Chapter Recaps
  if (q.includes("summar")) {
    return [
      "Here's how to get a high-quality summary from me:",
      "",
      "1. Paste the chapter text or key points in your next message.",
      "2. Tell me the format you want: bullet outline, one-page notes, or exam-focused recap.",
      "3. I'll extract definitions, formulas, and common exam traps.",
      "",
      "Meanwhile, a good manual summary structure is: Key concept → Formula → Worked example → Common mistake → 2 self-test questions.",
    ].join("\n");
  }

  // 5. Thevenin's Theorem (Theory & Formula Derivation)
  if (q.includes("thevenin") || (q.includes("circuit") && q.includes("theorem"))) {
    return [
      "### Thevenin's Theorem (Circuit Analysis)",
      "",
      "**Statement:** Any linear, bilateral, two-terminal circuit containing independent or dependent sources and resistors can be replaced by an equivalent circuit consisting of an independent voltage source ($V_{th}$) in series with a resistor ($R_{th}$).",
      "",
      "**Steps to Solve:**",
      "1. **Identify the load resistor ($R_L$)** and temporarily remove it, leaving open terminals $a$ and $b$.",
      "2. **Find $V_{th}$ (Open-Circuit Voltage):** Calculate the voltage across terminals $a$-$b$ using nodal or mesh analysis.",
      "3. **Find $R_{th}$ (Thevenin Resistance):**",
      "   - Deactivate all independent sources: replace voltage sources with short circuits ($0\\text{ V}$), and current sources with open circuits ($0\\text{ A}$).",
      "   - Calculate the equivalent resistance looking back into terminals $a$-$b$.",
      "4. **Reconstruct the equivalent:** Connect $V_{th}$ in series with $R_{th}$ and reconnect $R_L$.",
      "   $$I_L = \\frac{V_{th}}{R_{th} + R_L}$$",
    ].join("\n");
  }

  // 6. MOSFET Working Principles & Equations
  if (q.includes("mosfet") || q.includes("transistor") || q.includes("fet")) {
    return [
      "### MOSFET Working Principles (Electronics)",
      "",
      "A **Metal-Oxide-Semiconductor Field-Effect Transistor (MOSFET)** is a voltage-controlled majority carrier device with three active regions:",
      "",
      "1. **Cutoff Region ($V_{GS} < V_{th}$):**",
      "   - No inversion layer exists beneath the gate oxide.",
      "   - Drain current $I_D \\approx 0\\text{ A}$. The device behaves like an open switch.",
      "2. **Triode / Linear Region ($V_{GS} > V_{th}$ and $V_{DS} < V_{GS} - V_{th}$):**",
      "   - The channel is continuous from source to drain.",
      "   - $I_D = \\mu_n C_{ox} \\frac{W}{L} \\left[ (V_{GS} - V_{th})V_{DS} - \\frac{1}{2}V_{DS}^2 \\right]$",
      "3. **Saturation Region ($V_{GS} > V_{th}$ and $V_{DS} \\ge V_{GS} - V_{th}$):**",
      "   - Channel is pinched off at the drain side; current saturates and depends primarily on gate overdrive voltage:",
      "   - $I_D = \\frac{1}{2} \\mu_n C_{ox} \\frac{W}{L} (V_{GS} - V_{th})^2 (1 + \\lambda V_{DS})$",
    ].join("\n");
  }

  // 7. Operational Amplifier (Op-Amp) Gain Analysis
  if (q.includes("op-amp") || q.includes("operational amplifier") || q.includes("gain")) {
    return [
      "### Operational Amplifier (Op-Amp) Gain Analysis",
      "",
      "Under **ideal Op-Amp approximations**:",
      "- Infinite input impedance ($R_{in} \\to \\infty$), so input currents $I_+ = I_- = 0$.",
      "- Virtual short condition: $V_+ \\approx V_-$ when negative feedback is applied.",
      "",
      "**1. Inverting Amplifier:**",
      "- Non-inverting terminal tied to ground ($V_+ = 0$).",
      "- Applying KCL at the inverting node: $\\frac{V_{in} - 0}{R_1} + \\frac{V_{out} - 0}{R_f} = 0$",
      "- **Closed Loop Voltage Gain:** $A_v = \\frac{V_{out}}{V_{in}} = -\\frac{R_f}{R_1}$",
      "",
      "**2. Non-Inverting Amplifier:**",
      "- Input signal fed directly to non-inverting terminal ($V_+ = V_{in}$).",
      "- Due to virtual ground, $V_- = V_{in}$.",
      "- Voltage divider gives $V_- = V_{out} \\left(\\frac{R_1}{R_1 + R_f}\\right)$.",
      "- **Closed Loop Voltage Gain:** $A_v = 1 + \\frac{R_f}{R_1}$",
    ].join("\n");
  }

  // 8. RUET Examination, Assessment & Ordinance Guidelines
  if (
    q.includes("exam") ||
    q.includes("grading") ||
    q.includes("gpa") ||
    q.includes("ruet") ||
    q.includes("assessment")
  ) {
    return [
      "### RUET Examination & Ordinance Guidelines",
      "",
      "- **Continuous Assessment (40 Marks):** Class Attendance (10%), Class Tests / Quizzes (20%), Assignment / Performance (10%).",
      "- **Semester Final Examination (60 Marks):** Section A (30 Marks) & Section B (30 Marks).",
      "- **Grading Scale:**",
      "  - $80\\%+$ : **A+** (4.00)",
      "  - $75\\% - 79\\%$ : **A** (3.75)",
      "  - $70\\% - 74\\%$ : **A-** (3.50)",
      "  - $65\\% - 69\\%$ : **B+** (3.25)",
      "  - $60\\% - 64\\%$ : **B** (3.00)",
      "- **Minimum Attendance Requirement:** $75\\%$ for regular examination clearance.",
    ].join("\n");
  }

  // 9. Explanations (Intuition + Formal View)
  if (q.includes("explain") || q.includes("simple") || q.includes("what is")) {
    return [
      "Great question — here's the intuition first, then the formal view.",
      "",
      "Imagine Thevenin's theorem: any complicated linear circuit, no matter how many sources and resistors, behaves exactly like one voltage source and one series resistor — as far as any load connected to it is concerned.",
      "",
      "Intuition: the load only 'feels' the voltage at the terminals and how stiff that voltage is. Everything hidden inside the box just defines those two numbers.",
      "",
      "Formally:",
      "• Vth = open-circuit voltage at the terminals",
      "• Rth = (Vtest method) or deactivate independent sources and compute equivalent resistance",
      "• Load current: I = Vth / (Rth + Rload)",
      "",
      "Want a worked numerical example, or the same explanation for a different topic (e.g. Norton's theorem, superposition)?",
    ].join("\n");
  }

  // 10. Default Adaptive Academic Guidance
  return [
    `Good question about "${rawPrompt.trim().slice(0, 80)}".`,
    "",
    "Here's how I can help you with it:",
    "• Break the topic into fundamentals → intuition → formulas → worked problems",
    "• Point out the most common exam traps",
    "• Generate practice questions at your difficulty level",
    "",
    "To give you a precise answer, could you share a bit more context? For example:",
    "1. Which course/chapter is this from?",
    "2. Is this for a quick revision or deep understanding?",
    "3. Do you want theory, numericals, or both?",
  ].join("\n");
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const rawMessages: Message[] = Array.isArray(body?.messages)
      ? body.messages
      : body?.prompt
      ? [{ role: "user", content: String(body.prompt) }]
      : [];

    const lastUserPrompt =
      [...rawMessages].reverse().find((m) => m.role === "user")?.content || "";

    if (rawMessages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No messages provided in the request body." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Retrieve Gemini API Key from Supabase Edge Function secrets
    const apiKey = (
      Deno.env.get("GEMINI_API_KEY") ||
      Deno.env.get("GOOGLE_API_KEY") ||
      Deno.env.get("GOOGLE_GEMINI_API_KEY")
    )?.trim();

    // If API key is not configured, automatically use demo response without throwing raw error
    if (!apiKey) {
      const demoReply = generatePredefinedDemoReply(lastUserPrompt);
      return new Response(
        JSON.stringify({ reply: demoReply, source: "demo" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Filter and clean messages for conversation context
    const validMessages = rawMessages
      .filter((m) => m && typeof m.content === "string" && m.content.trim().length > 0)
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        content: m.content.trim(),
      }));

    // Find the first user message (skip initial assistant greetings)
    const firstUserIndex = validMessages.findIndex((m) => m.role === "user");
    if (firstUserIndex === -1) {
      const demoReply = generatePredefinedDemoReply(lastUserPrompt);
      return new Response(
        JSON.stringify({ reply: demoReply, source: "demo" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Keep the most recent messages (up to 12) starting with a user message
    let conversationSlice = validMessages.slice(firstUserIndex);
    if (conversationSlice.length > 12) {
      conversationSlice = conversationSlice.slice(-12);
      const userStart = conversationSlice.findIndex((m) => m.role === "user");
      if (userStart > 0) {
        conversationSlice = conversationSlice.slice(userStart);
      }
    }

    // Ensure the last message in the sequence is from user
    while (conversationSlice.length > 0 && conversationSlice[conversationSlice.length - 1].role !== "user") {
      conversationSlice.pop();
    }

    if (conversationSlice.length === 0) {
      const demoReply = generatePredefinedDemoReply(lastUserPrompt);
      return new Response(
        JSON.stringify({ reply: demoReply, source: "demo" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare multi-turn input:
    const inputPayload =
      conversationSlice.length === 1
        ? conversationSlice[0].content
        : conversationSlice.map((msg) => ({
            role: msg.role === "assistant" ? "model" : "user",
            content: [
              {
                type: "text",
                text: msg.content,
              },
            ],
          }));

    const interactionsEndpoint = "https://generativelanguage.googleapis.com/v1beta/interactions";

    // Call Google's Interactions API with gemini-3.8-flash and x-goog-api-key authentication
    let apiRes = await fetch(interactionsEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        model: "gemini-3.8-flash",
        input: inputPayload,
        system_instruction: SYSTEM_INSTRUCTION,
      }),
    });

    // If array input format returns 400, retry with conversational dialogue string
    if (!apiRes.ok && apiRes.status === 400 && Array.isArray(inputPayload)) {
      const dialogueText = conversationSlice
        .map(
          (m) =>
            `${m.role === "assistant" || m.role === "model" ? "Assistant" : "Student"}: ${m.content}`
        )
        .join("\n\n");

      apiRes = await fetch(interactionsEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          model: "gemini-3.8-flash",
          input: dialogueText,
          system_instruction: SYSTEM_INSTRUCTION,
        }),
      });
    }

    const data = await apiRes.json();

    // If API failed (503 capacity, 429 rate limit, or other error), use demo responder
    if (!apiRes.ok) {
      console.warn("Interactions API returned error, falling back to demo response:", data?.error || apiRes.status);
      const demoReply = generatePredefinedDemoReply(lastUserPrompt);
      return new Response(
        JSON.stringify({ reply: demoReply, source: "demo" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const replyText = extractReplyText(data);

    // If reply text was empty, fall back to demo response
    if (!replyText) {
      const demoReply = generatePredefinedDemoReply(lastUserPrompt);
      return new Response(
        JSON.stringify({ reply: demoReply, source: "demo" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Success with real AI response
    return new Response(
      JSON.stringify({ reply: replyText, source: "api" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.warn("AI tutor function encountered error, falling back to demo response:", error);
    const demoReply = generatePredefinedDemoReply("");
    return new Response(
      JSON.stringify({ reply: demoReply, source: "demo" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
