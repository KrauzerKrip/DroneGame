export class Vec2 {
  public readonly x: number;
  public readonly y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Adds two vectors and returns a new Vec2.
   */
  public add(other: Vec2): Vec2 {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  /**
   * Subtracts another vector from this vector and returns a new Vec2.
   */
  public subtract(other: Vec2): Vec2 {
    return new Vec2(this.x - other.x, this.y - other.y);
  }

  /**
   * Scales the vector by a scalar value and returns a new Vec2.
   */
  public scale(scalar: number): Vec2 {
    return new Vec2(this.x * scalar, this.y * scalar);
  }

  /**
   * Returns the dot product of this vector and another vector.
   */
  public dot(other: Vec2): number {
    return this.x * other.x + this.y * other.y;
  }

  /**
   * Returns the length (magnitude) of the vector.
   */
  public magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Normalizes the vector (makes its magnitude 1) and returns a new Vec2.
   * If the vector has zero length, it returns a zero vector.
   */
  public normalize(): Vec2 {
    const magnitude = this.magnitude();
    if (magnitude === 0) {
      return new Vec2(0, 0);
    }
    return this.scale(1 / magnitude);
  }

  /**
   * Returns the perpendicular vector (rotated 90 degrees counterclockwise).
   */
  public perpendicular(): Vec2 {
    return new Vec2(-this.y, this.x);
  }

  /**
   * Computes the cross product (in 2D, this is the scalar z-component of the 3D cross product).
   */
  public cross(other: Vec2): number {
    return this.x * other.y - this.y * other.x;
  }

  /**
   * Returns the distance between this vector and another vector.
   */
  public distanceTo(other: Vec2): number {
    return Math.sqrt(
      (this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y)
    );
  }

  public equals(other: Vec2): boolean {
    return this.x === other.x && this.y === other.y;
  }

  /**
   * Returns a string representation of the vector.
   */
  public toString(): string {
    return `Vec2(${this.x}, ${this.y})`;
  }

  public clone(): Vec2 {
    return new Vec2(this.x, this.y);
  }
}
