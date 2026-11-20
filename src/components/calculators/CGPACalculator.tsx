import React, { useState, useMemo, useEffect } from "react";
import {
  GraduationCap,
  Plus,
  Trash2,
  RotateCcw,
  Settings2,
  Check,
  AlertCircle,
  Sparkles,
  BookOpen,
  Layers,
  Award,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Download,
  Info,
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

export interface GradeItem {
  id: string;
  letter: string;
  points: number;
  description?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number | "";
  gradeLetter: string;
}

export interface Semester {
  id: string;
  name: string;
  courses: Course[];
}

export interface GradingScale {
  id: string;
  name: string;
  maxPoints: number;
  grades: GradeItem[];
}

export const PRESET_SCALES: Record<string, GradingScale> = {
  "ruet-ugc": {
    id: "ruet-ugc",
    name: "UGC / Engineering Standard (4.00 Scale)",
    maxPoints: 4.0,
    grades: [
      { id: "1", letter: "A+", points: 4.0, description: "80% and above" },
      { id: "2", letter: "A", points: 3.75, description: "75% to <80%" },
      { id: "3", letter: "A-", points: 3.5, description: "70% to <75%" },
      { id: "4", letter: "B+", points: 3.25, description: "65% to <70%" },
      { id: "5", letter: "B", points: 3.0, description: "60% to <65%" },
      { id: "6", letter: "B-", points: 2.75, description: "55% to <60%" },
      { id: "7", letter: "C+", points: 2.5, description: "50% to <55%" },
      { id: "8", letter: "C", points: 2.25, description: "45% to <50%" },
      { id: "9", letter: "D", points: 2.0, description: "40% to <45%" },
      { id: "10", letter: "F", points: 0.0, description: "Below 40% (Fail)" },
    ],
  },
  "us-standard": {
    id: "us-standard",
    name: "North American 4.0 Scale (0.33 step)",
    maxPoints: 4.0,
    grades: [
      { id: "u1", letter: "A", points: 4.0, description: "Excellent" },
      { id: "u2", letter: "A-", points: 3.7, description: "Very Good" },
      { id: "u3", letter: "B+", points: 3.3, description: "Good" },
      { id: "u4", letter: "B", points: 3.0, description: "Above Average" },
      { id: "u5", letter: "B-", points: 2.7, description: "Average" },
      { id: "u6", letter: "C+", points: 2.3, description: "Below Average" },
      { id: "u7", letter: "C", points: 2.0, description: "Satisfactory" },
      { id: "u8", letter: "C-", points: 1.7, description: "Passing" },
      { id: "u9", letter: "D+", points: 1.3, description: "Poor" },
      { id: "u10", letter: "D", points: 1.0, description: "Barely Passing" },
      { id: "u11", letter: "F", points: 0.0, description: "Failing" },
    ],
  },
  "scale-5": {
    id: "scale-5",
    name: "5.0 Point Scale",
    maxPoints: 5.0,
    grades: [
      { id: "5_1", letter: "A", points: 5.0, description: "70%+" },
      { id: "5_2", letter: "B", points: 4.0, description: "60-69%" },
      { id: "5_3", letter: "C", points: 3.0, description: "50-59%" },
      { id: "5_4", letter: "D", points: 2.0, description: "45-49%" },
      { id: "5_5", letter: "E", points: 1.0, description: "40-44%" },
      { id: "5_6", letter: "F", points: 0.0, description: "Below 40%" },
    ],
  },
  "scale-10": {
    id: "scale-10",
    name: "10.0 Point Scale (Indian / European)",
    maxPoints: 10.0,
    grades: [
      { id: "10_1", letter: "O", points: 10.0, description: "Outstanding (90-100%)" },
      { id: "10_2", letter: "A+", points: 9.0, description: "Excellent (80-89%)" },
      { id: "10_3", letter: "A", points: 8.0, description: "Very Good (70-79%)" },
      { id: "10_4", letter: "B+", points: 7.0, description: "Good (60-69%)" },
      { id: "10_5", letter: "B", points: 6.0, description: "Above Average (55-59%)" },
      { id: "10_6", letter: "C", points: 5.0, description: "Average (50-54%)" },
      { id: "10_7", letter: "P", points: 4.0, description: "Pass (40-49%)" },
      { id: "10_8", letter: "F", points: 0.0, description: "Fail (<40%)" },
    ],
  },
};

const SAMPLE_SEMESTERS: Semester[] = [
  {
    id: "sem-1",
    name: "Semester 1 (Year 1, Term 1)",
    courses: [
      { id: "c1", code: "ECE 1101", name: "Electrical Circuits I", credits: 3.0, gradeLetter: "A+" },
      { id: "c2", code: "ECE 1102", name: "Electrical Circuits I Sessional", credits: 1.5, gradeLetter: "A+" },
      { id: "c3", code: "MATH 1103", name: "Differential & Integral Calculus", credits: 3.0, gradeLetter: "A" },
      { id: "c4", code: "PHY 1105", name: "Physics", credits: 3.0, gradeLetter: "A-" },
      { id: "c5", code: "HUM 1107", name: "English Language & Technical Writing", credits: 3.0, gradeLetter: "A" },
    ],
  },
  {
    id: "sem-2",
    name: "Semester 2 (Year 1, Term 2)",
    courses: [
      { id: "c6", code: "ECE 1201", name: "Electronic Devices & Circuits", credits: 3.0, gradeLetter: "A+" },
      { id: "c7", code: "ECE 1202", name: "Electronic Devices Sessional", credits: 1.5, gradeLetter: "A" },
      { id: "c8", code: "CSE 1203", name: "Structured Programming", credits: 3.0, gradeLetter: "A+" },
      { id: "c9", code: "MATH 1205", name: "Ordinary Differential Equations", credits: 3.0, gradeLetter: "A" },
      { id: "c10", code: "CHEM 1207", name: "Engineering Chemistry", credits: 3.0, gradeLetter: "B+" },
    ],
  },
];

function createBlankCourse(idSuffix: string, defaultGrade: string): Course {
  return {
    id: `course-${Date.now()}-${idSuffix}`,
    code: "",
    name: "",
    credits: 3.0,
    gradeLetter: defaultGrade,
  };
}

function createBlankSemester(index: number, defaultGrade: string): Semester {
  return {
    id: `sem-${Date.now()}-${index}`,
    name: `Semester ${index}`,
    courses: [
      createBlankCourse("1", defaultGrade),
      createBlankCourse("2", defaultGrade),
      createBlankCourse("3", defaultGrade),
    ],
  };
}

const DEFAULT_SCALE: GradingScale = PRESET_SCALES["ruet-ugc"]!;

export function CGPACalculator() {
  const [activeScaleKey, setActiveScaleKey] = useState<string>("ruet-ugc");
  const [customScale, setCustomScale] = useState<GradingScale>(DEFAULT_SCALE);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [tempScale, setTempScale] = useState<GradingScale>(DEFAULT_SCALE);

  // Semesters state
  const [semesters, setSemesters] = useState<Semester[]>(() => [
    createBlankSemester(1, "A+"),
  ]);

  // Track collapsed semesters
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // Active grading scale
  const activeScale: GradingScale = useMemo(() => {
    if (activeScaleKey === "custom") {
      return customScale;
    }
    return PRESET_SCALES[activeScaleKey] || DEFAULT_SCALE;
  }, [activeScaleKey, customScale]);

  // Map letter -> points for fast lookup
  const gradePointsMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const g of activeScale.grades) {
      map.set(g.letter, g.points);
    }
    return map;
  }, [activeScale]);

  const defaultGradeLetter = activeScale.grades[0]?.letter || "A";

  // Calculations per semester and overall
  const calculationResults = useMemo(() => {
    let totalCumulativeCredits = 0;
    let totalCumulativeQualityPoints = 0;
    let totalCompletedCourses = 0;

    const semesterResults = semesters.map((sem) => {
      let semCredits = 0;
      let semQualityPoints = 0;
      let semValidCourses = 0;

      sem.courses.forEach((c) => {
        const creditNum = typeof c.credits === "number" ? c.credits : parseFloat(c.credits);
        if (!isNaN(creditNum) && creditNum > 0 && c.gradeLetter) {
          const pt = gradePointsMap.get(c.gradeLetter) ?? 0;
          semCredits += creditNum;
          semQualityPoints += creditNum * pt;
          semValidCourses++;
        }
      });

      const semGPA = semCredits > 0 ? semQualityPoints / semCredits : 0;

      totalCumulativeCredits += semCredits;
      totalCumulativeQualityPoints += semQualityPoints;
      totalCompletedCourses += semValidCourses;

      return {
        semesterId: sem.id,
        credits: semCredits,
        qualityPoints: semQualityPoints,
        gpa: semGPA,
        courseCount: semValidCourses,
      };
    });

    const cgpa =
      totalCumulativeCredits > 0
        ? totalCumulativeQualityPoints / totalCumulativeCredits
        : 0;

    return {
      cgpa,
      totalCredits: totalCumulativeCredits,
      totalQualityPoints: totalCumulativeQualityPoints,
      totalCourses: totalCompletedCourses,
      semesterResults,
    };
  }, [semesters, gradePointsMap]);

  // Semester actions
  const handleAddSemester = () => {
    const nextIndex = semesters.length + 1;
    setSemesters((prev) => [...prev, createBlankSemester(nextIndex, defaultGradeLetter)]);
  };

  const handleRemoveSemester = (semId: string) => {
    if (semesters.length <= 1) {
      // Just clear courses if only one left
      setSemesters([createBlankSemester(1, defaultGradeLetter)]);
      return;
    }
    setSemesters((prev) => prev.filter((s) => s.id !== semId));
  };

  const handleRenameSemester = (semId: string, name: string) => {
    setSemesters((prev) =>
      prev.map((s) => (s.id === semId ? { ...s, name } : s))
    );
  };

  // Course actions
  const handleAddCourse = (semId: string) => {
    setSemesters((prev) =>
      prev.map((s) => {
        if (s.id !== semId) return s;
        return {
          ...s,
          courses: [...s.courses, createBlankCourse(String(s.courses.length + 1), defaultGradeLetter)],
        };
      })
    );
  };

  const handleRemoveCourse = (semId: string, courseId: string) => {
    setSemesters((prev) =>
      prev.map((s) => {
        if (s.id !== semId) return s;
        const remaining = s.courses.filter((c) => c.id !== courseId);
        return {
          ...s,
          courses: remaining.length > 0 ? remaining : [createBlankCourse("1", defaultGradeLetter)],
        };
      })
    );
  };

  const handleUpdateCourse = (
    semId: string,
    courseId: string,
    field: keyof Course,
    val: string | number
  ) => {
    setSemesters((prev) =>
      prev.map((s) => {
        if (s.id !== semId) return s;
        return {
          ...s,
          courses: s.courses.map((c) => {
            if (c.id !== courseId) return c;
            if (field === "credits") {
              if (val === "") return { ...c, credits: "" };
              const parsed = parseFloat(String(val));
              return { ...c, credits: isNaN(parsed) ? "" : parsed };
            }
            return { ...c, [field]: val };
          }),
        };
      })
    );
  };

  // Reset
  const handleReset = () => {
    setSemesters([createBlankSemester(1, defaultGradeLetter)]);
  };

  // Load Sample
  const handleLoadSample = () => {
    setSemesters(SAMPLE_SEMESTERS);
    setActiveScaleKey("ruet-ugc");
  };

  // Scale Config Dialog
  const openConfigDialog = () => {
    setTempScale(JSON.parse(JSON.stringify(activeScale)));
    setIsConfigOpen(true);
  };

  const saveCustomScale = () => {
    setCustomScale(tempScale);
    setActiveScaleKey("custom");
    setIsConfigOpen(false);
  };

  const toggleCollapse = (semId: string) => {
    setCollapsed((prev) => ({ ...prev, [semId]: !prev[semId] }));
  };

  // Academic standing label
  const standingBadge = useMemo(() => {
    const cgpa = calculationResults.cgpa;
    const max = activeScale.maxPoints;
    const ratio = max > 0 ? cgpa / max : 0;

    if (calculationResults.totalCredits === 0) {
      return { label: "No Credits Entered", variant: "secondary" as const };
    }
    if (ratio >= 0.9375) {
      return { label: "First Class with Distinction", variant: "default" as const };
    }
    if (ratio >= 0.75) {
      return { label: "First Class Standing", variant: "secondary" as const };
    }
    if (ratio >= 0.6) {
      return { label: "Second Class Standing", variant: "outline" as const };
    }
    return { label: "Academic Warning", variant: "destructive" as const };
  }, [calculationResults.cgpa, calculationResults.totalCredits, activeScale.maxPoints]);

  return (
    <div className="space-y-6">
      {/* Hero / Summary Dashboard Card */}
      <Card className="border-border bg-card shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-foreground">
                    Cumulative Grade Point Average (CGPA)
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Real-time credit-weighted academic calculation across all semesters
                  </p>
                </div>
              </div>

              {/* Active Scale & Config Button */}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                <span className="text-muted-foreground">Scale:</span>
                <select
                  value={activeScaleKey}
                  onChange={(e) => setActiveScaleKey(e.target.value)}
                  className="h-7 text-xs rounded border border-input bg-background px-2 py-0.5 font-medium text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
                >
                  <option value="ruet-ugc">UGC / Engineering Standard (4.00)</option>
                  <option value="us-standard">North American 4.0 Scale</option>
                  <option value="scale-5">5.0 Point Scale</option>
                  <option value="scale-10">10.0 Point Scale</option>
                  {activeScaleKey === "custom" && <option value="custom">Custom Scale</option>}
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={openConfigDialog}
                  className="h-7 text-xs px-2.5 gap-1.5"
                >
                  <Settings2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Configure Scale</span>
                </Button>

                <Badge variant={standingBadge.variant} className="text-[11px] font-medium ml-auto">
                  {standingBadge.label}
                </Badge>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadSample}
                className="h-8 text-xs gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Load Sample</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-destructive hover:border-destructive"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Big Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border bg-muted/20">
          <div className="p-4 sm:p-5 text-center">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Overall CGPA
            </span>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary font-mono">
                {calculationResults.totalCredits > 0
                  ? calculationResults.cgpa.toFixed(2)
                  : "0.00"}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                / {activeScale.maxPoints.toFixed(2)}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Credit-weighted cumulative
            </p>
          </div>

          <div className="p-4 sm:p-5 text-center">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Total Credits
            </span>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-mono">
                {calculationResults.totalCredits.toFixed(1)}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Earned credit hours
            </p>
          </div>

          <div className="p-4 sm:p-5 text-center">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Quality Points
            </span>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-mono">
                {calculationResults.totalQualityPoints.toFixed(2)}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Σ(Credits × Grade Points)
            </p>
          </div>

          <div className="p-4 sm:p-5 text-center">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Semesters / Courses
            </span>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-mono">
                {semesters.length}
              </span>
              <span className="text-muted-foreground text-sm font-mono">
                / {calculationResults.totalCourses}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Registered academic modules
            </p>
          </div>
        </div>

        {/* Formula Footnote */}
        <div className="px-5 py-2.5 bg-background border-t border-border flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="font-semibold text-foreground">Formula:</span>
            <span>CGPA = Σ(Credit × Grade Point) / Σ(Credits)</span>
          </div>
          <span className="italic">
            Scale: {activeScale.name}
          </span>
        </div>
      </Card>

      {/* Semesters List */}
      <div className="space-y-4">
        {semesters.map((sem, semIdx) => {
          const semResult = calculationResults.semesterResults.find(
            (r) => r.semesterId === sem.id
          );
          const isCollapsed = collapsed[sem.id];

          return (
            <Card
              key={sem.id}
              className="border-border bg-card shadow-xs transition-all overflow-hidden"
            >
              {/* Semester Header */}
              <div className="px-4 py-3 bg-muted/40 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleCollapse(sem.id)}
                    className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                    title={isCollapsed ? "Expand semester" : "Collapse semester"}
                  >
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  <Input
                    value={sem.name}
                    onChange={(e) => handleRenameSemester(sem.id, e.target.value)}
                    className="h-8 text-sm font-semibold max-w-[240px] bg-background/80 border-input font-display"
                    placeholder="e.g. Semester 1"
                  />

                  <Badge variant="outline" className="text-[11px] font-mono font-normal">
                    {sem.courses.length} {sem.courses.length === 1 ? "Course" : "Courses"}
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  {/* Semester Results Badges */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Credits:</span>
                    <span className="font-mono font-semibold text-foreground">
                      {semResult ? semResult.credits.toFixed(1) : "0.0"}
                    </span>

                    <span className="text-muted-foreground ml-1">GPA:</span>
                    <Badge
                      variant="secondary"
                      className="font-mono font-bold text-xs bg-primary/10 text-primary border-primary/20"
                    >
                      {semResult && semResult.credits > 0
                        ? semResult.gpa.toFixed(2)
                        : "0.00"}
                    </Badge>
                  </div>

                  {/* Semester Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSemester(sem.id)}
                    className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    title="Remove Semester"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Semester Body (Collapsible) */}
              {!isCollapsed && (
                <CardContent className="p-4 space-y-3">
                  {/* Desktop Table Header */}
                  <div className="hidden sm:grid sm:grid-cols-12 gap-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <div className="col-span-3">Course Code / No.</div>
                    <div className="col-span-4">Course Title (Optional)</div>
                    <div className="col-span-2">Credit Hours</div>
                    <div className="col-span-2">Letter Grade</div>
                    <div className="col-span-1 text-right">Points</div>
                  </div>

                  {/* Course Rows */}
                  <div className="space-y-2">
                    {sem.courses.map((course, courseIdx) => {
                      const pt = gradePointsMap.get(course.gradeLetter) ?? 0;
                      const cred = typeof course.credits === "number" ? course.credits : 0;
                      const qualityPts = cred * pt;

                      return (
                        <div
                          key={course.id}
                          className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 p-2.5 rounded-md border border-border/70 bg-card hover:bg-muted/20 items-center transition-colors"
                        >
                          {/* Course Code */}
                          <div className="sm:col-span-3">
                            <Label className="text-[10px] text-muted-foreground sm:hidden mb-1 block">
                              Course Code
                            </Label>
                            <Input
                              value={course.code}
                              onChange={(e) =>
                                handleUpdateCourse(sem.id, course.id, "code", e.target.value)
                              }
                              placeholder="e.g. ECE 2101"
                              className="h-8 text-xs font-mono"
                            />
                          </div>

                          {/* Course Title */}
                          <div className="sm:col-span-4">
                            <Label className="text-[10px] text-muted-foreground sm:hidden mb-1 block">
                              Course Title
                            </Label>
                            <Input
                              value={course.name}
                              onChange={(e) =>
                                handleUpdateCourse(sem.id, course.id, "name", e.target.value)
                              }
                              placeholder="e.g. Signals & Systems"
                              className="h-8 text-xs"
                            />
                          </div>

                          {/* Credit Hours */}
                          <div className="sm:col-span-2">
                            <Label className="text-[10px] text-muted-foreground sm:hidden mb-1 block">
                              Credits
                            </Label>
                            <Input
                              type="number"
                              step="0.25"
                              min="0"
                              max="20"
                              value={course.credits}
                              onChange={(e) =>
                                handleUpdateCourse(sem.id, course.id, "credits", e.target.value)
                              }
                              placeholder="3.0"
                              className="h-8 text-xs font-mono"
                            />
                          </div>

                          {/* Letter Grade */}
                          <div className="sm:col-span-2">
                            <Label className="text-[10px] text-muted-foreground sm:hidden mb-1 block">
                              Letter Grade
                            </Label>
                            <select
                              value={course.gradeLetter}
                              onChange={(e) =>
                                handleUpdateCourse(sem.id, course.id, "gradeLetter", e.target.value)
                              }
                              className="w-full h-8 text-xs rounded-md border border-input bg-background px-2 font-mono font-medium text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
                            >
                              {activeScale.grades.map((g) => (
                                <option key={g.id} value={g.letter}>
                                  {g.letter} ({g.points.toFixed(2)})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Quality Points & Delete Action */}
                          <div className="sm:col-span-1 flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0">
                            <div className="text-right">
                              <span className="text-[10px] text-muted-foreground sm:hidden block">
                                Quality Points
                              </span>
                              <span className="font-mono text-xs font-bold text-foreground">
                                {qualityPts.toFixed(2)}
                              </span>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveCourse(sem.id, course.id)}
                              className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              title="Delete Course"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Course Button */}
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddCourse(sem.id)}
                      className="h-8 text-xs gap-1.5 border-dashed"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Course</span>
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Add Semester Button */}
      <div className="flex items-center justify-center pt-2">
        <Button
          onClick={handleAddSemester}
          className="gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Semester</span>
        </Button>
      </div>

      {/* Scale Configuration Modal / Dialog */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-primary" />
              <span>Configure Grading Scale</span>
            </DialogTitle>
            <DialogDescription>
              Customize the letter grades and their corresponding numerical grade point values to match your university's official scale.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Scale Name & Max Points */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Scale Name</Label>
                <Input
                  value={tempScale.name}
                  onChange={(e) =>
                    setTempScale({ ...tempScale, name: e.target.value })
                  }
                  className="h-8 text-xs mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Max Grade Points</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="1"
                  max="100"
                  value={tempScale.maxPoints}
                  onChange={(e) =>
                    setTempScale({
                      ...tempScale,
                      maxPoints: parseFloat(e.target.value) || 4.0,
                    })
                  }
                  className="h-8 text-xs mt-1 font-mono"
                />
              </div>
            </div>

            {/* Grades Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs font-semibold">Letter Grades & Points</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setTempScale({
                      ...tempScale,
                      grades: [
                        ...tempScale.grades,
                        {
                          id: `custom-${Date.now()}`,
                          letter: "New",
                          points: 0.0,
                          description: "",
                        },
                      ],
                    })
                  }
                  className="h-7 text-xs px-2 gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Grade</span>
                </Button>
              </div>

              <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                {tempScale.grades.map((g, idx) => (
                  <div
                    key={g.id}
                    className="grid grid-cols-12 gap-2 items-center p-1.5 rounded border border-border/80 bg-muted/20"
                  >
                    <div className="col-span-3">
                      <Input
                        value={g.letter}
                        onChange={(e) => {
                          const updated = tempScale.grades.map((item, i) =>
                            i === idx ? { ...item, letter: e.target.value } : item
                          );
                          setTempScale({ ...tempScale, grades: updated });
                        }}
                        className="h-7 text-xs font-mono font-bold"
                        placeholder="Letter (e.g. A+)"
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        step="0.05"
                        min="0"
                        max="100"
                        value={g.points}
                        onChange={(e) => {
                          const pts = parseFloat(e.target.value) || 0;
                          const updated = tempScale.grades.map((item, i) =>
                            i === idx ? { ...item, points: pts } : item
                          );
                          setTempScale({ ...tempScale, grades: updated });
                        }}
                        className="h-7 text-xs font-mono"
                        placeholder="Points"
                      />
                    </div>
                    <div className="col-span-5">
                      <Input
                        value={g.description || ""}
                        onChange={(e) => {
                          const updated = tempScale.grades.map((item, i) =>
                            i === idx ? { ...item, description: e.target.value } : item
                          );
                          setTempScale({ ...tempScale, grades: updated });
                        }}
                        className="h-7 text-xs"
                        placeholder="Description (e.g. 80%+)"
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={tempScale.grades.length <= 1}
                        onClick={() => {
                          const updated = tempScale.grades.filter((_, i) => i !== idx);
                          setTempScale({ ...tempScale, grades: updated });
                        }}
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfigOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={saveCustomScale}
              className="gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Custom Scale</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
