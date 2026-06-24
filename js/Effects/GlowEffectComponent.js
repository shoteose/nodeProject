class GlowEffectComponent extends IEffectComponent {
  constructor() {
    super();
    this.enabled = false;
  }

  update() {}

  draw(renderer) {
    if (!this.enabled) return;
    const transformComponent = this.entity.getComponent(TransformComponent);
    const renderComponent = this.entity.getComponent(RenderComponent);
    if (transformComponent && renderComponent) renderer.drawGlow(this, transformComponent, renderComponent);
  }
}
