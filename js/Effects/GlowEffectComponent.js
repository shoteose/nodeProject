class GlowEffectComponent extends IEffectComponent {
  constructor() {
    super();
    this.enabled = false;
  }

  update() {}

  draw(renderer) {
    if (!this.enabled) return;
    const t = this.entity.getComponent(TransformComponent);
    const r = this.entity.getComponent(RenderComponent);
    if (t && r) renderer.drawGlow(this, t, r);
  }
}
