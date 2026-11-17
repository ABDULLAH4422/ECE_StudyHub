import { createFileRoute } from "@tanstack/react-router";
import { PortalLayout } from "@/components/layout/PortalLayout";
import {
  BookOpen,
  CheckSquare,
  BarChart3,
  Clock,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/common/StatCard";
import {
  courses,
  assignments,
  attendanceSummary,
  results,
} from "@/data/demo";

export const Route = createFileRoute("/student")({
  component: StudentDashboard,
});

function StudentDashboard() {
  const pendingAssignments = assignments.filter((a) => a.submissionStatus === "NOT_SUBMITTED");

  return (
    <PortalLayout
      title="Student Academic Dashboard"
      description="Welcome back, Sadia M. Rahman (Roll: 1901001 · 19 Series · 6th Semester)"
    >
      <div className="space-y-6">
        {/* Top Summary Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Current GPA"
            value="3.58 / 4.00"
            subtitle="Rank #3 in 19 Series"
            icon={<Award className="w-4 h-4 text-primary" />}
          />
          <StatCard
            label="Enrolled Courses"
            value={`${courses.length} Courses`}
            subtitle="16.5 total credit hours"
            icon={<BookOpen className="w-4 h-4 text-primary" />}
          />
          <StatCard
            label="Attendance Rate"
            value="92.3%"
            subtitle="Above 75% requirement"
            icon={<CheckSquare className="w-4 h-4 text-primary" />}
          />
          <StatCard
            label="Pending Tasks"
            value={`${pendingAssignments.length} Assignments`}
            subtitle="Upcoming due in 5 days"
            icon={<Clock className="w-4 h-4 text-primary" />}
          />
        </div>

        {/* Middle Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Enrolled Courses & Attendance */}
          <div className="lg:col-span-8 space-y-6">
            {/* Enrolled Courses */}
            <Card className="border border-border/80 bg-card">
              <CardHeader className="p-4 border-b border-border/70 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" /> Active Enrolled Courses (6th Semester)
                </CardTitle>
                <Badge variant="outline" className="text-xs font-normal">
                  19 Series
                </Badge>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {courses.map((course) => (
                  <div key={course.id} className="p-3.5 rounded-lg bg-muted/30 border border-border/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-medium text-xs text-primary">{course.code}</span>
                      <Badge variant={course.type === "THEORY" ? "secondary" : "outline"} className="text-[11px] font-normal">
                        {course.credits} Cr · {course.type}
                      </Badge>
                    </div>
                    <div className="text-xs font-semibold text-foreground">{course.title}</div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Instructor: {course.facultyName}</span>
                      <span>Enrolled: {course.enrolled} Students</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Attendance Summary */}
            <Card className="border border-border/80 bg-card">
              <CardHeader className="p-4 border-b border-border/70">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-primary" /> Course Attendance Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/20">
                    <TableRow>
                      <TableHead className="text-xs font-medium">Course Code</TableHead>
                      <TableHead className="text-xs font-medium">Course Title</TableHead>
                      <TableHead className="text-xs font-medium">Attended / Total</TableHead>
                      <TableHead className="text-xs font-medium">Percentage</TableHead>
                      <TableHead className="text-xs font-medium">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceSummary.map((item) => {
                      const pct = Math.round((item.attended / item.total) * 100);
                      return (
                        <TableRow key={item.courseId}>
                          <TableCell className="font-mono text-xs font-medium text-primary">{item.courseCode}</TableCell>
                          <TableCell className="text-xs font-medium">{item.courseTitle}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {item.attended} / {item.total} Classes
                          </TableCell>
                          <TableCell className="text-xs font-semibold text-foreground">{pct}%</TableCell>
                          <TableCell>
                            <Badge
                              variant={pct >= 75 ? "secondary" : "destructive"}
                              className="text-[11px] font-normal"
                            >
                              {pct >= 75 ? "Satisfactory" : "Below 75%"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Deadlines & Recent Results */}
          <div className="lg:col-span-4 space-y-6">
            {/* Upcoming Deadlines Card */}
            <Card className="border border-border/80 bg-card">
              <CardHeader className="p-4 border-b border-border/70">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> Assignments & Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {assignments.map((asgn) => (
                  <div key={asgn.id} className="p-3 rounded-md border border-border/60 space-y-1.5 bg-background">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={asgn.submissionStatus === "GRADED" ? "secondary" : asgn.submissionStatus === "SUBMITTED" ? "default" : "outline"}
                        className="text-[11px] font-normal"
                      >
                        {asgn.submissionStatus.replace("_", " ")}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Due: {asgn.deadline}</span>
                    </div>
                    <div className="text-xs font-semibold text-foreground">{asgn.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{asgn.description}</div>
                    <div className="pt-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Total Marks: {asgn.totalMarks}</span>
                      {asgn.obtainedMarks !== undefined && (
                        <span className="font-semibold text-foreground">Score: {asgn.obtainedMarks}/{asgn.totalMarks}</span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Assessment Results Card */}
            <Card className="border border-border/80 bg-card">
              <CardHeader className="p-4 border-b border-border/70">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" /> Recent Evaluation Results
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2.5">
                {results.slice(0, 4).map((res) => (
                  <div key={res.id} className="flex items-center justify-between p-2.5 rounded-md bg-muted/30 border border-border/50 text-xs">
                    <div>
                      <div className="font-medium text-foreground">{res.courseCode} ({res.type})</div>
                      <div className="text-xs text-muted-foreground">{res.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">
                        {res.obtained} / {res.total}
                      </div>
                      <Badge variant={res.status === "PASSED" ? "secondary" : "outline"} className="text-[10px] font-normal px-1 py-0">
                        {res.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
