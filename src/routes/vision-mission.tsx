import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Target, Award, Compass, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { peos, pos, psos } from "@/data/demo";

export const Route = createFileRoute("/vision-mission")({
  component: VisionMissionPage,
});

function VisionMissionPage() {
  return (
    <PublicLayout>
      <PageHeader
        category="Accreditation & Quality Assurance"
        title="Vision, Mission & OBE Framework"
        description="Program Educational Objectives (PEOs), Program Outcomes (POs), and Program Specific Outcomes (PSOs) governing engineering education at ECE RUET under the BAETE accreditation manual."
        breadcrumbs={[{ label: "Vision & Mission" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-border/80 bg-card">
            <CardHeader className="bg-muted/30 border-b border-border/60 p-5">
              <div className="flex items-center gap-2 text-foreground font-semibold text-base">
                <Compass className="w-4 h-4 text-primary" /> Vision of the Department
              </div>
            </CardHeader>
            <CardContent className="p-5 text-sm text-muted-foreground leading-relaxed">
              To be an internationally recognized center of excellence in Electrical and Computer Engineering education and research, producing innovative engineers, researchers, and entrepreneurial leaders capable of solving complex global technological challenges and serving societal needs.
            </CardContent>
          </Card>

          <Card className="border border-border/80 bg-card">
            <CardHeader className="bg-muted/30 border-b border-border/60 p-5">
              <div className="flex items-center gap-2 text-foreground font-semibold text-base">
                <Target className="w-4 h-4 text-primary" /> Mission Statements
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs text-muted-foreground leading-relaxed">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span><strong>M1:</strong> Deliver high-quality, comprehensive education in power systems, embedded computing, VLSI, and communication networks through state-of-the-art pedagogical practices.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span><strong>M2:</strong> Foster impactful research, technological innovation, critical thinking, and ethical engineering conduct.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span><strong>M3:</strong> Cultivate effective multidisciplinary collaboration, industrial partnerships, and lifelong self-learning abilities.</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PEOs Section */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" /> Program Educational Objectives (PEOs)
            </h2>
            <p className="text-xs text-muted-foreground">
              Broad career statements describing accomplishments expected from ECE graduates within a few years of graduation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {peos.map((peo) => (
              <Card key={peo.id} className="border border-border/80 bg-card">
                <CardHeader className="p-4 pb-2">
                  <Badge variant="outline" className="text-xs font-mono w-fit">
                    {peo.code}
                  </Badge>
                </CardHeader>
                <CardContent className="p-4 pt-1 text-xs text-muted-foreground leading-relaxed">
                  {peo.statement}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* POs Section */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> Program Outcomes (POs)
            </h2>
            <p className="text-xs text-muted-foreground">
              Attributes and skills that students are expected to demonstrate by the time of graduation (Washington Accord graduate attributes).
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pos.map((po) => (
              <div key={po.id} className="p-4 rounded-lg bg-card border border-border/80 space-y-1.5">
                <div className="text-xs font-semibold text-primary">{po.code}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{po.statement}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PSOs Section (Now properly rendered!) */}
        {psos && psos.length > 0 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> Program Specific Outcomes (PSOs)
              </h2>
              <p className="text-xs text-muted-foreground">
                Domain-specific competencies tailored for Electrical & Computer Engineering practitioners.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {psos.map((pso) => (
                <div key={pso.id} className="p-4 rounded-lg bg-card border border-border/80 space-y-1.5">
                  <div className="text-xs font-semibold text-primary">{pso.code}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{pso.statement}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
