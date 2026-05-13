class ClickableComponent extends IComponent {
  constructor() {
    super();
  }

  contains(px, py) {
    let transform = this.entity.getComponent(TransformComponent);
    let render = this.entity.getComponent(RenderComponent);

    if (transform && render) {
      const distance = dist(px, py, transform.x, transform.y);
      const result = distance < render.tamanho;

      return result;
    }
    return false;
  }
}