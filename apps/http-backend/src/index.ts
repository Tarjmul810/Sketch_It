import express, { json } from "express";
import { signinSchema, signupSchema } from "@repo/common/validation";
import { SECRET } from "@repo/common/config";
import { prismaClient } from "@repo/db";
import { middleware } from "./middleware";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();

app.use(json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  const { success } = signupSchema.safeParse({ email, password, name });

  if (!success) return res.status(404).json({ message: "Invalid Schema" });

  const user = await prismaClient.user.create({
    data: {
      email,
      password,
      name,
    },
  });

  const userId = user.id;

  const token = jwt.sign({ userId, email }, SECRET);

  res.cookie("token", token);

  res.status(200).json({
    message: "Signed Up succesfully",
    token,
    email,
  });
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const { success } = signinSchema.safeParse({ email, password });

  if (!success) return res.status(404).json({ message: "Invalid Credentials" });

  const user = await prismaClient.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(401).json({ message: "Inavlid Credentials" });
  }

  const userId = user.id;

  const token = jwt.sign({ userId, email }, SECRET);

  res.cookie("token", token);

  res.status(200).json({
    message: "Signed In succesfully",
    token,
    email,
  });
});

app.post("/room", middleware, async (req, res) => {
  const { slug } = req.body;
  const adminId = Number(req.userId);

  const room = await prismaClient.room.create({
    data: {
      slug,
      adminId,
    },
  });

  res.status(200).json({
    message: "success",
    slug,
  });
});

app.get("/room/:slug", middleware, async (req, res) => {
  const slug = req.params.slug as string;

  const room = await prismaClient.room.findFirst({
    where: {
      slug: slug,
    },
  });

  const roomId = room?.id;

  res.status(200).json({
    message: "success",
    roomId,
  });
});

app.get("/chats/:roomId", middleware, async (req, res) => {
  const roomId = Number(req.params.roomId);

  const messages = await prismaClient.chat.findMany({
    where: {
      roomId,
    },
    orderBy: {
      id: "desc",
    },
    take: 500,
  });

  res.status(200).json({
    message: "Success",
    messages,
  });
});

app.put("/chat/:shapeId", middleware, async (req, res) => {
  const shapeId = req.params.shapeId as string;
  const message = req.body.message;

  await prismaClient.chat.update({
    where: {
      shapeId,
    },
    data: {
      message,
    },
  });

  res.json({ message: "Success" });
});

app.listen(3001);
