import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { achievements } from "@/data/demo";

export const Route = createFileRoute("/achievements")({
  component: AchievementsPage,
});

function AchievementsPage() {
  return (
    <PublicLayout>
      <PageHeader
        category="Department Honors"
        title="Awards & Achievements"
        description="National and international competitive achievements, robotics & hackathon recognitions, research honors, and student accomplishments."
        breadcrumbs={[{ label: "Achievements" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((item) => (
            <Card key={item.id} className="border border-border/80 bg-card hover:border-border transition-colors">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-8 h-8 rounded-md bg-secondary text-primary flex items-center justify-center font-bold shrink-0">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <Badge variant="outline" className="text-xs font-normal">
                    {item.year}
                  </Badge>
                </div>
                <CardTitle className="text-sm font-semibold text-foreground pt-2">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 text-xs text-muted-foreground leading-relaxed">
                {item.detail}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
