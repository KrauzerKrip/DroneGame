import { Transform } from "./components";
import { GameObject } from "./gameObject";

export class Scene {
  private gameObjects: { [id: string]: { gameObject: GameObject; transform: Transform } } = {};
  private lastRenderTime = Date.now();

  constructor() {}

  // Main render loop
  public render() {
    const deltaTime = Date.now() - this.lastRenderTime;

    for (const key in this.gameObjects) {
      const { gameObject, transform } = this.gameObjects[key];
      gameObject.update(deltaTime);
    }

    for (const key in this.gameObjects) {
      const { gameObject, transform } = this.gameObjects[key];
      gameObject.render();
    }

    this.lastRenderTime = Date.now();

    // Request the next frame
    requestAnimationFrame(() => this.render());
  }
}