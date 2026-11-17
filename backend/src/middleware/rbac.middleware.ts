import type { Response, NextFunction } from "express";
import type { Role } from "@prisma/client";
import type { AuthenticatedRequest } from "./auth.middleware.js";

export function requireRole(allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized request" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted. Required role: ${allowedRoles.join(" or ")}`,
      });
      return;
    }

    next();
  };
}
