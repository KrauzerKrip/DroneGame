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

export class BoxColliderOBB {
  public readonly center: Vec2;
  public readonly halfSize: Vec2;
  public readonly rotation: number; // Rotation in radians

  /**
   * Creates an OBB collider.
   * @param center - The center position of the OBB.
   * @param size - The width and height of the OBB.
   * @param rotation - The rotation angle in degrees.
   */
  constructor(center: Vec2, size: Vec2, rotation: number = 0) {
    this.center = center;
    this.halfSize = new Vec2(size.x * 0.5, size.y * 0.5);
    this.rotation = rotation * (Math.PI / 180); // Convert degrees to radians
  }

  /**
   * Rotates a point around the origin.
   * @param point - The point to rotate.
   * @param angle - The rotation angle in radians.
   * @returns The rotated point.
   */
  private rotatePoint(point: Vec2, angle: number): Vec2 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vec2(
      point.x * cos - point.y * sin,
      point.x * sin + point.y * cos
    );
  }

  /**
   * Gets the corners of the OBB in world space.
   * @returns An array of the four corner points.
   */
  public getCorners(): Vec2[] {
    // Local space corners
    const localCorners = [
      new Vec2(-this.halfSize.x, -this.halfSize.y),
      new Vec2(this.halfSize.x, -this.halfSize.y),
      new Vec2(this.halfSize.x, this.halfSize.y),
      new Vec2(-this.halfSize.x, this.halfSize.y)
    ];

    // Rotate and translate corners
    return localCorners.map(corner => {
      const rotatedCorner = this.rotatePoint(corner, this.rotation);
      return new Vec2(
        rotatedCorner.x + this.center.x,
        rotatedCorner.y + this.center.y
      );
    });
  }

  /**
   * Generates unit axes of the OBB for SAT testing.
   * @returns An array of unit axes.
   */
  private getAxes(): Vec2[] {
    return [
      this.rotatePoint(new Vec2(1, 0), this.rotation), // Local x-axis
      this.rotatePoint(new Vec2(0, 1), this.rotation)  // Local y-axis
    ];
  }

  /**
   * Projects a set of points onto an axis and returns the min/max projection values.
   * @param points - The points to project.
   * @param axis - The axis to project onto.
   * @returns An object with `min` and `max` projection values.
   */
  private projectPoints(points: Vec2[], axis: Vec2): { min: number; max: number } {
    const projections = points.map(point => point.x * axis.x + point.y * axis.y);
    return {
      min: Math.min(...projections),
      max: Math.max(...projections)
    };
  }

  /**
   * Checks if this OBB intersects with another OBB using the Separating Axis Theorem (SAT).
   * @param other - The other OBB to check for intersection.
   * @returns True if the OBBs overlap, false otherwise.
   */
  public intersects(other: BoxColliderOBB): boolean {
    // Get axes to test
    const axes = [...this.getAxes(), ...other.getAxes()];

    // Test each axis for separation
    for (const axis of axes) {
      // Project corners of both OBBs onto the axis
      const thisProjection = this.projectPoints(this.getCorners(), axis);
      const otherProjection = this.projectPoints(other.getCorners(), axis);

      // Check for separation
      if (thisProjection.max < otherProjection.min || otherProjection.max < thisProjection.min) {
        return false; // Separation found
      }
    }

    return true; // No separation found
  }

  /**
   * Checks if a point is inside this OBB.
   * @param point - The point to check.
   * @returns True if the point is inside the OBB, false otherwise.
   */
  public containsPoint(point: Vec2): boolean {
    // Transform point to OBB's local space
    const localPoint = this.rotatePoint(
      new Vec2(point.x - this.center.x, point.y - this.center.y),
      -this.rotation
    );

    // Check if point is within local space bounds
    return (
      Math.abs(localPoint.x) <= this.halfSize.x &&
      Math.abs(localPoint.y) <= this.halfSize.y
    );
  }

  /**
   * Moves the OBB by a specified offset.
   * @param offset - The vector by which to move the OBB.
   * @returns A new OBB representing the moved collider.
   */
  public move(offset: Vec2): BoxColliderOBB {
    return new BoxColliderOBB(
      new Vec2(this.center.x + offset.x, this.center.y + offset.y), 
      new Vec2(this.halfSize.x * 2, this.halfSize.y * 2),
      this.rotation * (180 / Math.PI)
    );
  }

  /**
   * Rotates the OBB by a specified angle.
   * @param angle - The rotation angle in radians.
   * @returns A new OBB representing the rotated collider.
   */
  public rotate(angle: number): BoxColliderOBB {
    return new BoxColliderOBB(
      this.center, 
      new Vec2(this.halfSize.x * 2, this.halfSize.y * 2),
      (this.rotation + angle) * (180 / Math.PI)
    );
  }
}
