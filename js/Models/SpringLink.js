class SpringLink extends ILink {
  constructor(sourceNode, targetNode, distancia, forca, cor) {
    super(sourceNode, targetNode);
    this.distancia = distancia;
    this.forca = forca;
    this.cor = cor;
  }

  applyForce(selectedNode, draggedNode = null) {
    const sourceTransform = this.source.getComponent(TransformComponent);
    const targetTransform = this.target.getComponent(TransformComponent);

    if (!sourceTransform || !targetTransform) return;

    const dx = targetTransform.x - sourceTransform.x;
    const dy = targetTransform.y - sourceTransform.y;
    const distanceToTarget = dist(sourceTransform.x, sourceTransform.y, targetTransform.x, targetTransform.y);

    if (distanceToTarget === 0) return;

    const difference = distanceToTarget - this.distancia;
    const forceMagnitude = difference * this.forca * 0.05;
    const fx = (dx / distanceToTarget) * forceMagnitude;
    const fy = (dy / distanceToTarget) * forceMagnitude;

    if (selectedNode !== this.source && draggedNode !== this.source) {
      sourceTransform.vx += fx;
      sourceTransform.vy += fy;
    }
    if (selectedNode !== this.target && draggedNode !== this.target) {
      targetTransform.vx -= fx;
      targetTransform.vy -= fy;
    }
  }

  draw(renderer, isSelected = false) {
    const sourceTransform = this.source.getComponent(TransformComponent);
    const targetTransform = this.target.getComponent(TransformComponent);
    if (sourceTransform && targetTransform) {
      renderer.drawLink(this, sourceTransform, targetTransform, isSelected);
    }
  }
}
