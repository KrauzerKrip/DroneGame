import { Transform } from "./components";
import { BoxColliderAABB } from "./physics";
import { Sprite } from "./sprite";
import { Vec2 } from "./vector";

function randomUUID(): string {
  // Helper function to generate a random 4-character hex string
  function randomHexSegment(): string {
    return Math.random().toString(16).slice(2, 6); // Generate random hex
  }

  // Generate the UUID segments
  const s1 = randomHexSegment() + randomHexSegment(); // 8 hex characters
  const s2 = randomHexSegment();                     // 4 hex characters
  const s3 = ((Math.random() * 0x10000) | 0x4000).toString(16).slice(1); // 4 hex, version 4
  const s4 = ((Math.random() * 0x10000) | 0x8000).toString(16).slice(1); // 4 hex, variant 1
  const s5 = randomHexSegment() + randomHexSegment() + randomHexSegment(); // 12 hex characters

  // Assemble the UUID
  return `${s1}-${s2}-${s3}-${s4}-${s5}`;
}

export class GameObject {
  public readonly name; 
  public transform: Transform;
  private readonly sprite: Sprite;

  constructor(sprite: Sprite, transform = { position: new Vec2(0, 0), rotation: 0, size: sprite.getSize() }, name: string = randomUUID()) {
    this.name = name;
    this.transform = transform;
    this.sprite = sprite;
  }

  public onCollision(objectCollidedWith: GameObject) {
    
  }

  public update(deltaTime: number) {
    
  }

  public render(): void {
    const screenY = window.innerHeight - (this.transform.position.y + this.sprite.getSize().y * 0.5);
    this.sprite.setPosition(new Vec2(this.transform.position.x, screenY));
    this.sprite.setRotation(this.transform.rotation);
  }
}