class PhysicsController {
  constructor(networkManager) {
    this.network = networkManager;
  }

  update() {
    let nodes = this.network.nodes;
    let links = this.network.links;
    let selected = this.network.getSelectedNode();

    if (selected) {
      selected.x = lerp(selected.x, width / 2, 0.03);
      selected.y = lerp(selected.y, height / 2, 0.03);
      selected.vx = 0; 
      selected.vy = 0;
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        let n1 = nodes[i];
        let n2 = nodes[j];
        
        let dx = n2.x - n1.x;
        let dy = n2.y - n1.y;
        let d = dist(n1.x, n1.y, n2.x, n2.y);
        
        let minDist = n1.tamanho + n2.tamanho;

        if (d < minDist && d > 0) {
          let overlap = minDist - d;
          let nx = dx / d;
          let ny = dy / d;
          
          if (n1 === selected) {
            n2.x += nx * overlap;
            n2.y += ny * overlap;
          } else if (n2 === selected) {
            n1.x -= nx * overlap;
            n1.y -= ny * overlap;
          } else {
            n1.x -= nx * overlap * 0.5;
            n1.y -= ny * overlap * 0.5;
            n2.x += nx * overlap * 0.5;
            n2.y += ny * overlap * 0.5;
          }
        } 
        else if (d < minDist + 40) {
          let repulseForce = (minDist + 40 - d) * 0.02;
          let fX = (dx / d) * repulseForce;
          let fY = (dy / d) * repulseForce;
          
          if (n1 !== selected) { n1.vx -= fX; n1.vy -= fY; }
          if (n2 !== selected) { n2.vx += fX; n2.vy += fY; }
        }
      }
    }

    links.forEach(link => link.applyForce(selected));

    nodes.forEach(node => node.update());
  }
}