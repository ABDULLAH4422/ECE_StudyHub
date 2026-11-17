import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { GraduationCap, Download, FileText, ArrowRight, ShieldCheck, MapPin, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { syllabusMeta } from "@/data/eceSyllabus";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <PublicLayout>
      <PageHeader
        category="Institutional Overview"
        title="About the Department"
        description="Department of Electrical & Computer Engineering (ECE), Rajshahi University of Engineering & Technology (RUET)."
        breadcrumbs={[{ label: "About" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Department Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
            <div className="space-y-3">
              <h2 className="font-display font-semibold text-xl text-foreground">
                Academic Mission & Profile
              </h2>
              <p>
                Electrical & Computer Engineering, which applies technical principles to the invention, design, and operation of advanced electrical, electronics, and computing systems, is a vital broad-based discipline. The Department of Electrical & Computer Engineering at Rajshahi University of Engineering & Technology offers a distinguished four-year undergraduate program leading to the Bachelor of Science in Engineering (B.Sc. Engg.) degree.
              </p>
              <p>
                The curriculum is structured across 8 rigorous semesters totaling 160.0 credit hours (120.0 theory credits and 40.0 sessional lab credits). It empowers graduates with strong foundations in electromagnetic fields, modern power systems, embedded microarchitectures, VLSI design, and artificial intelligence applications.
              </p>
              <p>
                Our curriculum strictly complies with the Outcome-Based Education (OBE) guidelines established by the Board of Accreditation for Engineering and Technical Education (BAETE), ensuring international standard compatibility and direct industrial relevance.
              </p>
            </div>

            {/* Official Syllabus Callout Card */}
            <div className="p-5 rounded-lg border border-border/80 bg-card space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-foreground text-sm">
                  Official Undergraduate Syllabus & Ordinance
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Effective from Session 2020-2021, First Edition (September 2023). Published by the Department of Electrical & Computer Engineering, RUET. Complete documentation covering credit allocations, course outlines, continuous assessment criteria, and examination ordinance.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Button asChild size="sm" className="gap-1.5 text-xs">
                  <a href={syllabusMeta.pdfPath} download="RUET-ECE-Undergraduate-Syllabus.pdf">
                    <Download className="w-3.5 h-3.5" /> Download Syllabus PDF ({syllabusMeta.pdfFileSize})
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Link to="/curriculum">
                    View Course Outlines Online <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Key Facts Card */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border border-border/80 bg-card">
              <CardHeader className="bg-muted/30 border-b border-border/60 py-4 px-5">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <GraduationCap className="w-4 h-4 text-primary" /> Degree Program Facts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <span className="text-muted-foreground">Institution</span>
                  <span className="font-medium text-foreground">RUET (Rajshahi-6204)</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <span className="text-muted-foreground">Degree Conferred</span>
                  <span className="font-medium text-foreground">B.Sc. Engg. (ECE)</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium text-foreground">4 Academic Years (8 Semesters)</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <span className="text-muted-foreground">Total Credits</span>
                  <span className="font-medium text-foreground">160.0 Credits (120 Theory + 40 Lab)</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <span className="text-muted-foreground">Accreditation</span>
                  <Badge variant="secondary" className="text-[11px] font-normal">
                    BAETE OBE-Compliant
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Head of Department</span>
                  <span className="font-medium text-foreground">Prof. Dr. Md. Anwar Hossain</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact Summary */}
            <Card className="border border-border/80 bg-card">
              <CardHeader className="bg-muted/30 border-b border-border/60 py-3 px-5">
                <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Department Office
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-2.5 text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <span>3rd Floor, ECE Building, RUET Campus, Kazla, Rajshahi-6204</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>+88-0721-751055 · PABX ext. 653</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                  <a href="mailto:head@ece.ruet.ac.bd" className="hover:underline text-foreground">
                    head@ece.ruet.ac.bd
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
