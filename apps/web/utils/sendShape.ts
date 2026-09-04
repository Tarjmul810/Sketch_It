import { AppContext } from "../types/appContext";
import { Shapes } from "../types/shapes";

/** Send shape data to other users in the same room via WebSocket. */
export function sendShape(
  ctx: AppContext,
  type: "create" | "update" | "delete",
  shapes: { id: string; shape: Shapes }[],
) {
  ctx.socket.send(
    JSON.stringify({
      type,
      roomId: ctx.roomId,
      message: shapes,
    }),
  );
}
