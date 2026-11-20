import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { CGPACalculator } from "@/components/calculators/CGPACalculator";

export const Route = createFileRoute("/cgpa-calculator")({
  component: CGPACalculatorPage,
});

function CGPACalculatorPage() {
  return (
    <PublicLayout>
      <PageHeader
        category="Academic Performance"
        title="CGPA Calculator"
        description="Comprehensive semester GPA and cumulative CGPA estimation tool with multi-semester tracking, course credit weighting, and configurable grading scales."
        breadcrumbs={[
          { label: "Academics", href: "/calculators" },
          { label: "CGPA Calculator" },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <CGPACalculator />
      </div>
    </PublicLayout>
  );
}
