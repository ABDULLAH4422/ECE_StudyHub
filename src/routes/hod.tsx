import { createFileRoute } from "@tanstack/react-router";
import { PortalLayout } from "@/components/layout/PortalLayout";
import {
  Building2,
  Users,
  GraduationCap,
  Target,
  FileSpreadsheet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/common/StatCard";
import {
  departmentStats,
  batches,
  coAttainment,
  poAttainment,
  users,
} from "@/data/demo";

export const Route = createFileRoute("/hod")({
  component: HodDashboard,
});

function HodDashboard() {
  const pendingUsers = users.filter((u) => u.status === "PENDING");

  return (
    <PortalLayout
      title="HOD Department Management Portal"
      description="Head of Department: Dr. Sabbir Karim · Department Administration & OBE Attainment"
    >
      <div className="space-y-6">
        {/* Top Department Overview Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Students"
            value={departmentStats.students}
            subtitle="Across 3 active batches"
            icon={<Users className="w-4 h-4 text-primary" />}
          />
          <StatCard
            label="Faculty Members"
            value={departmentStats.faculty}
            subtitle={`${pendingUsers.length} approval pending`}
            icon={<Building2 className="w-4 h-4 text-primary" />}
          />
          <StatCard
            label="Active Batches"
            value={`${departmentStats.activeBatches} Series`}
            subtitle="19, 20, 21 Series"
            icon={<GraduationCap className="w-4 h-4 text-primary" />}
          />
          <StatCard
            label="OBE Attainment"
            value="3.3 / 4.0"
            subtitle="Target met (82.5%)"
            icon={<Target className="w-4 h-4 text-primary" />}
          />
        </div>

        {/* OBE Attainment Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CO Attainment Card */}
          <Card className="border border-border/80 bg-card">
            <CardHeader className="p-4 border-b border-border/70 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> CO Attainment (ECE 3201 Course)
              </CardTitle>
              <Badge variant="outline" className="text-xs font-normal">
                Target: 3.0 / 4.0
              </Badge>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/20">
                  <TableRow>
                    <TableHead className="text-xs font-medium">CO Code</TableHead>
                    <TableHead className="text-xs font-medium">Target</TableHead>
                    <TableHead className="text-xs font-medium">Attained</TableHead>
                    <TableHead className="text-xs font-medium">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coAttainment.map((row) => (
                    <TableRow key={row.code}>
                      <TableCell className="font-mono font-medium text-xs text-primary">{row.code}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{row.target.toFixed(1)}</TableCell>
                      <TableCell className="text-xs font-semibold text-foreground">{row.attained.toFixed(1)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={row.attained >= row.target ? "secondary" : "destructive"}
                          className="text-[11px] font-normal"
                        >
                          {row.attained >= row.target ? "Target Met" : "Below Target"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* PO Attainment Card */}
          <Card className="border border-border/80 bg-card">
            <CardHeader className="p-4 border-b border-border/70 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-primary" /> PO Attainment Overview
              </CardTitle>
              <Badge variant="outline" className="text-xs font-normal">
                Target: 2.8 / 4.0
              </Badge>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/20">
                  <TableRow>
                    <TableHead className="text-xs font-medium">PO Code</TableHead>
                    <TableHead className="text-xs font-medium">Target</TableHead>
                    <TableHead className="text-xs font-medium">Attained</TableHead>
                    <TableHead className="text-xs font-medium">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {poAttainment.map((row) => (
                    <TableRow key={row.code}>
                      <TableCell className="font-mono font-medium text-xs text-primary">{row.code}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{row.target.toFixed(1)}</TableCell>
                      <TableCell className="text-xs font-semibold text-foreground">{row.attained.toFixed(1)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={row.attained >= row.target ? "secondary" : "destructive"}
                          className="text-[11px] font-normal"
                        >
                          {row.attained >= row.target ? "Target Met" : "Action Required"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Batches & Series Status */}
        <Card className="border border-border/80 bg-card">
          <CardHeader className="p-4 border-b border-border/70">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary" /> Active & Graduated Batches Directory
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/20">
                <TableRow>
                  <TableHead className="text-xs font-medium">Batch Series</TableHead>
                  <TableHead className="text-xs font-medium">Admission Year</TableHead>
                  <TableHead className="text-xs font-medium">Students</TableHead>
                  <TableHead className="text-xs font-medium">Current Semester</TableHead>
                  <TableHead className="text-xs font-medium">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-mono font-medium text-xs text-primary">{b.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{b.admissionYear}</TableCell>
                    <TableCell className="text-xs font-semibold text-foreground">{b.students} Students</TableCell>
                    <TableCell className="text-xs text-muted-foreground">Semester {b.currentSemester}</TableCell>
                    <TableCell>
                      <Badge
                        variant={b.status === "ACTIVE" ? "default" : "secondary"}
                        className="text-[11px] font-normal"
                      >
                        {b.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
