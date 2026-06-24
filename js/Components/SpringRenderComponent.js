class SpringRenderComponent extends IComponent {
  constructor(cor) {
    super();
    this.cor = cor;
  }

  draw(renderer, isSelected = false) {
    const connectionComponent = this.entity.getComponent(ConnectionComponent);
    const springPhysicsComponent = this.entity.getComponent(SpringPhysicsComponent);
    if (!connectionComponent || !springPhysicsComponent) return;
    const sourceTransform = connectionComponent.source.getComponent(TransformComponent);
    const targetTransform = connectionComponent.target.getComponent(TransformComponent);
    if (sourceTransform && targetTransform) renderer.drawLink(this.cor, springPhysicsComponent.tension, sourceTransform, targetTransform, isSelected);
  }
}
