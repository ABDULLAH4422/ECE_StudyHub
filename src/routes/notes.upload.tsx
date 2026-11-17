/**
 * Route: /notes/upload
 *
 * Upload Notes page — only for logged-in users.
 * Wraps <UploadForm /> inside the standard PublicLayout.
 * Demo auth: checks that the active role is STUDENT or FACULTY
 * (DEPARTMENT_ADMIN / SYSTEM_ADMIN can also upload).
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { UploadCloud, ArrowLeft, Lock } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { UploadForm } from "@/components/notes/UploadForm";
import { useRole } from "@/context/RoleContext";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/notes/upload")({
  component: UploadNotesPage,
});

function UploadNotesPage() {
  const { currentUser } = useRole();

  // In the demo all users are "logged in". In a real Supabase setup you would
  // replace this with a session check, e.g. `supabase.auth.getSession()`.
  const isLoggedIn = Boolean(currentUser);

  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="space-y-1">
          <Link
            to="/notes"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Browse
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2 mt-2">
            <UploadCloud className="w-6 h-6 text-primary" />
            Upload Study Notes
          </h1>
          <p className="text-sm text-muted-foreground">
            Share your notes with the ECE community. Uploaded files are reviewed
            by an admin before becoming publicly visible.
          </p>
        </div>

        {/* ── Auth guard ──────────────────────────────────────────────────── */}
        {!isLoggedIn ? (
          <div className="rounded-lg border border-border bg-muted/40 flex flex-col items-center gap-4 py-16 text-center px-6">
            <Lock className="w-12 h-12 text-muted-foreground" />
            <div className="space-y-1">
              <p className="font-semibold text-foreground">Sign in to upload notes</p>
              <p className="text-sm text-muted-foreground">
                You need to be logged in to share study materials.
              </p>
            </div>
            <Button asChild size="sm">
              <Link to="/">Go to Sign In</Link>
            </Button>
          </div>
        ) : (
          /* ── Upload form ──────────────────────────────────────────────── */
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <UploadForm />
          </div>
        )}

      </div>
    </PublicLayout>
  );
}
