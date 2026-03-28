class CollisionComponent extends IComponent {
  constructor() {
    super();
  }


  resolveAgainst(entity1, entity2, selectedNode) {
    const t1 = entity1.getComponent(TransformComponent);
    const r1 = entity1.getComponent(RenderComponent);
    const t2 = entity2.getComponent(TransformComponent);
    const r2 = entity2.getComponent(RenderComponent);

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

      if (entity1 === selectedNode) {
        t2.x += nx * overlap;
        t2.y += ny * overlap;
      } else if (entity2 === selectedNode) {
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

      if (entity1 !== selectedNode) {
        t1.vx -= forceX;
        t1.vy -= forceY;
      }
      if (entity2 !== selectedNode) {
        t2.vx += forceX;
        t2.vy += forceY;
      }
    }
  }
}