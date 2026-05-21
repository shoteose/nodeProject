class SparkEffect extends IGlobalEffect {
  constructor() {
    super();
    this.particles = [];
  }

  add(x1, y1, x2, y2, cor) {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const px = -dy / len, py = dx / len;
    for (let i = 0; i < 10; i++) {
      this.particles.push({
        x1, y1, x2, y2, px, py,
        t: 0,
        speed:  random(0.03, 0.07),
        jitter: random(-12, 12),
        cor
      });
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const s = this.particles[i];
      s.t += s.speed;
      if (s.t >= 1) this.particles.splice(i, 1);
    }
  }

  draw() {
    noStroke();
    for (const s of this.particles) {
      const lx = lerp(s.x1, s.x2, s.t);
      const ly = lerp(s.y1, s.y2, s.t);
      const offset = s.jitter * Math.sin(s.t * Math.PI);
      const c = color(s.cor);
      c.setAlpha((1 - s.t) * 220);
      fill(c);
      circle(lx + s.px * offset, ly + s.py * offset, 5);
    }
  }
}
