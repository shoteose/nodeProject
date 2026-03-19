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
    

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        let node_1 = nodes[i];
        let node_2 = nodes[j];

        const collision1 = node_1.getComponent(CollisionComponent);
        const collision2 = node_2.getComponent(CollisionComponent);
        if (collision1 && collision2) {
          collision1.resolveAgainst(node_2, selected);
        }
      }
    }

    links.forEach(link => link.applyForce(selected));

    nodes.forEach(node => node.update());
  }
}