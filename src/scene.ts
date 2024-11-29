import { Transform } from "./components";
import { Drone } from "./drone";
import { GameObject } from "./gameObject";
import { Obstacle } from "./obstacle";
import { Vec2 } from "./vector";

export class Scene {
  private gameObjects: { [id: string]: GameObject } = {};
  private lastRenderTime = Date.now();

  constructor() {}

  public create() {
    const drone = new Drone(new Vec2(window.innerWidth * 0.25, window.innerHeight * 0.25), 0, new Vec2(1, 1));
    const obstacle1 = new Obstacle(new Vec2(200, 200), 0, new Vec2(400, 100));

    this.gameObjects[drone.name] = drone;
    this.gameObjects[obstacle1.name] = obstacle1;
  }

  public runGameLoop() {
    this.gameLoop();
  }

  // Main render loop
  private gameLoop() {
    const deltaTime = Date.now() - this.lastRenderTime;

    for (const key in this.gameObjects) {
      const gameObject = this.gameObjects[key];
      gameObject.update(deltaTime);
    }

    for (const key in this.gameObjects) {
      const gameObject = this.gameObjects[key];
      gameObject.render();
    }

    this.lastRenderTime = Date.now();

    // Request the next frame
    requestAnimationFrame(() => this.gameLoop());
  }
}