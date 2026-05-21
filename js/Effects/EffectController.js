class EffectController {
  constructor() {
    this.bursts = [];
  }

  addBurst(x, y, cor, count = 14) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * TWO_PI;
      const speed = random(1.5, 5);
      this.bursts.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 230,
        cor,
        size: random(3, 7)
      });
    }
  }

  update() {
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const p = this.bursts[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.92;
      p.vy *= 0.92;
      p.alpha -= 9;
      if (p.alpha <= 0) this.bursts.splice(i, 1);
    }
  }

  draw() {
    noStroke();
    for (const p of this.bursts) {
      const c = color(p.cor);
      c.setAlpha(p.alpha);
      fill(c);
      circle(p.x, p.y, p.size * 2);
    }
  }
}
