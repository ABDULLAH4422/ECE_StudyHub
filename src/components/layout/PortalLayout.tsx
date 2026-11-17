import React, { useState } from "react";
import { PortalSidebar } from "./PortalSidebar";
import { PortalHeader } from "./PortalHeader";

interface PortalLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string | undefined;
}

export function PortalLayout({ children, title, description }: PortalLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      {/* Sidebar - Handles both desktop sticky and mobile overlay */}
      <PortalSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader
          title={title}
          description={description}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
