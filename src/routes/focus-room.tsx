import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { FocusRoom } from "@/components/focus/FocusRoom";

export const Route = createFileRoute("/focus-room")({
  component: FocusRoomPage,
});

function FocusRoomPage() {
  return (
    <PublicLayout>
      <PageHeader
        category="Academic Tools"
        title="Focus Room"
        description="Distraction-free Pomodoro study environment with customizable intervals, background ambient sound, tab-accurate countdown, and progress analytics."
        breadcrumbs={[
          { label: "Academics", href: "/calculators" },
          { label: "Focus Room" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <FocusRoom />
      </div>
    </PublicLayout>
  );
}
