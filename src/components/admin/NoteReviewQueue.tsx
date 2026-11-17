/**
 * NoteReviewQueue — Admin component for reviewing pending note uploads.
 *
 * Features:
 * - Display all pending notes in a table
 * - Preview note details (title, description, subject, uploader)
 * - Approve notes with one click
 * - Reject notes with a required reason
 * - Delete notes with confirmation
 */
import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  Trash2,
  FileText,
  Download,
  Loader2,
  AlertCircle,
  Clock,
  User,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { StudyNote } from "@/types";
import {
  fetchPendingNotes,
  approveNote,
  rejectNote,
  deleteNote,
  getNoteStatusCounts,
} from "@/services/adminNotes";
import { useRole } from "@/context/RoleContext";

export function NoteReviewQueue() {
  const { currentUser } = useRole();

  // State
  const [pendingNotes, setPendingNotes] = useState<StudyNote[]>([]);
  const [statusCounts, setStatusCounts] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Action states
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<StudyNote | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [notes, counts] = await Promise.all([
        fetchPendingNotes(),
        getNoteStatusCounts(),
      ]);
      setPendingNotes(notes);
      setStatusCounts(counts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load pending notes");
    } finally {
      setLoading(false);
    }
  }

  // Approve a note
  async function handleApprove(note: StudyNote) {
    setProcessingId(note.id);
    try {
      await approveNote({
        noteId: note.id,
        reviewerId: currentUser.id,
        reviewerName: currentUser.name,
      });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve note");
    } finally {
      setProcessingId(null);
    }
  }

  // Open reject dialog
  function openRejectDialog(note: StudyNote) {
    setSelectedNote(note);
    setRejectionReason("");
    setRejectDialogOpen(true);
  }

  // Reject a note
  async function handleReject() {
    if (!selectedNote || !rejectionReason.trim()) return;

    setProcessingId(selectedNote.id);
    try {
      await rejectNote({
        noteId: selectedNote.id,
        reviewerId: currentUser.id,
        reviewerName: currentUser.name,
        rejectionReason: rejectionReason.trim(),
      });
      setRejectDialogOpen(false);
      setSelectedNote(null);
      setRejectionReason("");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject note");
    } finally {
      setProcessingId(null);
    }
  }

  // Open delete dialog
  function openDeleteDialog(note: StudyNote) {
    setSelectedNote(note);
    setDeleteDialogOpen(true);
  }

  // Delete a note
  async function handleDelete() {
    if (!selectedNote) return;

    setProcessingId(selectedNote.id);
    try {
      await deleteNote(selectedNote.id);
      setDeleteDialogOpen(false);
      setSelectedNote(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete note");
    } finally {
      setProcessingId(null);
    }
  }

  // Format file size
  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  // Format date
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">Pending</p>
                <p className="text-2xl font-bold">{statusCounts.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">Approved</p>
                <p className="text-2xl font-bold">{statusCounts.approved}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">Rejected</p>
                <p className="text-2xl font-bold">{statusCounts.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">Total Notes</p>
                <p className="text-2xl font-bold">{statusCounts.total}</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Pending Notes Table */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-base">Pending Review Queue</CardTitle>
          <CardDescription>
            {pendingNotes.length} {pendingNotes.length === 1 ? "note" : "notes"} awaiting review
          </CardDescription>
        </CardHeader>

        {pendingNotes.length === 0 ? (
          <CardContent className="p-12">
            <div className="text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="text-base font-semibold">All caught up!</p>
              <p className="text-sm text-muted-foreground">No pending notes to review</p>
            </div>
          </CardContent>
        ) : (
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/20">
                <TableRow>
                  <TableHead className="text-sm">Title</TableHead>
                  <TableHead className="text-sm">Subject</TableHead>
                  <TableHead className="text-sm">Semester</TableHead>
                  <TableHead className="text-sm">Uploaded By</TableHead>
                  <TableHead className="text-sm">File</TableHead>
                  <TableHead className="text-sm">Date</TableHead>
                  <TableHead className="text-sm text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingNotes.map((note) => (
                  <TableRow key={note.id}>
                    <TableCell className="max-w-[200px]">
                      <div className="space-y-1">
                        <div className="font-medium text-sm truncate">{note.title}</div>
                        {note.description && (
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {note.description}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground font-mono">
                          {note.course_code}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {note.subject}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-sm">Sem {note.semester}</TableCell>

                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-muted-foreground" />
                        <span>{note.uploader_name}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-sm">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs font-mono uppercase">{note.file_type}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatFileSize(note.file_size)}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(note.created_at)}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Download/Preview */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          asChild
                        >
                          <a href={note.file_url} target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4" />
                          </a>
                        </Button>

                        {/* Approve */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          onClick={() => handleApprove(note)}
                          disabled={processingId === note.id}
                        >
                          {processingId === note.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                        </Button>

                        {/* Reject */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => openRejectDialog(note)}
                          disabled={processingId === note.id}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>

                        {/* Delete */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => openDeleteDialog(note)}
                          disabled={processingId === note.id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Note</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this note. The uploader will see this message.
            </DialogDescription>
          </DialogHeader>

          {selectedNote && (
            <div className="space-y-4">
              <div className="p-3 rounded-md bg-muted/30 border space-y-1">
                <div className="font-medium text-sm">{selectedNote.title}</div>
                <div className="text-xs text-muted-foreground">
                  by {selectedNote.uploader_name}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rejectionReason">
                  Rejection Reason <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="rejectionReason"
                  placeholder="e.g., File is corrupted, wrong subject, duplicate content..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={processingId !== null}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectionReason.trim() || processingId !== null}
            >
              {processingId ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Rejecting...</>
              ) : (
                <><XCircle className="w-4 h-4" /> Reject Note</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              This will permanently delete the note and its file. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedNote && (
            <div className="p-3 rounded-md bg-muted/30 border space-y-1">
              <div className="font-medium text-sm">{selectedNote.title}</div>
              <div className="text-xs text-muted-foreground">
                by {selectedNote.uploader_name}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={processingId !== null}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={processingId !== null}
            >
              {processingId ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</>
              ) : (
                <><Trash2 className="w-4 h-4" /> Delete Permanently</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
