/**
 * Domain types for ECE StudyHub.
 *
 * These mirror the intended PostgreSQL/Prisma models. When the real backend
 * (Node + Express + Prisma) is connected, the API layer in src/services should
 * return exactly these shapes so no UI code has to change.
 */

export type Role = "STUDENT" | "FACULTY" | "DEPARTMENT_ADMIN" | "SYSTEM_ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarInitials: string;
  emailVerified: boolean;
  /** Student: roll number. Faculty/admin: staff id. */
  identifier: string;
  batch?: string;
  designation?: string;
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
}

export interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  semester: number;
  batch: string;
  facultyId: string;
  facultyName: string;
  description: string;
  type: "THEORY" | "LAB" | "SESSIONAL";
  enrolled: number;
}

export interface Material {
  id: string;
  courseId: string;
  title: string;
  description: string;
  fileName: string;
  fileSizeKb: number;
  category: "LECTURE" | "SLIDE" | "BOOK" | "REFERENCE" | "LAB_MANUAL";
  uploadedAt: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  deadline: string;
  attachment?: string;
  totalMarks: number;
  submissionStatus: "NOT_SUBMITTED" | "SUBMITTED" | "LATE" | "GRADED";
  obtainedMarks?: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  courseId: string;
  studentName: string;
  studentRoll: string;
  submittedAt: string;
  fileName: string;
  status: "PENDING" | "EVALUATED" | "LATE";
  marks?: number;
}

export interface LabExperiment {
  id: string;
  courseId: string;
  number: number;
  title: string;
  manual: string;
  reportStatus: "NOT_SUBMITTED" | "SUBMITTED" | "EVALUATED";
  marks?: number;
}

export interface AttendanceRecord {
  id: string;
  courseId: string;
  courseCode: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE";
}

export interface CourseAttendanceSummary {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  attended: number;
  total: number;
}

export type AssessmentType = "CT" | "QUIZ" | "LAB" | "MIDTERM" | "FINAL";

export interface ResultRow {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  type: AssessmentType;
  date: string;
  obtained: number;
  total: number;
  status: "PASSED" | "PENDING" | "BELOW_MIN";
}

export interface SemesterResult {
  semester: number;
  session: string;
  creditsEarned: number;
  gpa: number;
  status: "PUBLISHED" | "PROVISIONAL";
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  audience: "ALL" | "STUDENTS" | "FACULTY" | "BATCH" | "COURSE";
  date: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  author: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  at: string;
  read: boolean;
  kind: "ASSIGNMENT" | "RESULT" | "NOTICE" | "SYSTEM";
}

export interface FacultyMember {
  id: string;
  name: string;
  nameBn?: string;
  designation: string;
  email: string;
  phone: string;
  initials: string;
  photoUrl?: string;
  room?: string;
  status?: "ACTIVE" | "ON_LEAVE";
  leaveDetails?: string;
  googleScholar?: string;
  linkedin?: string;
  facebook?: string;
  profileUrl?: string;
  researchAreas: string[];
  education: string[];
  courses: string[];
  publications: number;
  officeHours: string;
  bio: string;
}

export interface Batch {
  id: string;
  name: string;
  series: string;
  admissionYear: number;
  students: number;
  currentSemester: number;
  status: "ACTIVE" | "GRADUATED" | "ARCHIVED";
}

export interface Alumnus {
  id: string;
  name: string;
  series: string;
  graduationYear: number;
  currentRole: string;
  organisation: string;
  location: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  type: "JOURNAL" | "CONFERENCE" | "BOOK_CHAPTER";
  doi?: string;
}

export interface Laboratory {
  id: string;
  name: string;
  incharge: string;
  capacity: number;
  equipment: string[];
  courses: string[];
}

export interface ResearchArea {
  id: string;
  title: string;
  summary: string;
  leads: string[];
  activeProjects: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "EXAM" | "CLASS" | "HOLIDAY" | "DEADLINE" | "EVENT";
  detail: string;
}

export interface ForumThread {
  id: string;
  title: string;
  courseCode: string;
  author: string;
  replies: number;
  lastActivity: string;
  tags: string[];
}

/* ---------------- OBE ---------------- */

export interface OutcomeStatement {
  id: string;
  code: string;
  statement: string;
}

export interface CourseOutcome extends OutcomeStatement {
  courseId: string;
  bloomLevel: string;
}

export interface CoPoMapping {
  coCode: string;
  /** PO code -> correlation level 1..3, 0 = not mapped */
  po: Record<string, number>;
}

export interface AssessmentMapping {
  id: string;
  assessment: string;
  type: AssessmentType;
  coCode: string;
  weight: number;
}

export interface AttainmentRow {
  code: string;
  target: number;
  attained: number;
  /** Out of 4.0 scale used by the department's OBE policy. */
  scale: number;
}

/* ---------------- Notes / StudyHub ---------------------------------------- */

/**
 * Mirrors the `notes` table in Supabase.
 * `status` is set to "pending" on upload; an admin sets it to "approved".
 */
export interface StudyNote {
  id: string;
  title: string;
  description: string;
  subject: string;
  semester: string;
  course_code: string;
  file_url: string;
  file_path?: string;  // Storage bucket path
  /** Lowercase extension: "pdf" | "docx" | "ppt" | "png" | "jpg" */
  file_type: string;
  file_size: number;
  uploaded_by: string;
  uploader_name: string;
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  reviewed_by?: string;       // UUID of reviewer
  reviewed_at?: string;        // ISO timestamp
  rejection_reason?: string;   // Reason for rejection
  downloads_count: number;
  upvotes_count: number;
  created_at: string;
}

/**
 * Mirrors the `note_upvotes` join table.
 * One row per (note, user) pair — ensures each user can vote at most once.
 */
export interface NoteUpvote {
  id: string;
  note_id: string;
  user_id: string;
  created_at: string;
}

/* ---------------- System admin ---------------- */

export interface ActivityLog {
  id: string;
  actor: string;
  action: string;
  entity: string;
  at: string;
  ip: string;
  severity: "INFO" | "WARN" | "CRITICAL";
}
