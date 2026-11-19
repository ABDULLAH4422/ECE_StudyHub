import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  RotateCcw,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { useRole } from "@/context/RoleContext";
import { loginUser } from "@/services/api";
import { supabase } from "@/lib/supabase";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Validates whether an email belongs to RUET or is a pre-configured demo account */
function isRuetEmail(email: string): boolean {
  const normalized = email.toLowerCase().trim();
  if (normalized.endsWith(".demo@example.com") || normalized.endsWith("@example.com")) return true;
  return /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)?ruet\.ac\.bd$/i.test(normalized);
}

/** Parses student roll and batch series from RUET student emails (e.g. 1901001@s.ruet.ac.bd) */
function parseRuetStudentEmail(email: string) {
  const match = email.toLowerCase().trim().match(/^(\d{2})(\d{2})(\d{3})@/);
  if (!match) return null;
  const [_, series, deptCode, id] = match;
  return {
    roll: `${series}${deptCode}${id}`,
    series: `${series} Series`,
    isECE: deptCode === "01",
  };
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { setUserByRole, setAuthenticatedUser } = useRole();

  // Mode: "otp" (verification code) or "password"
  const [authMode, setAuthMode] = useState<"otp" | "password">("otp");

  // Step for OTP: "email" (enter email) or "verify" (enter 6-digit code)
  const [otpStep, setOtpStep] = useState<"email" | "verify">("email");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const studentInfo = parseRuetStudentEmail(email);

  // ── Step 1: Send 6-Digit Verification Code to RUET Email ───────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!isRuetEmail(cleanEmail)) {
      setErrorMessage(
        "Access Restricted: Please enter your official RUET email address (e.g., 1901001@s.ruet.ac.bd or name@ece.ruet.ac.bd)."
      );
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        throw error;
      }

      setOtpStep("verify");
      setSuccessMessage(`A 6-digit verification code has been sent to ${cleanEmail}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send verification code.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify 6-Digit Code ───────────────────────────────────────────────
  const handleVerifyOtp = async (codeToVerify?: string) => {
    const token = (codeToVerify ?? otpCode).trim();
    if (token.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const cleanEmail = email.toLowerCase().trim();
      const { data, error } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token,
        type: "email",
      });

      if (error) {
        throw error;
      }

      // Successful verification
      const rollInfo = parseRuetStudentEmail(cleanEmail);
      const rollNum: string = rollInfo?.roll ?? (cleanEmail.split("@")[0] || "Student");

      setAuthenticatedUser({
        id: data.user?.id ?? `ruet-${rollNum}`,
        name: `Roll: ${rollNum}`,
        identifier: rollNum,
        email: cleanEmail,
        role: "STUDENT",
        batch: rollInfo?.series ?? "RUET Student",
        avatarInitials: rollNum.slice(-2).toUpperCase(),
        status: "ACTIVE",
        emailVerified: true,
      });

      setSuccessMessage(`Verified! Welcome Student Roll: ${rollNum}`);

      setTimeout(() => {
        onOpenChange(false);
        resetState();
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid or expired verification code.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Resend Code ───────────────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    setResending(true);
    setErrorMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase().trim(),
        options: { shouldCreateUser: true },
      });
      if (error) throw error;
      setSuccessMessage("New verification code sent! Check your RUET inbox.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to resend code.";
      setErrorMessage(msg);
    } finally {
      setResending(false);
    }
  };

  // ── Password-Based Login (Alternative for Admin / Faculty) ───────────────────
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (!isRuetEmail(email)) {
      setLoading(false);
      setErrorMessage(
        "Access Restricted: Please enter your official RUET email address (e.g., 1901001@s.ruet.ac.bd)."
      );
      return;
    }

    const result = await loginUser(email, password);
    setLoading(false);

    if (result.success && result.user) {
      setSuccessMessage(`Authenticated as ${result.user.name} (${result.user.role})`);
      setUserByRole(result.user.role);
      setTimeout(() => {
        onOpenChange(false);
        resetState();
      }, 1000);
    } else {
      setErrorMessage(result.message || "Authentication failed. Check your password.");
    }
  };

  // ── Demo Quick Login ──────────────────────────────────────────────────────────
  const handleQuickDemoLogin = async (
    demoEmail: string,
    demoRole: "STUDENT" | "FACULTY" | "DEPARTMENT_ADMIN" | "SYSTEM_ADMIN"
  ) => {
    setEmail(demoEmail);
    setUserByRole(demoRole);
    setSuccessMessage(`Logged in with demo role: ${demoRole.replace("_", " ")}`);
    setTimeout(() => {
      onOpenChange(false);
      resetState();
    }, 800);
  };

  const resetState = () => {
    setEmail("");
    setPassword("");
    setOtpCode("");
    setOtpStep("email");
    setErrorMessage(null);
    setSuccessMessage(null);
    setAuthMode("otp");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetState();
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-md bg-card border-border/80">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
            <Lock className="w-4 h-4 text-primary" /> ECE StudyHub Portal Sign In
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {authMode === "otp"
              ? otpStep === "email"
                ? "Enter your official RUET email to receive a 6-digit login verification code."
                : `Enter the 6-digit code sent to ${email}`
              : "Sign in with your password or use a demo account."}
          </DialogDescription>
        </DialogHeader>

        {/* Error / Success Notifications */}
        {errorMessage && (
          <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}
        {successMessage && (
          <div className="p-3 rounded-md bg-primary/10 border border-primary/20 text-primary text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ── MODE 1: EMAIL OTP VERIFICATION CODE (RECOMMENDED) ──────────────── */}
        {authMode === "otp" && (
          <>
            {otpStep === "email" ? (
              /* Step 1: Input RUET Email */
              <form onSubmit={handleSendOtp} className="space-y-4 pt-1">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ruet-email" className="text-xs font-medium">
                      RUET Email Address
                    </Label>
                    <span className="text-[11px] text-muted-foreground font-normal">
                      @ruet.ac.bd required
                    </span>
                  </div>
                  <Input
                    id="ruet-email"
                    type="email"
                    placeholder="1901001@s.ruet.ac.bd"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMessage(null);
                    }}
                    className="h-9 text-xs"
                    autoFocus
                    required
                  />
                  {studentInfo && (
                    <div className="p-2 rounded-md bg-muted/40 border border-border/60 text-[11px] text-muted-foreground flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>
                        Verified Format: Roll {studentInfo.roll} · {studentInfo.series} {studentInfo.isECE ? "(ECE)" : ""}
                      </span>
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={loading} className="w-full h-9 text-xs font-medium gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  {loading ? "Sending Verification Code..." : "Send Verification Code"}
                </Button>
              </form>
            ) : (
              /* Step 2: Input 6-Digit OTP Code */
              <div className="space-y-5 pt-2">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <Label className="text-xs font-medium text-center">
                    Enter the 6-Digit Code
                  </Label>

                  {/* 6-Slot OTP Input Component */}
                  <InputOTP
                    maxLength={6}
                    value={otpCode}
                    onChange={(val) => {
                      setOtpCode(val);
                      setErrorMessage(null);
                      if (val.length === 6) {
                        handleVerifyOtp(val);
                      }
                    }}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>

                  <p className="text-[11px] text-muted-foreground text-center">
                    Check your RUET email inbox or spam folder for the code.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    disabled={loading || otpCode.length !== 6}
                    onClick={() => handleVerifyOtp()}
                    className="w-full h-9 text-xs font-medium gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {loading ? "Verifying Code..." : "Verify & Sign In"}
                  </Button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setOtpStep("email");
                        setOtpCode("");
                        setErrorMessage(null);
                      }}
                      className="text-xs h-7 text-muted-foreground hover:text-foreground"
                    >
                      ← Change Email
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={resending}
                      onClick={handleResendOtp}
                      className="text-xs h-7 gap-1 text-primary hover:underline"
                    >
                      <RotateCcw className="w-3 h-3" />
                      {resending ? "Resending..." : "Resend Code"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Switch to Password Mode */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("password");
                  setErrorMessage(null);
                }}
                className="text-xs text-muted-foreground hover:text-foreground hover:underline inline-flex items-center gap-1"
              >
                <KeyRound className="w-3 h-3" /> Or sign in with password
              </button>
            </div>
          </>
        )}

        {/* ── MODE 2: PASSWORD LOGIN ─────────────────────────────────────────── */}
        {authMode === "password" && (
          <form onSubmit={handlePasswordLogin} className="space-y-3.5 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="pass-email" className="text-xs font-medium">RUET Email</Label>
              <Input
                id="pass-email"
                type="email"
                placeholder="1901001@s.ruet.ac.bd"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pass-val" className="text-xs font-medium">Password</Label>
              <Input
                id="pass-val"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-9 text-xs font-medium gap-2">
              <Lock className="w-3.5 h-3.5" />
              {loading ? "Signing in..." : "Sign In with Password"}
            </Button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("otp");
                  setErrorMessage(null);
                }}
                className="text-xs text-primary hover:underline inline-flex items-center gap-1"
              >
                <Mail className="w-3 h-3" /> Switch to Email Verification Code (OTP)
              </button>
            </div>
          </form>
        )}

        {/* Demo Quick Accounts Section */}
        <div className="pt-3 border-t border-border/80 space-y-2">
          <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center justify-between">
            <span>Examiner & Demo Quick Access</span>
            <Badge variant="outline" className="text-[10px] font-normal">Mock Student</Badge>
          </div>

          <div className="grid grid-cols-1 gap-2 text-xs">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickDemoLogin("student.demo@example.com", "STUDENT")}
              className="h-8 justify-start text-xs gap-2"
            >
              <GraduationCap className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">Student Demo (Sadia M. Rahman · Roll: 1901001)</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
