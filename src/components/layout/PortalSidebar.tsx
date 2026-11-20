import React, { useState, useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  GraduationCap,
  ChevronRight,
  ChevronDown,
  LogOut,
  X,
  BookOpen,
  FileText,
  Calculator,
  Award,
  Cpu,
  Clock,
  CheckSquare,
  Building2,
} from "lucide-react";
import { useRole } from "@/context/RoleContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PortalSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function PortalSidebar({ mobileOpen = false, onCloseMobile }: PortalSidebarProps) {
  const { currentUser } = useRole();
  const location = useLocation();

  const academicItems = [
    { label: "Undergraduate Curriculum", href: "/curriculum", icon: BookOpen },
    { label: "Study Notes & Materials", href: "/notes", icon: FileText },
    { label: "Academic Calculators", href: "/calculators", icon: Calculator },
    { label: "CGPA Calculator", href: "/cgpa-calculator", icon: Award },
    { label: "Academic Simulators", href: "/simulators", icon: Cpu },
    { label: "Focus Room", href: "/focus-room", icon: Clock },
    { label: "Study Planner", href: "/study-planner", icon: CheckSquare },
    { label: "Laboratories & Facilities", href: "/labs", icon: Building2 },
  ];

  const isAcademicsActive = academicItems.some((item) =>
    item.href === "/notes"
      ? location.pathname.startsWith("/notes")
      : location.pathname === item.href
  );

  const [academicsOpen, setAcademicsOpen] = useState(true);

  // Auto-expand Academics menu when an academic route is active
  useEffect(() => {
    if (isAcademicsActive) {
      setAcademicsOpen(true);
    }
  }, [isAcademicsActive]);

  const roleTitle = "Student Portal";

  const sidebarContent = (
    <div className="flex flex-col h-full bg-card">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border/80 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
          onClick={onCloseMobile}
        >
          <div className="w-8 h-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-base shadow-xs">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-sm leading-none text-foreground">
              ECE StudyHub
            </h2>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
              RUET Academic
            </span>
          </div>
        </Link>
        {onCloseMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-7 w-7 text-muted-foreground"
            onClick={onCloseMobile}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* User Information Pill */}
      <div className="p-3 mx-3 mt-3 rounded-md bg-muted/50 border border-border/60 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-xs shrink-0">
          {currentUser.avatarInitials}
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-xs font-medium text-foreground truncate">
            {currentUser.name}
          </span>
          <span className="text-[11px] text-muted-foreground truncate">
            {currentUser.identifier ? `Roll: ${currentUser.identifier}` : roleTitle}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-medium text-muted-foreground uppercase px-2 py-1 tracking-wider">
          Main Navigation
        </div>

        {/* Dashboard Link */}
        <Link
          to="/student"
          onClick={onCloseMobile}
          className={cn(
            "flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors group",
            location.pathname === "/student"
              ? "bg-primary text-primary-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
          )}
        >
          <div className="flex items-center gap-2.5 truncate">
            <LayoutDashboard
              className={cn(
                "w-4 h-4 shrink-0",
                location.pathname === "/student"
                  ? "text-primary-foreground"
                  : "text-muted-foreground group-hover:text-foreground"
              )}
            />
            <span className="truncate">Dashboard</span>
          </div>
          {location.pathname === "/student" && (
            <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
          )}
        </Link>

        {/* Academics Collapsible Section */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setAcademicsOpen((prev) => !prev)}
            className={cn(
              "w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors group",
              isAcademicsActive && !academicsOpen
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
            )}
          >
            <div className="flex items-center gap-2.5 truncate">
              <GraduationCap
                className={cn(
                  "w-4 h-4 shrink-0",
                  isAcademicsActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span className="truncate">Academics</span>
            </div>
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 shrink-0 transition-transform duration-200 opacity-70",
                !academicsOpen && "-rotate-90"
              )}
            />
          </button>

          {/* Academics Submenu Items */}
          {academicsOpen && (
            <div className="pl-3.5 ml-2 border-l border-border/80 space-y-0.5 mt-1">
              {academicItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/notes"
                    ? location.pathname.startsWith("/notes")
                    : location.pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    to={item.href as any}
                    onClick={onCloseMobile}
                    className={cn(
                      "flex items-center justify-between px-2 py-1.5 rounded-md text-xs font-medium transition-colors group",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon
                        className={cn(
                          "w-3.5 h-3.5 shrink-0",
                          isActive
                            ? "text-primary-foreground"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-3 h-3 shrink-0 opacity-70" />
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Return to Public Site Footer */}
      <div className="p-3 border-t border-border/80">
        <Link
          to="/"
          onClick={onCloseMobile}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit to Public Website</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 border-r border-border/80 min-h-screen flex-col shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="relative w-64 max-w-[80vw] h-full shadow-xl z-50">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
