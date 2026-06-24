class PhysicsController {
  constructor(networkManager, effectController = null) {
    this.network = networkManager;
    this.effectController = effectController;
  }

  update() {
    const nodes = this.network.nodes;
    const links = this.network.links;
    const selected = this.network.getSelectedNode();
    const dragged = this.network.getDraggedNode();

    this.pullSelectedToCenter(selected);

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const firstNode = nodes[i];
        const secondNode = nodes[j];
        if (firstNode.hasComponent(CollisionComponent) && secondNode.hasComponent(CollisionComponent)) {
          this.resolveCollision(firstNode, secondNode, selected);
        }
      }
    }

    links.forEach(link => link.update(selected, dragged));
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
    const firstTransform = node1.getComponent(TransformComponent);
    const firstRenderComponent = node1.getComponent(RenderComponent);
    const secondTransform = node2.getComponent(TransformComponent);
    const secondRenderComponent = node2.getComponent(RenderComponent);

    if (!firstTransform || !firstRenderComponent || !secondTransform || !secondRenderComponent) return;

    const deltaX = secondTransform.x - firstTransform.x;
    const deltaY = secondTransform.y - firstTransform.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const minimumDistance = firstRenderComponent.tamanho + secondRenderComponent.tamanho;

    if (distance > 0 && distance < minimumDistance) {
      const overlap = minimumDistance - distance;
      const normalX = deltaX / distance;
      const normalY = deltaY / distance;

      if (node1 === selectedNode) {
        secondTransform.x += normalX * overlap;
        secondTransform.y += normalY * overlap;
      } else if (node2 === selectedNode) {
        firstTransform.x -= normalX * overlap;
        firstTransform.y -= normalY * overlap;
      } else {
        firstTransform.x -= normalX * overlap * 0.5;
        firstTransform.y -= normalY * overlap * 0.5;
        secondTransform.x += normalX * overlap * 0.5;
        secondTransform.y += normalY * overlap * 0.5;
      }
    }

    const repulseRange = minimumDistance + 40;
    if (distance > 0 && distance < repulseRange) {
      const repulseForce = (repulseRange - distance) * 0.02;
      const forceX = (deltaX / distance) * repulseForce;
      const forceY = (deltaY / distance) * repulseForce;

      if (node1 !== selectedNode) {
        firstTransform.vx -= forceX;
        firstTransform.vy -= forceY;
      }
      if (node2 !== selectedNode) {
        secondTransform.vx += forceX;
        secondTransform.vy += forceY;
      }
    }
  }
}
