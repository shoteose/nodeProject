class PhysicsComponent extends IComponent {
  static worldFriction = 0.97;

  constructor(mass = 1.0, gravitation = 1.0) {
    super();
    this.mass = mass;
    this.gravitation = gravitation;
    this.forceX = 0;
    this.forceY = 0;
  }

  static setWorldFriction(value) {
    PhysicsComponent.worldFriction = value;
  }

  applyForce(fx, fy) {
    this.forceX += fx;
    this.forceY += fy;
  }

  clearForces() {
    this.forceX = 0;
    this.forceY = 0;
  }

  update() {
    let transform = this.entity.getComponent(TransformComponent);
    if (transform) {
      transform.vx += this.forceX / this.mass;
      transform.vy += this.forceY / this.mass;

      transform.vx *= PhysicsComponent.worldFriction;
      transform.vy *= PhysicsComponent.worldFriction;

      transform.x += transform.vx;
      transform.y += transform.vy;

      this.clearForces();
    }
  }
}