import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Edit2,
  BookOpen,
  Filter,
  CheckSquare,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  date: string; // YYYY-MM-DD
  time?: string | undefined; // HH:mm
  completed: boolean;
  createdAt: string;
}

const STORAGE_KEY = "ece_studyhub_study_planner_tasks";

function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTomorrowString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const INITIAL_TASKS: StudyTask[] = [
  {
    id: "sample-1",
    title: "Review AC Circuit Theorems & Phasor Analysis",
    subject: "ECE 2101",
    date: getTodayString(),
    time: "10:30",
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-2",
    title: "Complete Sessional Lab Report 3 on RLC Resonance",
    subject: "ECE 2102",
    date: getTodayString(),
    time: "15:00",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-3",
    title: "Solve 2nd Order Differential Equations Exercises",
    subject: "MATH 2105",
    date: getTomorrowString(),
    time: "11:00",
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

type FilterStatus = "all" | "pending" | "completed";

export function StudyPlanner() {
  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn("Could not read tasks from localStorage", e);
      }
    }
    return INITIAL_TASKS;
  });

  // Filter state
  const [filter, setFilter] = useState<FilterStatus>("all");

  // New task form state
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("ECE 2101");
  const [newDate, setNewDate] = useState(getTodayString());
  const [newTime, setNewTime] = useState("");

  // Edit task state
  const [editingTask, setEditingTask] = useState<StudyTask | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks]);

  // Statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Add task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const task: StudyTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: newTitle.trim(),
      subject: newSubject.trim() || "General",
      date: newDate || getTodayString(),
      time: newTime.trim() || undefined,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [task, ...prev]);
    setNewTitle("");
    setNewTime("");
  };

  // Toggle completion
  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Delete task
  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Open edit modal
  const handleOpenEdit = (task: StudyTask) => {
    setEditingTask({ ...task });
    setIsEditDialogOpen(true);
  };

  // Save edited task
  const handleSaveEdit = () => {
    if (!editingTask || !editingTask.title.trim()) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === editingTask.id ? editingTask : t))
    );
    setIsEditDialogOpen(false);
    setEditingTask(null);
  };

  const todayStr = getTodayString();

  // Group tasks into today, upcoming, and past
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filter === "pending") return !t.completed;
      if (filter === "completed") return t.completed;
      return true;
    });
  }, [tasks, filter]);

  const todayTasks = useMemo(() => {
    return filteredTasks.filter((t) => t.date === todayStr);
  }, [filteredTasks, todayStr]);

  const upcomingTasks = useMemo(() => {
    return filteredTasks.filter((t) => t.date > todayStr).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredTasks, todayStr]);

  const pastTasks = useMemo(() => {
    return filteredTasks.filter((t) => t.date < todayStr).sort((a, b) => b.date.localeCompare(a.date));
  }, [filteredTasks, todayStr]);

  return (
    <div className="space-y-6">
      {/* Top Overview & Progress Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-primary/10 text-primary">
                  <BookOpen className="w-4 h-4" />
                </span>
                <h3 className="font-semibold text-base sm:text-lg text-foreground">
                  Study Progress
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Keep track of academic deliverables, coursework deadlines, and sessional prep.
              </p>
            </div>

            {/* Quick Metrics Badges */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <Badge variant="outline" className="px-2.5 py-1">
                {totalTasks} Total
              </Badge>
              <Badge variant="secondary" className="px-2.5 py-1 text-amber-600 dark:text-amber-400">
                {pendingTasks} Pending
              </Badge>
              <Badge variant="default" className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-600 text-white">
                {completedTasks} Completed
              </Badge>
            </div>
          </div>

          {/* Simple Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-medium">Completion Rate</span>
              <span className="font-mono font-bold text-foreground">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Add New Task Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3 pt-5 px-5 sm:px-6">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            <span>Add Study Task</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 sm:px-6 pb-5">
          <form onSubmit={handleAddTask} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Task Title */}
              <div className="sm:col-span-5">
                <Label className="text-xs text-muted-foreground mb-1 block">Task Title</Label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Study Maxwell's Equations & Boundary Conditions"
                  className="h-9 text-xs"
                  required
                />
              </div>

              {/* Subject */}
              <div className="sm:col-span-3">
                <Label className="text-xs text-muted-foreground mb-1 block">Subject / Code</Label>
                <Input
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. ECE 2101"
                  className="h-9 text-xs font-mono"
                />
              </div>

              {/* Date */}
              <div className="sm:col-span-2">
                <Label className="text-xs text-muted-foreground mb-1 block">Target Date</Label>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="h-9 text-xs font-mono"
                  required
                />
              </div>

              {/* Time (Optional) */}
              <div className="sm:col-span-2">
                <Label className="text-xs text-muted-foreground mb-1 block">Time (Optional)</Label>
                <Input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button type="submit" size="sm" className="h-8 text-xs gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Filter Tabs Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
        <div className="inline-flex items-center p-1 rounded-lg bg-muted/60 border border-border text-xs">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "px-3 py-1 rounded-md transition-all",
              filter === "all"
                ? "bg-card text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All ({totalTasks})
          </button>
          <button
            type="button"
            onClick={() => setFilter("pending")}
            className={cn(
              "px-3 py-1 rounded-md transition-all",
              filter === "pending"
                ? "bg-card text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Pending ({pendingTasks})
          </button>
          <button
            type="button"
            onClick={() => setFilter("completed")}
            className={cn(
              "px-3 py-1 rounded-md transition-all",
              filter === "completed"
                ? "bg-card text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Completed ({completedTasks})
          </button>
        </div>

        <span className="text-xs text-muted-foreground font-mono hidden sm:inline">
          {new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
        </span>
      </div>

      {/* Task Sections */}
      <div className="space-y-6">
        {/* Today's Tasks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-primary" />
              <span>Today's Tasks</span>
              <Badge variant="outline" className="ml-1 text-[10px] font-mono">
                {todayTasks.length}
              </Badge>
            </h4>
          </div>

          {todayTasks.length === 0 ? (
            <div className="p-4 rounded-lg border border-dashed border-border/80 text-center text-xs text-muted-foreground bg-muted/10">
              No tasks scheduled for today. Add one above!
            </div>
          ) : (
            <div className="space-y-2">
              {todayTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Tasks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-primary" />
              <span>Upcoming Tasks</span>
              <Badge variant="outline" className="ml-1 text-[10px] font-mono">
                {upcomingTasks.length}
              </Badge>
            </h4>
          </div>

          {upcomingTasks.length === 0 ? (
            <div className="p-4 rounded-lg border border-dashed border-border/80 text-center text-xs text-muted-foreground bg-muted/10">
              No upcoming tasks scheduled yet.
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>

        {/* Past / Previous Tasks (if any) */}
        {pastTasks.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Past & Previous Tasks</span>
                <Badge variant="outline" className="ml-1 text-[10px] font-mono">
                  {pastTasks.length}
                </Badge>
              </h4>
            </div>

            <div className="space-y-2">
              {pastTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-primary" />
              <span>Edit Study Task</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Update task title, course code, scheduled date, or time.
            </DialogDescription>
          </DialogHeader>

          {editingTask && (
            <div className="space-y-3 py-2 text-xs">
              <div>
                <Label className="text-xs">Task Title</Label>
                <Input
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, title: e.target.value })
                  }
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div>
                <Label className="text-xs">Subject / Code</Label>
                <Input
                  value={editingTask.subject}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, subject: e.target.value })
                  }
                  className="h-8 text-xs font-mono mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Target Date</Label>
                  <Input
                    type="date"
                    value={editingTask.date}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, date: e.target.value })
                    }
                    className="h-8 text-xs font-mono mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Time (Optional)</Label>
                  <Input
                    type="time"
                    value={editingTask.time || ""}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, time: e.target.value })
                    }
                    className="h-8 text-xs font-mono mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface TaskItemProps {
  task: StudyTask;
  onToggle: (id: string) => void;
  onEdit: (task: StudyTask) => void;
  onDelete: (id: string) => void;
}

