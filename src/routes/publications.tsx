import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { FileText, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { publications } from "@/data/demo";

export const Route = createFileRoute("/publications")({
  component: PublicationsPage,
});

function PublicationsPage() {
  return (
    <PublicLayout>
      <PageHeader
        category="Scholarly Output"
        title="Faculty & Student Publications"
        description="Peer-reviewed international journal articles, IEEE conference proceedings, and book chapters published by researchers from the Department of Electrical & Computer Engineering, RUET."
        breadcrumbs={[{ label: "Publications" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-4 max-w-4xl">
          {publications.map((pub) => (
            <Card key={pub.id} className="border border-border/80 bg-card hover:border-border transition-colors">
              <CardHeader className="p-5 pb-2.5 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant={pub.type === "JOURNAL" ? "secondary" : "outline"} className="text-[11px] font-normal">
                    {pub.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-medium">{pub.year}</span>
                </div>
                <CardTitle className="text-sm sm:text-base font-semibold text-foreground pt-1 leading-snug">
                  {pub.title}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Authors: {pub.authors}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-3 text-xs text-muted-foreground">
                <div className="font-medium text-foreground">{pub.venue}</div>
                {pub.doi && (
                  <div className="pt-2.5 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="font-mono text-muted-foreground text-[11px]">DOI: {pub.doi}</span>
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                    >
                      View Publication <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
