class StandardNode extends IEntity {
  constructor(id, nome, tamanho, cor, x, y) {
    super(id);
    this.addComponent(new TransformComponent(x, y));
    this.addComponent(new PhysicsComponent());
    this.addComponent(new GlowEffectComponent());
    this.addComponent(new RenderComponent(nome, tamanho, cor));
    this.addComponent(new PulseEffectComponent());
    this.addComponent(new ClickableComponent());
    this.addComponent(new CollisionComponent());
  }

  toString() {
    return `StandardNode(id: ${this.id}, name: ${this.getComponent(RenderComponent).nome})`;
  }
}
