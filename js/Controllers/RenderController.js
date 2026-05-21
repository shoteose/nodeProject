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

  drawLink(cor, tension, src, tgt, isSelected = false) {
    if (isSelected) {
      stroke('#f39c12');
      strokeWeight(4);
      line(src.x, src.y, tgt.x, tgt.y);
    } else {
      const t = Math.max(-1, Math.min(1, tension));
      const absT = Math.abs(t);
      const c = this.tensionColor(cor, t);

      if (absT > 0.4) {
        const intensity = (absT - 0.4) / 0.6;
        const gc = color(red(c), green(c), blue(c));
        gc.setAlpha(intensity * 35);
        stroke(gc);
        strokeWeight(14 + intensity * 8);
        line(src.x, src.y, tgt.x, tgt.y);
        gc.setAlpha(intensity * 60);
        stroke(gc);
        strokeWeight(7 + intensity * 4);
        line(src.x, src.y, tgt.x, tgt.y);
      }

      stroke(c);
      strokeWeight(2 + absT * 3);
      line(src.x, src.y, tgt.x, tgt.y);
    }
  }

  drawLinkPreview(startNode, mx, my) {
    if (!startNode) return;
    const transform = startNode.getComponent(TransformComponent);
    if (!transform) return;
    stroke('#f39c12');
    strokeWeight(3);
    line(transform.x, transform.y, mx, my);
  }

  drawTrail(component) {
    noStroke();
    for (const p of component.points) {
      fill(200, 210, 255, p.alpha);
      circle(p.x, p.y, p.size * 2);
    }
  }

  drawPulse(component, transform) {
    noFill();
    for (const ring of component.rings) {
      const c = color(ring.cor);
      c.setAlpha(ring.alpha);
      stroke(c);
      strokeWeight(2);
      circle(transform.x, transform.y, ring.radius * 2);
    }
  }

  drawTensionParticles(component) {
    noStroke();
    for (const p of component.particles) {
      const c = color(p.cor);
      c.setAlpha(p.alpha);
      fill(c);
      circle(p.x, p.y, 4);
    }
  }

  drawGlow(component, transform, renderComponent) {
    const speed = Math.hypot(transform.vx, transform.vy);
    const pulse = Math.min(speed * 8 + component.tensionInput * 50, 60);
    noStroke();
    const gc = color(renderComponent.cor);
    gc.setAlpha(30 + pulse * 0.4); fill(gc);
    circle(transform.x, transform.y, renderComponent.tamanho * 2 + 36);
    gc.setAlpha(30 + pulse * 0.7); fill(gc);
    circle(transform.x, transform.y, renderComponent.tamanho * 2 + 22);
    gc.setAlpha(30 + pulse);       fill(gc);
    circle(transform.x, transform.y, renderComponent.tamanho * 2 + 10);
  }

  tensionColor(baseCor, tension) {
    const base = color(baseCor);
    if (tension > 0) return lerpColor(base, color('#e74c3c'), Math.min(tension * 1.5, 1));
    if (tension < 0) return lerpColor(base, color('#3498db'), Math.min(-tension * 1.5, 1));
    return base;
  }
}
