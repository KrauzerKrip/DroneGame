import { GameObject } from "./gameObject";
import { Sprite } from "./sprite";
import { Vec2 } from "./vector";

export class Obstacle extends GameObject {
  constructor(pos: Vec2, rot: number, size: Vec2) {
    const sprite = Sprite.fromImage('resources/sprites/obstacle.png');
    sprite.setSize(size);
    super(sprite, { position: pos, rotation: rot, size: size });
  }
}