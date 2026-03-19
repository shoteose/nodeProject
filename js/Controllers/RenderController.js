class RenderController {
  clearBackground() {
    background(30);
  }

  drawNode(node, isSelected) {
    stroke(255);
    strokeWeight(2);
    
    if (isSelected) {
      stroke('#2ecc71');
      strokeWeight(6);
    }
    
    fill(node.cor);
    circle(node.x, node.y, node.tamanho * 2);
    
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    text(node.nome, node.x, node.y);
  }

  drawLink(link) {
    stroke(link.cor);
    strokeWeight(2);
    line(link.source.x, link.source.y, link.target.x, link.target.y);
  }
}