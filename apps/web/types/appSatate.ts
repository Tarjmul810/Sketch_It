import { Camera } from "./camera";
import { Interaction } from "./interactions";
import { Shapes } from "./shapes"

export type AppState = {
    shapes: Shapes[];
    camera: Camera;
    interaction: Interaction;
}