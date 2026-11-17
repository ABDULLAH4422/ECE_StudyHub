import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PortalLayout } from "@/components/layout/PortalLayout";
import {
  BookOpen,
  Upload,
  ClipboardList,
  CheckSquare,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { courses, submissions } from "@/data/demo";

export const Route = createFileRoute("/faculty-portal")({
  component: FacultyDashboard,
});

function FacultyDashboard() {
  const [evaluatedIds, setEvaluatedIds] = useState<string[]>([]);
  const myCourses = courses.filter((c) => c.facultyId === "f3"); // Dr. Rafiul Islam

  const handleEvaluate = (id: string) => {
    setEvaluatedIds((prev) => [...prev, id]);
  };

  return (
    <PortalLayout
      title="Faculty Academic Management Portal"
      description="Welcome back, Dr. Rafiul Islam (Associate Professor · ECE Department)"
    >
      <div className="space-y-6">
        {/* Quick Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg bg-card border border-border/80">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-normal">Faculty Instructor</Badge>
            <span className="text-xs text-muted-foreground">Assigned Courses: 2 · Total Enrolled: 236 Students</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="gap-1.5 text-xs">
              <Upload className="w-3.5 h-3.5" /> Upload Material
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <Plus className="w-3.5 h-3.5" /> Create Assignment
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <CheckSquare className="w-3.5 h-3.5" /> Attendance
            </Button>
          </div>
        </div>

        {/* Assigned Courses Grid */}
        <div className="space-y-4">
          <h2 className="font-display font-semibold text-base text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" /> Assigned Courses (Spring Term)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCourses.map((course) => (
              <Card key={course.id} className="border border-border/80 bg-card hover:border-border transition-colors">
                <CardHeader className="p-4 pb-2 border-b border-border/70 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-medium text-xs text-primary">{course.code}</span>
                    <Badge variant={course.type === "THEORY" ? "secondary" : "outline"} className="text-[11px] font-normal">
                      {course.credits} Cr · {course.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-semibold text-foreground pt-0.5">{course.title}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">{course.batch} · Semester {course.semester}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-3 text-xs">
                  <p className="text-muted-foreground line-clamp-2 leading-relaxed">{course.description}</p>
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Enrolled: {course.enrolled} Students</span>
                    <span className="text-primary font-medium cursor-pointer hover:underline">View Course Details →</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Submissions Pending Evaluation */}
        <Card className="border border-border/80 bg-card">
          <CardHeader className="p-4 border-b border-border/70 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-primary" /> Student Submissions Pending Evaluation
            </CardTitle>
            <Badge variant="outline" className="text-xs font-normal">
              {submissions.length} Total Submissions
            </Badge>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/20">
                <TableRow>
                  <TableHead className="text-xs font-medium">Roll No.</TableHead>
                  <TableHead className="text-xs font-medium">Student Name</TableHead>
                  <TableHead className="text-xs font-medium">Submitted File</TableHead>
                  <TableHead className="text-xs font-medium">Submitted At</TableHead>
                  <TableHead className="text-xs font-medium">Status</TableHead>
                  <TableHead className="text-xs font-medium text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((sub) => {
                  const isEvaluated = evaluatedIds.includes(sub.id) || sub.status === "EVALUATED";
                  return (
                    <TableRow key={sub.id}>
                      <TableCell className="font-mono font-medium text-xs text-primary">{sub.studentRoll}</TableCell>
                      <TableCell className="text-xs font-medium text-foreground">{sub.studentName}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{sub.fileName}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{sub.submittedAt}</TableCell>
                      <TableCell>
                        <Badge
                          variant={isEvaluated ? "secondary" : sub.status === "LATE" ? "destructive" : "outline"}
                          className="text-[11px] font-normal"
                        >
                          {isEvaluated ? "EVALUATED" : sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {isEvaluated ? (
                          <span className="text-xs text-primary font-medium inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Graded
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEvaluate(sub.id)}
                            className="h-7 text-xs px-2.5"
                          >
                            Grade File
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
