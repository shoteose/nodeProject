class RenderComponent extends IComponent {
  constructor(nome, tamanho, cor) {
    super();
    this.nome = nome;
    this.tamanho = tamanho;
    this.cor = cor;
  }

  draw(renderer, isSelected, isLinkTarget = false) {
    let transform = this.entity.getComponent(TransformComponent);
    if (transform) {
      renderer.drawNode(this, transform, isSelected, isLinkTarget);
    }
  }
}