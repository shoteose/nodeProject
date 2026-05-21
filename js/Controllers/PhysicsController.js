class PhysicsController {
  constructor(networkManager) {
    this.network = networkManager;
  }

  update() {
    const nodes = this.network.nodes;
    const links = this.network.links;
    const selected = this.network.getSelectedNode();
    const dragged = this.network.getDraggedNode();

    this.pullSelectedToCenter(selected);

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i];
        const n2 = nodes[j];
        if (n1.hasComponent(CollisionComponent) && n2.hasComponent(CollisionComponent)) {
          this.resolveCollision(n1, n2, selected);
        }
      }
    }

    links.forEach(link => link.applyForce(selected, dragged));
    nodes.forEach(node => node.update(this.network.friction));
  }

  pullSelectedToCenter(selected) {
    if (!selected || this.network.getDragging()) return;
    const transform = selected.getComponent(TransformComponent);
    if (!transform) return;
    transform.vx += (width / 2 - transform.x) * 0.02;
    transform.vy += (height / 2 - transform.y) * 0.02;
  }

  resolveCollision(node1, node2, selectedNode) {
    const t1 = node1.getComponent(TransformComponent);
    const r1 = node1.getComponent(RenderComponent);
    const t2 = node2.getComponent(TransformComponent);
    const r2 = node2.getComponent(RenderComponent);

    if (!t1 || !r1 || !t2 || !r2) return;

    const dx = t2.x - t1.x;
    const dy = t2.y - t1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDist = r1.tamanho + r2.tamanho;

    if (distance > 0 && distance < minDist) {
      const overlap = minDist - distance;
      const nx = dx / distance;
      const ny = dy / distance;

      if (node1 === selectedNode) {
        t2.x += nx * overlap;
        t2.y += ny * overlap;
      } else if (node2 === selectedNode) {
        t1.x -= nx * overlap;
        t1.y -= ny * overlap;
      } else {
        t1.x -= nx * overlap * 0.5;
        t1.y -= ny * overlap * 0.5;
        t2.x += nx * overlap * 0.5;
        t2.y += ny * overlap * 0.5;
      }
    }

    const repulseRange = minDist + 40;
    if (distance > 0 && distance < repulseRange) {
      const repulseForce = (repulseRange - distance) * 0.02;
      const forceX = (dx / distance) * repulseForce;
      const forceY = (dy / distance) * repulseForce;

      if (node1 !== selectedNode) {
        t1.vx -= forceX;
        t1.vy -= forceY;
      }
      if (node2 !== selectedNode) {
        t2.vx += forceX;
        t2.vy += forceY;
      }
    }
  }
}
