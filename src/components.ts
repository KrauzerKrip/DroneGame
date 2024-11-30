import { Vec2 } from "./vector";

export interface Transform {
  position: Vec2;
  rotation: number;
  size: Vec2;
}