import { Camera, Interaction } from "./interactions";
import { Shapes } from "./shapes";

export type AppState = {
  shapes: Shapes[];
  camera: Camera;
  interaction: Interaction;
  selectedIds: Set<string>;
};
