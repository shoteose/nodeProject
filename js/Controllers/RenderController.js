class RenderController {
  clearBackground() {
    background(30);
  }

  drawNode(renderComponent, transformComponent, isSelected, isLinkTarget = false) {
    if (isLinkTarget) {
      noFill();
      stroke('#f39c12');
      strokeWeight(8);
      circle(transformComponent.x, transformComponent.y, renderComponent.tamanho * 2 + 10);
    }

    stroke(255);
    strokeWeight(2);
    if (isSelected) {
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

  drawLinkPreview(startNode, mouseX, mouseY) {
    if (!startNode) return;
    const transform = startNode.getComponent(TransformComponent);
    if (!transform) return;

    stroke('#f39c12');
    strokeWeight(3);
    line(transform.x, transform.y, mouseX, mouseY);
  }
}