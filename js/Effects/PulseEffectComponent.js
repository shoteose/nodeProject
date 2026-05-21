class PulseEffectComponent extends IEffectComponent {
  constructor() {
    super();
    this.rings = [];
  }

  trigger(cor, startRadius = 0) {
    this.rings.push({ radius: startRadius, alpha: 200, cor });
  }

  update() {
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i];
      r.radius += 3;
      r.alpha  -= 6;
      if (r.alpha <= 0) this.rings.splice(i, 1);
    }
  }

  draw(renderer) {
    if (this.rings.length === 0) return;
    const t = this.entity.getComponent(TransformComponent);
    if (t) renderer.drawPulse(this, t);
  }
}
