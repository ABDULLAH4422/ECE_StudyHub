/**
 * Route: /notes/$id
 *
 * Note Detail page — shows full metadata, inline file preview,
 * a download button (increments downloads_count), and an upvote toggle.
 */
import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Download,
  Calendar,
  User,
  BookOpen,
  Hash,
  CalendarDays,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { NotePreview } from "@/components/notes/NotePreview";
import { UpvoteButton } from "@/components/notes/UpvoteButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { fetchNoteById, incrementDownloads } from "@/services/notes";
import { useRole } from "@/context/RoleContext";
import type { StudyNote } from "@/types";

export const Route = createFileRoute("/notes/$id")({
  component: NoteDetailPage,
});

function NoteDetailPage() {
  const { id } = Route.useParams();
  const { currentUser } = useRole();

  const [note, setNote] = useState<StudyNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the note on mount / when id changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchNoteById(id)
      .then((data) => { if (!cancelled) setNote(data); })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Could not load note.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [id]);

  // ── Download handler ────────────────────────────────────────────────────────
  async function handleDownload() {
    if (!note) return;
    // Fire-and-forget: increment counter without blocking the download
    incrementDownloads(note.id).catch(console.error);
    // Open the file in a new tab (browser handles PDF / image inline, others download)
    window.open(note.file_url, "_blank", "noopener,noreferrer");
  }

  // ── Format helpers ──────────────────────────────────────────────────────────
  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* ── Back link ─────────────────────────────────────────────────── */}
        <Link
          to="/notes"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Browse
        </Link>

        {/* ── Loading ───────────────────────────────────────────────────── */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* ── Error ─────────────────────────────────────────────────────── */}
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-6 py-10 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
            <p className="font-semibold text-destructive">{error}</p>
            <Button size="sm" variant="outline" asChild>
              <Link to="/notes">← Back to Browse</Link>
            </Button>
          </div>
        )}

        {/* ── Note content ──────────────────────────────────────────────── */}
        {!loading && !error && note && (
          <>
            {/* Header card */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">

              {/* Title + action row */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 space-y-2">
                  <h1 className="text-xl font-bold leading-snug">{note.title}</h1>
                  {note.description && (
                    <p className="text-sm text-muted-foreground">{note.description}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Upvote — shown to all (demo), only functional when logged in */}
                  <UpvoteButton noteId={note.id} initialCount={note.upvotes_count} />

                  {/* Download */}
                  <Button onClick={handleDownload} className="gap-2" size="sm">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Metadata grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                <MetaRow icon={<BookOpen className="w-4 h-4" />} label="Subject" value={note.subject} />
                <MetaRow icon={<CalendarDays className="w-4 h-4" />} label="Semester" value={`Semester ${note.semester}`} />
                <MetaRow icon={<Hash className="w-4 h-4" />} label="Course Code" value={note.course_code} />
                <MetaRow icon={<User className="w-4 h-4" />} label="Uploaded by" value={note.uploader_name} />
                <MetaRow icon={<Calendar className="w-4 h-4" />} label="Uploaded" value={formatDate(note.created_at)} />
                <MetaRow
                  icon={<Download className="w-4 h-4" />}
                  label="Downloads"
                  value={`${note.downloads_count}`}
                />
              </div>

              {/* File info badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs uppercase">
                  {note.file_type}
                </Badge>
                {note.file_size > 0 && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    {formatSize(note.file_size)}
                  </Badge>
                )}
              </div>
            </div>

            {/* ── Preview ─────────────────────────────────────────────────── */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Preview
              </h2>
              <NotePreview
                fileUrl={note.file_url}
                fileType={note.file_type}
                title={note.title}
              />
            </div>

            {/* ── Bottom download CTA ──────────────────────────────────────── */}
            <div className="flex justify-center">
              <Button onClick={handleDownload} size="lg" className="gap-2">
                <Download className="w-5 h-5" />
                Download {note.file_type.toUpperCase()} File
              </Button>
            </div>
          </>
        )}
      </div>
    </PublicLayout>
  );
}

// ── Small helper for consistent metadata rows ──────────────────────────────────
function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-muted-foreground shrink-0">{icon}</span>
      <div>
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide leading-none mb-0.5">
          {label}
        </p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
