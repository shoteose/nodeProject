class PhysicsController {
  constructor(networkManager) {
    this.network = networkManager;
  }

  update() {
    let nodes = this.network.nodes;
    let links = this.network.links;
    let selected = this.network.getSelectedNode();

    if (selected && !this.network.getDragging()) {
      let transform = selected.getComponent(TransformComponent);
      if (transform) {
        transform.x = lerp(transform.x, width / 2, 0.03);
        transform.y = lerp(transform.y, height / 2, 0.03);
        transform.vx = 0; 
        transform.vy = 0;
      }
    }
    

    const gravityConstant = 0.003;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        let node_1 = nodes[i];
        let node_2 = nodes[j];

        const collision1 = node_1.getComponent(CollisionComponent);
        const collision2 = node_2.getComponent(CollisionComponent);
        if (collision1 && collision2) {
          collision1.resolveAgainst(node_1, node_2, selected);
        }

        const physics1 = node_1.getComponent(PhysicsComponent);
        const physics2 = node_2.getComponent(PhysicsComponent);
        const transform1 = node_1.getComponent(TransformComponent);
        const transform2 = node_2.getComponent(TransformComponent);

        if (physics1 && physics2 && transform1 && transform2) {
          let dx = transform2.x - transform1.x;
          let dy = transform2.y - transform1.y;
          let distanceSq = dx * dx + dy * dy + 1;
          let distance = Math.sqrt(distanceSq);
          let g1 = physics1.gravitation || 1.0;
          let g2 = physics2.gravitation || 1.0;
          let forceMagnitude = gravityConstant * physics1.mass * physics2.mass * g1 * g2 / distanceSq;
          let fx = (dx / distance) * forceMagnitude;
          let fy = (dy / distance) * forceMagnitude;

          physics1.applyForce(fx, fy);
          physics2.applyForce(-fx, -fy);
        }
      }
    }

    links.forEach(link => link.applyForce(selected));

    nodes.forEach(node => node.update());
  }
}