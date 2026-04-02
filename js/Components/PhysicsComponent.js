class PhysicsComponent extends IComponent {
  constructor() {
    super();
  }

  update(friction = 0.15) {
    let transform = this.entity.getComponent(TransformComponent);
    if (transform) {
      const damping = 1 - friction;

      transform.vx *= damping;
      transform.vy *= damping;
      transform.x += transform.vx;
      transform.y += transform.vy;
    }
  }
}