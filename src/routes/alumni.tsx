import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { MapPin, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { alumni } from "@/data/demo";

export const Route = createFileRoute("/alumni")({
  component: AlumniPage,
});

function AlumniPage() {
  return (
    <PublicLayout>
      <PageHeader
        category="Global Network"
        title="Alumni Directory"
        description="Graduates of the Department of Electrical & Computer Engineering, RUET serving across semiconductor manufacturing, software systems, telecommunications, and advanced research worldwide."
        breadcrumbs={[{ label: "Alumni" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {alumni.map((alum) => (
            <Card key={alum.id} className="border border-border/80 bg-card hover:border-border transition-colors flex flex-col justify-between">
              <CardHeader className="p-5 pb-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs font-normal">
                    {alum.series} Series
                  </Badge>
                  <span className="text-xs text-muted-foreground">Class of {alum.graduationYear}</span>
                </div>
                <CardTitle className="text-sm font-semibold text-foreground pt-1">
                  {alum.name}
                </CardTitle>
                <CardDescription className="text-xs font-medium text-primary flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{alum.currentRole}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-3 text-xs text-muted-foreground">
                <div className="font-medium text-foreground">{alum.organisation}</div>
                <div className="pt-2.5 border-t border-border/60 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{alum.location}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
