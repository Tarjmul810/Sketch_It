import { AppState } from "../types/appSatate";
import { previewShape } from "./previewShape";

export function renderOverlays(ctx: CanvasRenderingContext2D, state: AppState) {
  const preview = state.interaction.preview;
  if (!preview) return;

  ctx.save();
  
  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = "white";

  previewShape({
    ctx,
    tool: state.interaction.preview.tool!,
    start: state.interaction.preview.start!,
    end: state.interaction.preview.end!,
  });

  ctx.restore();
}
