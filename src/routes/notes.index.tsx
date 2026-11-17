/**
 * Route: /notes
 *
 * Browse & Search page — public, lists all approved notes.
 *
 * Features:
 *  - Responsive card grid (NoteCard)
 *  - Dropdown filters: subject, semester, course code
 *  - Debounced search input (title / description ILIKE)
 *  - Sort toggle: Newest | Most Upvoted
 *  - Clean empty state
 */
import React, { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search,
  SlidersHorizontal,
  UploadCloud,
  BookOpen,
  X,
  Loader2,
} from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { NoteCard } from "@/components/notes/NoteCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchApprovedNotes,
  fetchNoteSubjects,
  fetchNoteSemesters,
  fetchNoteCourseCodes,
} from "@/services/notes";
import type { StudyNote } from "@/types";

export const Route = createFileRoute("/notes/")({
  component: BrowseNotesPage,
});

// ── Simple debounce hook ───────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// ── Page component ─────────────────────────────────────────────────────────────
function BrowseNotesPage() {
  // Filter state
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("all");
  const [semester, setSemester] = useState("all");
  const [courseCode, setCourseCode] = useState("all");
  const [sort, setSort] = useState<"newest" | "most_upvoted">("newest");

  // Data state
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter options (populated from DB)
  const [subjectOptions, setSubjectOptions] = useState<string[]>([]);
  const [semesterOptions, setSemesterOptions] = useState<string[]>([]);
  const [courseCodeOptions, setCourseCodeOptions] = useState<string[]>([]);

  const debouncedSearch = useDebounce(search, 400);

  // Load filter options once
  useEffect(() => {
    Promise.all([
      fetchNoteSubjects(),
      fetchNoteSemesters(),
      fetchNoteCourseCodes(),
    ]).then(([subjects, semesters, codes]) => {
      setSubjectOptions(subjects);
      setSemesterOptions(semesters);
      setCourseCodeOptions(codes);
    });
  }, []);

  // Re-fetch whenever filters / sort change
  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Build filter object omitting undefined values (required by exactOptionalPropertyTypes)
      const filter: Parameters<typeof fetchApprovedNotes>[0] = { sort };
      if (subject !== "all") filter.subject = subject;
      if (semester !== "all") filter.semester = semester;
      if (courseCode !== "all") filter.course_code = courseCode;
      if (debouncedSearch) filter.search = debouncedSearch;

      const data = await fetchApprovedNotes(filter);
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notes.");
    } finally {
      setLoading(false);
    }
  }, [subject, semester, courseCode, debouncedSearch, sort]);

  useEffect(() => { loadNotes(); }, [loadNotes]);

  // Reset all filters
  function clearFilters() {
    setSearch("");
    setSubject("all");
    setSemester("all");
    setCourseCode("all");
    setSort("newest");
  }

  const hasActiveFilters =
    search || subject !== "all" || semester !== "all" || courseCode !== "all";

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              Study Notes
            </h1>
            <p className="text-sm text-muted-foreground">
              Browse peer-reviewed study materials shared by ECE students.
            </p>
          </div>
          <Button asChild size="sm" className="gap-2 shrink-0">
            <Link to="/notes/upload">
              <UploadCloud className="w-4 h-4" /> Upload Notes
            </Link>
          </Button>
        </div>

        {/* ── Filters & Search ────────────────────────────────────────────── */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative lg:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search notes…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Subject dropdown */}
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue placeholder="All subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All subjects</SelectItem>
                {subjectOptions.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Semester dropdown */}
            <Select value={semester} onValueChange={setSemester}>
              <SelectTrigger>
                <SelectValue placeholder="All semesters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All semesters</SelectItem>
                {semesterOptions.map((s) => (
                  <SelectItem key={s} value={s}>Semester {s}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Course code dropdown */}
            <Select value={courseCode} onValueChange={setCourseCode}>
              <SelectTrigger>
                <SelectValue placeholder="All courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All courses</SelectItem>
                {courseCodeOptions.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort + clear row */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Sort by:</span>
              <Button
                variant={sort === "newest" ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setSort("newest")}
              >
                Newest
              </Button>
              <Button
                variant={sort === "most_upvoted" ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setSort("most_upvoted")}
              >
                Most Upvoted
              </Button>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1 text-muted-foreground"
                onClick={clearFilters}
              >
                <X className="w-3 h-3" /> Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* ── Results ─────────────────────────────────────────────────────── */}
        {loading ? (
          /* Loading skeleton */
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          /* Error state */
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 text-destructive px-6 py-8 text-center text-sm space-y-2">
            <p className="font-semibold">Failed to load notes</p>
            <p className="text-xs">{error}</p>
            <Button size="sm" variant="outline" onClick={loadNotes} className="mt-2">
              Retry
            </Button>
          </div>
        ) : notes.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <BookOpen className="w-16 h-16 text-muted-foreground/40" strokeWidth={1} />
            <div className="space-y-1">
              <p className="font-semibold text-foreground">No notes found</p>
              <p className="text-sm text-muted-foreground">
                {hasActiveFilters
                  ? "Try adjusting your filters or search term."
                  : "Be the first to share study materials with the community!"}
              </p>
            </div>
            {hasActiveFilters ? (
              <Button size="sm" variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : (
              <Button size="sm" asChild>
                <Link to="/notes/upload">
                  <UploadCloud className="w-4 h-4 mr-2" /> Upload Notes
                </Link>
              </Button>
            )}
          </div>
        ) : (
          /* Notes grid */
          <>
            <p className="text-xs text-muted-foreground">
              {notes.length} note{notes.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {notes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          </>
        )}

      </div>
    </PublicLayout>
  );
}
