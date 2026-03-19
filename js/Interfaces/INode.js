class INode {
  constructor(id, x, y) {
    if (this.constructor === INode) throw new Error("INode é uma interface/classe abstrata.");
    this.id = id;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
  }
  update() { throw new Error("Método update() tem de ser implementado."); }
  draw(renderer) { throw new Error("Método draw() tem de ser implementado."); }
  contains(px, py) { throw new Error("Método contains() tem de ser implementado."); }
}

