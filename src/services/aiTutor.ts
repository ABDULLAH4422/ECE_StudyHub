/**
 * AI Study Tutor Service
 * Invokes the Supabase Edge Function ("ai-tutor") powered by Google Gemini API.
 * Seamlessly falls back to comprehensive predefined demo responses whenever the API
 * is unavailable, rate-limited (429), or experiencing server capacity issues (503).
 */
import { supabase } from "@/lib/supabase";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface AiTutorResponse {
  success: boolean;
  reply: string;
  error?: string;
  source?: "api" | "demo";
}

/**
 * Sends conversation context directly to the Supabase Edge Function ("ai-tutor").
 * If the real AI API succeeds, returns the generated response.
 * If the API fails or is unavailable, automatically returns the original demo answer.
 */
export async function sendChatMessage(messages: ChatMessage[]): Promise<AiTutorResponse> {
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content || "";

  // Ensure the history begins with a user message (strips out the initial UI greeting)
  const userStartIndex = messages.findIndex((m) => m.role === "user");
  const filteredMessages = userStartIndex >= 0 ? messages.slice(userStartIndex) : messages;

  const payload = filteredMessages.map((m) => ({
    role: m.role,
    content: m.content.trim(),
  }));

  try {
    const { data, error } = await supabase.functions.invoke("ai-tutor", {
      body: { messages: payload },
    });

    // If real AI response was generated successfully
    if (!error && data?.reply && typeof data.reply === "string" && data.reply.trim().length > 0) {
      return {
        success: true,
        reply: data.reply,
        source: data?.source === "demo" ? "demo" : "api",
      };
    }

    // If Edge Function returned an error or status
    if (error || data?.error) {
      console.warn(
        "[ai-tutor] API unavailable, using predefined demo response:",
        error || data?.error
      );
      const demoReply = generatePredefinedDemoReply(lastUserMsg);
      return {
        success: true,
        reply: demoReply,
        source: "demo",
      };
    }

    const demoReply = generatePredefinedDemoReply(lastUserMsg);
    return {
      success: true,
      reply: demoReply,
      source: "demo",
    };
  } catch (err: any) {
    console.warn("[ai-tutor] Network/API exception, using predefined demo response:", err);
    const demoReply = generatePredefinedDemoReply(lastUserMsg);
    return {
      success: true,
      reply: demoReply,
      source: "demo",
    };
  }
}

/**
 * Predefined demo answers for academic ECE subjects.
 * Provides instant, high-quality answers when external AI APIs are unavailable.
 */
export function generatePredefinedDemoReply(rawPrompt: string): string {
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
