class CollisionComponent extends IComponent {
  constructor() {
    super();
  }

  resolveAgainst(other, selectedNode) {
    const t1 = this.entity.getComponent(TransformComponent);
    const r1 = this.entity.getComponent(RenderComponent);
    const t2 = other.getComponent(TransformComponent);
    const r2 = other.getComponent(RenderComponent);

    if (!t1 || !r1 || !t2 || !r2) return;

    let dx = t2.x - t1.x;
    let dy = t2.y - t1.y;
    let distSq = dx * dx + dy * dy;
    let distance = Math.sqrt(distSq);
    let minDist = r1.tamanho + r2.tamanho;

    // direct overlap resolution
    if (distance > 0 && distance < minDist) {
      let overlap = minDist - distance;
      let nx = dx / distance;
      let ny = dy / distance;

      if (this.entity === selectedNode) {
        t2.x += nx * overlap;
        t2.y += ny * overlap;
      } else if (other === selectedNode) {
        t1.x -= nx * overlap;
        t1.y -= ny * overlap;
      } else {
        t1.x -= nx * overlap * 0.5;
        t1.y -= ny * overlap * 0.5;
        t2.x += nx * overlap * 0.5;
        t2.y += ny * overlap * 0.5;
      }
    }

    // repulsion when close but not touching 
    const repulseRange = minDist + 40;
    if (distance > 0 && distance < repulseRange) {
      let repulseForce = (repulseRange - distance) * 0.02;
      let forceX = (dx / distance) * repulseForce;
      let forceY = (dy / distance) * repulseForce;

      if (this.entity !== selectedNode) {
        t1.vx -= forceX;
        t1.vy -= forceY;
      }
      if (other !== selectedNode) {
        t2.vx += forceX;
        t2.vy += forceY;
      }
    }
  }
}