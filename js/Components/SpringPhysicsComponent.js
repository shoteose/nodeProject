class SpringPhysicsComponent extends IComponent {
  constructor(distancia, forca) {
    super();
    this.distancia = distancia;
    this.forca = forca;
  }

  get tension() {
    const connectionComponent = this.entity.getComponent(ConnectionComponent);
    if (!connectionComponent) return 0;
    const sourceTransform = connectionComponent.source.getComponent(TransformComponent);
    const targetTransform = connectionComponent.target.getComponent(TransformComponent);
    if (!sourceTransform || !targetTransform) return 0;

    // tension = (currentDistance - restDistance) / max(restDistance, 1)
    return (Math.hypot(targetTransform.x - sourceTransform.x, targetTransform.y - sourceTransform.y) - this.distancia) / Math.max(this.distancia, 1);
  }

  update(selectedNode, draggedNode = null) {
    const connectionComponent = this.entity.getComponent(ConnectionComponent);
    if (!connectionComponent) return;
    const sourceTransform = connectionComponent.source.getComponent(TransformComponent);
    const targetTransform = connectionComponent.target.getComponent(TransformComponent);
    if (!sourceTransform || !targetTransform) return;

    const deltaX = targetTransform.x - sourceTransform.x;
    const deltaY = targetTransform.y - sourceTransform.y;
    
    // Calculate the distance between the source and target nodes
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (distance === 0) return;

    const forceMultiplier = ((distance - this.distancia) * this.forca * 0.05) / distance;
    const forceX = deltaX * forceMultiplier;
    const forceY = deltaY * forceMultiplier;

    // Apply forces to the source and target nodes, unless they are selected or dragged
    if (selectedNode !== connectionComponent.source && draggedNode !== connectionComponent.source) {
      sourceTransform.vx += forceX;
      sourceTransform.vy += forceY;
    }
    if (selectedNode !== connectionComponent.target && draggedNode !== connectionComponent.target) {
      targetTransform.vx -= forceX;
      targetTransform.vy -= forceY;
    }
  }
}
