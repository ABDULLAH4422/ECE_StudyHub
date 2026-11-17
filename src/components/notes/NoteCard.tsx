/**
 * NoteCard — compact card for the Browse/Search page grid.
 *
 * Displays: title, subject, semester, course code, uploader name,
 * upvote count, and a link to the full detail page.
 */
import React from "react";
import { Link } from "@tanstack/react-router";
import { ThumbsUp, User, BookOpen, CalendarDays, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { StudyNote } from "@/types";

interface NoteCardProps {
  note: StudyNote;
}

/** Maps a file extension to a colour Badge variant label. */
function FileTypeBadge({ type }: { type: string }) {
  const colours: Record<string, string> = {
    pdf: "bg-red-100 text-red-700 border-red-200",
    docx: "bg-blue-100 text-blue-700 border-blue-200",
    ppt: "bg-orange-100 text-orange-700 border-orange-200",
    pptx: "bg-orange-100 text-orange-700 border-orange-200",
    png: "bg-green-100 text-green-700 border-green-200",
    jpg: "bg-green-100 text-green-700 border-green-200",
    jpeg: "bg-green-100 text-green-700 border-green-200",
  };
  const cls = colours[type.toLowerCase()] ?? "bg-muted text-muted-foreground";
  return (
    <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-mono font-semibold uppercase ${cls}`}>
      {type.toUpperCase()}
    </span>
  );
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Link
      to="/notes/$id"
      params={{ id: note.id }}
      className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
    >
      <Card className="h-full transition-shadow hover:shadow-md group-hover:border-primary/40">
        <CardHeader className="pb-2">
          {/* File type + course code row */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <FileTypeBadge type={note.file_type} />
            <span className="text-[10px] font-mono text-muted-foreground">{note.course_code}</span>
          </div>

          {/* Title */}
          <CardTitle className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {note.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-0 space-y-3">
          {/* Description preview */}
          {note.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{note.description}</p>
          )}

          {/* Metadata chips */}
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="text-[10px] gap-1 px-1.5 py-0.5">
              <BookOpen className="w-2.5 h-2.5" />
              {note.subject}
            </Badge>
            <Badge variant="outline" className="text-[10px] gap-1 px-1.5 py-0.5">
              <CalendarDays className="w-2.5 h-2.5" />
              Sem {note.semester}
            </Badge>
          </div>

          {/* Footer: uploader + upvotes */}
          <div className="flex items-center justify-between pt-1 border-t border-border">
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <User className="w-3 h-3" />
              <span className="truncate max-w-[120px]">{note.uploader_name}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <ThumbsUp className="w-3 h-3" />
              <span>{note.upvotes_count}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
