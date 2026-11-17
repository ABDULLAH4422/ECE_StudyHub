/**
 * Admin Notes Service
 *
 * Handles admin-specific operations for note approval workflow:
 * - Fetch notes by status (PENDING_REVIEW, APPROVED, REJECTED)
 * - Approve notes
 * - Reject notes with reason
 * - Delete notes and their associated files
 */
import { supabase } from "@/lib/supabase";
import type { StudyNote } from "@/types";

export type NoteStatus = "PENDING_REVIEW" | "APPROVED" | "REJECTED";

export interface NoteReviewPayload {
  noteId: string;
  reviewerId: string;
  reviewerName: string;
}

export interface RejectNotePayload extends NoteReviewPayload {
  rejectionReason: string;
}

/**
 * Fetch all notes with a specific status.
 * Used by admin dashboard to show pending, approved, or rejected notes.
 */
export async function fetchNotesByStatus(status: NoteStatus): Promise<StudyNote[]> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch notes: ${error.message}`);
  return (data ?? []) as StudyNote[];
}

/**
 * Fetch all pending notes for admin review.
 * Convenience wrapper for fetchNotesByStatus.
 */
export async function fetchPendingNotes(): Promise<StudyNote[]> {
  return fetchNotesByStatus("PENDING_REVIEW");
}

/**
 * Approve a note.
 * Updates status to APPROVED and records who approved it and when.
 */
export async function approveNote(payload: NoteReviewPayload): Promise<void> {
  const { error } = await supabase
    .from("notes")
    .update({
      status: "APPROVED",
      reviewed_by: payload.reviewerId,
      reviewed_at: new Date().toISOString(),
      rejection_reason: null, // Clear any previous rejection reason
    })
    .eq("id", payload.noteId);

  if (error) throw new Error(`Failed to approve note: ${error.message}`);
}

/**
 * Reject a note with a reason.
 * Updates status to REJECTED and records who rejected it, when, and why.
 */
export async function rejectNote(payload: RejectNotePayload): Promise<void> {
  const { error } = await supabase
    .from("notes")
    .update({
      status: "REJECTED",
      reviewed_by: payload.reviewerId,
      reviewed_at: new Date().toISOString(),
      rejection_reason: payload.rejectionReason.trim(),
    })
    .eq("id", payload.noteId);

  if (error) throw new Error(`Failed to reject note: ${error.message}`);
}

/**
 * Delete a note and its associated file from storage.
 * Used for removing rejected notes or cleaning up bad uploads.
 */
export async function deleteNote(noteId: string): Promise<void> {
  // 1. Fetch the note record (safely select all existing columns)
  const { data: note } = await supabase
    .from("notes")
    .select("*")
    .eq("id", noteId)
    .maybeSingle();

  // 2. Delete the file from storage if file_path exists on the record
  const noteRecord = note as Record<string, unknown> | null;
  const filePath = noteRecord ? (noteRecord["file_path"] as string | undefined) : undefined;
  if (filePath) {
    const { error: storageError } = await supabase.storage
      .from("notes")
      .remove([filePath]);

    if (storageError) {
      console.warn(`Failed to delete file from storage: ${storageError.message}`);
      // Continue with database deletion even if storage deletion fails
    }
  }

  // 3. Delete the database record
  const { error: deleteError } = await supabase
    .from("notes")
    .delete()
    .eq("id", noteId);

  if (deleteError) throw new Error(`Failed to delete note: ${deleteError.message}`);
}

/**
 * Fetch notes uploaded by a specific user.
 * Used for showing students their own uploads and their approval status.
 */
export async function fetchUserNotes(userId: string): Promise<StudyNote[]> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("uploaded_by", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch user notes: ${error.message}`);
  return (data ?? []) as StudyNote[];
}

/**
 * Get count of notes by status.
 * Used for admin dashboard statistics.
 */
export async function getNoteStatusCounts(): Promise<{
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}> {
  const { data, error } = await supabase
    .from("notes")
    .select("status");

  if (error) throw new Error(`Failed to fetch note counts: ${error.message}`);

  const counts = {
    pending: 0,
    approved: 0,
    rejected: 0,
    total: data?.length ?? 0,
  };

  data?.forEach((note: { status: string }) => {
    if (note.status === "PENDING_REVIEW") counts.pending++;
    else if (note.status === "APPROVED") counts.approved++;
    else if (note.status === "REJECTED") counts.rejected++;
  });

  return counts;
}
