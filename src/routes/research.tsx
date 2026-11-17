import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { FlaskConical, ArrowRight, BookOpen, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { researchAreas, publications } from "@/data/demo";

export const Route = createFileRoute("/research")({
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <PublicLayout>
      <PageHeader
        category="Innovation & R&D"
        title="Research Groups & Disciplines"
        description="Leading-edge research in Smart Grids, Embedded Systems, VLSI Hardware Accelerators, and Biomedical Signal Processing at ECE RUET."
        breadcrumbs={[{ label: "Research" }]}
        actions={
          <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs">
            <Link to="/publications">
              <BookOpen className="w-3.5 h-3.5" /> View Publications ({publications.length})
            </Link>
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Research Areas Grid */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="font-display font-semibold text-lg text-foreground">
              Active Research Groups
            </h2>
            <p className="text-xs text-muted-foreground">
              Investigating foundational engineering principles and practical industrial applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {researchAreas.map((area) => (
              <Card key={area.id} className="border border-border/80 bg-card hover:border-border transition-colors">
                <CardHeader className="p-6 pb-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-xs font-normal">
                      {area.activeProjects} Active Projects
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Lead: {area.leads.join(", ")}
                    </span>
                  </div>
                  <CardTitle className="text-base font-semibold text-foreground pt-1">
                    {area.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                    {area.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-3">
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-muted-foreground" />
                      ECE RUET Research Group
                    </span>
                    <Link to="/faculty" className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                      Faculty Leads <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Selected Publications Banner */}
        <div className="p-6 rounded-lg border border-border/80 bg-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-base text-foreground">
              Recent Scholarly Publications
            </h3>
            <p className="text-xs text-muted-foreground">
              Explore recent peer-reviewed journal articles and conference papers by department faculty and research teams.
            </p>
          </div>
          <Button asChild size="sm" className="gap-2 shrink-0">
            <Link to="/publications">
              Explore Publications Directory <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </PublicLayout>
  );
}
