import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Settings2,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Flame,
  Clock,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  Tag,
  Headphones,
  Bell,
  Sliders,
  History,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  FocusSession,
  FocusStats,
  fetchAllFocusSessions,
  saveCompletedSession,
  calculateFocusStats,
} from "@/services/focusSession";
import {
  playChimeSound,
  startAmbientSound,
  stopAmbientSound,
  updateAmbientVolume,
} from "@/lib/focusAudio";

type SessionType = "focus" | "short_break" | "long_break";

interface FocusSettings {
  focusDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number; // every X focus sessions
  autoSwitch: boolean; // automatically switch between focus and break
  autoStart: boolean; // automatically start next session timer
  soundEnabled: boolean; // chime sound on complete
}

const DEFAULT_SETTINGS: FocusSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoSwitch: true,
  autoStart: false,
  soundEnabled: true,
};

const SUBJECT_PRESETS = [
  "ECE 2101 Circuits",
  "ECE 2103 Signals",
  "MATH 2105 ODE",
  "Electronics Lab",
  "Electromagnetics",
  "VLSI / Digital Logic",
  "Final Exam Prep",
];

export function FocusRoom() {
  // Settings
  const [settings, setSettings] = useState<FocusSettings>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("ece_focus_settings");
        if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch {
        // use default
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState<FocusSettings>(settings);

  // Timer state
  const [sessionType, setSessionType] = useState<SessionType>("focus");
  const [sessionCount, setSessionCount] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [targetEndTime, setTargetEndTime] = useState<number | null>(null);

  // Time left in seconds
  const currentTotalSeconds = useMemo(() => {
    if (sessionType === "focus") return settings.focusDuration * 60;
    if (sessionType === "short_break") return settings.shortBreakDuration * 60;
    return settings.longBreakDuration * 60;
  }, [sessionType, settings]);

  const [timeLeft, setTimeLeft] = useState<number>(currentTotalSeconds);

  // Task / Study description
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("ECE 2101 Circuits");

  // Zen / Distraction-free full screen mode
  const [isZenMode, setIsZenMode] = useState<boolean>(false);

  // Ambient sound
  const [ambientType, setAmbientType] = useState<"none" | "rain" | "whitenoise" | "waves">("none");
  const [ambientVolume, setAmbientVolume] = useState<number>(0.4);

  // Completed sessions and stats
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [stats, setStats] = useState<FocusStats>({
    todayMinutes: 0,
    todaySessionsCount: 0,
    weekMinutes: 0,
    weekSessionsCount: 0,
    streakDays: 0,
    dailyBreakdown: [],
  });

  // Load initial session history
  useEffect(() => {
    fetchAllFocusSessions().then((data) => {
      setSessions(data);
      setStats(calculateFocusStats(data));
    });
  }, []);

  // Save settings when changed
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ece_focus_settings", JSON.stringify(settings));
    }
  }, [settings]);

  // Ambient sound controls
  useEffect(() => {
    if (ambientType === "none" || !isRunning) {
      stopAmbientSound();
    } else {
      startAmbientSound(ambientType, ambientVolume);
    }
    return () => {
      stopAmbientSound();
    };
  }, [ambientType, isRunning, ambientVolume]);

  // Handle ambient volume change
  const handleVolumeChange = (vol: number) => {
    setAmbientVolume(vol);
    updateAmbientVolume(vol);
  };

  // Switch session mode manually
  const switchSessionType = useCallback(
    (type: SessionType, resetTimer: boolean = true) => {
      setSessionType(type);
      setIsRunning(false);
      setTargetEndTime(null);

      let durationMins = settings.focusDuration;
      if (type === "short_break") durationMins = settings.shortBreakDuration;
      if (type === "long_break") durationMins = settings.longBreakDuration;

      if (resetTimer) {
        setTimeLeft(durationMins * 60);
      }
    },
    [settings]
  );

  // Session completion logic
  const handleSessionComplete = useCallback(async () => {
    setIsRunning(false);
    setTargetEndTime(null);

    // Play chime sound if enabled
    if (settings.soundEnabled) {
      playChimeSound();
    }

    // Save session to history if it was a focus session
    if (sessionType === "focus") {
      const saved = await saveCompletedSession({
        session_type: "focus",
        duration_minutes: settings.focusDuration,
        task_description: taskDescription.trim() || "Focused Study Session",
        subject_tag: selectedTag,
      });

      const updatedSessions = [saved, ...sessions];
      setSessions(updatedSessions);
      setStats(calculateFocusStats(updatedSessions));

      const nextSessionCount = sessionCount + 1;
      setSessionCount(nextSessionCount);

      // Determine next break
      const isLong = nextSessionCount % settings.longBreakInterval === 0;
      const nextType: SessionType = isLong ? "long_break" : "short_break";

      if (settings.autoSwitch) {
        setSessionType(nextType);
        const nextSeconds =
          (isLong ? settings.longBreakDuration : settings.shortBreakDuration) * 60;
        setTimeLeft(nextSeconds);

        if (settings.autoStart) {
          const nextEndTime = Date.now() + nextSeconds * 1000;
          setTargetEndTime(nextEndTime);
          setIsRunning(true);
        }
      } else {
        switchSessionType(nextType, true);
      }
    } else {
      // Break is over -> return to focus session
      if (settings.autoSwitch) {
        setSessionType("focus");
        const nextSeconds = settings.focusDuration * 60;
        setTimeLeft(nextSeconds);

        if (settings.autoStart) {
          const nextEndTime = Date.now() + nextSeconds * 1000;
          setTargetEndTime(nextEndTime);
          setIsRunning(true);
        }
      } else {
        switchSessionType("focus", true);
      }
    }
  }, [
    sessionType,
    settings,
    taskDescription,
    selectedTag,
    sessions,
    sessionCount,
    switchSessionType,
  ]);

  // Accurate timestamp timer with tab visibility synchronization
  useEffect(() => {
    if (!isRunning || !targetEndTime) return;

    const checkTime = () => {
      const remaining = Math.max(0, Math.round((targetEndTime - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        handleSessionComplete();
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 250);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkTime();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("focus", onVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", onVisibilityChange);
    };
  }, [isRunning, targetEndTime, handleSessionComplete]);

  // Update browser document tab title with remaining countdown
  useEffect(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const formatted = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

    if (isRunning) {
      const label = sessionType === "focus" ? "Focus" : "Break";
      document.title = `(${formatted}) ${label} - ECE StudyHub`;
    } else {
      document.title = "Focus Room - ECE StudyHub";
    }

    return () => {
      document.title = "ECE StudyHub";
    };
  }, [timeLeft, isRunning, sessionType]);

  // Start / Resume timer
  const handleStart = () => {
    const endTime = Date.now() + timeLeft * 1000;
    setTargetEndTime(endTime);
    setIsRunning(true);
  };

  // Pause timer
  const handlePause = () => {
    if (targetEndTime) {
      const remaining = Math.max(0, Math.round((targetEndTime - Date.now()) / 1000));
      setTimeLeft(remaining);
    }
    setIsRunning(false);
    setTargetEndTime(null);
  };

  // Reset timer
  const handleReset = () => {
    setIsRunning(false);
    setTargetEndTime(null);
    setTimeLeft(currentTotalSeconds);
  };

  // Skip to next session
  const handleSkip = () => {
    handleSessionComplete();
  };

  // Settings Save
  const openSettingsDialog = () => {
    setTempSettings(settings);
    setIsSettingsOpen(true);
  };

  const handleSaveSettings = () => {
    setSettings(tempSettings);
    setIsSettingsOpen(false);
    // If timer wasn't running, adjust current duration
    if (!isRunning) {
      let durationMins = tempSettings.focusDuration;
      if (sessionType === "short_break") durationMins = tempSettings.shortBreakDuration;
      if (sessionType === "long_break") durationMins = tempSettings.longBreakDuration;
      setTimeLeft(durationMins * 60);
    }
  };

  // Circular progress calculations
  const progressRatio = currentTotalSeconds > 0 ? timeLeft / currentTotalSeconds : 0;
  const radius = 135;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  // Minutes and seconds display
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Session color schemes
  const sessionColors = {
    focus: {
      text: "text-primary",
      ring: "stroke-primary",
      bgBadge: "bg-primary/10 text-primary border-primary/20",
      accent: "from-primary/20 via-primary/5 to-transparent",
    },
    short_break: {
      text: "text-emerald-500 dark:text-emerald-400",
      ring: "stroke-emerald-500 dark:stroke-emerald-400",
      bgBadge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      accent: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    },
    long_break: {
      text: "text-amber-500 dark:text-amber-400",
      ring: "stroke-amber-500 dark:stroke-amber-400",
      bgBadge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      accent: "from-amber-500/20 via-amber-500/5 to-transparent",
    },
  }[sessionType];

  return (
    <div className={cn("space-y-8", isZenMode && "fixed inset-0 z-50 bg-background overflow-y-auto p-4 sm:p-10")}>
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-display">
              ECE Focus Room
            </h2>
            <Badge variant="outline" className="text-xs font-mono">
              Academic Tool
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Distraction-free Pomodoro study environment with tab-accurate tracking & session analytics.
          </p>
        </div>

        {/* Ambient Noise & Zen Mode Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Ambient Sound Dropdown */}
          <div className="flex items-center gap-1.5 bg-card border border-border px-2.5 py-1 rounded-md text-xs">
            <Headphones className="w-3.5 h-3.5 text-muted-foreground" />
            <select
              value={ambientType}
              onChange={(e) => setAmbientType(e.target.value as "none" | "rain" | "whitenoise" | "waves")}
              className="bg-transparent border-none text-xs font-medium text-foreground focus:outline-hidden cursor-pointer"
            >
              <option value="none">Sound: Off</option>
              <option value="rain">Sound: Soft Rain</option>
              <option value="whitenoise">Sound: White Noise</option>
              <option value="waves">Sound: Ocean Waves</option>
            </select>
            {ambientType !== "none" && (
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={ambientVolume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-16 h-1 ml-1 accent-primary cursor-pointer"
                title={`Volume: ${Math.round(ambientVolume * 100)}%`}
              />
            )}
          </div>

          {/* Settings Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={openSettingsDialog}
            className="h-8 text-xs gap-1.5"
          >
            <Settings2 className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="hidden sm:inline">Settings</span>
          </Button>

          {/* Zen Mode Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsZenMode(!isZenMode)}
            className="h-8 text-xs gap-1.5"
            title={isZenMode ? "Exit Zen Mode" : "Enter Distraction-Free Zen Mode"}
          >
            {isZenMode ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-primary" />
                <span>Exit Zen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Zen Mode</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Focus Room Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left/Center Column: Pomodoro Timer & Controls */}
        <div className={cn("space-y-6", isZenMode ? "lg:col-span-12 max-w-2xl mx-auto" : "lg:col-span-7")}>
          <Card className="border-border bg-card shadow-sm overflow-hidden text-center relative">
            {/* Ambient Background Glow */}
            <div
              className={cn(
                "absolute inset-x-0 top-0 h-40 bg-gradient-to-b opacity-60 pointer-events-none transition-all duration-700",
                sessionColors.accent
              )}
            />

            <CardContent className="pt-8 pb-10 px-4 sm:px-8 space-y-6 relative">
              {/* Session Type Selectors */}
              <div className="inline-flex items-center p-1 rounded-xl bg-muted/60 border border-border text-xs font-medium">
                <button
                  type="button"
                  onClick={() => switchSessionType("focus")}
                  className={cn(
                    "px-4 py-1.5 rounded-lg transition-all",
                    sessionType === "focus"
                      ? "bg-card text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Focus ({settings.focusDuration}m)
                </button>
                <button
                  type="button"
                  onClick={() => switchSessionType("short_break")}
                  className={cn(
                    "px-4 py-1.5 rounded-lg transition-all",
                    sessionType === "short_break"
                      ? "bg-card text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Short Break ({settings.shortBreakDuration}m)
                </button>
                <button
                  type="button"
                  onClick={() => switchSessionType("long_break")}
                  className={cn(
                    "px-4 py-1.5 rounded-lg transition-all",
                    sessionType === "long_break"
                      ? "bg-card text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Long Break ({settings.longBreakDuration}m)
                </button>
              </div>

              {/* Circular SVG Countdown Timer */}
              <div className="relative flex items-center justify-center py-4">
                <svg
                  className="w-72 h-72 sm:w-80 sm:h-80 -rotate-90 transform"
                  viewBox="0 0 320 320"
                >
                  {/* Background Track Ring */}
                  <circle
                    cx="160"
                    cy="160"
                    r={radius}
                    className="stroke-muted/40"
                    strokeWidth="10"
                    fill="transparent"
                  />

                  {/* Active Progress Ring */}
                  <circle
                    cx="160"
                    cy="160"
                    r={radius}
                    className={cn(
                      "transition-all duration-300 ease-linear",
                      sessionColors.ring
                    )}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 pointer-events-none">
                  {/* Session Badge */}
                  <span
                    className={cn(
                      "text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border",
                      sessionColors.bgBadge
                    )}
                  >
                    {sessionType === "focus"
                      ? `Focus Session #${sessionCount}`
                      : sessionType === "short_break"
                      ? "Short Break"
                      : "Long Break"}
                  </span>

                  {/* Monospace Countdown */}
                  <div className="font-mono text-5xl sm:text-6xl font-black tracking-tight text-foreground select-none">
                    {formattedTime}
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full",
                        isRunning ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/40"
                      )}
                    />
                    <span>{isRunning ? "Active Session" : timeLeft === currentTotalSeconds ? "Ready to begin" : "Paused"}</span>
                  </div>
                </div>
              </div>

              {/* Main Action Controls */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleReset}
                  className="h-11 w-11 rounded-full text-muted-foreground hover:text-foreground"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>

                <Button
                  onClick={isRunning ? handlePause : handleStart}
                  size="lg"
                  className={cn(
                    "h-14 px-8 rounded-full font-bold text-sm tracking-wide shadow-md transition-all",
                    isRunning
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "bg-primary hover:bg-primary/90 text-primary-foreground"
                  )}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-5 h-5 mr-2 fill-current" />
                      PAUSE
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2 fill-current" />
                      {timeLeft === currentTotalSeconds ? "START FOCUS" : "RESUME"}
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSkip}
                  className="h-11 w-11 rounded-full text-muted-foreground hover:text-foreground"
                  title="Skip to Next Session"
                >
                  <SkipForward className="w-5 h-5" />
                </Button>
              </div>

              {/* What are you studying? input */}
              <div className="pt-4 max-w-md mx-auto space-y-2 text-left">
                <Label className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
                  <span>Current Study Target</span>
                  <span className="text-[10px] text-muted-foreground/80">Saved to session log</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="e.g. Solving ECE 2101 Chapter 4 problems..."
                    className="h-9 text-xs bg-background"
                  />
                </div>

                {/* Quick Subject Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-muted-foreground">Quick tag:</span>
                  {SUBJECT_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setSelectedTag(preset);
                        if (!taskDescription) {
                          setTaskDescription(preset);
                        }
                      }}
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded-md border transition-colors",
                        selectedTag === preset
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/40 border-border/80 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Statistics & Activity Tracking */}
        {!isZenMode && (
          <div className="space-y-6 lg:col-span-5">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Today's Focus Card */}
              <Card className="p-4 border-border bg-card">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-xs font-medium uppercase tracking-wider">Today</span>
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold font-mono text-foreground">
                    {stats.todayMinutes}
                  </span>
                  <span className="text-xs text-muted-foreground">mins</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {stats.todaySessionsCount} completed sessions
                </p>
              </Card>

              {/* Weekly Streak Card */}
              <Card className="p-4 border-border bg-card">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-xs font-medium uppercase tracking-wider">Streak</span>
                  <Flame className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold font-mono text-foreground">
                    {stats.streakDays}
                  </span>
                  <span className="text-xs text-muted-foreground">days</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {stats.weekMinutes} mins this week
                </p>
              </Card>
            </div>

            {/* Weekly Activity Breakdown (Bar Chart) */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-3 pt-4 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                    Weekly Focus Distribution
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {stats.weekSessionsCount} sessions
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="flex items-end justify-between gap-2 h-28 pt-4 border-b border-border/60 pb-2">
                  {stats.dailyBreakdown.map((item) => {
                    const maxDaily = Math.max(...stats.dailyBreakdown.map((d) => d.minutes), 60);
                    const barHeightPct = Math.min(100, Math.round((item.minutes / maxDaily) * 100));

                    return (
                      <div
                        key={item.dayName}
                        className="flex-1 flex flex-col items-center justify-end h-full group"
                      >
                        {/* Bar */}
                        <div
                          className={cn(
                            "w-full max-w-[28px] rounded-t transition-all group-hover:opacity-80 relative",
                            item.isToday
                              ? "bg-primary"
                              : item.minutes > 0
                              ? "bg-primary/50"
                              : "bg-muted/40"
                          )}
                          style={{ height: `${Math.max(barHeightPct, 6)}%` }}
                        >
                          {/* Tooltip on hover */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-none bg-popover text-popover-foreground text-[10px] font-mono px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-10 border">
                            {item.minutes}m
                          </div>
                        </div>

                        {/* Day Label */}
                        <span
                          className={cn(
                            "text-[10px] mt-2 font-mono",
                            item.isToday ? "font-bold text-primary" : "text-muted-foreground"
                          )}
                        >
                          {item.dayName}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-2.5 text-[11px] text-muted-foreground">
                  <span>Target: 120 mins / day</span>
                  <span className="font-mono">Weekly Total: {stats.weekMinutes} mins</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Completed Sessions History */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-3 pt-4 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5" />
                    <span>Recent Sessions</span>
                  </CardTitle>
                  <span className="text-[10px] text-muted-foreground">
                    {sessions.length} total
                  </span>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {sessions.length === 0 ? (
                  <div className="text-center py-6 text-xs text-muted-foreground">
                    No completed focus sessions yet. Start your first sprint!
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {sessions.slice(0, 8).map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between p-2 rounded-md bg-muted/20 border border-border/60 text-xs"
                      >
                        <div className="space-y-0.5 truncate max-w-[210px]">
                          <div className="font-medium text-foreground truncate">
                            {s.task_description}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span className="font-mono">{s.duration_minutes} mins</span>
                            {s.subject_tag && (
                              <span className="px-1.5 py-0.2 bg-muted rounded text-[9px]">
                                {s.subject_tag}
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">
                          {new Date(s.completed_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Settings2 className="w-4 h-4 text-primary" />
              <span>Focus Room Settings</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Customize session lengths, intervals, and audio alerts.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Durations */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-[11px]">Focus (mins)</Label>
                <Input
                  type="number"
                  min="1"
                  max="120"
                  value={tempSettings.focusDuration}
                  onChange={(e) =>
                    setTempSettings({
                      ...tempSettings,
                      focusDuration: Math.max(1, parseInt(e.target.value) || 25),
                    })
                  }
                  className="h-8 text-xs font-mono mt-1"
                />
              </div>

              <div>
                <Label className="text-[11px]">Short Break</Label>
                <Input
                  type="number"
                  min="1"
                  max="60"
                  value={tempSettings.shortBreakDuration}
                  onChange={(e) =>
                    setTempSettings({
                      ...tempSettings,
                      shortBreakDuration: Math.max(1, parseInt(e.target.value) || 5),
                    })
                  }
                  className="h-8 text-xs font-mono mt-1"
                />
              </div>

              <div>
                <Label className="text-[11px]">Long Break</Label>
                <Input
                  type="number"
                  min="1"
                  max="90"
                  value={tempSettings.longBreakDuration}
                  onChange={(e) =>
                    setTempSettings({
                      ...tempSettings,
                      longBreakDuration: Math.max(1, parseInt(e.target.value) || 15),
                    })
                  }
                  className="h-8 text-xs font-mono mt-1"
                />
              </div>
            </div>

            {/* Long Break Interval */}
            <div className="space-y-1">
              <Label className="text-[11px]">Long Break Interval</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="2"
                  max="10"
                  value={tempSettings.longBreakInterval}
                  onChange={(e) =>
                    setTempSettings({
                      ...tempSettings,
                      longBreakInterval: Math.max(2, parseInt(e.target.value) || 4),
                    })
                  }
                  className="h-8 w-24 text-xs font-mono"
                />
                <span className="text-muted-foreground text-xs">
                  sessions before a long break
                </span>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2.5 pt-2 border-t border-border">
              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <div className="font-semibold text-foreground">Auto-switch sessions</div>
                  <div className="text-muted-foreground text-[11px]">
                    Automatically switch between focus and break
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={tempSettings.autoSwitch}
                  onChange={(e) =>
                    setTempSettings({ ...tempSettings, autoSwitch: e.target.checked })
                  }
                  className="h-4 w-4 rounded accent-primary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <div className="font-semibold text-foreground">Auto-start next timer</div>
                  <div className="text-muted-foreground text-[11px]">
                    Start counting immediately when switching
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={tempSettings.autoStart}
                  onChange={(e) =>
                    setTempSettings({ ...tempSettings, autoStart: e.target.checked })
                  }
                  className="h-4 w-4 rounded accent-primary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <div className="font-semibold text-foreground">Sound Notification</div>
                  <div className="text-muted-foreground text-[11px]">
                    Play soothing chime when session ends
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={tempSettings.soundEnabled}
                  onChange={(e) =>
                    setTempSettings({ ...tempSettings, soundEnabled: e.target.checked })
                  }
                  className="h-4 w-4 rounded accent-primary cursor-pointer"
                />
              </label>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettingsOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveSettings}>
              Save Preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
