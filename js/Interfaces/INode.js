class INode {
  constructor(id, name) {
    if (this.constructor === INode) throw new Error("INode é uma interface/classe abstrata.");
    this.id = id;
    this.name = name;
  }

  // Abstract methods that concrete node classes should implement
  update() { throw new Error("Método update() tem de ser implementado."); }
  draw(renderer, isSelected) { throw new Error("Método draw() tem de ser implementado."); }
  contains(x, y) { throw new Error("Método contains() tem de ser implementado."); }
}

