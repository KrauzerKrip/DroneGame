import { Vec2 } from "./vector";

export interface Transform {
  position: Vec2;
  rotation: number;
  scale: Vec2;
}