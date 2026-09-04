import { Tools } from "../types/tool";
import { Shapes } from "../types/shapes";
import { AppContext } from "../types/appContext";
import { sendShape } from "../utils/sendShape";
import { shiftShape } from "../utils/shiftShape";
import { isPointInShape, isShapeInBox } from "../utils/isPointInRect";
import { AppState } from "../types/appSatate";

/* ─────────────────────────────────────────────────────────────
   Bounding-box helpers
───────────────────────────────────────────────────────────── */

type Box = { x: number; y: number; width: number; height: number };

/** Axis-aligned bounding box of a single shape, in world coords. */
export function getShapeBounds(shape: Shapes): Box {
  switch (shape.type) {
    case "rect": {
      // Inflate by half-stroke so the visible box matches what's hittable
      const hw = 0.75;
      const x = Math.min(shape.startX, shape.startX + shape.width) - hw;
      const y = Math.min(shape.startY, shape.startY + shape.height) - hw;
      return { x, y, width: Math.abs(shape.width) + hw * 2, height: Math.abs(shape.height) + hw * 2 };
    }
    case "circle":
      return {
        x: shape.x - shape.radius,
        y: shape.y - shape.radius,
        width: shape.radius * 2,
        height: shape.radius * 2,
      };
    case "line": {
      const x = Math.min(shape.startX, shape.endX);
      const y = Math.min(shape.startY, shape.endY);
      return {
        x,
        y,
        width: Math.abs(shape.endX - shape.startX),
        height: Math.abs(shape.endY - shape.startY),
      };
    }
  }
}

