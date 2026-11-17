import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import {
  BookOpen,
  Download,
  FileText,
  ExternalLink,
  Layers,
  ChevronDown,
  ChevronUp,
  Award,
  SlidersHorizontal,
  Bookmark,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import {
  syllabusMeta,
  semesterCurricula,
  electiveCourses,
  creditDistributionCategories,
  gradingSystemData,
  marksDistributionData,
  SyllabusCourse,
} from "@/data/eceSyllabus";

export const Route = createFileRoute("/curriculum")({
  component: CurriculumPage,
});

function CurriculumPage() {
  const [selectedSemester, setSelectedSemester] = useState<string>("1-1");
  const [expandedCourse, setExpandedCourse] = useState<string | null>("ECE 1101");

  const currentCurriculum =
    semesterCurricula.find((sem) => sem.semesterId === selectedSemester) ?? semesterCurricula[0];

  const toggleCourseExpand = (courseNo: string) => {
    setExpandedCourse(expandedCourse === courseNo ? null : courseNo);
  };

  if (!currentCurriculum) {
    return null;
  }

  return (
    <PublicLayout>
      <PageHeader
        category="Curriculum"
        title="Undergraduate B.Sc. Engineering Syllabus"
        description={`160 credit hours across 8 semesters under Outcome-Based Education (OBE) framework. Session ${syllabusMeta.effectiveSession}.`}
        actions={
          <Button asChild size="sm">
            <a href={syllabusMeta.pdfPath} download>
              <Download className="w-4 h-4" /> Download PDF
            </a>
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Credit Breakdown Highlights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Degree Credits"
            value={`${syllabusMeta.totalCredits.toFixed(1)} Cr`}
            subtitle="Minimum required for graduation"
            icon={<Award className="w-4 h-4" />}
          />
          <StatCard
            label="Duration"
            value="8 Semesters"
            subtitle="4 academic years (13 wks/term)"
            icon={<BookOpen className="w-4 h-4" />}
          />
          <StatCard
            label="Theory Credits"
            value={`${syllabusMeta.theoryCredits.toFixed(1)} Cr`}
            subtitle="40 theoretical courses"
            icon={<FileText className="w-4 h-4" />}
          />
          <StatCard
            label="Sessional Credits"
            value={`${syllabusMeta.sessionalCredits.toFixed(1)} Cr`}
            subtitle="40 practical laboratory sessions"
            icon={<Layers className="w-4 h-4" />}
          />
        </div>

        {/* Main Curriculum Navigation Tabs */}
        <Tabs defaultValue="semesters" className="space-y-6">
          <TabsList className="bg-muted p-1 border rounded-md flex flex-wrap h-auto gap-1">
            <TabsTrigger value="semesters" className="text-sm gap-1.5">
              <BookOpen className="w-4 h-4" /> Semesters
            </TabsTrigger>
            <TabsTrigger value="electives" className="text-sm gap-1.5">
              <Layers className="w-4 h-4" /> Electives
            </TabsTrigger>
            <TabsTrigger value="credit-breakdown" className="text-sm gap-1.5">
              <SlidersHorizontal className="w-4 h-4" /> Credits
            </TabsTrigger>
            <TabsTrigger value="ordinance" className="text-sm gap-1.5">
              <Award className="w-4 h-4" /> Grading
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Semester-Wise Courses */}
          <TabsContent value="semesters" className="space-y-5">
            {/* Semester Pill Selectors */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {semesterCurricula.map((sem) => (
                <Button
                  key={sem.semesterId}
                  variant={selectedSemester === sem.semesterId ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSemester(sem.semesterId)}
                  className="text-sm whitespace-nowrap"
                >
                  Year {sem.year} · {sem.term} ({sem.totalCredits} Cr)
                </Button>
              ))}
            </div>

            {/* Semester Information Table */}
            <Card>
              <CardHeader className="bg-muted/30 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">
                      {currentCurriculum.semesterName}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {currentCurriculum.courses.length} courses
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Theory: {currentCurriculum.theoryCredits} Cr
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Lab: {currentCurriculum.sessionalCredits} Cr
                    </Badge>
                    <Badge className="text-xs">
                      Total: {currentCurriculum.totalCredits} Cr
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/20">
                    <TableRow>
                      <TableHead className="text-sm w-[130px]">Course Code</TableHead>
                      <TableHead className="text-sm">Course Title</TableHead>
                      <TableHead className="text-sm w-[100px]">Type</TableHead>
                      <TableHead className="text-sm w-[120px] text-center">Contact Hrs/Wk</TableHead>
                      <TableHead className="text-sm w-[90px] text-center">Credits</TableHead>
                      <TableHead className="text-sm w-[80px] text-right">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentCurriculum.courses.map((course: SyllabusCourse) => {
                      const isExpanded = expandedCourse === course.courseNo;
                      return (
                        <React.Fragment key={course.courseNo}>
                          <TableRow
                            className={`cursor-pointer hover:bg-muted/30 ${
                              isExpanded ? "bg-muted/15" : ""
                            }`}
                            onClick={() => toggleCourseExpand(course.courseNo)}
                          >
                            <TableCell className="font-mono font-medium text-sm text-primary">
                              {course.courseNo}
                            </TableCell>
                            <TableCell className="text-sm">
                              <span className="font-medium">{course.courseTitle}</span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={course.type === "THEORY" ? "secondary" : "outline"}
                                className="text-xs"
                              >
                                {course.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-center text-muted-foreground">
                              {course.contactHrs}
                            </TableCell>
                            <TableCell className="text-sm font-semibold text-center">
                              {course.credits.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>

                          {/* Expanded Course Syllabus Topics */}
                          {isExpanded && (
                            <TableRow className="bg-muted/10">
                              <TableCell colSpan={6} className="p-5">
                                <div className="space-y-3 bg-card p-4 rounded-md border">
                                  <div className="flex items-center justify-between">
                                    <div className="font-medium text-sm flex items-center gap-2">
                                      <Bookmark className="w-4 h-4 text-primary" />
                                      {course.courseNo} — {course.courseTitle}
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                      {course.credits.toFixed(2)} Credits
                                    </span>
                                  </div>

                                  {course.topics && course.topics.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {course.topics.map((topic, i) => (
                                        <div
                                          key={i}
                                          className="p-3 rounded-md bg-muted/30 border space-y-1"
                                        >
                                          <div className="font-medium text-sm">
                                            {topic.title}
                                          </div>
                                          <p className="text-sm text-muted-foreground leading-relaxed">
                                            {topic.description}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground">
                                      Practical laboratory course based on corresponding theoretical concepts.
                                    </p>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: Elective Pools */}
          <TabsContent value="electives" className="space-y-6">
            <div>
              <h2 className="font-display font-semibold text-lg mb-1">
                Technical Elective Courses
              </h2>
              <p className="text-sm text-muted-foreground">
                4th year students select specialized electives aligned with their career direction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["Optional I", "Optional II", "Optional III", "Optional IV"].map((poolName) => {
                const poolCourses = electiveCourses.filter((c) => c.pool === poolName);
                const semesterLabel =
                  poolName === "Optional I" || poolName === "Optional II" ? "4-1" : "4-2";

                return (
                  <Card key={poolName}>
                    <CardHeader className="p-4 bg-muted/20 border-b">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {poolName}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {semesterLabel}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {poolCourses.map((c) => (
                          <div key={c.courseNo} className="p-4 flex items-center justify-between gap-3">
                            <div>
                              <div className="font-mono text-sm font-medium text-primary">
                                {c.courseNo}
                              </div>
                              <div className="text-sm">{c.courseTitle}</div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge variant="secondary" className="text-xs">
                                {c.stream}
                              </Badge>
                              <span className="text-sm text-muted-foreground font-medium">
                                {c.credits} Cr
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* TAB 3: Credit Distribution */}
          <TabsContent value="credit-breakdown" className="space-y-6">
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-base">
                  Course Distribution by Academic Domain
                </CardTitle>
                <CardDescription>
                  Official breakdown across science, humanities, and engineering courses
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/20">
                    <TableRow>
                      <TableHead className="text-sm">Classification</TableHead>
                      <TableHead className="text-sm text-center">Percentage</TableHead>
                      <TableHead className="text-sm text-center">Credits</TableHead>
                      <TableHead className="text-sm">Coverage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creditDistributionCategories.map((cat, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium text-sm">
                          {cat.category}
                        </TableCell>
                        <TableCell className="text-sm text-center font-semibold text-primary">
                          {cat.percentage}
                        </TableCell>
                        <TableCell className="text-sm text-center font-semibold">
                          {cat.credits.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {cat.subcategories}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/30 font-semibold">
                      <TableCell className="text-sm">Total</TableCell>
                      <TableCell className="text-sm text-center text-primary">100%</TableCell>
                      <TableCell className="text-sm text-center">160.00 Cr</TableCell>
                      <TableCell className="text-sm text-muted-foreground">40 Theory & 40 Lab</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: Academic Ordinance & Grading */}
          <TabsContent value="ordinance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Grading System Table */}
              <Card>
                <CardHeader className="p-4 border-b bg-muted/20">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" /> Letter Grading Scale
                  </CardTitle>
                  <CardDescription>
                    Undergraduate grading system
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/15">
                      <TableRow>
                        <TableHead className="text-sm">Range</TableHead>
                        <TableHead className="text-sm">Grade</TableHead>
                        <TableHead className="text-sm text-right">Point</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gradingSystemData.map((grade, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-sm">{grade.numerical}</TableCell>
                          <TableCell className="text-sm font-semibold text-primary">
                            {grade.letter}
                          </TableCell>
                          <TableCell className="text-sm text-right font-semibold">
                            {grade.point}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Mark Distribution System */}
              <div className="space-y-6">
                <Card>
                  <CardHeader className="p-4 border-b bg-muted/20">
                    <CardTitle className="text-base">Theory Course Evaluation</CardTitle>
                    <CardDescription>100 marks total breakdown</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3 text-sm">
                    <div className="p-3 rounded-md bg-muted/30 border space-y-2">
                      <div className="font-medium flex items-center justify-between">
                        <span>Continuous Assessment</span>
                        <span className="font-semibold">40 Marks</span>
                      </div>
                      <div className="space-y-1 text-muted-foreground pt-2 border-t text-sm">
                        <div className="flex justify-between">
                          <span>Attendance & Participation</span>
                          <span className="text-foreground">10</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Class Tests (Best 3 of 4)</span>
                          <span className="text-foreground">20</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Assignment / Project</span>
                          <span className="text-foreground">10</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-md bg-muted/20 border flex items-center justify-between font-medium">
                      <span>Final Examination</span>
                      <span className="font-semibold">60 Marks</span>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Minimum pass: 15/60 in final exam
                    </p>
                  </CardContent>
                </Card>

                {/* Sessional Course Mark Distribution */}
                <Card>
                  <CardHeader className="p-4 border-b bg-muted/20">
                    <CardTitle className="text-base">Lab Evaluation</CardTitle>
                    <CardDescription>100 marks continuous assessment</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2 text-sm">
                    <div className="divide-y">
                      {marksDistributionData.sessional.breakdown.map((item, i) => (
                        <div key={i} className="py-2 flex items-center justify-between">
                          <span className="text-muted-foreground">{item.item}</span>
                          <span className="font-medium">{item.marks}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Attendance Requirements */}
            <Card>
              <CardHeader className="p-4 border-b bg-muted/20">
                <CardTitle className="text-base">Attendance Policy</CardTitle>
                <CardDescription>Academic standing requirements</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {marksDistributionData.attendanceScale.map((scale, i) => (
                    <div key={i} className="p-3 rounded-md bg-muted/30 border text-center">
                      <div className="text-base font-semibold">{scale.marks}</div>
                      <div className="text-sm text-muted-foreground mt-1">{scale.range}</div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-md bg-muted/30 border text-sm space-y-1">
                  <div className="font-medium flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary shrink-0" /> Debarment Regulation
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Students with less than 50% attendance are debarred from final examination. Below 75% makes students ineligible for merit scholarships.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PublicLayout>
  );
}
