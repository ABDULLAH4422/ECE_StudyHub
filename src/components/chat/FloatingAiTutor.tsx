import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  Bot,
  User,
  Loader2,
  ChevronDown,
  BookOpen,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { sendChatMessage, type ChatMessage } from "@/services/aiTutor";
import { cn } from "@/lib/utils";

const INITIAL_MESSAGE: ChatMessage = {
  id: "welcome-tutor",
  role: "assistant",
  content:
    "Hello! I am your **ECE StudyHub AI Tutor**.\n\nI can help you understand engineering topics, solve circuit problems, explain formulas, or prepare for RUET exams. What would you like to study today?",
  createdAt: new Date(),
};

const SUGGESTED_QUESTIONS = [
  "⚡ Explain Thevenin's Theorem with steps",
  "🔬 How does a MOSFET operate in saturation?",
  "📐 Ideal Op-Amp gain formulas",
  "📋 RUET continuous assessment rules",
];

export function FloatingAiTutor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? inputValue).trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setLoading(true);

    try {
      // Pass full conversation history for context preservation
      const res = await sendChatMessage(newMessages);

      const assistantMessage: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: "assistant",
        content: res.reply,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (!isOpen) {
        setUnreadCount((c) => c + 1);
      }
    } catch (err) {
      console.error("[FloatingAiTutor] Error:", err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content:
          "⚠️ I encountered an issue connecting to the AI service. Please check your network connection or try again in a moment.",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setInputValue("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <>
      {/* ── Floating Popup Window ────────────────────────────────────────── */}
      {isOpen && (
        <div
          className={cn(
            "fixed bottom-20 right-4 sm:right-6 z-50",
            "w-[350px] sm:w-[390px] h-[520px] max-h-[calc(100vh-6.5rem)] max-w-[calc(100vw-2rem)]",
            "bg-card text-card-foreground border border-border/80 rounded-xl shadow-2xl",
            "flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200"
          )}
          role="dialog"
          aria-label="AI Study Tutor Window"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-border/80 bg-muted/30 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-semibold text-xs sm:text-sm text-foreground truncate">
                    AI Study Tutor
                  </h3>
                  <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" title="Online" />
                </div>
                <p className="text-[10px] text-muted-foreground truncate font-mono">
                  RUET ECE · Gemini
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleResetChat}
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                title="Reset conversation"
                aria-label="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                title="Close chat"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={cn("flex gap-2.5", isUser ? "justify-end" : "justify-start")}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={cn(
                      "px-3 py-2 rounded-lg text-xs leading-relaxed max-w-[85%] break-words",
                      isUser
                        ? "bg-primary text-primary-foreground rounded-tr-xs shadow-xs"
                        : "bg-muted/60 text-foreground border border-border/60 rounded-tl-xs"
                    )}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>

                  {isUser && (
                    <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Quick Suggestions (Shown when conversation is fresh) */}
            {messages.length === 1 && (
              <div className="pt-2 space-y-1.5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground px-1">
                  Suggested Questions
                </span>
                <div className="flex flex-col gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSendMessage(q)}
                      className="text-left px-2.5 py-1.5 rounded-md bg-muted/40 hover:bg-muted/80 text-[11px] text-foreground border border-border/50 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="px-3 py-2 rounded-lg bg-muted/60 border border-border/60 text-muted-foreground text-xs flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin text-primary" />
                  <span>Thinking & researching...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input & Send Footer */}
          <div className="p-2.5 border-t border-border/80 bg-background/95">
            <div className="relative flex items-center gap-1.5">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about circuits, formulas, syllabus..."
                rows={1}
                disabled={loading}
                className={cn(
                  "flex-1 min-h-[38px] max-h-24 p-2 text-xs bg-muted/40 border border-border/80 rounded-md",
                  "focus:outline-hidden focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                )}
              />
              <Button
                size="icon"
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || loading}
                className="h-[38px] w-[38px] shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
                title="Send message (Enter)"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="mt-1.5 text-[9px] text-center text-muted-foreground/80 font-mono">
              Press Enter to send · Shift+Enter for new line
            </div>
          </div>
        </div>
      )}

      {/* ── Fixed Circular Floating Trigger Icon ────────────────────────── */}
      <div className="fixed bottom-5 right-4 sm:right-6 z-50">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "h-12 w-12 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95",
            "flex items-center justify-center border border-border/70",
            isOpen
              ? "bg-muted text-foreground hover:bg-muted/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
          aria-label={isOpen ? "Close AI Study Tutor" : "Open AI Study Tutor"}
          title={isOpen ? "Close AI Study Tutor" : "Open AI Study Tutor"}
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
                  {unreadCount}
                </span>
              )}
            </div>
          )}
        </button>
      </div>
    </>
  );
}
