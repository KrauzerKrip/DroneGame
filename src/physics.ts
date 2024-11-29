import { Vec2 } from "./vector";

export class BoxColliderAABB {
  public readonly center: Vec2;
  public readonly halfSize: Vec2;

  /**
   * Creates an AABB collider.
   * @param center - The center position of the AABB.
   * @param size - The width and height of the AABB.
   */
  constructor(center: Vec2, size: Vec2) {
    this.center = center;
    this.halfSize = new Vec2(size.x * 0.5, size.y * 0.5);
  }

  /**
   * Checks if this AABB intersects with another AABB.
   * @param other - The other AABB to check for intersection.
   * @returns True if the AABBs overlap, false otherwise.
   */
  public intersects(other: BoxColliderAABB): boolean {
    const dx = Math.abs(this.center.x - other.center.x);
    const dy = Math.abs(this.center.y - other.center.y);
    const combinedHalfWidth = this.halfSize.x + other.halfSize.x;
    const combinedHalfHeight = this.halfSize.y + other.halfSize.y;

    return dx <= combinedHalfWidth && dy <= combinedHalfHeight;
  }

  /**
   * Checks if a point is inside this AABB.
   * @param point - The point to check.
   * @returns True if the point is inside the AABB, false otherwise.
   */
  public containsPoint(point: Vec2): boolean {
    return (
      point.x >= this.center.x - this.halfSize.x &&
      point.x <= this.center.x + this.halfSize.x &&
      point.y >= this.center.y - this.halfSize.y &&
      point.y <= this.center.y + this.halfSize.y
    );
  }

  /**
   * Moves the AABB by a specified offset.
   * @param offset - The vector by which to move the AABB.
   * @returns A new AABB representing the moved collider.
   */
  public move(offset: Vec2): BoxColliderAABB {
    return new BoxColliderAABB(new Vec2(this.center.x + offset.x, this.center.y + offset.y), this.halfSize);
  }
}
