import { Vec2 } from "./vector";

export class Sprite {
  private pos: Vec2; // Position of the sprite
  private rot: number; // Rotation of the sprite in degrees
  private element: HTMLDivElement; // Div container
  private imgElement: HTMLImageElement; // Image element inside the div

  constructor(element: HTMLDivElement, imgElement: HTMLImageElement) {
    this.pos = new Vec2(0, 0); // Initialize position at (0, 0)
    this.rot = 0; // Initialize rotation to 0
    this.element = element;
    this.imgElement = imgElement;
  }

  static fromImage(imagePath: string) {
    // Create HTML elements
    const element = document.createElement("div");
    const imgElement = document.createElement("img");

    // Set image source
    imgElement.src = imagePath;

    // Wait for the image to load to determine its size
    imgElement.onload = () => { 
      element.style.width = `${imgElement.width}px`;
      element.style.height = `${imgElement.height}px`;
    };

    // Append the image to the div container
    element.appendChild(imgElement);

    // Style the div for positioning and rotation
    element.style.position = "absolute";

    // Add the element to the document body (or you can add it elsewhere as needed)
    document.body.appendChild(element);
  }

  // Returns the size of the sprite
  public getSize(): Vec2 {
    return new Vec2(this.imgElement.width, this.imgElement.height);
  }

  // Sets the position of the sprite
  public setPosition(position: Vec2): void {
    this.pos = position;
    this.updateStyle();
  }

  // Returns the rotation of the sprite
  public getRotation(): number {
    return this.rot;
  }

  // Sets the rotation of the sprite
  public setRotation(rotation: number): void {
    this.rot = rotation;
    this.updateStyle();
  }

  // Updates the style of the div to reflect position and rotation
  private updateStyle(): void {
    this.element.style.transform = `
      translate(${this.pos.x}px, ${this.pos.y}px)
      rotate(${this.rot}deg)
    `;
  }
}
