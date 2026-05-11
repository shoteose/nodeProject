class SpringLink extends ILink {
  constructor(sourceNode, targetNode, distancia, forca, cor) {
    super(sourceNode, targetNode);
    this.distancia = distancia;
    this.forca = forca;
    this.cor = cor;
  }

  applyForce(selectedNode, draggedNode = null) {
    let sourceTransform = this.source.getComponent(TransformComponent);
    let targetTransform = this.target.getComponent(TransformComponent);

    if (!sourceTransform || !targetTransform) {
      return;
    }

    let dx = targetTransform.x - sourceTransform.x;
    let dy = targetTransform.y - sourceTransform.y;
    let distanceToTarget = dist(sourceTransform.x, sourceTransform.y, targetTransform.x, targetTransform.y);

    if (distanceToTarget === 0) {
      return;
    }

    let difference = distanceToTarget - this.distancia;
    let forceMagnitude = difference * this.forca * 0.05;
    let fx = (dx / distanceToTarget) * forceMagnitude;
    let fy = (dy / distanceToTarget) * forceMagnitude;

    if (selectedNode !== this.source && draggedNode !== this.source) {
      sourceTransform.vx += fx;
      sourceTransform.vy += fy;
    }
    if (selectedNode !== this.target && draggedNode !== this.target) {
      targetTransform.vx -= fx;
      targetTransform.vy -= fy;
    }
  }

  draw(renderer) {
    let sourceTransform = this.source.getComponent(TransformComponent);
    let targetTransform = this.target.getComponent(TransformComponent);

    if (sourceTransform && targetTransform) {
      renderer.drawLink(this, sourceTransform, targetTransform);
    }
  }
}