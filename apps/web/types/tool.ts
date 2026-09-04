import { AppContext } from "./appContext";
import { AppState } from "./appSatate";

export type Tools = {
  onMouseDown?: (state: AppState, e: MouseEvent) => void;
  onMouseMove?: (state: AppState, e: MouseEvent) => void;
  onMouseUp?: (state: AppState, e: MouseEvent, ctx: AppContext) => void;
};
