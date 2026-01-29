import { AppContext } from "../types/appContext";
import { Shapes } from "../types/shapes";

export const sendSahpe = (
  ctx: AppContext,
  type: "create" | "update" | "delete",
  messages: { id: string; shape: Shapes }[],
) => {
  ctx.socket.send(
    JSON.stringify({
      type: type,
      roomId: ctx.roomId,
      message: JSON.stringify(messages),
    }),
  );
};