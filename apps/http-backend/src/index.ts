import "dotenv/config";
import express, { json, Request, Response } from "express";
import { signinSchema, signupSchema } from "@repo/common/validation";
import { SECRET } from "@repo/common/config";
import { prismaClient } from "@repo/db";
import { middleware } from "./middleware";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();

app.use(json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
      "http://localhost:3000",
    ].filter(Boolean) as string[],
    credentials: true,
  }),
);

/* ── Auth ── */

app.post("/signup", async (req: Request, res: Response) => {
  const { email, password, name } = req.body as { email?: string; password?: string; name?: string };
  const parsed = signupSchema.safeParse({ email, password, name });
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
  }

  const existing = await prismaClient.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }

  const user = await prismaClient.user.create({
    data: { email: email!, password: password!, name: name! },
  });

  const token = jwt.sign({ userId: String(user.id), email: user.email }, SECRET);

  res.cookie("token", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  return res.status(200).json({ token, email: user.email });
});

app.post("/signin", async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };
  const parsed = signinSchema.safeParse({ email, password });
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const user = await prismaClient.user.findUnique({ where: { email } });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ userId: String(user.id), email: user.email }, SECRET);

  res.cookie("token", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  return res.status(200).json({ token, email: user.email });
});

/* ── Rooms ── */

app.post("/room", middleware, async (req: Request, res: Response) => {
  const { slug } = req.body as { slug?: string };
  if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
    return res.status(400).json({ message: "slug is required" });
  }
  const cleanSlug = slug.trim().toLowerCase();

  const existing = await prismaClient.room.findUnique({ where: { slug: cleanSlug } });
  if (existing) {
    return res.status(409).json({ message: "A room with this slug already exists" });
  }

  const room = await prismaClient.room.create({
    data: { slug: cleanSlug, adminId: Number(req.userId) },
  });

  return res.status(200).json({ id: room.id, slug: room.slug });
});

app.get("/rooms", middleware, async (req: Request, res: Response) => {
  const rooms = await prismaClient.room.findMany({
    where: { adminId: Number(req.userId) },
    orderBy: { createdAt: "desc" },
  });
  return res.status(200).json({ rooms });
});

app.get("/room/:slug", middleware, async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  if (!slug) return res.status(400).json({ message: "slug is required" });
  const room = await prismaClient.room.findUnique({ where: { slug } });
  if (!room) return res.status(404).json({ message: "Room not found" });
  return res.status(200).json({ id: room.id, slug: room.slug });
});

/* ── Shapes (chats) ── */

app.get("/chats/:roomId", middleware, async (req: Request, res: Response) => {
  const roomId = Number(req.params.roomId);
  if (!Number.isFinite(roomId)) return res.status(400).json({ message: "Invalid roomId" });

  const messages = await prismaClient.chat.findMany({
    where: { roomId },
    orderBy: { id: "asc" },
    take: 2000,
  });

  return res.status(200).json({ messages });
});

app.put("/chat/:shapeId", middleware, async (req: Request, res: Response) => {
  const shapeId = req.params.shapeId as string;
  const { message } = req.body as { message?: string };
  if (!shapeId) return res.status(400).json({ message: "shapeId is required" });
  if (!message) return res.status(400).json({ message: "message is required" });

  await prismaClient.chat.update({
    where: { shapeId },
    data: { message },
  });
  return res.status(200).json({ message: "ok" });
});

/* ── Start ── */

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`HTTP server running on port ${PORT}`);
});
