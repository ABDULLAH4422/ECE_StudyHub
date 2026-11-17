/**
 * Notes service — all Supabase calls for the StudyHub notes feature.
 *
 * Encapsulates:
 *  - File upload to the "notes" Storage bucket
 *  - CRUD on the "notes" table
 *  - Upvote toggle via the "note_upvotes" join table
 */
import { supabase } from "@/lib/supabase";
import type { StudyNote } from "@/types";

// ─── Storage ──────────────────────────────────────────────────────────────────

/**
 * Upload a file to the Supabase "notes" bucket.
 *
 * @param file   The File object to upload.
 * @param path   Destination path inside the bucket, e.g. "userId/filename.pdf".
 * @param onProgress  Optional callback receiving 0–100 upload percentage.
 * @returns Public URL of the uploaded file.
 */
export async function uploadNoteFile(
  file: File,
  path: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  // Supabase JS v2 does not expose real progress directly via .upload(),
  // so we provide responsive simulated progress during upload.
  let progress = 10;
  if (onProgress) onProgress(progress);

  const progressInterval = setInterval(() => {
    if (progress < 85) {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress > 85) progress = 85;
      if (onProgress) onProgress(progress);
    }
  }, 150);

  try {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("notes")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    clearInterval(progressInterval);

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    if (onProgress) onProgress(100);

    // Get the public URL from the bucket
    const { data } = supabase.storage.from("notes").getPublicUrl(uploadData?.path ?? path);
    return data.publicUrl;
  } catch (err) {
    clearInterval(progressInterval);
    throw err;
  }
}

// ─── Notes Table ──────────────────────────────────────────────────────────────

/** Shape of data used when inserting a new note. */
export interface InsertNotePayload {
  title: string;
  description: string;
  subject: string;
  semester: string;
  course_code: string;
  file_url: string;
  file_path: string;     // Storage bucket path
  file_type: string;
  file_size: number;
  uploaded_by: string;   // demo user id (or real Supabase auth uid later)
  uploader_name: string;
  status: "PENDING_REVIEW";
}

/**
 * Insert a new row into the `notes` table.
 * If uploaded_by is not a valid UUID and DB column is UUID, gracefully falls back to null.
 */
export async function insertNote(payload: InsertNotePayload): Promise<StudyNote> {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.uploaded_by);
  
  const rowToInsert: Record<string, unknown> = { ...payload };
  if (!isUUID) {
    rowToInsert["uploaded_by"] = null;
  }

  // Resilient retry loop: gracefully handles missing columns in DB schema (e.g. file_path) or type mismatches
  for (let attempt = 0; attempt < 3; attempt++) {
    const { data, error } = await supabase
      .from("notes")
      .insert(rowToInsert)
      .select()
      .maybeSingle();

    if (!error) {
      return (data ?? rowToInsert) as StudyNote;
    }

    // Handle missing column in Supabase schema cache (e.g., 'file_path')
    if (error.message.includes("in the schema cache")) {
      const match = error.message.match(/Could not find the '([^']+)' column/);
      if (match && match[1] && match[1] in rowToInsert) {
        delete rowToInsert[match[1]];
        continue;
      }
    }

    // Handle UUID type rejection if mock string was passed
    if (error.message.includes("invalid input syntax for type uuid") && "uploaded_by" in rowToInsert) {
      delete rowToInsert["uploaded_by"];
      continue;
    }

    throw new Error(error.message);
  }

  return rowToInsert as unknown as StudyNote;
}

/** Filter options for fetching approved notes. */
export interface NotesFilter {
  subject?: string;
  semester?: string;
  course_code?: string;
  search?: string;
  sort?: "newest" | "most_upvoted";
}

/**
 * Fetch all approved notes with optional filters and sorting.
 */
