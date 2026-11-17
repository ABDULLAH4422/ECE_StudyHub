import { createFileRoute } from "@tanstack/react-router";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { NoteReviewQueue } from "@/components/admin/NoteReviewQueue";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/admin/notes")({
  component: AdminNotesPage,
});

function AdminNotesPage() {
  return (
    <PortalLayout
      title="Notes Review & Approval"
      description="Admin Dashboard · Review and approve student-uploaded study materials"
    >
      <NoteReviewQueue />
    </PortalLayout>
  );
}
