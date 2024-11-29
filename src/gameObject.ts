import { Transform } from "./components";
import { Sprite } from "./sprite";
import { randomUUID, UUID } from 'crypto'
import { Vec2 } from "./vector";

export class GameObject {
  public readonly name; 
  public transform: Transform;
  private readonly sprite: Sprite;

  constructor(sprite: Sprite, transform = { position: new Vec2(0, 0), rotation: 0, scale: new Vec2(0, 0) }, name: string = randomUUID(), ) {
    this.name = name;
    this.transform = transform;
    this.sprite = sprite;
  }

  public update(deltaTime: number) {
    
  }

  public render(): void {
    
  }
}