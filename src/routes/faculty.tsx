import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import {
  Users,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Search,
  Plane,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/PageHeader";
import { facultyMembers } from "@/data/demo";

export const Route = createFileRoute("/faculty")({
  component: FacultyPage,
});

function FacultyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");

  const filteredFaculty = facultyMembers.filter((faculty) => {
    // Rank/Status Filter
    if (selectedFilter === "HEAD" && !faculty.designation.includes("Professor")) {
      return false;
    }
    if (selectedFilter === "ASSISTANT_PROF" && !faculty.designation.includes("Assistant Professor")) {
      return false;
    }
    if (selectedFilter === "LECTURER" && !faculty.designation.includes("Lecturer")) {
      return false;
    }
    if (selectedFilter === "ACTIVE" && faculty.status !== "ACTIVE") {
      return false;
    }
    if (selectedFilter === "ON_LEAVE" && faculty.status !== "ON_LEAVE") {
      return false;
    }

    // Text Search
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      faculty.name.toLowerCase().includes(q) ||
      (faculty.nameBn && faculty.nameBn.includes(q)) ||
      faculty.designation.toLowerCase().includes(q) ||
      (faculty.room && faculty.room.toLowerCase().includes(q)) ||
      faculty.researchAreas.some((area) => area.toLowerCase().includes(q)) ||
      faculty.email.toLowerCase().includes(q)
    );
  });

  const countHead = facultyMembers.filter((f) => f.designation.includes("Professor") && !f.designation.includes("Assistant")).length;
  const countAssistants = facultyMembers.filter((f) => f.designation.includes("Assistant Professor")).length;
  const countLecturers = facultyMembers.filter((f) => f.designation.includes("Lecturer")).length;
  const countActive = facultyMembers.filter((f) => f.status === "ACTIVE").length;
  const countOnLeave = facultyMembers.filter((f) => f.status === "ON_LEAVE").length;

  return (
    <PublicLayout>
      <PageHeader
        category="Directory"
        title="Faculty Members"
        description="Teaching and research faculty of the Department of Electrical & Computer Engineering."
        breadcrumbs={[{ label: "Faculty" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-md bg-card border">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, research area, or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={selectedFilter === "ALL" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("ALL")}
            >
              All ({facultyMembers.length})
            </Button>
            <Button
              variant={selectedFilter === "HEAD" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("HEAD")}
            >
              Professors ({countHead})
            </Button>
            <Button
              variant={selectedFilter === "ASSISTANT_PROF" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("ASSISTANT_PROF")}
            >
              Assistant ({countAssistants})
            </Button>
            <Button
              variant={selectedFilter === "LECTURER" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("LECTURER")}
            >
              Lecturers ({countLecturers})
            </Button>
          </div>
        </div>

        {/* Faculty Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculty.map((faculty) => (
            <Card
              key={faculty.id}
              className={`flex flex-col ${
                faculty.designation.includes("Head") ? "ring-1 ring-primary/30" : ""
              }`}
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-start gap-3">
                  {/* Photo or Initials */}
                  <div className="relative shrink-0">
                    {faculty.photoUrl ? (
                      <img
                        src={faculty.photoUrl}
                        alt={faculty.name}
                        className="w-12 h-12 rounded-full object-cover border bg-muted"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                          const fallback = (e.target as HTMLElement).nextElementSibling;
                          if (fallback) fallback.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-12 h-12 rounded-full bg-secondary font-semibold flex items-center justify-center text-sm ${
                        faculty.photoUrl ? "hidden" : ""
                      }`}
                    >
                      {faculty.initials}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <CardTitle className="text-base font-semibold truncate">
                      {faculty.name}
                    </CardTitle>

                    {faculty.nameBn && (
                      <div className="text-sm text-muted-foreground">
                        {faculty.nameBn}
                      </div>
                    )}

                    <CardDescription className="text-sm text-primary truncate">
                      {faculty.designation}
                    </CardDescription>

                    {faculty.status === "ON_LEAVE" && (
                      <Badge variant="outline" className="text-xs gap-1 text-muted-foreground">
                        <Plane className="w-3 h-3" />
                        {faculty.leaveDetails || "On Leave"}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-1 space-y-4 text-sm">
                {faculty.bio && (
                  <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                    {faculty.bio}
                  </p>
                )}

                {/* Research Areas */}
                {faculty.researchAreas.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase">
                      Research Interests
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {faculty.researchAreas.map((area, i) => (
                        <span key={i} className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="pt-3 border-t space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-4 h-4 shrink-0" />
                    <a href={`mailto:${faculty.email}`} className="truncate hover:text-foreground hover:underline">
                      {faculty.email}
                    </a>
                  </div>

                  {faculty.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 shrink-0" />
                      <a href={`tel:${faculty.phone}`} className="hover:text-foreground">
                        {faculty.phone}
                      </a>
                    </div>
                  )}

                  {faculty.room && (
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="truncate">{faculty.room}</span>
                    </div>
                  )}
                </div>

                {/* Footer links */}
                <div className="pt-3 border-t flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    {faculty.profileUrl && (
                      <a
                        href={faculty.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Profile <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {faculty.googleScholar && (
                      <a
                        href={faculty.googleScholar}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Scholar
                      </a>
                    )}
                  </div>

                  <span className="text-muted-foreground text-xs">
                    {faculty.publications} Pubs
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFaculty.length === 0 && (
          <div className="text-center py-16 space-y-2">
            <Users className="w-8 h-8 mx-auto text-muted-foreground" />
            <div className="text-base font-semibold">No faculty members found</div>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter selection.
            </p>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
