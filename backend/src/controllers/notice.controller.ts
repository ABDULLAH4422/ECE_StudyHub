import type { Request, Response } from "express";
import { prisma } from "../config/db.js";

export async function getNotices(req: Request, res: Response): Promise<void> {
  try {
    const notices = await prisma.notice.findMany({
      include: {
        author: { select: { name: true } },
      },
      orderBy: { date: "desc" },
    });

    const formatted = notices.map((n) => ({
      id: n.id,
      title: n.title,
      description: n.description,
      audience: n.audience,
      date: n.date.toISOString().split("T")[0],
      priority: n.priority,
      author: n.author.name,
    }));

    res.json({ success: true, notices: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch notices" });
  }
}
