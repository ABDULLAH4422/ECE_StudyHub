import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { StudyPlanner } from "@/components/planner/StudyPlanner";

export const Route = createFileRoute("/study-planner")({
  component: StudyPlannerPage,
});

function StudyPlannerPage() {
  return (
    <PublicLayout>
      <PageHeader
        category="Academic Planning"
        title="Study Planner"
        description="Organize your daily study tasks, track academic coursework deadlines, and monitor your completion progress."
        breadcrumbs={[
          { label: "Academics", href: "/calculators" },
          { label: "Study Planner" },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <StudyPlanner />
      </div>
    </PublicLayout>
  );
}
