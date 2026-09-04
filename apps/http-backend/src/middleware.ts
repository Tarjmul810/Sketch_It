import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { SECRET } from "@repo/common/config";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      email?: string;
    }
  }
}

export function middleware(req: Request, res: Response, next: NextFunction) {
  // Accept token from Authorization: Bearer <token> header
  // OR from the "token" cookie set at sign-in
  const authHeader = req.headers.authorization;
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const cookieToken = (req as Request & { cookies?: Record<string, string> }).cookies?.token;
  const token = bearer || cookieToken;

  if (!token) {
    return res.status(401).json({ message: "Missing authentication token" });
  }

  try {
    const decoded = jwt.verify(token, SECRET) as JwtPayload;
    if (typeof decoded === "string" || !decoded.userId) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.userId = String(decoded.userId);
    req.email = typeof decoded.email === "string" ? decoded.email : undefined;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
