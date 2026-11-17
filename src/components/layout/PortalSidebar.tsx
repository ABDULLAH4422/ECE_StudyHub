import React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Upload,
  ClipboardList,
  FlaskConical,
  CheckSquare,
  BarChart3,
  Bell,
  MessageSquare,
  Star,
  Calendar,
  User,
  Users,
  Building2,
  GraduationCap,
  ShieldAlert,
  Settings,
  Target,
  FileSpreadsheet,
  Award,
  Layers,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";
import { useRole } from "@/context/RoleContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PortalSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function PortalSidebar({ mobileOpen = false, onCloseMobile }: PortalSidebarProps) {
  const { currentUser, activeRole } = useRole();
  const location = useLocation();

  // Navigation Items per Role
  const studentItems = [
    { label: "Dashboard", href: "/student", icon: LayoutDashboard },
    { label: "My Courses", href: "/student/courses", icon: BookOpen },
    { label: "Materials", href: "/student/materials", icon: FileText },
    { label: "Assignments", href: "/student/assignments", icon: ClipboardList },
    { label: "Lab Reports", href: "/student/labs", icon: FlaskConical },
    { label: "Attendance", href: "/student/attendance", icon: CheckSquare },
    { label: "Results & Grades", href: "/student/results", icon: BarChart3 },
    { label: "Academic Calendar", href: "/student/calendar", icon: Calendar },
    { label: "My Profile", href: "/student/profile", icon: User },
  ];

  const facultyItems = [
    { label: "Dashboard", href: "/faculty-portal", icon: LayoutDashboard },
    { label: "Assigned Courses", href: "/faculty-portal/courses", icon: BookOpen },
    { label: "Course Materials", href: "/faculty-portal/materials", icon: Upload },
    { label: "Assignments", href: "/faculty-portal/assignments", icon: ClipboardList },
    { label: "Submissions", href: "/faculty-portal/submissions", icon: FlaskConical },
    { label: "Attendance Tracker", href: "/faculty-portal/attendance", icon: CheckSquare },
    { label: "Upload Marks", href: "/faculty-portal/results", icon: BarChart3 },
    { label: "My Profile", href: "/faculty-portal/profile", icon: User },
  ];

  const hodItems = [
    { label: "Dashboard", href: "/hod", icon: LayoutDashboard },
    { label: "Faculty Directory", href: "/hod/faculty", icon: Users },
    { label: "Course Directory", href: "/hod/courses", icon: BookOpen },
    { label: "Teacher Allocation", href: "/hod/allocations", icon: Layers },
    { label: "Batch Management", href: "/hod/batches", icon: GraduationCap },
    { label: "OBE Attainment", href: "/hod/obe-reports", icon: FileSpreadsheet },
    { label: "Department Analytics", href: "/hod/analytics", icon: BarChart3 },
  ];

  const adminItems = [
    { label: "System Overview", href: "/admin", icon: LayoutDashboard },
    { label: "User Management", href: "/admin/users", icon: Users },
    { label: "Roles & Permissions", href: "/admin/roles", icon: ShieldAlert },
    { label: "Faculty Database", href: "/admin/faculty", icon: Users },
    { label: "Activity Audit Logs", href: "/admin/logs", icon: ClipboardList },
    { label: "System Settings", href: "/admin/settings", icon: Settings },
  ];

  let navItems = studentItems;
  let roleTitle = "Student Portal";

  if (activeRole === "FACULTY") {
    navItems = facultyItems;
    roleTitle = "Faculty Portal";
  } else if (activeRole === "DEPARTMENT_ADMIN") {
    navItems = hodItems;
    roleTitle = "HOD Management";
  } else if (activeRole === "SYSTEM_ADMIN") {
    navItems = adminItems;
    roleTitle = "System Admin";
  }

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
            {roleTitle}
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
