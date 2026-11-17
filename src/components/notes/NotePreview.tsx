/**
 * NotePreview — inline file preview for the Note Detail page.
 *
 * - PDF  → renders inside an <iframe> (native browser PDF viewer)
 * - PNG / JPG / JPEG → renders as an <img>
 * - Other types (DOCX, PPT, etc.) → shows a descriptive file-type icon card
 */
import React from "react";
import { FileText, FileSpreadsheet, Presentation, File } from "lucide-react";

interface NotePreviewProps {
  fileUrl: string;
  fileType: string;
  title: string;
}

/** Maps extension strings to a relevant Lucide icon and label. */
function getFileIcon(type: string) {
  switch (type.toLowerCase()) {
    case "pdf":
      return { Icon: FileText, label: "PDF Document", color: "text-red-500" };
    case "docx":
    case "doc":
      return { Icon: FileText, label: "Word Document", color: "text-blue-500" };
    case "ppt":
    case "pptx":
      return { Icon: Presentation, label: "PowerPoint Presentation", color: "text-orange-500" };
    case "xlsx":
    case "xls":
      return { Icon: FileSpreadsheet, label: "Spreadsheet", color: "text-green-500" };
    default:
      return { Icon: File, label: "File", color: "text-muted-foreground" };
  }
}

export function NotePreview({ fileUrl, fileType, title }: NotePreviewProps) {
  const type = fileType.toLowerCase();

  /* ── PDF preview ─────────────────────────────────────────────────────────── */
  if (type === "pdf") {
    return (
      <div className="w-full rounded-lg overflow-hidden border border-border bg-muted/30">
        <iframe
          src={fileUrl}
          title={`PDF preview – ${title}`}
          className="w-full h-[600px]"
          // Some browsers need this to render PDFs inline
          allow="fullscreen"
        />
      </div>
    );
  }

  /* ── Image preview ───────────────────────────────────────────────────────── */
  if (["png", "jpg", "jpeg", "webp", "gif"].includes(type)) {
    return (
      <div className="w-full flex justify-center rounded-lg overflow-hidden border border-border bg-muted/30 p-4">
        <img
          src={fileUrl}
          alt={`Preview – ${title}`}
          className="max-h-[600px] object-contain rounded"
          loading="lazy"
        />
      </div>
    );
  }

  /* ── Generic file-type icon (DOCX, PPT, etc.) ────────────────────────────── */
  const { Icon, label, color } = getFileIcon(type);

  return (
    <div className="w-full rounded-lg border border-border bg-muted/30 flex flex-col items-center justify-center gap-4 py-16">
      <Icon className={`w-20 h-20 ${color}`} strokeWidth={1} />
      <div className="text-center space-y-1">
        <p className="font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">
          Inline preview is not available for this file type.
        </p>
        <p className="text-xs text-muted-foreground">
          Use the <span className="font-medium text-foreground">Download</span> button below to open the file.
        </p>
      </div>
    </div>
  );
}
