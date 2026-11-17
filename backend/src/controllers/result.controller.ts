import type { Request, Response } from "express";
import { prisma } from "../config/db.js";

export async function getResults(req: Request, res: Response): Promise<void> {
  try {
    const results = await prisma.result.findMany({
      include: {
        course: true,
      },
    });

    const formatted = results.map((r) => ({
      id: r.id,
      courseId: r.courseId,
      courseCode: r.course.code,
      courseTitle: r.course.title,
      type: r.type,
      date: r.date.toISOString().split("T")[0],
      obtained: r.obtainedMarks,
      total: r.totalMarks,
      status: r.status,
    }));

    res.json({ success: true, results: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch results" });
  }
}
