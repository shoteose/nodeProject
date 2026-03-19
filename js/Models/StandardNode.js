class StandardNode extends IEntity {
  constructor(id, nome, tamanho, cor, x, y) {
    super(id);
    this.addComponent(new TransformComponent(x, y));
    this.addComponent(new PhysicsComponent());
    this.addComponent(new RenderComponent(nome, tamanho, cor));
    this.addComponent(new ClickableComponent());
    this.addComponent(new CollisionComponent());
  }

  contains(px, py) {
    let clickable = this.getComponent(ClickableComponent);
    return clickable ? clickable.contains(px, py) : false;
  }
}

