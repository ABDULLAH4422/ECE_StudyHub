import { PrismaClient, Role, UserStatus, CourseType, MaterialCategory, SubmissionStatus, AttendanceStatus, AssessmentType, PriorityLevel, AudienceScope, NotificationKind, BatchStatus, EventType, LogSeverity } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database for ECE StudyHub...");

  // Hashing standard development passwords
  const studentPassword = await bcrypt.hash("Student123!", 10);
  const facultyPassword = await bcrypt.hash("Faculty123!", 10);
  const hodPassword = await bcrypt.hash("Hod123!", 10);
  const adminPassword = await bcrypt.hash("Admin123!", 10);

  // 1. Create Users
  const studentUser = await prisma.user.upsert({
    where: { email: "student.demo@example.com" },
    update: {},
    create: {
      email: "student.demo@example.com",
      passwordHash: studentPassword,
      name: "Sadia M. Rahman",
      role: Role.STUDENT,
      avatarInitials: "SM",
      identifier: "1901001",
      batch: "19 Series",
      status: UserStatus.ACTIVE,
    },
  });

  const facultyUser = await prisma.user.upsert({
    where: { email: "faculty.demo@example.com" },
    update: {},
    create: {
      email: "faculty.demo@example.com",
      passwordHash: facultyPassword,
      name: "Dr. Rafiul Islam",
      role: Role.FACULTY,
      avatarInitials: "RI",
      identifier: "ECE-F-1032",
      designation: "Associate Professor",
      status: UserStatus.ACTIVE,
    },
  });

  const hodUser = await prisma.user.upsert({
    where: { email: "hod.demo@example.com" },
    update: {},
    create: {
      email: "hod.demo@example.com",
      passwordHash: hodPassword,
      name: "Dr. Sabbir Karim",
      role: Role.DEPARTMENT_ADMIN,
      avatarInitials: "SK",
      identifier: "ECE-F-1001",
      designation: "Professor & Head",
      status: UserStatus.ACTIVE,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin.demo@example.com" },
    update: {},
    create: {
      email: "admin.demo@example.com",
      passwordHash: adminPassword,
      name: "System Operator",
      role: Role.SYSTEM_ADMIN,
      avatarInitials: "SO",
      identifier: "SYS-0001",
      status: UserStatus.ACTIVE,
    },
  });

  console.log("👤 Demo accounts created/verified:");
  console.log("   - Student: student.demo@example.com / Student123!");
  console.log("   - Faculty: faculty.demo@example.com / Faculty123!");
  console.log("   - HOD: hod.demo@example.com / Hod123!");
  console.log("   - Admin: admin.demo@example.com / Admin123!");

  // 2. Create Batches
  const batch19 = await prisma.batch.upsert({
    where: { series: "19" },
    update: {},
    create: {
      name: "19 Series",
      series: "19",
      admissionYear: 2019,
      studentCount: 118,
      currentSemester: 6,
      status: BatchStatus.ACTIVE,
    },
  });

  await prisma.batch.upsert({
    where: { series: "20" },
    update: {},
    create: {
      name: "20 Series",
      series: "20",
      admissionYear: 2020,
      studentCount: 121,
      currentSemester: 4,
      status: BatchStatus.ACTIVE,
    },
  });

  // 3. Create Student & Faculty Profiles
  const studentProfile = await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      rollNumber: "1901001",
      series: "19",
      batchId: batch19.id,
      currentSemester: 6,
      cgpa: 3.58,
    },
  });

  const facultyProfile = await prisma.faculty.upsert({
    where: { userId: facultyUser.id },
    update: {},
    create: {
      userId: facultyUser.id,
      staffId: "ECE-F-1032",
      designation: "Associate Professor",
      officeHours: "Tue & Thu, 09:00–11:00",
      bio: "Teaches digital system design and runs the VLSI laboratory.",
      publicationsCount: 27,
    },
  });

  // 4. Create Courses
  const course1 = await prisma.course.upsert({
    where: { code: "ECE 3201" },
    update: {},
    create: {
      code: "ECE 3201",
      title: "Digital System Design",
      credits: 3.0,
      semester: 6,
      batchSeries: "19 Series",
      type: CourseType.THEORY,
      description: "Combinational and sequential logic, HDL modelling, FPGA-based system design.",
      facultyId: facultyProfile.id,
    },
  });

  const course2 = await prisma.course.upsert({
    where: { code: "ECE 3312" },
    update: {},
    create: {
      code: "ECE 3312",
      title: "Power Electronics",
      credits: 3.0,
      semester: 6,
      batchSeries: "19 Series",
      type: CourseType.THEORY,
      description: "Switching converters, rectifiers, inverters and drive applications.",
    },
  });

  // Enroll student
  await prisma.enrollment.upsert({
    where: {
      studentId_courseId: {
        studentId: studentProfile.id,
        courseId: course1.id,
      },
    },
    update: {},
    create: {
      studentId: studentProfile.id,
      courseId: course1.id,
      semester: 6,
      academicYear: "2024-25",
    },
  });

  // 5. Create Materials & Assignments
  await prisma.material.create({
    data: {
      courseId: course1.id,
      facultyId: facultyProfile.id,
      title: "Lecture 07 — Finite State Machines",
      description: "Moore and Mealy machines with worked Verilog examples.",
      fileName: "ece3201-lec07-fsm.pdf",
      fileSizeKb: 1840,
      category: MaterialCategory.LECTURE,
    },
  });

  const assignment1 = await prisma.assignment.create({
    data: {
      courseId: course1.id,
      facultyId: facultyProfile.id,
      title: "Assignment 3 — Verilog ALU",
      description: "Design and simulate a 16-bit ALU with flags. Submit source and testbench.",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      totalMarks: 20,
    },
  });

  // 6. Create Attendance Session & Record
  const session = await prisma.attendanceSession.create({
    data: {
      courseId: course1.id,
      facultyId: facultyProfile.id,
      topic: "Finite State Machine Verilog Modelling",
    },
  });

  await prisma.attendanceRecord.create({
    data: {
      sessionId: session.id,
      studentId: studentProfile.id,
      status: AttendanceStatus.PRESENT,
    },
  });

  // 7. Create Result Record
  await prisma.result.create({
    data: {
      studentId: studentProfile.id,
      courseId: course1.id,
      type: AssessmentType.CT,
      obtainedMarks: 18,
      totalMarks: 20,
      status: "PASSED",
    },
  });

  // 8. Create Notice
  await prisma.notice.create({
    data: {
      authorId: hodUser.id,
      title: "Mid-semester examination routine published",
      description: "The routine for the 6th semester mid-semester examinations is now available in the portal.",
      audience: AudienceScope.STUDENTS,
      priority: PriorityLevel.HIGH,
    },
  });

  // 9. Activity Log
  await prisma.activityLog.create({
    data: {
      actorId: adminUser.id,
      actorEmail: adminUser.email,
      action: "Database initialized and seeded",
      entity: "SYSTEM",
      severity: LogSeverity.INFO,
      ipAddress: "127.0.0.1",
    },
  });

  console.log("✅ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
