/**
 * UploadForm — the full note upload form.
 *
 * Responsibilities:
 *  1. Validate file type (PDF, DOCX, PPT, PNG, JPG) and size (≤ 20 MB) client-side.
 *  2. Upload the file to the Supabase "notes" Storage bucket with progress reporting.
 *  3. Insert a row into the `notes` table with status = "pending".
 *  4. Show clear success / error messages and reset the form on success.
 */
import React, { useRef, useState } from "react";
import {
  UploadCloud,
  CheckCircle2,
  XCircle,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { uploadNoteFile, insertNote } from "@/services/notes";
import { useRole } from "@/context/RoleContext";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Allowed MIME types keyed by their display extension. */
const ALLOWED_TYPES: Record<string, string[]> = {
  pdf: ["application/pdf"],
  docx: [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ],
  ppt: [
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-powerpoint",
  ],
  png: ["image/png"],
  jpg: ["image/jpeg"],
};

const ALLOWED_MIME_SET = new Set(Object.values(ALLOWED_TYPES).flat());
const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Circuit Theory",
  "Electronics",
  "Digital Electronics",
  "Signals & Systems",
  "Microprocessors",
  "Communication Systems",
  "Electromagnetics",
  "Control Systems",
  "Power Systems",
  "VLSI Design",
  "Embedded Systems",
  "Computer Networks",
  "Other",
];

const SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"];

// ─── Component ────────────────────────────────────────────────────────────────

interface FormState {
  title: string;
  description: string;
  subject: string;
  semester: string;
  courseCode: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  subject: "",
  semester: "",
  courseCode: "",
};

export function UploadForm() {
  const { currentUser } = useRole();

  // Form fields
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);

  // UI state
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleFieldChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError(null);
    setError(null);
    setSuccess(null);
    const selected = e.target.files?.[0] ?? null;
    if (!selected) { setFile(null); return; }

    // Client-side type check
    if (!ALLOWED_MIME_SET.has(selected.type)) {
      setFileError("Invalid file type. Please upload PDF, DOCX, PPT, PNG, or JPG.");
      setFile(null);
      e.target.value = "";
      return;
    }

    // Client-side size check
    if (selected.size > MAX_SIZE_BYTES) {
      setFileError(`File is too large (${(selected.size / 1024 / 1024).toFixed(1)} MB). Maximum is 20 MB.`);
      setFile(null);
      e.target.value = "";
      return;
    }

    setFile(selected);
  }

  /** Derive a lowercase extension string from the file's MIME type. */
  function getExtension(f: File): string {
    for (const [ext, mimes] of Object.entries(ALLOWED_TYPES)) {
      if (mimes.includes(f.type)) return ext;
    }
    return f.name.split(".").pop()?.toLowerCase() ?? "bin";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic required-field guard
    if (!form.title || !form.subject || !form.semester || !form.courseCode) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Build a unique storage path: userId/timestamp-filename
      const ext = getExtension(file);
      const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `${currentUser.id}/${Date.now()}-${safeFilename}`;

      // 1. Upload file to Supabase Storage
      const fileUrl = await uploadNoteFile(file, storagePath, setProgress);

      // 2. Insert metadata row
      await insertNote({
        title: form.title.trim(),
        description: form.description.trim(),
        subject: form.subject,
        semester: form.semester,
        course_code: form.courseCode.trim().toUpperCase(),
        file_url: fileUrl,
        file_path: storagePath,
        file_type: ext,
        file_size: file.size,
        uploaded_by: currentUser.id,
        uploader_name: currentUser.name,
        status: "PENDING_REVIEW",
      });

      // 3. Success — reset everything
      setSuccess(
        "Note uploaded successfully! It will appear in the browse list after admin approval."
      );
      setForm(EMPTY_FORM);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setProgress(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>

      {/* ── Status banners ───────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-start gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* ── Title ─────────────────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="e.g. Chapter 4 — Fourier Transforms"
          value={form.title}
          onChange={(e) => handleFieldChange("title", e.target.value)}
          disabled={uploading}
          required
        />
      </div>

      {/* ── Description ───────────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Brief description of what this note covers…"
          value={form.description}
          onChange={(e) => handleFieldChange("description", e.target.value)}
          disabled={uploading}
          rows={3}
          className="resize-none"
        />
      </div>

      {/* ── Subject + Semester row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>
            Subject <span className="text-destructive">*</span>
          </Label>
          <Select
            value={form.subject}
            onValueChange={(v) => handleFieldChange("subject", v)}
            disabled={uploading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>
            Semester <span className="text-destructive">*</span>
          </Label>
          <Select
            value={form.semester}
            onValueChange={(v) => handleFieldChange("semester", v)}
            disabled={uploading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              {SEMESTERS.map((s) => (
                <SelectItem key={s} value={s}>Semester {s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Course Code ───────────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <Label htmlFor="courseCode">
          Course Code <span className="text-destructive">*</span>
        </Label>
        <Input
          id="courseCode"
          placeholder="e.g. ECE 2105"
          value={form.courseCode}
          onChange={(e) => handleFieldChange("courseCode", e.target.value)}
          disabled={uploading}
          required
          className="font-mono"
        />
      </div>

      {/* ── File Input ────────────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <Label htmlFor="file">
          File <span className="text-destructive">*</span>
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            PDF, DOCX, PPT, PNG, JPG — max 20 MB
          </span>
        </Label>

        {/* Drop-zone style wrapper */}
        <label
          htmlFor="file"
          className={`
            flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed
            px-6 py-8 cursor-pointer transition-colors
            ${fileError ? "border-destructive/60 bg-destructive/5" : "border-border hover:border-primary/50 hover:bg-accent/30"}
            ${uploading ? "pointer-events-none opacity-50" : ""}
          `}
        >
          {file ? (
            <>
              <FileText className="w-8 h-8 text-primary" />
              <span className="text-sm font-medium text-foreground">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
              <span className="text-xs text-primary underline">Click to change</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-8 h-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Click to browse or drag & drop
              </span>
            </>
          )}
        </label>

        <input
          ref={fileInputRef}
          id="file"
          type="file"
          accept=".pdf,.docx,.doc,.ppt,.pptx,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          disabled={uploading}
          className="sr-only"  /* visually hidden; label acts as the trigger */
        />

        {fileError && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <XCircle className="w-3 h-3" /> {fileError}
          </p>
        )}
      </div>

      {/* ── Upload Progress ───────────────────────────────────────────────── */}
      {uploading && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin" /> Uploading…
            </span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      )}

      {/* ── Submit ────────────────────────────────────────────────────────── */}
      <Button
        type="submit"
        disabled={uploading}
        className="w-full gap-2"
        size="lg"
      >
        {uploading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
        ) : (
          <><UploadCloud className="w-4 h-4" /> Upload Note</>
        )}
      </Button>
    </form>
  );
}
