import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import {
  ArrowRight,
  ShieldCheck,
  FileText,
  FlaskConical,
  Building2,
  Calendar,
  Award,
  Bell,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/common/StatCard";
import {
  departmentStats,
  notices,
  laboratories,
  researchAreas,
  calendarEvents,
  achievements,
} from "@/data/demo";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-muted/30 to-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-background border text-xs text-muted-foreground mb-6">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>RUET ECE · BAETE Accredited</span>
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground tracking-tight leading-tight mb-6">
              Department of Electrical & Computer Engineering
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Rajshahi University of Engineering & Technology. Excellence in Power Systems, Embedded Computing, VLSI Design, and Intelligent Signal Processing.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link to="/student">
                  Student Portal <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/curriculum">
                  <BookOpen className="w-4 h-4" /> Curriculum
                </Link>
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <a href="/ece-undergraduate-syllabus.pdf" download>
                  <FileText className="w-4 h-4" /> Syllabus PDF
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="border-b bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Students"
              value={departmentStats.students}
              subtitle="Enrolled undergraduates"
            />
            <StatCard
              label="Faculty"
              value={departmentStats.faculty}
              subtitle="Teaching & research"
            />
            <StatCard
              label="Laboratories"
              value={departmentStats.laboratories}
              subtitle="Specialized labs"
            />
            <StatCard
              label="Credits"
              value="160.0"
              subtitle="8 semesters · BAETE"
            />
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-12 border-b bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground mb-2">
                <Bell className="w-4 h-4 text-primary" />
                <span>Notice Board</span>
              </div>
              <h2 className="font-display font-semibold text-2xl text-foreground">
                Recent Announcements
              </h2>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/student">View All →</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {notices.map((notice) => (
              <Card key={notice.id} className="flex flex-col">
                <CardHeader className="p-4 pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge
                      variant={notice.priority === "HIGH" || notice.priority === "URGENT" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {notice.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{notice.date}</span>
                  </div>
                  <CardTitle className="text-sm font-semibold leading-snug line-clamp-2">
                    {notice.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {notice.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities & Achievements */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Laboratories */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-semibold text-xl text-foreground">
                    Specialized Laboratories
                  </h3>
                </div>
                <Link to="/labs" className="text-sm text-primary hover:underline">
                  View All →
                </Link>
              </div>

              <div className="space-y-3">
                {laboratories.slice(0, 3).map((lab) => (
                  <div key={lab.id} className="p-4 rounded-md border bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-foreground">{lab.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {lab.capacity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">In-charge: {lab.incharge}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-semibold text-xl text-foreground">
                    Recent Achievements
                  </h3>
                </div>
                <Link to="/achievements" className="text-sm text-primary hover:underline">
                  View All →
                </Link>
              </div>

              <div className="space-y-3">
                {achievements.slice(0, 2).map((ac) => (
                  <div key={ac.id} className="p-4 rounded-md border bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-foreground">{ac.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {ac.year}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{ac.detail}</p>
                  </div>
                ))}

                {/* Next Event */}
                {calendarEvents[0] && (
                  <div className="p-4 rounded-md bg-primary text-primary-foreground">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-medium flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" /> Upcoming Event
                      </span>
                      <span>{calendarEvents[0].date}</span>
                    </div>
                    <div className="text-sm font-semibold mb-1">{calendarEvents[0].title}</div>
                    <p className="text-xs opacity-90">{calendarEvents[0].detail}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
