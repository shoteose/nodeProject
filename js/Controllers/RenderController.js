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

  drawLink(link, src, tgt, isSelected = false) {
    if (isSelected) {
      stroke('#f39c12');
      strokeWeight(4);
    } else {
      const dx = tgt.x - src.x;
      const dy = tgt.y - src.y;
      const currentDist = Math.sqrt(dx * dx + dy * dy);
      const tension = (currentDist - link.distancia) / Math.max(link.distancia, 1);
      const clamped = Math.max(-1, Math.min(1, tension));
      stroke(this.tensionColor(link.cor, clamped));
      strokeWeight(2 + Math.abs(clamped) * 2);
    }
    line(src.x, src.y, tgt.x, tgt.y);
  }

  drawLinkPreview(startNode, mx, my) {
    if (!startNode) return;
    const transform = startNode.getComponent(TransformComponent);
    if (!transform) return;
    stroke('#f39c12');
    strokeWeight(3);
    line(transform.x, transform.y, mx, my);
  }

  tensionColor(baseCor, tension) {
    const base = color(baseCor);
    if (tension > 0) return lerpColor(base, color('#e74c3c'), Math.min(tension * 1.5, 1));
    if (tension < 0) return lerpColor(base, color('#3498db'), Math.min(-tension * 1.5, 1));
    return base;
  }
}