export async function fetchApprovedNotes(filter: NotesFilter = {}): Promise<StudyNote[]> {
  let query = supabase
    .from("notes")
    .select("*")
    .eq("status", "APPROVED");

  // Dropdown filters (exact match)
  if (filter.subject) query = query.eq("subject", filter.subject);
  if (filter.semester) query = query.eq("semester", filter.semester);
  if (filter.course_code) query = query.eq("course_code", filter.course_code);

  // Text search across title and description (ILIKE)
  if (filter.search) {
    const term = `%${filter.search}%`;
    query = query.or(`title.ilike.${term},description.ilike.${term}`);
  }

  // Sorting
  if (filter.sort === "most_upvoted") {
    query = query.order("upvotes_count", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as StudyNote[];
}

/**
 * Fetch a single note by its ID.
 */
export async function fetchNoteById(id: string): Promise<StudyNote> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as StudyNote;
}

/**
 * Increment the downloads_count for a note.
 * Uses a Postgres RPC to avoid race conditions.
 * Falls back to a plain update if the RPC isn't deployed.
 */
export async function incrementDownloads(id: string): Promise<void> {
  // Try RPC first; if not set up, fall back to read-then-write
  const { error: rpcError } = await supabase.rpc("increment_downloads", { note_id: id });
  if (rpcError) {
    // Fallback: fetch current count and add 1
    const { data } = await supabase.from("notes").select("downloads_count").eq("id", id).single();
    await supabase
      .from("notes")
      .update({ downloads_count: (data?.downloads_count ?? 0) + 1 })
      .eq("id", id);
  }
}

// ─── Upvotes ──────────────────────────────────────────────────────────────────

/**
 * Check whether a specific user has already upvoted a note.
 */
export async function hasUserUpvoted(noteId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("note_upvotes")
    .select("id")
    .eq("note_id", noteId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return false;
  return data !== null;
}

/**
 * Toggle an upvote for a note.
 * - If the user hasn't voted → insert a row + increment `upvotes_count`
 * - If the user has voted   → delete the row + decrement `upvotes_count`
 *
 * @returns `true` if the vote was added, `false` if it was removed.
 */
export async function toggleUpvote(noteId: string, userId: string): Promise<boolean> {
  const alreadyVoted = await hasUserUpvoted(noteId, userId);

  if (alreadyVoted) {
    // Remove vote
    await supabase
      .from("note_upvotes")
      .delete()
      .eq("note_id", noteId)
      .eq("user_id", userId);

    // Decrement counter (floor at 0)
    const { data } = await supabase
      .from("notes")
      .select("upvotes_count")
      .eq("id", noteId)
      .single();
    await supabase
      .from("notes")
      .update({ upvotes_count: Math.max(0, (data?.upvotes_count ?? 1) - 1) })
      .eq("id", noteId);

    return false;
  } else {
    // Add vote
    await supabase.from("note_upvotes").insert({ note_id: noteId, user_id: userId });

    // Increment counter
    const { data } = await supabase
      .from("notes")
      .select("upvotes_count")
      .eq("id", noteId)
      .single();
    await supabase
      .from("notes")
      .update({ upvotes_count: (data?.upvotes_count ?? 0) + 1 })
      .eq("id", noteId);

    return true;
  }
}

/**
 * Fetch distinct subjects from approved notes (for filter dropdowns).
 */
export async function fetchNoteSubjects(): Promise<string[]> {
  const { data, error } = await supabase
    .from("notes")
    .select("subject")
    .eq("status", "APPROVED");
  if (error || !data) return [];
  return [...new Set(data.map((r: { subject: string }) => r.subject))].sort();
}

/**
 * Fetch distinct semesters from approved notes (for filter dropdowns).
 */
export async function fetchNoteSemesters(): Promise<string[]> {
  const { data, error } = await supabase
    .from("notes")
    .select("semester")
    .eq("status", "APPROVED");
  if (error || !data) return [];
  return [...new Set(data.map((r: { semester: string }) => r.semester))].sort();
}

/**
 * Fetch distinct course codes from approved notes (for filter dropdowns).
 */
export async function fetchNoteCourseCodes(): Promise<string[]> {
  const { data, error } = await supabase
    .from("notes")
    .select("course_code")
    .eq("status", "APPROVED");
  if (error || !data) return [];
  return [...new Set(data.map((r: { course_code: string }) => r.course_code))].sort();
}
