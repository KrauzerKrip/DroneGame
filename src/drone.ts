import { Transform } from "./components";
import { GameObject } from "./gameObject";
import { Sprite } from "./sprite";
import { Vec2 } from "./vector";

export class Drone extends GameObject {
  constructor(pos: Vec2, rot: number, scale: Vec2) {
    const sprite = Sprite.fromImage('resources/sprites/drone.png');
    super(sprite, { position: pos, rotation: rot, scale: scale });
  }
}