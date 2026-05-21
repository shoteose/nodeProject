class TrailEffectComponent extends IEffectComponent {
  constructor() {
    super();
    this.points = [];
  }

  update() {
    const t = this.entity.getComponent(TransformComponent);
    const r = this.entity.getComponent(RenderComponent);
    if (t && r) {
      const speed = Math.hypot(t.vx, t.vy);
      if (speed > 0.8) {
        this.points.push({
          x: t.x, y: t.y,
          alpha: Math.min(speed * 25, 160),
          size: r.tamanho * 0.45
        });
      }
    }
    for (let i = this.points.length - 1; i >= 0; i--) {
      this.points[i].alpha -= 18;
      if (this.points[i].alpha <= 0) this.points.splice(i, 1);
    }
  }

  draw() {
    noStroke();
    for (const p of this.points) {
      fill(200, 210, 255, p.alpha);
      circle(p.x, p.y, p.size * 2);
    }
  }
}
