class ClickableComponent extends IComponent {
  constructor() {
    super();
  }

  contains(px, py) {
    let transform = this.entity.getComponent(TransformComponent);
    let render = this.entity.getComponent(RenderComponent);
    if (transform && render) {
      return dist(px, py, transform.x, transform.y) < render.tamanho;
    }
    return false;
  }
}