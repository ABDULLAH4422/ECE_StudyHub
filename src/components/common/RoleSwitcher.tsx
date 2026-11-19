import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/context/RoleContext";
import { ChevronDown, GraduationCap, UserCheck } from "lucide-react";

interface RoleSwitcherProps {
  variant?: "outline" | "ghost" | "secondary";
  showLabel?: boolean;
  className?: string;
}

export function RoleSwitcher({
  variant = "outline",
  showLabel = true,
  className,
}: RoleSwitcherProps) {
  const { currentUser, setUserByRole } = useRole();

  const userDisplayName = currentUser.identifier || currentUser.name;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className={`h-8 gap-2 text-xs border-border/80 font-normal hover:bg-muted/60 ${className || ""}`}
        >
          <UserCheck className="w-3.5 h-3.5 text-muted-foreground" />
          {showLabel && (
            <span className="hidden sm:inline font-medium text-foreground">
              {userDisplayName}
            </span>
          )}
          <Badge
            variant="secondary"
            className="text-[11px] font-normal px-1.5 py-0 rounded text-muted-foreground"
          >
            Student
          </Badge>
          <ChevronDown className="w-3 h-3 text-muted-foreground opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 shadow-md">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          Active Account View
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setUserByRole("STUDENT")}
          className="flex items-center justify-between text-xs py-2 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span className="font-medium">Student View</span>
          </div>
          <span className="text-[11px] text-muted-foreground truncate max-w-[100px]">
            {userDisplayName}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
