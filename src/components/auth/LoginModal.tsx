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
import { Lock, UserCheck, Key, LogIn, CheckCircle2, ShieldCheck, GraduationCap, BookOpen, Building2 } from "lucide-react";
import { useRole } from "@/context/RoleContext";
import { loginUser } from "@/services/api";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { setUserByRole, switchUser } = useRole();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = await loginUser(email, password);
    setLoading(false);

    if (result.success && result.user) {
      setSuccessMessage(`Authenticated as ${result.user.name} (${result.user.role})`);
      setUserByRole(result.user.role);
      setTimeout(() => {
        onOpenChange(false);
        setSuccessMessage(null);
      }, 1000);
    } else {
      setErrorMessage(result.message || "Authentication failed. Check credentials.");
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string, demoRole: "STUDENT" | "FACULTY" | "DEPARTMENT_ADMIN" | "SYSTEM_ADMIN") => {
    setEmail(demoEmail);
    setPassword(demoRole === "STUDENT" ? "Student123!" : demoRole === "FACULTY" ? "Faculty123!" : demoRole === "DEPARTMENT_ADMIN" ? "Hod123!" : "Admin123!");
    setLoading(true);

    const result = await loginUser(demoEmail, demoRole === "STUDENT" ? "Student123!" : demoRole === "FACULTY" ? "Faculty123!" : demoRole === "DEPARTMENT_ADMIN" ? "Hod123!" : "Admin123!");
    setLoading(false);

    setUserByRole(demoRole);
    setSuccessMessage(`Logged in as ${demoRole.replace("_", " ")}`);
    setTimeout(() => {
      onOpenChange(false);
      setSuccessMessage(null);
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" /> ECE StudyHub Authentic Portal Sign-In
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Enter your credentials or choose a pre-configured demo account to test JWT authentication & RBAC against PostgreSQL backend.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4 pt-2">
          {errorMessage && (
            <div className="p-2.5 rounded bg-destructive/10 border border-destructive/30 text-destructive text-xs font-mono">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> {successMessage}
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="student.demo@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-8 text-xs font-mono"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="text-xs">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-8 text-xs font-mono"
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-8 text-xs font-semibold gap-2">
            <LogIn className="w-3.5 h-3.5" /> {loading ? "Verifying Credentials..." : "Sign In with JWT"}
          </Button>
        </form>

        {/* Demo Quick Accounts Section */}
        <div className="pt-3 border-t border-border space-y-2">
          <div className="text-[10px] font-mono text-muted-foreground uppercase flex items-center justify-between">
            <span>Pre-Configured Demo Accounts</span>
            <Badge variant="outline" className="text-[9px] font-mono">PostgreSQL Seeded</Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickDemoLogin("student.demo@example.com", "STUDENT")}
              className="h-8 justify-start text-[11px] font-mono gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">Student</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickDemoLogin("faculty.demo@example.com", "FACULTY")}
              className="h-8 justify-start text-[11px] font-mono gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="truncate">Faculty</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickDemoLogin("hod.demo@example.com", "DEPARTMENT_ADMIN")}
              className="h-8 justify-start text-[11px] font-mono gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span className="truncate">HOD Admin</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickDemoLogin("admin.demo@example.com", "SYSTEM_ADMIN")}
              className="h-8 justify-start text-[11px] font-mono gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">Sys Admin</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
