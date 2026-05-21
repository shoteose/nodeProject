class IEffectComponent extends IComponent {
  constructor() {
    super();
    if (this.constructor === IEffectComponent) throw new Error("IEffectComponent é abstrata.");
  }
  update() { throw new Error("update() tem de ser implementado."); }
  draw() { throw new Error("draw() tem de ser implementado."); }
}
