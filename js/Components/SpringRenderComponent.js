class SpringRenderComponent extends IComponent {
  constructor(cor) {
    super();
    this.cor = cor;
  }

  draw(renderer, isSelected = false) {
    const conn = this.entity.getComponent(ConnectionComponent);
    const phys = this.entity.getComponent(SpringPhysicsComponent);
    if (!conn || !phys) return;
    const src = conn.source.getComponent(TransformComponent);
    const tgt = conn.target.getComponent(TransformComponent);
    if (src && tgt) renderer.drawLink(this.cor, phys.tension, src, tgt, isSelected);
  }
}
