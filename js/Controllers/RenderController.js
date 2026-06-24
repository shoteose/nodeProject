class RenderController {
  clearBackground() {
    background(20);
    const spacing = 38;
    stroke(40);
    strokeWeight(2);
    for (let x = spacing; x < width; x += spacing) {
      for (let y = spacing; y < height; y += spacing) {
        point(x, y);
      }
    }
  }

  drawWatermark(img) {
    if (!img) return;
    const s = 64;
    tint(255, 70);
    image(img, width - s - 14, height - s - 14, s, s);
    noTint();
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

  drawLink(cor, tension, sourceTransform, targetTransform, isSelected = false) {
    if (isSelected) {
      stroke('#f39c12');
      strokeWeight(4);
      line(sourceTransform.x, sourceTransform.y, targetTransform.x, targetTransform.y);
    } else {
      const clampedTension = Math.max(-1, Math.min(1, tension));
      const absoluteTension = Math.abs(clampedTension);
      const linkColor = this.tensionColor(cor, clampedTension);

      stroke(linkColor);
      strokeWeight(2 + absoluteTension * 3);
      line(sourceTransform.x, sourceTransform.y, targetTransform.x, targetTransform.y);
    }
  }

  drawLinkPreview(startNode, mouseXPosition, mouseYPosition) {
    if (!startNode) return;
    const transform = startNode.getComponent(TransformComponent);
    if (!transform) return;
    stroke('#f39c12');
    strokeWeight(3);
    line(transform.x, transform.y, mouseXPosition, mouseYPosition);
  }

  drawPulse(component, transform) {
    noFill();
    for (const ring of component.rings) {
      const ringColor = color(ring.cor);
      ringColor.setAlpha(ring.alpha);
      stroke(ringColor);
      strokeWeight(2);
      circle(transform.x, transform.y, ring.radius * 2);
    }
  }

  drawGlow(component, transform, renderComponent) {
    if (!component.enabled) return;
    const ringRadius = renderComponent.tamanho * 2 + 42;
    const glowColor = color(renderComponent.cor);

    noFill();
    glowColor.setAlpha(38);
    stroke(glowColor);
    strokeWeight(20);
    circle(transform.x, transform.y, ringRadius);
  }

  tensionColor(baseCor, tension) {
    const baseColor = color(baseCor);
    if (tension > 0) return lerpColor(baseColor, color('#e74c3c'), Math.min(tension * 1.5, 1));
    if (tension < 0) return lerpColor(baseColor, color('#3498db'), Math.min(-tension * 1.5, 1));
    return baseColor;
  }
}
