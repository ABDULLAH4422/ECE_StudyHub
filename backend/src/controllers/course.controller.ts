import type { Request, Response } from "express";
import { prisma } from "../config/db.js";

export async function getCourses(req: Request, res: Response): Promise<void> {
  try {
    const courses = await prisma.course.findMany({
      include: {
        faculty: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });

    const formatted = courses.map((c) => ({
      id: c.id,
      code: c.code,
      title: c.title,
      credits: c.credits,
      semester: c.semester,
      batch: c.batchSeries,
      facultyId: c.facultyId || "",
      facultyName: c.faculty?.user.name || "Unassigned",
      description: c.description,
      type: c.type,
      enrolled: 118,
    }));

    res.json({ success: true, courses: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch courses" });
  }
}
