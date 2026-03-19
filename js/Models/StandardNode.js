class StandardNode extends INode {
  constructor(id, nome, tamanho, cor, x, y) {
    super(id, x, y);
    this.nome = nome;
    this.tamanho = tamanho * 1.5;
    this.cor = cor;
  }

  update() {
    this.vx *= 0.85; // Fricção
    this.vy *= 0.85;
    this.x += this.vx;
    this.y += this.vy;
  }

  draw(renderer, isSelected) {
    renderer.drawNode(this, isSelected);
  }

  contains(px, py) {
    return dist(px, py, this.x, this.y) < this.tamanho;
  }
}

