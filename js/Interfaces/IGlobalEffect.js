class IGlobalEffect {
  constructor() {
    if (this.constructor === IGlobalEffect) throw new Error("IGlobalEffect é abstrata.");
  }
  add()    { throw new Error("add() tem de ser implementado."); }
  update() { throw new Error("update() tem de ser implementado."); }
  draw()   { throw new Error("draw() tem de ser implementado."); }
}
