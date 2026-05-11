class RenderController {
  clearBackground() {
    background(30);
  }

  drawNode(renderComponent, transformComponent, isSelected, isLinkTarget = false, mass = 1.0) {
    // Draw pull range circle (gravity field)
    let pullRange = renderComponent.tamanho + 40 + mass * 20;
    noFill();
    stroke(100, 180, 255, 40);
    strokeWeight(1);
    circle(transformComponent.x, transformComponent.y, pullRange * 2);

    // Draw glow effect for link target
    if (isLinkTarget) {
      noFill();
      stroke('#f39c12');
      strokeWeight(8);
      circle(transformComponent.x, transformComponent.y, renderComponent.tamanho * 2 + 10);
    }
    
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

  drawLinkPreview(startNode, mouseX, mouseY) {
    if (!startNode) return;
    const transform = startNode.getComponent(TransformComponent);
    if (!transform) return;

    stroke('#f39c12');
    strokeWeight(3);
    line(transform.x, transform.y, mouseX, mouseY);
  }

  drawForcePreview(forceNode, dragX, dragY) {
    if (!forceNode) return;
    const transform = forceNode.getComponent(TransformComponent);
    if (!transform) return;

    let nx = transform.x;
    let ny = transform.y;
    let dx = dragX - nx;
    let dy = dragY - ny;

    // Opposite direction line
    let ox = nx - dx;
    let oy = ny - dy;

    // Draw drag vector (faint)
    stroke(255, 255, 255, 80);
    strokeWeight(2);
    line(nx, ny, dragX, dragY);

    // Draw force vector (opposite, bright)
    stroke('#e74c3c');
    strokeWeight(3);
    line(nx, ny, ox, oy);

    // Arrowhead on the force vector
    let len = Math.sqrt(dx * dx + dy * dy);
    if (len > 10) {
      let arrowSize = 10;
      let angle = Math.atan2(-dy, -dx);
      let ax1 = ox + arrowSize * Math.cos(angle + 0.4);
      let ay1 = oy + arrowSize * Math.sin(angle + 0.4);
      let ax2 = ox + arrowSize * Math.cos(angle - 0.4);
      let ay2 = oy + arrowSize * Math.sin(angle - 0.4);
      line(ox, oy, ax1, ay1);
      line(ox, oy, ax2, ay2);
    }
  }
}