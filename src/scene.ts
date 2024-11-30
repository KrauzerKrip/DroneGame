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
    const drone = new Drone(new Vec2(window.innerWidth * 0.25 + 100, window.innerHeight * 0.5), 0);
    const obstacleFloor = new Obstacle(new Vec2(200, 400), 0, new Vec2(1080, 50))
    const obstacle1 = new Obstacle(new Vec2(200, 300), 0, new Vec2(400, 500));
    const obstacle2 = new Obstacle(new Vec2(0, 1100), 0, new Vec2(400, 100));
    const obstacle3 = new Obstacle(new Vec2(400, 1100), 0, new Vec2(900, 100));
    const obstacle4 = new Obstacle(new Vec2(-500, 500), 0, new Vec2(100, 1000));

    this.gameObjects[drone.name] = drone;
    this.gameObjects[obstacleFloor.name] = obstacleFloor;
    this.gameObjects[obstacle1.name] = obstacle1;
    this.gameObjects[obstacle2.name] = obstacle2;
    this.gameObjects[obstacle3.name] = obstacle3;
    this.gameObjects[obstacle4.name] = obstacle4;
  }

  public runGameLoop() {
    this.gameLoop();
  }

  public handleCollisions() {
    for (const i in this.gameObjects) {
      const gameObjectI = this.gameObjects[i]; 
      const colliderI = new BoxColliderOBB(gameObjectI.transform.position, gameObjectI.transform.size, gameObjectI.transform.rotation);
      for (const j in this.gameObjects) {
        const gameObjectJ = this.gameObjects[j]; 
        if (gameObjectI === gameObjectJ) {
          continue;
        }
        const colliderJ = new BoxColliderOBB(gameObjectJ.transform.position, gameObjectJ.transform.size, gameObjectJ.transform.rotation);
        if (colliderI.intersects(colliderJ)) {
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