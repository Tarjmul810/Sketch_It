import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { SECRET } from "@repo/common/config";
import { prismaClient } from "@repo/db";

const PORT = (process.env.PORT as unknown as number) || 8080;

const wss = new WebSocketServer({ port: PORT });

type User = {
  userId: string;
  rooms: number[];
  ws: WebSocket;
};

const Users: User[] = [];

function broadcast(roomId: number, payload: object) {
  const json = JSON.stringify(payload);
  for (const u of Users) {
    if (u.rooms.includes(roomId) && u.ws.readyState === WebSocket.OPEN) {
      u.ws.send(json);
    }
  }
}

function safeParse(raw: any): any | null {
  try {
    if (typeof raw === "string") return JSON.parse(raw);
    if (Buffer.isBuffer(raw)) return JSON.parse(raw.toString());
    if (raw instanceof ArrayBuffer) return JSON.parse(Buffer.from(raw).toString());
    return null;
  } catch {
    return null;
  }
}

wss.on("connection", async (ws, req) => {
  const url = req.url ?? "";
  const token = new URLSearchParams(url.split("?")[1] ?? "").get("token");
  if (!token) {
    ws.close(1008, "Missing token");
    return;
  }

  let userId: string;
  try {
    const decoded = jwt.verify(token, SECRET) as any;
    if (typeof decoded === "string" || !decoded.userId) {
      ws.close(1008, "Invalid token");
      return;
    }
    userId = String(decoded.userId);
  } catch {
    ws.close(1008, "Invalid token");
    return;
  }

  Users.push({ userId, rooms: [], ws });

  ws.on("message", async (raw) => {
    const parsed = safeParse(raw);
    console.log("parsed", parsed);

    if (!parsed || typeof parsed.type !== "string") return;

    const user = Users.find((u) => u.ws === ws);
    if (!user) return;

    switch (parsed.type) {
      case "get-room-id": {
        if (typeof parsed.slug !== "string") return;
        const room = await prismaClient.room.findUnique({ where: { slug: parsed.slug } });
        if (!room) {
          ws.send(JSON.stringify({ type: "room-not-found", slug: parsed.slug }));
          return;
        }
        ws.send(JSON.stringify({ type: "room-id", slug: parsed.slug, roomId: room.id }));
        return;
      }

      case "join-room": {
        const roomId = Number(parsed.roomId);
        if (!Number.isFinite(roomId)) return;
        if (!user.rooms.includes(roomId)) user.rooms.push(roomId);
        return;
      }

      case "leave-room": {
        const roomId = Number(parsed.roomId);
        if (!Number.isFinite(roomId)) return;
        user.rooms = user.rooms.filter((r) => r !== roomId);
        return;
      }

      case "create": {
        const roomId = Number(parsed.roomId);
        if (!Number.isFinite(roomId)) return;
        const message = parsed.message;
        if (!Array.isArray(message)) return;
        // Validate each item
        const valid = message.filter((m: any) => m && typeof m.id === "string" && m.shape && typeof m.shape.type === "string");
        for (const m of valid) {
          await prismaClient.chat.create({
            data: {
              shapeId: m.id,
              roomId,
              adminId: Number(userId),
              message: JSON.stringify(m.shape),
            },
          });
        }
        broadcast(roomId, { type: "create", roomId, message: valid });
        return;
      }

      case "update": {
        const roomId = Number(parsed.roomId);
        if (!Number.isFinite(roomId)) return;
        const message = parsed.message;
        if (!Array.isArray(message)) return;
        const valid = message.filter((m: any) => m && typeof m.id === "string" && m.shape);
        for (const m of valid) {
          try {
            await prismaClient.chat.update({
              where: { shapeId: m.id },
              data: { message: JSON.stringify(m.shape) },
            });
          } catch {
            // shape doesn't exist yet, ignore
          }
        }
        broadcast(roomId, { type: "update", roomId, message: valid });
        return;
      }

      case "delete": {
        const roomId = Number(parsed.roomId);
        if (!Number.isFinite(roomId)) return;
        const message = parsed.message;
        if (!Array.isArray(message)) return;
        const ids = message.filter((m: any) => m && typeof m.id === "string").map((m: any) => m.id);
        for (const id of ids) {
          try {
            await prismaClient.chat.delete({ where: { shapeId: id } });
          } catch {
            // already gone
          }
        }
        broadcast(roomId, { type: "delete", roomId, message: ids.map((id) => ({ id })) });
        return;
      }
    }
  });

  ws.on("close", () => {
    const idx = Users.findIndex((u) => u.ws === ws);
    if (idx !== -1) Users.splice(idx, 1);
  });
});

console.log(`WebSocket server listening on ws://localhost:${PORT}`);
