import React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  GraduationCap,
  ChevronRight,
  LogOut,
  X,
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

  // Simplified Student Portal Navigation: Only Dashboard is kept
  const navItems = [
    { label: "Dashboard", href: "/student", icon: LayoutDashboard },
  ];

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
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <div className="text-[10px] font-medium text-muted-foreground uppercase px-2 py-1 tracking-wider">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href as any}
              onClick={onCloseMobile}
              className={cn(
                "flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
              )}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-70" />}
            </Link>
          );
        })}
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
