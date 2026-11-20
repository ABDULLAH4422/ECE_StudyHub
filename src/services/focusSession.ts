import { supabase } from "@/lib/supabase";

export interface FocusSession {
  id: string;
  user_id?: string | null;
  session_type: "focus" | "short_break" | "long_break";
  duration_minutes: number;
  task_description: string;
  subject_tag?: string;
  completed_at: string;
  created_at?: string;
}

export interface FocusStats {
  todayMinutes: number;
  todaySessionsCount: number;
  weekMinutes: number;
  weekSessionsCount: number;
  streakDays: number;
  dailyBreakdown: {
    dayName: string;
    dateStr: string;
    minutes: number;
    sessionsCount: number;
    isToday: boolean;
  }[];
}

const STORAGE_KEY = "ece_studyhub_focus_sessions";

/**
 * Retrieve sessions from localStorage
 */
export function getLocalFocusSessions(): FocusSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FocusSession[];
  } catch (err) {
    console.warn("Failed to read local focus sessions", err);
    return [];
  }
}

/**
 * Save sessions to localStorage
 */
function setLocalFocusSessions(sessions: FocusSession[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.warn("Failed to save local focus sessions", err);
  }
}

/**
 * Save a newly completed session to both localStorage and Supabase.
 */
export async function saveCompletedSession(
  sessionData: Omit<FocusSession, "id" | "completed_at"> & {
    id?: string;
    completed_at?: string;
  }
): Promise<FocusSession> {
  const newSession: FocusSession = {
    id: sessionData.id || `focus-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    user_id: sessionData.user_id || null,
    session_type: sessionData.session_type,
    duration_minutes: sessionData.duration_minutes,
    task_description: sessionData.task_description || "Focused Study",
    subject_tag: sessionData.subject_tag || "General",
    completed_at: sessionData.completed_at || new Date().toISOString(),
  };

  // 1. Immediately persist in localStorage
  const existing = getLocalFocusSessions();
  const updated = [newSession, ...existing].slice(0, 500); // keep recent 500
  setLocalFocusSessions(updated);

  // 2. Sync to Supabase if available
  try {
    const { data: authData } = await supabase.auth.getSession();
    const userId = authData.session?.user?.id || newSession.user_id;

    const payload = {
      id: newSession.id.includes("-") ? undefined : newSession.id, // let db assign uuid if custom string
      user_id: userId || null,
      session_type: newSession.session_type,
      duration_minutes: newSession.duration_minutes,
      task_description: newSession.task_description,
      subject_tag: newSession.subject_tag,
      completed_at: newSession.completed_at,
    };

    const { error } = await supabase.from("focus_sessions").insert([payload]);
    if (error) {
      // Table might not exist or network error: we log quietly since localStorage has it safe
      console.warn("[FocusSession] Supabase sync note (using local cache):", error.message);
    }
  } catch (err) {
    console.warn("[FocusSession] Offline or Supabase unreachable, saved locally.", err);
  }

  return newSession;
}

/**
 * Fetch all sessions for stats, merging Supabase and localStorage.
 */
export async function fetchAllFocusSessions(): Promise<FocusSession[]> {
  const localSessions = getLocalFocusSessions();

  try {
    const { data, error } = await supabase
      .from("focus_sessions")
      .select("*")
      .order("completed_at", { ascending: false })
      .limit(200);

    if (!error && data && Array.isArray(data)) {
      // Merge unique by id or completed_at
      const map = new Map<string, FocusSession>();
      data.forEach((s) => {
        const id = s.id || s.completed_at;
        map.set(id, {
          id: s.id,
          user_id: s.user_id,
          session_type: s.session_type,
          duration_minutes: s.duration_minutes,
          task_description: s.task_description,
          subject_tag: s.subject_tag,
          completed_at: s.completed_at,
        });
      });

      localSessions.forEach((s) => {
        const id = s.id || s.completed_at;
        if (!map.has(id)) {
          map.set(id, s);
        }
      });

      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
      );
      setLocalFocusSessions(merged);
      return merged;
    }
  } catch (err) {
    console.warn("[FocusSession] Could not fetch remote sessions, returning local.", err);
  }

  return localSessions;
}

/**
 * Calculate stats from sessions (today, week, streaks, daily breakdown)
 */
export function calculateFocusStats(sessions: FocusSession[]): FocusStats {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  // Find start of current week (Monday)
  const currentDay = now.getDay(); // 0 is Sunday, 1 is Monday
  const distToMonday = currentDay === 0 ? 6 : currentDay - 1;
  const weekStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - distToMonday
  ).getTime();

  let todayMinutes = 0;
  let todaySessionsCount = 0;
  let weekMinutes = 0;
  let weekSessionsCount = 0;

  // Build daily breakdown for Monday through Sunday of current week
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dailyBreakdown = daysOfWeek.map((dayName, idx) => {
    const dayDate = new Date(weekStart);
    dayDate.setDate(dayDate.getDate() + idx);
    const dayDateStart = new Date(
      dayDate.getFullYear(),
      dayDate.getMonth(),
      dayDate.getDate()
    ).getTime();
    const dayDateEnd = dayDateStart + 86400000;

    const isToday =
      dayDate.getDate() === now.getDate() &&
      dayDate.getMonth() === now.getMonth() &&
      dayDate.getFullYear() === now.getFullYear();

    const dateStr = `${dayDate.getMonth() + 1}/${dayDate.getDate()}`;

    let dayMin = 0;
    let dayCount = 0;

    sessions.forEach((s) => {
      if (s.session_type !== "focus") return;
      const t = new Date(s.completed_at).getTime();
      if (t >= dayDateStart && t < dayDateEnd) {
        dayMin += s.duration_minutes;
        dayCount++;
      }
    });

    return {
      dayName,
      dateStr,
      minutes: dayMin,
      sessionsCount: dayCount,
      isToday,
    };
  });

  // Calculate totals
  const activeDateSet = new Set<string>();

  sessions.forEach((s) => {
    if (s.session_type !== "focus") return;
    const sessionTime = new Date(s.completed_at).getTime();
    const dateKey = new Date(s.completed_at).toDateString();
    activeDateSet.add(dateKey);

    if (sessionTime >= todayStart) {
      todayMinutes += s.duration_minutes;
      todaySessionsCount++;
    }

    if (sessionTime >= weekStart) {
      weekMinutes += s.duration_minutes;
      weekSessionsCount++;
    }
  });

  // Calculate daily streak
  let streakDays = 0;
  const checkDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // If worked today, streak counts today; otherwise check if worked yesterday
  if (activeDateSet.has(checkDate.toDateString())) {
    streakDays++;
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    // Check if worked yesterday to keep streak active
    const yesterday = new Date(checkDate);
    yesterday.setDate(yesterday.getDate() - 1);
    if (!activeDateSet.has(yesterday.toDateString())) {
      streakDays = 0;
    } else {
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  while (streakDays > 0 && activeDateSet.has(checkDate.toDateString())) {
    streakDays++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return {
    todayMinutes,
    todaySessionsCount,
    weekMinutes,
    weekSessionsCount,
    streakDays,
    dailyBreakdown,
  };
}
