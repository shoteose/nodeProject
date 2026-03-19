class SpringLink extends ILink {
  constructor(sourceNode, targetNode, distancia, forca, cor) {
    super(sourceNode, targetNode);
    this.distancia = distancia;
    this.forca = forca;
    this.cor = cor;
  }

  applyForce(selectedNode) {
    let dx = this.target.x - this.source.x;
    let dy = this.target.y - this.source.y;
    let distanceToTarget = dist(this.source.x, this.source.y, this.target.x, this.target.y);
    
    if (distanceToTarget === 0) return;

    let difference = distanceToTarget - this.distancia;
    let forceMagnitude = difference * this.forca * 0.05; 
    let fx = (dx / distanceToTarget) * forceMagnitude;
    let fy = (dy / distanceToTarget) * forceMagnitude;

    if (selectedNode !== this.source) {
      this.source.vx += fx;
      this.source.vy += fy;
    }
    if (selectedNode !== this.target) {
      this.target.vx -= fx;
      this.target.vy -= fy;
    }
  }

  draw(renderer) {
    renderer.drawLink(this);
  }
}