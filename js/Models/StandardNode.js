class StandardNode extends IEntity {
  constructor(id, nome, tamanho, cor, x, y) {
    super(id);
    this.addComponent(new TransformComponent(x, y));
    this.addComponent(new PhysicsComponent());
    this.addComponent(new TrailEffectComponent());
    this.addComponent(new RenderComponent(nome, tamanho, cor));
    this.addComponent(new ClickableComponent());
    this.addComponent(new CollisionComponent());
  }

  contains(px, py) {
    const clickable = this.getComponent(ClickableComponent);
    return clickable ? clickable.contains(px, py) : false;
  }

  toString() {
    return `StandardNode(id: ${this.id}, name: ${this.getComponent(RenderComponent).nome})`;
  }
}
