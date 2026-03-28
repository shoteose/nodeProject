class RenderComponent extends IComponent {
  constructor(nome, tamanho, cor) {
    super();
    this.nome = nome;
    this.tamanho = tamanho * 1.5;
    this.cor = cor;
  }

  draw(renderer, isSelected, isLinkTarget = false) {
    let transform = this.entity.getComponent(TransformComponent);
    if (transform) {
      renderer.drawNode(this, transform, isSelected, isLinkTarget);
    }
  }
}