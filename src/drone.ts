import { Transform } from "./components";
import { GameObject } from "./gameObject";
import { Sprite } from "./sprite";
import { Vec2 } from "./vector";

export class Drone extends GameObject {
  // Physical properties
  private mass: number = 1.0; // Mass of the drone
  private momentOfInertia: number = 0.5; // Moment of inertia
  
  // Dynamic state
  private position: Vec2 = new Vec2();
  private velocity: Vec2 = new Vec2();
  private acceleration: Vec2 = new Vec2();
  
  private rotation: number = 0; // Current angle
  private angularVelocity: number = 0; // Rotational velocity
  private angularAcceleration: number = 0; // Rotational acceleration

  // Engine configuration
  private readonly engineForce: number = 16; // Newtons
  private readonly engineOffset: number = 72; // Distance from center of mass
  
  // Environmental forces
  private readonly gravity: Vec2 = new Vec2(0, -9.8); // Gravitational acceleration

  // Engine states
  private leftEngineActive: boolean = false;
  private rightEngineActive: boolean = false;

  constructor(pos: Vec2, rot: number) {
    const sprite = Sprite.fromImage("resources/sprites/drone.png");
    super(sprite, { position: pos, rotation: rot, size: new Vec2(140, 48) });
    
    // Add event listeners
    window.addEventListener("keydown", this.onKeyDown.bind(this));
    window.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  private onKeyDown(e: KeyboardEvent) {
    if (e.key === "a" || e.key === "A") this.leftEngineActive = true;
    if (e.key === "d" || e.key === "D") this.rightEngineActive = true;
  }

  private onKeyUp(e: KeyboardEvent) {
    if (e.key === "a" || e.key === "A") this.leftEngineActive = false;
    if (e.key === "d" || e.key === "D") this.rightEngineActive = false;
  }

  public onCollision(objectCollidedWith: GameObject): void {
    alert('You have collided with an obstacle! Please, restart the training program.')
  }

  public update(deltaTime: number): void {
    // Reset forces
    let netForce = this.gravity.clone();
    let netTorque = 0;

    // Simplified engine force and torque calculation
    if (this.leftEngineActive) {
      const leftEngineForce = this.calculateEngineForce(true);
      netForce = netForce.add(leftEngineForce);
      netTorque += this.calculateTorque(leftEngineForce, true);
    }
    
    if (this.rightEngineActive) {
      const rightEngineForce = this.calculateEngineForce(false);
      netForce = netForce.add(rightEngineForce);
      netTorque += this.calculateTorque(rightEngineForce, false);
    }

    netTorque *= 0.05;

    netForce = new Vec2(netForce.x * 300, netForce.y * 10);

    // Apply physics
    this.applyForce(netForce, deltaTime);
    this.applyTorque(netTorque, deltaTime);

    // Update position and rotation
    this.updateKinematics(deltaTime);

    // Apply drag/damping
    this.applyDamping(deltaTime);

    super.update(deltaTime);
  }

  private calculateEngineForce(isLeftEngine: boolean): Vec2 {
    // Calculate engine thrust vector (local space)
    const engineThrust = new Vec2(0, this.engineForce);
    
    // Rotate thrust to match drone's current orientation
    return this.rotateVector(engineThrust, this.rotation);
  }

  private calculateTorque(force: Vec2, isLeftEngine: boolean): number {
    // Increase torque calculation to create more pronounced rolling
    const leverArm = isLeftEngine ? -1 : 1; // Wider lever arm for more rotation
    const torqueMultiplier = 5; // Increase rotational sensitivity
    
    return force.magnitude() * leverArm * torqueMultiplier;
  }

  private applyTorque(torque: number, deltaTime: number) {
    // Increase angular acceleration sensitivity
    const maxAngularVelocity = Math.PI; // Limit max rotation speed
    
    // Calculate angular acceleration
    this.angularAcceleration = torque / this.momentOfInertia;
    
    // Update angular velocity with clamping
    this.angularVelocity += this.angularAcceleration * deltaTime;
    this.angularVelocity = Math.max(
      -maxAngularVelocity, 
      Math.min(maxAngularVelocity, this.angularVelocity)
    );
  }

  private applyForce(force: Vec2, deltaTime: number) {
    // F = ma
    this.acceleration = force.scale(1 / this.mass);
    this.velocity = this.velocity.add(this.acceleration.scale(deltaTime));

    this.velocity = new Vec2(-this.velocity.x, this.velocity.y);
  }

  private updateKinematics(deltaTime: number) {
    // Update position based on velocity
    this.transform.position = this.transform.position.add(
      this.velocity.scale(deltaTime)
    );

    // Update rotation based on angular velocity
    this.rotation += this.angularVelocity * deltaTime;
    this.transform.rotation = this.rotation * (180 / Math.PI); // Convert to degrees
  }

  private applyDamping(deltaTime: number) {
    // Linear damping
    this.velocity = this.velocity.scale(0.99);
    
    // Angular damping
    this.angularVelocity *= 0.99;
  }

  private rotateVector(vector: Vec2, angle: number): Vec2 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vec2(
      vector.x * cos - vector.y * sin,
      vector.x * sin + vector.y * cos
    );
  }
}