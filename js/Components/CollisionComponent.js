class CollisionComponent extends IComponent {
  constructor() {
    super();
  }


  resolveAgainst(entity1, entity2, selectedNode) {
    const transform_1 = entity1.getComponent(TransformComponent);
    const renderer_1 = entity1.getComponent(RenderComponent);
    const transform_2 = entity2.getComponent(TransformComponent);
    const renderer_2 = entity2.getComponent(RenderComponent);
    const physic_1 = entity1.getComponent(PhysicsComponent);
    const physic_2 = entity2.getComponent(PhysicsComponent);

    if (!transform_1 || !renderer_1 || !transform_2 || !renderer_2)
    {
      return;
    }

    const m1 = physic_1 ? physic_1.mass : 1.0;
    const m2 = physic_2 ? physic_2.mass : 1.0;
    const totalMass = m1 + m2;

    let distance_x = transform_2.x - transform_1.x;
    let distance_y = transform_2.y - transform_1.y;
    let distance_Sqr_root = distance_x * distance_x + distance_y * distance_y;
    let distance_normalized = Math.sqrt(distance_Sqr_root);
    let minDist = renderer_1.tamanho + renderer_2.tamanho;

    // direct overlap resolution
    if (distance_normalized > 0 && distance_normalized < minDist) {
      let overlap = minDist - distance_normalized;
      let nx = distance_x / distance_normalized;
      let ny = distance_y / distance_normalized;

      if (entity1 === selectedNode) {
        transform_2.x += nx * overlap;
        transform_2.y += ny * overlap;
      } else if (entity2 === selectedNode) {
        transform_1.x -= nx * overlap;
        transform_1.y -= ny * overlap;
      } else {
        // Mass-weighted positional separation
        let ratio1 = m2 / totalMass;
        let ratio2 = m1 / totalMass;
        transform_1.x -= nx * overlap * ratio1;
        transform_1.y -= ny * overlap * ratio1;
        transform_2.x += nx * overlap * ratio2;
        transform_2.y += ny * overlap * ratio2;
      }

      // Apply collision force (impulse) 
      // lighter nodes get pushed more
      let collisionForce = overlap * 0.15;
      if (entity1 !== selectedNode) {
        transform_1.vx -= nx * collisionForce * (m2 / totalMass);
        transform_1.vy -= ny * collisionForce * (m2 / totalMass);
      }
      if (entity2 !== selectedNode) {
        transform_2.vx += nx * collisionForce * (m1 / totalMass);
        transform_2.vy += ny * collisionForce * (m1 / totalMass);
      }
    }

    // repulsion when close but not touching 
    // scaled by mass 
    const repulseRange = minDist + 40;
    if (distance_normalized > 0 && distance_normalized < repulseRange) {
      let repulseForce = (repulseRange - distance_normalized) * 0.02 * m1 * m2;
      let forceX = (distance_x / distance_normalized) * repulseForce;
      let forceY = (distance_y / distance_normalized) * repulseForce;

      if (entity1 !== selectedNode) {
        transform_1.vx -= forceX / m1;
        transform_1.vy -= forceY / m1;
      }
      if (entity2 !== selectedNode) {
        transform_2.vx += forceX / m2;
        transform_2.vy += forceY / m2;
      }
    }
  }

  // Returns the pull range for a given entity (used for rendering)
  static getPullRange(entity) {
    const render = entity.getComponent(RenderComponent);
    const physics = entity.getComponent(PhysicsComponent);
    if (!render) return 0;
    const mass = physics ? physics.mass : 1.0;
    return render.tamanho + 40 + mass * 20;
  }
}