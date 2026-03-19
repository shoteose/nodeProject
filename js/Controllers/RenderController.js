class RenderController {
  clearBackground() {
    background(30);
  }

  drawNode(renderComponent, transformComponent, isSelected) {
    stroke(255);
    strokeWeight(2);
    if (isSelected) {
      console.log("drawing selected node ->", renderComponent.nome);
      stroke('#2ecc71');
      strokeWeight(6);
    }
    
    fill(renderComponent.cor);
    circle(transformComponent.x, transformComponent.y, renderComponent.tamanho * 2);
    
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    text(renderComponent.nome, transformComponent.x, transformComponent.y);
  }

  drawLink(link, sourceTransform, targetTransform) {
    stroke(link.cor);
    strokeWeight(2);
    line(sourceTransform.x, sourceTransform.y, targetTransform.x, targetTransform.y);
  }
}