class SpringPhysicsComponent extends IComponent {
  constructor(distancia, forca) {
    super();
    this.distancia = distancia;
    this.forca = forca;
  }

  get tension() {
    const conn = this.entity.getComponent(ConnectionComponent);
    if (!conn) return 0;
    const t1 = conn.source.getComponent(TransformComponent);
    const t2 = conn.target.getComponent(TransformComponent);
    if (!t1 || !t2) return 0;
    return (Math.hypot(t2.x - t1.x, t2.y - t1.y) - this.distancia) / Math.max(this.distancia, 1);
  }

  update(selectedNode, draggedNode = null) {
    const conn = this.entity.getComponent(ConnectionComponent);
    if (!conn) return;
    const src = conn.source.getComponent(TransformComponent);
    const tgt = conn.target.getComponent(TransformComponent);
    if (!src || !tgt) return;

    const dx = tgt.x - src.x;
    const dy = tgt.y - src.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d === 0) return;

    const fm = ((d - this.distancia) * this.forca * 0.05) / d;
    const fx = dx * fm;
    const fy = dy * fm;

    if (selectedNode !== conn.source && draggedNode !== conn.source) {
      src.vx += fx;
      src.vy += fy;
    }
    if (selectedNode !== conn.target && draggedNode !== conn.target) {
      tgt.vx -= fx;
      tgt.vy -= fy;
    }
  }
}
