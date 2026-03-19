class ILink {
  constructor(sourceNode, targetNode) {
    if (this.constructor === ILink) throw new Error("ILink é uma interface/classe abstrata.");
    this.source = sourceNode;
    this.target = targetNode;
  }
  applyForce() { throw new Error("Método applyForce() tem de ser implementado."); }
  draw(renderer) { throw new Error("Método draw() tem de ser implementado."); }
}