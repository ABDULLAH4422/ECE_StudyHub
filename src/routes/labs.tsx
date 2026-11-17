import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Building2, Library, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { laboratories } from "@/data/demo";

export const Route = createFileRoute("/labs")({
  component: LabsPage,
});

function LabsPage() {
  return (
    <PublicLayout>
      <PageHeader
        category="Facilities & Infrastructure"
        title="Laboratories & Facilities"
        description="The Department of ECE possesses well-equipped specialized laboratories and a departmental rental library supporting undergraduate sessional experimentation, capstone design, and advanced research."
        breadcrumbs={[{ label: "Laboratories" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Department Rental Library Facility Card */}
        <div className="p-6 rounded-lg bg-card border border-border/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-secondary text-primary flex items-center justify-center shrink-0">
              <Library className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base text-foreground">Departmental Rental Library</h3>
                <Badge variant="secondary" className="text-[11px] font-normal">Textbook Bank</Badge>
              </div>
              <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                Offers semester-long textbook lending services for all theoretical core and elective engineering courses, complementing central university library resources.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs font-normal self-start md:self-auto">
            Available to all ECE Students
          </Badge>
        </div>

        {/* 9 Official Laboratories Grid */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="font-display font-semibold text-lg text-foreground">
              Specialized Laboratories ({laboratories.length})
            </h2>
            <p className="text-xs text-muted-foreground">
              Fully operational undergraduate instructional and advanced development labs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {laboratories.map((lab, index) => (
              <Card key={lab.id} className="border border-border/80 bg-card hover:border-border transition-colors flex flex-col justify-between">
                <CardHeader className="p-5 pb-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-[11px] font-normal">
                      Lab {index + 1} · Cap: {lab.capacity}
                    </Badge>
                    <span className="text-xs text-muted-foreground">In-charge: {lab.incharge}</span>
                  </div>
                  <CardTitle className="text-sm font-semibold text-foreground pt-1">
                    {lab.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-4 text-xs">
                  <div>
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                      Equipment & Instruments
                    </span>
                    <div className="flex flex-wrap gap-1 pt-1.5">
                      {lab.equipment.map((eq, i) => (
                        <span key={i} className="text-[11px] bg-muted px-2 py-0.5 rounded text-muted-foreground">
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/60 flex items-center justify-between text-muted-foreground text-xs">
                    <span className="truncate max-w-[200px]">Courses: {lab.courses.join(", ")}</span>
                    <span className="text-primary font-medium flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Operational
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