/** Tight union bounding box of a set of shapes. Returns null if no shapes. */
export function getBoundingBox(shapes: Shapes[]): Box | null {
  if (shapes.length === 0) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const s of shapes) {
    const b = getShapeBounds(s);
    if (b.x < minX) minX = b.x;
    if (b.y < minY) minY = b.y;
    if (b.x + b.width > maxX) maxX = b.x + b.width;
    if (b.y + b.height > maxY) maxY = b.y + b.height;
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

/** True if a world point lies inside a box (handles negative width/height). */
function pointInBox(wx: number, wy: number, box: Box): boolean {
  const x1 = Math.min(box.x, box.x + box.width);
  const y1 = Math.min(box.y, box.y + box.height);
  const x2 = x1 + Math.abs(box.width);
  const y2 = y1 + Math.abs(box.height);
  return wx >= x1 && wx <= x2 && wy >= y1 && wy <= y2;
}

function topmostShapeAt(shapes: Shapes[], wx: number, wy: number, worldThreshold: number): Shapes | null {
  for (let i = shapes.length - 1; i >= 0; i--) {
    const s = shapes[i];
    if (s && isPointInShape(s, wx, wy, worldThreshold)) return s;
  }
  return null;
}

/* ─────────────────────────────────────────────────────────────
   Mode decision

   The mousedown point can hit a shape, hit the existing selection's
   bounding box, or hit nothing. The actual drag mode is decided
   LAZILY on each onMouseMove, so the user can always start a marquee
   from anywhere (even on top of a shape) just by dragging past a
   small threshold. This avoids the trap where a click on a shape
   permanently preempts marquee selection.

   The down-hit is stored on a symbol-keyed property of the AppState
   object so it survives state object identity changes (caused by
   React re-renders) during the drag.
───────────────────────────────────────────────────────────── */

type DownHit = { kind: "shape"; shapeId: string } | { kind: "bbox" } | { kind: "empty" };

const DOWN_HIT_KEY = Symbol("selectToolDownHit");

type AppStateWithDownHit = AppState & { [DOWN_HIT_KEY]?: DownHit };

/** Screen-px distance the pointer must travel before marquee mode kicks in. */
const MARQUEE_THRESHOLD_PX = 4;

function setDownHit(state: AppState, hit: DownHit): void {
  (state as AppStateWithDownHit)[DOWN_HIT_KEY] = hit;
}

function getDownHit(state: AppState): DownHit {
  return (state as AppStateWithDownHit)[DOWN_HIT_KEY] ?? { kind: "empty" };
}

function clearDownHit(state: AppState): void {
  delete (state as AppStateWithDownHit)[DOWN_HIT_KEY];
}

function classifyDownHit(
  state: AppState,
  worldX: number,
  worldY: number,
  worldThreshold: number,
): DownHit {
  const hit = topmostShapeAt(state.shapes, worldX, worldY, worldThreshold);
  if (hit) return { kind: "shape", shapeId: hit.id };
  return { kind: "empty" };
}

/**
 * Returns true when the world point is inside the current selection's bounding box.
 * This is evaluated against the LIVE selection state (not what was captured at
 * mousedown) so that clicking inside a bounding box always initiates a group drag,
 * even when shapeIds was empty at the moment of the mousedown.
 */
function isInSelectionBBox(state: AppState, worldX: number, worldY: number): boolean {
  const sel = state.interaction.selection;
  return sel !== null && sel.shapeIds.length > 0 && pointInBox(worldX, worldY, sel.box);
}

/* ─────────────────────────────────────────────────────────────
   SelectTool
───────────────────────────────────────────────────────────── */

export const SelectTool: Tools = {
  onMouseDown(state, e) {
    const { camera } = state;
    const world = {
      x: e.clientX / camera.scale + camera.x,
      y: e.clientY / camera.scale + camera.y,
    };
    const threshold = 8 / camera.scale;

    // ALWAYS classify the down-hit, regardless of whether a selection exists.
    // The mode (drag-group vs marquee) is decided later, on first onMouseMove.
    const downHit = classifyDownHit(state, world.x, world.y, threshold);
    setDownHit(state, downHit);

    if (downHit.kind === "shape") {
      // Click landed on a shape → that shape becomes the new selection.
      const id = downHit.shapeId;
      state.selectedIds.clear();
      state.selectedIds.add(id);
      const shape = state.shapes.find((s) => s.id === id);
      const box = shape ? getShapeBounds(shape) : { x: world.x, y: world.y, width: 0, height: 0 };
      state.interaction.selection = { box, shapeIds: [id] };
    } else if (isInSelectionBBox(state, world.x, world.y)) {
      // Click landed inside the existing selection's bounding box.
      // Keep the selection; we may drag it. (The existing box already wraps the group.)
    } else {
      // Empty space — clear and start fresh. shapeIds stay [] until onMouseUp
      // commits them. The box will become the marquee rectangle (or be cleared on click).
      state.interaction.selection = {
        box: { x: world.x, y: world.y, width: 0, height: 0 },
        shapeIds: [],
      };
      state.selectedIds.clear();
    }

    state.interaction.isDragging = true;
    state.interaction.dragStart = { x: e.clientX, y: e.clientY };
  },

  onMouseMove(state, e) {
    if (!state.interaction.isDragging || !state.interaction.dragStart) return;
    const { camera } = state;
    const sel = state.interaction.selection;
    if (!sel) return;

    const downPt = state.interaction.dragStart;
    const screenDx = e.clientX - downPt.x;
    const screenDy = e.clientY - downPt.y;
    const screenDist = Math.hypot(screenDx, screenDy);

    const down = getDownHit(state);

    // Marquee mode kicks in only when the down was on empty space AND the user
    // has moved far enough to signal marquee intent. Critically, a click that lands
    // inside the current selection's bounding box (even when shapeIds was empty at
    // mousedown) immediately enters drag-group mode, so the user can always drag
    // a multi-shape selection by clicking anywhere inside it.
    //
    // IMPORTANT: once shapeIds is non-empty (we've already moved shapes in a drag),
    // the mode is LOCKED to drag-group. This prevents fast/large mouse movements from
    // accidentally flipping back to marquee mode mid-drag and losing the selection.
    const inBBox = isInSelectionBBox(state, downPt.x / camera.scale + camera.x, downPt.y / camera.scale + camera.y);
    const alreadyMovedShapes = sel.shapeIds.length > 0;
    const mode: "drag-group" | "draw-marquee" =
      alreadyMovedShapes
        ? "drag-group"
        : inBBox || (down.kind !== "empty" && screenDist <= MARQUEE_THRESHOLD_PX)
          ? "drag-group"
          : "draw-marquee";

    if (mode === "draw-marquee") {
      const sx = Math.min(downPt.x, e.clientX);
      const sy = Math.min(downPt.y, e.clientY);
      const ex = Math.max(downPt.x, e.clientX);
      const ey = Math.max(downPt.y, e.clientY);
      sel.box = {
        x: sx / camera.scale + camera.x,
        y: sy / camera.scale + camera.y,
        width: (ex - sx) / camera.scale,
        height: (ey - sy) / camera.scale,
      };
      sel.shapeIds = [];
      state.selectedIds.clear();
      return;
    }

    // ── drag-group ──
    if (state.selectedIds.size === 0) return;

    const worldDx = screenDx / camera.scale;
    const worldDy = screenDy / camera.scale;
    if (worldDx === 0 && worldDy === 0) return;

    // Translate every selected shape by the same delta
    const newShapes: Shapes[] = state.shapes.map((s) =>
      state.selectedIds.has(s.id) ? shiftShape(s, worldDx, worldDy) : s,
    );
    state.shapes = newShapes;

    // Keep the visible bounding box in sync with the drag so it tracks the group
    sel.box = {
      x: sel.box.x + worldDx,
      y: sel.box.y + worldDy,
      width: sel.box.width,
      height: sel.box.height,
    };

    // Advance drag start so subsequent deltas are incremental
    state.interaction.dragStart = { x: e.clientX, y: e.clientY };
  },

  onMouseUp(state, _e, ctx) {
    const wasDragging = state.interaction.isDragging;
    const sel = state.interaction.selection;
    state.interaction.isDragging = false;
    state.interaction.dragStart = null;
    if (!sel) return;

    const down = getDownHit(state);
    clearDownHit(state);

    // A drag in drag-group mode produced real movement (the selection box was
    // translated in onMouseMove, and sel.shapeIds is non-empty). Broadcast the
    // updated positions to the server. We treat this as "was a drag" whenever
    // shapeIds is non-empty — the only way that is true at mouseup is if the
    // user dragged a pre-existing selection (from mousedown, the selection
    // was already populated for shape- or bbox-downs, and shapeIds is set).
    if (sel.shapeIds.length > 0) {
      const updates: { id: string; shape: Shapes }[] = [];
      for (const s of state.shapes) {
        if (state.selectedIds.has(s.id)) updates.push({ id: s.id, shape: s });
      }
      if (updates.length > 0 && wasDragging) sendShape(ctx, "update", updates);
      return;
    }

    // Case B: ended a marquee drag (or the down was on empty space).
    // shapeIds are []; pick the shapes the final box encloses and recompute
    // the visible box as the tight union of their bounds.
    if (down.kind === "empty" || sel.shapeIds.length === 0) {
      // Normalize the box in case the drag was reversed
      const { x, y, width, height } = sel.box;
      const nx = Math.min(x, x + width);
      const ny = Math.min(y, y + height);
      const nw = Math.abs(width);
      const nh = Math.abs(height);

      // Click without drag → clear any prior selection
      const minSize = 1 / state.camera.scale;
      if (nw < minSize && nh < minSize) {
        state.interaction.selection = null;
        state.selectedIds.clear();
        return;
      }

      const chosen = state.shapes.filter((s) => isShapeInBox(s, nx, ny, nw, nh));
      const shapeIds = chosen.map((s) => s.id);
      const tightBox = getBoundingBox(chosen);

      if (tightBox && shapeIds.length > 0) {
        state.interaction.selection = { box: tightBox, shapeIds };
        state.selectedIds = new Set(shapeIds);
      } else {
        state.interaction.selection = null;
        state.selectedIds.clear();
      }
      return;
    }

    // Case C: a small click on a shape that never entered any drag mode
    // → selection is already correct (set in onMouseDown). Nothing to do.
  },
};

export function deleteSelection(state: AppState, ctx: AppContext) {
  if (state.selectedIds.size === 0) return;
  const removed = state.shapes.filter((s) => state.selectedIds.has(s.id));
  state.shapes = state.shapes.filter((s) => !state.selectedIds.has(s.id));
  state.selectedIds.clear();
  state.interaction.selection = null;
  sendShape(
    ctx,
    "delete",
    removed.map((s) => ({ id: s.id, shape: s })),
  );
}
