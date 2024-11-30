import { Transform } from "./components";
import { Drone } from "./drone";
import { GameObject } from "./gameObject";
import { Obstacle } from "./obstacle";
import { BoxColliderOBB } from "./physics";
import { Vec2 } from "./vector";

export class Scene {
  private gameObjects: { [id: string]: GameObject } = {};
  private lastRenderTime = Date.now();

  constructor() {}

  public create() {
    const drone = new Drone(new Vec2(window.innerWidth * 0.25, window.innerHeight * 0.5), 0);
    const obstacle1 = new Obstacle(new Vec2(200, 500), 0, new Vec2(400, 100));

    this.gameObjects[drone.name] = drone;
    this.gameObjects[obstacle1.name] = obstacle1;
  }

  public runGameLoop() {
    this.gameLoop();
  }

  public handleCollisions() {
    for (const i in this.gameObjects) {
      const gameObjectI = this.gameObjects[i]; 
      const colliderI = new BoxColliderOBB(gameObjectI.transform.position, gameObjectI.transform.size);
      for (const j in this.gameObjects) {
        const gameObjectJ = this.gameObjects[j]; 
        if (gameObjectI === gameObjectJ) {
          continue;
        }
        const colliderJ = new BoxColliderOBB(gameObjectJ.transform.position, gameObjectJ.transform.size);
        if (colliderI.intersects(colliderJ)) {
          console.log('intersec');
          gameObjectI.onCollision(gameObjectJ);
          gameObjectJ.onCollision(gameObjectI);
        }
      }
    }
  }

  // Main render loop
  private gameLoop() {
    const deltaTime = Date.now() - this.lastRenderTime;

    this.handleCollisions();

    for (const key in this.gameObjects) {
      const gameObject = this.gameObjects[key];
      gameObject.update(deltaTime / 1000);
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