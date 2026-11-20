import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Menu,
  X,
  ChevronDown,
  LogIn,
  LogOut,
  ArrowUpRight,
  User as UserIcon,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/context/RoleContext";
import { LoginModal } from "@/components/auth/LoginModal";
import { RoleSwitcher } from "@/components/common/RoleSwitcher";

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { currentUser, isLoggedIn, logout } = useRole();

  const getPortalInfo = () => {
    switch (currentUser.role) {
      case "FACULTY":
        return { label: "Faculty Portal", to: "/faculty-portal" };
      case "DEPARTMENT_ADMIN":
        return { label: "HOD Portal", to: "/hod" };
      case "SYSTEM_ADMIN":
        return { label: "Admin Portal", to: "/admin" };
      default:
        return { label: "Student Portal", to: "/student" };
    }
  };

  const portalInfo = getPortalInfo();

  // Determine user display label (Roll Number if student, or name)
  const userRollOrName = currentUser.identifier
    ? currentUser.identifier
    : currentUser.name;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md">
      {/* Top Institutional Bar */}
      <div className="border-b border-border/60 bg-muted/40 text-muted-foreground text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-foreground tracking-wide uppercase text-[11px]">
              RUET
            </span>
            <span className="text-border">|</span>
            <span className="truncate">
              Department of Electrical & Computer Engineering
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 shrink-0 text-[11px]">
            <span>BAETE OBE Accredited</span>
            <span className="text-border">•</span>
            <span className="text-foreground/80 font-medium">Session 2020-21</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Department Branding */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-base shadow-xs group-hover:bg-primary/90 transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base leading-tight tracking-tight text-foreground">
                ECE StudyHub
              </span>
              <span className="text-[11px] text-muted-foreground tracking-normal">
                Academic Management Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/"
              className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md transition-colors"
              activeProps={{ className: "text-foreground font-semibold bg-muted/80" }}
            >
              Home
            </Link>

            {/* Department Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md transition-colors outline-hidden">
                  <span>Department</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 shadow-md">
                <DropdownMenuItem asChild>
                  <Link to="/about" className="text-xs w-full py-1.5">
                    About Department
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/vision-mission" className="text-xs w-full py-1.5">
                    Vision, Mission & OBE
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/faculty" className="text-xs w-full py-1.5">
                    Faculty Directory
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Academics Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md transition-colors outline-hidden">
                  <span>Academics</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 shadow-md">
                <DropdownMenuItem asChild>
                  <Link to="/curriculum" className="text-xs w-full py-1.5">
                    Undergraduate Curriculum
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/notes" className="text-xs w-full py-1.5">
                    Study Notes & Materials
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/calculators" className="text-xs w-full py-1.5">
                    Academic Calculators
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/cgpa-calculator" className="text-xs w-full py-1.5">
                    CGPA Calculator
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/simulators" className="text-xs w-full py-1.5">
                    Academic Simulators
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/focus-room" className="text-xs w-full py-1.5">
                    Focus Room
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/study-planner" className="text-xs w-full py-1.5">
                    Study Planner
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/labs" className="text-xs w-full py-1.5">
                    Laboratories & Facilities
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Research Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md transition-colors outline-hidden">
                  <span>Research</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 shadow-md">
                <DropdownMenuItem asChild>
                  <Link to="/research" className="text-xs w-full py-1.5">
                    Research Groups
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/publications" className="text-xs w-full py-1.5">
                    Publications
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/achievements" className="text-xs w-full py-1.5">
                    Achievements
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="/alumni"
              className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md transition-colors"
              activeProps={{ className: "text-foreground font-semibold bg-muted/80" }}
            >
              Alumni
            </Link>

            <Link
              to="/contact"
              className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md transition-colors"
              activeProps={{ className: "text-foreground font-semibold bg-muted/80" }}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* If NOT logged in: Show Role Switcher & Sign In Button */}
            {!isLoggedIn ? (
              <>
                <RoleSwitcher />

                <Button
                  size="sm"
                  onClick={() => setLoginModalOpen(true)}
                  className="h-8 text-xs font-medium gap-1.5 shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Button>
              </>
            ) : (
              /* When LOGGED IN: Sign In button is GONE, replaced by Student Roll Number pill & Portal link */
              <>
                {/* Portal Access Button */}
                <Button size="sm" variant="outline" asChild className="h-8 text-xs font-medium gap-1">
                  <Link to={portalInfo.to as any}>
                    <span>{portalInfo.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-70" />
                  </Link>
                </Button>

                {/* Logged-In User Profile Menu (Displays Roll Number) */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 gap-2 text-xs border border-border/80 font-medium px-2.5"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-primary" />
                      <span className="font-semibold text-foreground">
                        Roll: {userRollOrName}
                      </span>
                      <ChevronDown className="w-3 h-3 text-muted-foreground opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60 shadow-md">
                    <DropdownMenuLabel className="py-2">
                      <div className="text-xs font-semibold text-foreground flex items-center justify-between">
                        <span>Roll: {userRollOrName}</span>
                        <Badge variant="outline" className="text-[10px] uppercase font-mono px-1 py-0">
                          {currentUser.role}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate font-normal mt-0.5">
                        {currentUser.email}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/student" className="text-xs py-1.5 cursor-pointer">
                        <GraduationCap className="w-3.5 h-3.5 mr-2 text-primary" />
                        Student Academic Portal
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/notes" className="text-xs py-1.5 cursor-pointer">
                        <BookOpen className="w-3.5 h-3.5 mr-2 text-primary" />
                        Browse Study Notes
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-xs py-1.5 text-destructive focus:text-destructive cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8 text-muted-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Sign In Dialog */}
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background px-4 py-5 space-y-5 animate-in fade-in-50 duration-150">
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground mb-1.5">
                Department
              </p>
              <div className="grid grid-cols-2 gap-1">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-md"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-md"
                >
                  About Overview
                </Link>
                <Link
                  to="/vision-mission"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-md"
                >
                  Vision & Mission
                </Link>
                <Link
                  to="/faculty"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-md"
                >
                  Faculty Directory
                </Link>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground mb-1.5">
                Academics & Research
              </p>
              <div className="grid grid-cols-2 gap-1">
                <Link
                  to="/curriculum"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-md"
                >
                  Curriculum & Syllabus
                </Link>
                <Link
                  to="/notes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-md"
                >
                  Study Notes
                </Link>
                <Link
                  to="/calculators"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-md"
                >
                  Calculators
                </Link>
                <Link
                  to="/cgpa-calculator"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-md"
                >
                  CGPA Calculator
                </Link>
                <Link
                  to="/simulators"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-md"
                >
                  Simulators
                </Link>
                <Link
                  to="/focus-room"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-md"
                >
                  Focus Room
                </Link>
                <Link
                  to="/study-planner"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-md"
                >
                  Study Planner
                </Link>
                <Link
                  to="/labs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-md"
                >
                  Laboratories
                </Link>
                <Link
                  to="/research"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-md"
                >
                  Research Groups
                </Link>
                <Link
                  to="/publications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-md"
                >
                  Publications
                </Link>
                <Link
                  to="/achievements"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-md"
                >
                  Achievements
                </Link>
                <Link
                  to="/alumni"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-md"
                >
                  Alumni Network
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-md"
                >
                  Contact Office
                </Link>
              </div>
            </div>
          </div>

          {/* User Account / Portal in Mobile Drawer */}
          <div className="pt-3 border-t border-border space-y-2">
            {isLoggedIn ? (
              <div className="space-y-2">
                <div className="p-3 rounded-md bg-muted/50 border border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <div>
                      <div className="text-xs font-semibold text-foreground">
                        Roll: {userRollOrName}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {currentUser.email}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs h-7 text-destructive"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-1" />
                    Sign Out
                  </Button>
                </div>
                <Button size="sm" asChild className="w-full text-xs" onClick={() => setMobileMenuOpen(false)}>
                  <Link to={portalInfo.to as any}>
                    Open {portalInfo.label}
                  </Link>
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                className="w-full text-xs gap-1.5"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setLoginModalOpen(true);
                }}
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In to Portal
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
