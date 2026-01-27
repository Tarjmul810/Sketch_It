import express, { json } from "express";
import { signinSchema, signupSchema } from "@repo/common/validation";
import { SECRET } from "@repo/common/config";
import { prismaClient } from "@repo/db";
import { middleware } from "./middleware";
import cors from "cors"
import jwt from "jsonwebtoken";

const app = express();

app.use(json());
app.use(cors());

app.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  const { success } = signupSchema.safeParse({ email, password, name });

  if (!success) return res.status(404).json({ message: "Invalid Schema" });

  console.log(success)

  const user = await prismaClient.user.create({
    data: {
       email,
       password,
       name
    }
  })

  const userId = user.id

  const token = jwt.sign({ userId , email }, SECRET);

  res.status(200).json({
    message: "Signed Up succesfully",
    token,
  });
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const { success } = signinSchema.safeParse({ email, password });

  if (!success) return res.status(404).json({ message: "Invalid Credentials" });

  const user = await prismaClient.user.findFirst({
    where: {
      email
    }
  })

  if (!user) {
    return res.status(401).json({ message: "Inavlid Credentials"})
  }

  const userId = user.id

  const token = jwt.sign({ userId, email }, SECRET);

  res.status(200).json({
    message: "Logged In succesfully",
    token,
  });
});

app.post("/room", middleware, async(req, res) => {
  const { slug } = req.body;
  const adminId = Number(req.userId)

  const room = await prismaClient.room.create({
    data: {
      slug,
      adminId
    }
  })

  const roomId = room?.id

  res.status(200).json({
    message: "success",
    roomId
  });
});

app.get("/room/:slug", middleware, async(req, res) => {
  const slug = req.params.slug as string

  const room = await prismaClient.room.findFirst({
    where: {
      slug: slug
    }
  })

  const roomId = room?.id

  res.status(200).json({
    message: "success",
    roomId
  });
});

app.get("/chats/:roomId", middleware, async (req, res) => {
  const roomId = Number(req.params.roomId)

  const messages = await prismaClient.chat.findMany({
    where: {
      roomId
    },
    orderBy: {
      id: "desc"
    },
    take: 500
  })

  res.status(200).json({
    message: "Success",
    messages
  });
});

app.put("/chat/:shapeId", middleware, async (req, res) => {
  const shapeId = req.params.shapeId as string
  const message = req.body.message

  await prismaClient.chat.update({
    where: {
      shapeId
    },
    data: {
      message
    }
  })

  res.json({message: "Success"})
})

app.listen(3001);
