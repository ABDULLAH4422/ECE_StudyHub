/**
 * AI Study Tutor Service
 * Connects frontend chat to Supabase Edge Function ("ai-tutor") powered by Google Gemini API.
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
  source?: "edge-function" | "gemini-direct" | "mock-tutor";
}

const SYSTEM_PROMPT = `You are the ECE StudyHub AI Tutor for the Department of Electrical & Computer Engineering at RUET (Rajshahi University of Engineering & Technology).
Help students with undergraduate electrical and computer engineering concepts, circuit calculations, formulas, and exam prep. Format replies cleanly in markdown.`;

/**
 * Sends a conversation context to the AI Study Tutor.
 * Maintains context by sending all recent messages in the session.
 */
export async function sendChatMessage(messages: ChatMessage[]): Promise<AiTutorResponse> {
  const payload = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  // ── 1. Attempt call through Supabase Edge Function ("ai-tutor") ─────────────
  try {
    const { data, error } = await supabase.functions.invoke("ai-tutor", {
      body: { messages: payload },
    });

    if (!error && data?.reply) {
      return {
        success: true,
        reply: data.reply,
        source: "edge-function",
      };
    }

    if (error) {
      console.warn("[ai-tutor] Supabase Edge Function returned error:", error);
    }
  } catch (edgeErr) {
    console.warn("[ai-tutor] Failed to invoke Supabase Edge Function:", edgeErr);
  }

  // ── 2. Fallback: Direct Gemini API if VITE_GEMINI_API_KEY is configured in .env ──
  const clientGeminiKey = import.meta.env["VITE_GEMINI_API_KEY"] as string | undefined;
  if (clientGeminiKey) {
    try {
      const contents = payload.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${clientGeminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents,
            generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
          }),
        }
      );

      const json = await res.json();
      const reply = json?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply) {
        return {
          success: true,
          reply,
          source: "gemini-direct",
        };
      }
    } catch (directErr) {
      console.warn("[ai-tutor] Direct Gemini API fallback failed:", directErr);
    }
  }

  // ── 3. Educational Local Responder Fallback (if edge function is not deployed yet) ──
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content || "";
  const fallbackReply = generateEducationalFallback(lastUserMsg);

  return {
    success: true,
    reply: fallbackReply,
    source: "mock-tutor",
  };
}

/**
 * Intelligent local academic fallback when the remote Edge Function secret isn't configured yet.
 */
function generateEducationalFallback(rawPrompt: string): string {
  const q = rawPrompt.toLowerCase();

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
      "",
      "> *Tip: Deploy the Supabase Edge Function `ai-tutor` with your `GEMINI_API_KEY` for live generative responses to any custom numerical!*",
    ].join("\n");
  }

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

  if (q.includes("exam") || q.includes("grading") || q.includes("gpa") || q.includes("ruet")) {
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

  return [
    `I received your query: "${rawPrompt}"`,
    "",
    "To provide instant live answers from Google's Gemini LLM across all ECE curriculum topics:",
    "1. Deploy the included Supabase Edge Function `supabase/functions/ai-tutor/index.ts`.",
    "2. Set the `GEMINI_API_KEY` in your Supabase project (or define `VITE_GEMINI_API_KEY` in your `.env`).",
    "",
    "In the meantime, feel free to ask about:",
    "- **Circuit Analysis:** Thevenin, Norton, KVL, KCL, Nodal/Mesh analysis",
    "- **Electronics:** MOSFETs, BJTs, Diodes, Op-Amps",
    "- **Digital Logic:** K-Maps, Boolean algebra, Flip-flops",
    "- **RUET Academics:** Grading ordinance and syllabus advice",
  ].join("\n");
}
