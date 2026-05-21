class IEffectComponent {
  constructor() {
    if (this.constructor === IEffectComponent) throw new Error("IEffectComponent é abstrata.");
    this.entity = null;
  }
  update() { throw new Error("update() tem de ser implementado."); }
  draw()   { throw new Error("draw() tem de ser implementado."); }
}
