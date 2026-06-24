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
      const ring = this.rings[i];
      ring.radius += 3;
      ring.alpha  -= 6;
      if (ring.alpha <= 0) this.rings.splice(i, 1);
    }
  }

  draw(renderer) {
    if (this.rings.length === 0) return;
    const transformComponent = this.entity.getComponent(TransformComponent);
    if (transformComponent) renderer.drawPulse(this, transformComponent);
  }
}