function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 p-3 rounded-lg border transition-all",
        task.completed
          ? "bg-muted/30 border-border/50 text-muted-foreground opacity-85"
          : "bg-card border-border hover:border-primary/40 shadow-2xs"
      )}
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          className="mt-0.5 text-primary hover:opacity-80 transition-opacity"
          aria-label={task.completed ? "Mark pending" : "Mark completed"}
        >
          {task.completed ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500 fill-emerald-100 dark:fill-emerald-950/40" />
          ) : (
            <Circle className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          )}
        </button>

        <div className="space-y-1 min-w-0 flex-1">
          <p
            className={cn(
              "text-xs sm:text-sm font-medium leading-snug break-words",
              task.completed && "line-through text-muted-foreground font-normal"
            )}
          >
            {task.title}
          </p>

          <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
            <span className="font-mono px-1.5 py-0.5 rounded bg-muted/80 font-medium text-foreground">
              {task.subject}
            </span>

            <span className="flex items-center gap-1 font-mono">
              <CalendarIcon className="w-3 h-3" />
              <span>{task.date}</span>
            </span>

            {task.time && (
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" />
                <span>{task.time}</span>
              </span>
            )}

            {task.completed && (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                Done
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(task)}
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          title="Edit Task"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(task.id)}
          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          title="Delete Task"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
