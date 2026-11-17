import React from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { notifications } from "@/data/demo";
import { RoleSwitcher } from "@/components/common/RoleSwitcher";

interface PortalHeaderProps {
  title: string;
  description?: string | undefined;
  onOpenMobileSidebar?: () => void;
}

export function PortalHeader({ title, description, onOpenMobileSidebar }: PortalHeaderProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/80 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Title & Mobile Toggle */}
      <div className="flex items-center gap-3 min-w-0">
        {onOpenMobileSidebar && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8 text-muted-foreground shrink-0"
            onClick={onOpenMobileSidebar}
            aria-label="Open portal sidebar menu"
          >
            <Menu className="w-4 h-4" />
          </Button>
        )}
        <div className="min-w-0">
          <h1 className="font-display font-semibold text-base sm:text-lg text-foreground tracking-tight truncate">
            {title}
          </h1>
          {description && (
            <p className="text-xs text-muted-foreground truncate hidden sm:block">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Search Input */}
        <div className="relative hidden lg:block w-56">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search records..."
            className="pl-8 h-8 text-xs bg-muted/40 border-border/70"
          />
        </div>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground hover:text-foreground">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 shadow-md">
            <DropdownMenuLabel className="text-xs font-medium flex items-center justify-between py-2">
              <span>Notifications</span>
              <span className="text-[11px] text-muted-foreground font-normal">
                {unreadCount} unread
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-64 overflow-y-auto space-y-1 p-1">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-2.5 rounded-md text-xs transition-colors ${
                    item.read
                      ? "text-muted-foreground hover:bg-muted/40"
                      : "bg-muted/50 text-foreground font-medium"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 font-medium">
                    <span className="truncate">{item.title}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{item.at}</span>
                  </div>
                  <p className="text-[11px] mt-0.5 text-muted-foreground font-normal line-clamp-2">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Unified Role Switcher */}
        <RoleSwitcher />
      </div>
    </header>
  );
}
