import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Menu,
  X,
  ChevronDown,
  LogIn,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRole } from "@/context/RoleContext";
import { LoginModal } from "@/components/auth/LoginModal";
import { RoleSwitcher } from "@/components/common/RoleSwitcher";

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { currentUser } = useRole();

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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Top Institutional Bar */}
      <div className="border-b bg-muted text-muted-foreground text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-foreground tracking-wide uppercase text-[11px]">
              RUET
            </span>
            <span className="opacity-30">|</span>
            <span className="truncate">
              Department of Electrical & Computer Engineering
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3 shrink-0 text-[11px]">
            <span>BAETE Accredited</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Department Branding */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 rounded-md bg-primary text-primary-foreground flex items-center justify-center transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base leading-tight tracking-tight text-foreground">
                ECE StudyHub
              </span>
              <span className="text-[11px] text-muted-foreground">
                Academic Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              activeProps={{ className: "text-foreground bg-muted" }}
            >
              Home
            </Link>

            {/* Department Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                  <span>Department</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/about" className="text-sm">
                    About Department
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/vision-mission" className="text-sm">
                    Vision & Mission
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/faculty" className="text-sm">
                    Faculty Directory
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Academics Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                  <span>Academics</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuItem asChild>
                  <Link to="/curriculum" className="text-sm">
                    Curriculum
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/notes" className="text-sm">
                    Study Notes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/labs" className="text-sm">
                    Laboratories
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Research Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                  <span>Research</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/research" className="text-sm">
                    Research Groups
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/publications" className="text-sm">
                    Publications
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/achievements" className="text-sm">
                    Achievements
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="/alumni"
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              activeProps={{ className: "text-foreground bg-muted" }}
            >
              Alumni
            </Link>

            <Link
              to="/contact"
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              activeProps={{ className: "text-foreground bg-muted" }}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Role Switcher */}
            <RoleSwitcher />

            {/* Portal Button */}
            <Button size="sm" asChild className="text-sm gap-1.5">
              <Link to={portalInfo.to as any}>
                {portalInfo.label}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </Button>

            {/* Sign In Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLoginModalOpen(true)}
              className="text-sm gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
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
        <div className="lg:hidden border-t bg-background px-4 py-6 space-y-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                Department
              </p>
              <div className="grid grid-cols-2 gap-1">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                >
                  About
                </Link>
                <Link
                  to="/vision-mission"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                >
                  Vision & Mission
                </Link>
                <Link
                  to="/faculty"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                >
                  Faculty
                </Link>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                Academics & Research
              </p>
              <div className="grid grid-cols-2 gap-1">
                <Link
                  to="/curriculum"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                >
                  Curriculum
                </Link>
                <Link
                  to="/notes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                >
                  Study Notes
                </Link>
                <Link
                  to="/labs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                >
                  Laboratories
                </Link>
                <Link
                  to="/research"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                >
                  Research
                </Link>
                <Link
                  to="/publications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                >
                  Publications
                </Link>
                <Link
                  to="/achievements"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                >
                  Achievements
                </Link>
                <Link
                  to="/alumni"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                >
                  Alumni
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button size="sm" asChild className="w-full" onClick={() => setMobileMenuOpen(false)}>
              <Link to={portalInfo.to as any}>
                Open {portalInfo.label}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
