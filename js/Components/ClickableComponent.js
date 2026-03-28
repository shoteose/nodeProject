class ClickableComponent extends IComponent {
  constructor() {
    super();
    console.log("ClickableComponent constructor called");
  }

  contains(px, py) {
    console.log("contains called for entity:", this.entity ? this.entity.id : "null", "at point:", px, py);
    let transform = this.entity.getComponent(TransformComponent);
    let render = this.entity.getComponent(RenderComponent);
    
    if (transform && render) {
      const distance = dist(px, py, transform.x, transform.y);
      const result = distance < render.tamanho;
      console.log("  Transform found at:", transform.x, transform.y, "size:", render.tamanho);
      console.log("  Distance:", distance, "result:", result);
      return result;
    }
    console.log("  No transform or render component found");
    return false;
  }
}