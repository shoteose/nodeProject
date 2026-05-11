class RenderComponent extends IComponent {
  constructor(nome, tamanho, cor) {
    super();
    this.nome = nome;
    this.tamanho = tamanho * 1.5;
    this.cor = cor;
  }

  draw(renderer, isSelected, isLinkTarget = false) {
    let transform = this.entity.getComponent(TransformComponent);
    let physics = this.entity.getComponent(PhysicsComponent);
    let mass = physics ? physics.mass : 1.0;
    if (transform) {
      renderer.drawNode(this, transform, isSelected, isLinkTarget, mass);
    }
  }
}