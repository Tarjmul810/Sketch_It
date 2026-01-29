import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { SECRET } from "@repo/common/config"
import { prismaClient } from "@repo/db"

const wss = new WebSocketServer({ port: 8080 });

function checkUser(token: string) {
  const decoded = jwt.verify(token, SECRET);

  if (typeof decoded === "string" || !decoded.userId) {
    return;
  }

  return decoded.userId;
}
interface User {
  userId: string;
  rooms: string[];
  ws: WebSocket;
}

const Users: User[] = [];

wss.on("connection", function connection(ws, req) {
  const url = req.url;

  const token = new URLSearchParams(url?.split("?")[1]).get("token")

  if (!token) {
    ws.close();
    return;
  }

  const userId = checkUser(token);

  Users.push({
    userId,
    rooms: [],
    ws,
  });

  ws.on("message", async function message(data) {
    const parsedData = JSON.parse(data as unknown as string);
    
    if (parsedData.type === "join-room") {
      const roomId = parsedData.roomId;
      const user = Users.find((x) => x.ws === ws);
      user?.rooms.push(roomId);
    }

    if (parsedData.type === "leave-room") {
      const roomId = parsedData.roomId;
      const user = Users.find((x) => x.ws === ws) as User;
      user.rooms = user?.rooms.filter((x) => x !== roomId);
    }
    
    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = JSON.parse(parsedData.message)

      message.forEach( async (m: any) => {
        const { id, shape } = m
        await prismaClient.chat.create({
          data: {
            roomId: Number(roomId),
            adminId: Number(userId),
            shapeId: id, 
            message: JSON.stringify(shape)
          }
        })
      })


      Users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              roomId,
              message,
            })
          )
        }
      }
    )
    }

    if (parsedData.type === "update") {
      const roomId = parsedData.roomId;
      const message = JSON.parse(parsedData.message);
      
      message.forEach( async (m: any) => {
        const { id, shape } = m
        
        await prismaClient.chat.update({
          where: {
            shapeId: id
          },
          data: {
            message: JSON.stringify(shape)
          }
        })
      })

      Users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "update",
              roomId,
              message,
            })
          )
        }
      }
    )
    }

    if (parsedData.type === "delete") {
      const roomId = parsedData.roomId;
      const message = JSON.parse(parsedData.message);
      
      message.forEach( async (m: any, index: any) => {
        const { id } = m

        console.log(id, index)
        
        await prismaClient.chat.delete({
          where: {
            shapeId: id
          }
        })
      })

      Users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "delete",
              roomId,
              message,
            })
          )
        }
      }
    )
    }
  });
});
