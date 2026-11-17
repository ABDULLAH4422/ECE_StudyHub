import { createFileRoute } from "@tanstack/react-router";
import { PortalLayout } from "@/components/layout/PortalLayout";
import {
  Lock,
  Users,
  ShieldAlert,
  ClipboardList,
  BarChart3,
  Settings,
  Building2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { users, activityLogs, departmentStats } from "@/data/demo";

export const Route = createFileRoute("/admin")({
  component: SystemAdminDashboard,
});

function SystemAdminDashboard() {
  return (
    <PortalLayout title="System Administration & Audit Portal" description="System Operator (SYS-0001) · System Security, RBAC & Activity Audit Logs">
      <div className="space-y-6">
        {/* System Health Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border bg-card">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase">Registered Users</div>
                <div className="text-2xl font-bold font-mono text-amber-600">{users.length} Accounts</div>
                <div className="text-[10px] font-mono text-emerald-700 font-semibold">1 Pending Approval</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-600/10 text-amber-600 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase">System Audit Events</div>
                <div className="text-2xl font-bold font-mono text-foreground">{activityLogs.length} Events</div>
                <div className="text-[10px] font-mono text-muted-foreground">Logged Today</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                <ClipboardList className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase">System Security Status</div>
                <div className="text-2xl font-bold font-mono text-emerald-700">NORMAL</div>
                <div className="text-[10px] font-mono text-emerald-700 font-semibold">0 Critical Alerts</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-700/10 text-emerald-700 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase">Database Status</div>
                <div className="text-2xl font-bold font-mono text-primary">Connected</div>
                <div className="text-[10px] font-mono text-muted-foreground">Prisma / PostgreSQL</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Directory Table */}
        <Card className="border-border bg-card">
          <CardHeader className="p-4 pb-2 border-b border-border flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-600" /> User Accounts & Role Assignments
            </CardTitle>
            <Badge variant="outline" className="text-[10px] font-mono">
              {users.length} Users Listed
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-mono text-[11px]">User Identifier</TableHead>
                  <TableHead className="font-mono text-[11px]">Full Name</TableHead>
                  <TableHead className="font-mono text-[11px]">Email</TableHead>
                  <TableHead className="font-mono text-[11px]">Assigned Role</TableHead>
                  <TableHead className="font-mono text-[11px]">Account Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-mono font-bold text-xs text-primary">{u.identifier}</TableCell>
                    <TableCell className="text-xs font-medium">{u.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {u.role.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={u.status === "ACTIVE" ? "secondary" : u.status === "PENDING" ? "default" : "destructive"}
                        className="text-[10px] font-mono"
                      >
                        {u.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Activity Audit Logs */}
        <Card className="border-border bg-card">
          <CardHeader className="p-4 pb-2 border-b border-border">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-primary" /> System Activity Audit Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-mono text-[11px]">Timestamp</TableHead>
                  <TableHead className="font-mono text-[11px]">Actor</TableHead>
                  <TableHead className="font-mono text-[11px]">Action Taken</TableHead>
                  <TableHead className="font-mono text-[11px]">Target Entity</TableHead>
                  <TableHead className="font-mono text-[11px]">Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activityLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{log.at}</TableCell>
                    <TableCell className="font-mono text-xs text-primary">{log.actor}</TableCell>
                    <TableCell className="text-xs font-medium">{log.action}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{log.entity}</TableCell>
                    <TableCell>
                      <Badge
                        variant={log.severity === "CRITICAL" ? "destructive" : log.severity === "WARN" ? "default" : "secondary"}
                        className="text-[10px] font-mono"
                      >
                        {log.severity}
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
