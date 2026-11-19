/**
 * Route: /student/ai-tutor
 *
 * General AI Study Tutor — a chat interface that helps students understand
 * topics, solve problems and prepare for exams.
 *
 * NOTE: The AI backend is not wired up yet. Replies are produced by a local
 * mock responder so the interface can be developed and demoed end-to-end.
 * Swap `generateMockReply` for a real API call (e.g. Gemini) when ready.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  Send,
  SquarePen,
  BookOpenCheck,
  Sigma,
  ListChecks,
  CalendarRange,
  FileText,
  Lightbulb,
  Info,
} from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useRole } from "@/context/RoleContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/ai-tutor")({
  component: AiTutorPage,
});

/* ───────────────────────────── Types ───────────────────────────── */

type ChatRole = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: Date;
}

/* ───────────────────────── Mock responder ───────────────────────── */

/**
 * Placeholder for the real LLM integration. Returns a deterministic,
 * helpful-looking answer based on keywords in the prompt.
 */
function generateMockReply(rawPrompt: string): string {
  const q = rawPrompt.toLowerCase();

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

const createWelcomeMessage = (): ChatMessage => ({
  id: "welcome",
  role: "assistant",
  content: "Hello! I'm your AI Study Tutor. What would you like to learn today?",
  createdAt: new Date(),
});

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const SUGGESTED_PROMPTS = [
  {
    icon: BookOpenCheck,
    label: "Explain a topic in simple language",
    prompt: "Explain a difficult topic in simple language.",
  },
  {
    icon: Sigma,
    label: "Help me solve a problem",
    prompt: "Help me solve a circuit problem step by step.",
  },
  {
    icon: ListChecks,
    label: "Generate MCQs for my exam",
    prompt: "Generate MCQs for my upcoming exam.",
  },
  {
    icon: CalendarRange,
    label: "Create a study plan",
    prompt: "Create a 2-week study plan for my next exam.",
  },
  {
    icon: FileText,
    label: "Summarize my notes",
    prompt: "Summarize my notes into key points.",
  },
];

/* ─────────────────────────── Page ──────────────────────────────── */

function AiTutorPage() {
  const { currentUser } = useRole();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [createWelcomeMessage()]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const showSuggestions = messages.length <= 1 && !isThinking;

  // Keep the conversation pinned to the latest message.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking]);

  // Clear any pending mock-reply timer on unmount.
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const sendMessage = (rawText: string) => {
    const text = rawText.trim();
    if (!text || isThinking) return;

    setMessages((prev) => [
      ...prev,
      { id: createId(), role: "user", content: text, createdAt: new Date() },
    ]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsThinking(true);

    const reply = generateMockReply(text);
    timeoutRef.current = window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: createId(), role: "assistant", content: reply, createdAt: new Date() },
      ]);
      setIsThinking(false);
    }, 900 + Math.random() * 700);
  };

  const handleNewChat = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsThinking(false);
    setMessages([createWelcomeMessage()]);
    setInput("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(input);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    const el = event.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  return (
    <PortalLayout
      title="AI Study Tutor"
      description="Ask questions, get step-by-step explanations, and prepare for exams"
    >
      <div className="flex h-[calc(100dvh-7.5rem)] min-h-[540px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {/* ── Tutor header bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display text-sm font-semibold text-foreground">
                  AI Study Tutor
                </span>
                <Badge variant="outline" className="text-[10px] font-normal">
                  Preview
                </Badge>
              </div>
              <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Online · General ECE study help
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNewChat}
            className="shrink-0 gap-1.5"
          >
            <SquarePen className="h-4 w-4" />
            <span className="hidden sm:inline">New Chat</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>

        {/* ── Body: chat + optional side panel ── */}
        <div className="flex min-h-0 flex-1">
          {/* Chat column */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6"
              aria-live="polite"
            >
              {messages.map((message) =>
                message.role === "assistant" ? (
                  <div key={message.id} className="flex max-w-[92%] items-start gap-2.5 sm:max-w-[80%]">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="whitespace-pre-wrap rounded-2xl rounded-tl-sm border border-border/70 bg-muted/40 px-4 py-2.5 text-sm leading-relaxed text-foreground">
                        {message.content}
                      </div>
                      <span className="mt-1 block px-1 text-[10px] text-muted-foreground">
                        {message.createdAt.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    key={message.id}
                    className="ml-auto flex max-w-[92%] flex-row-reverse items-start gap-2.5 sm:max-w-[80%]"
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-[11px] font-semibold text-primary-foreground">
                      {currentUser.avatarInitials}
                    </div>
                    <div className="min-w-0">
                      <div className="whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground">
                        {message.content}
                      </div>
                      <span className="mt-1 block px-1 text-right text-[10px] text-muted-foreground">
                        {message.createdAt.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ),
              )}

              {/* Typing indicator */}
              {isThinking && (
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-border/70 bg-muted/40 px-4 py-3">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                    <span className="sr-only">AI is thinking…</span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested prompts (shown until the first real exchange) */}
            {showSuggestions && (
              <div className="border-t border-border/60 bg-background/40 px-4 py-3 sm:px-6">
                <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Suggested questions
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_PROMPTS.map(({ icon: Icon, label, prompt }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
                    >
                      <Icon className="h-3.5 w-3.5 text-primary" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Composer */}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage(input);
              }}
              className="border-t border-border/80 bg-background p-3 sm:p-4"
            >
              <div className="flex items-end gap-2">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="Ask about circuits, signals, digital logic, exam prep…"
                  aria-label="Message the AI Study Tutor"
                  className="max-h-40 min-h-[44px] flex-1 resize-none py-2.5 text-sm"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isThinking}
                  aria-label="Send message"
                  className="h-11 w-11 shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 px-1 text-[10px] leading-tight text-muted-foreground">
                AI Study Tutor is in preview — answers are illustrative and may contain mistakes.
                Always verify with your course materials. Press Enter to send, Shift+Enter for a new line.
              </p>
            </form>
          </div>

          {/* Side panel (wide screens only) */}
          <aside className="hidden w-72 shrink-0 flex-col gap-4 overflow-y-auto border-l border-border/80 bg-muted/20 p-5 xl:flex">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                What I can help with
              </h3>
              <ul className="mt-2 space-y-2 text-xs text-foreground">
                {[
                  "Step-by-step problem solving",
                  "Concept explanations in plain language",
                  "MCQ and short-question practice",
                  "Exam study plans and revision lists",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-border/70 bg-card p-3 text-xs text-muted-foreground">
              <div className="mb-1.5 flex items-center gap-1.5 font-medium text-foreground">
                <Info className="h-3.5 w-3.5 text-primary" />
                Tips for better answers
              </div>
              <ul className="list-inside list-disc space-y-1">
                <li>Mention the course code (e.g. EEE 2203)</li>
                <li>Paste the exact problem statement</li>
                <li>Say whether you want intuition or full derivations</li>
              </ul>
            </div>

            <div className="mt-auto rounded-lg border border-dashed border-border/80 p-3 text-[11px] leading-snug text-muted-foreground">
              Preview build — responses come from a placeholder responder, not a live model yet.
              Course-aware answers are coming after AI integration.
            </div>
          </aside>
        </div>
      </div>
    </PortalLayout>
  );
}
