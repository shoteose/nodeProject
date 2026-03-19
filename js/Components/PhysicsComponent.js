class PhysicsComponent extends IComponent {
  constructor() {
    super();
  }

  update() {
    let transform = this.entity.getComponent(TransformComponent);
    if (transform) {
      transform.vx *= 0.85; // Friction
      transform.vy *= 0.85;
      transform.x += transform.vx;
      transform.y += transform.vy;
    }
  }
}