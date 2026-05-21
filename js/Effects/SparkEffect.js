class SparkEffect extends IGlobalEffect {
  constructor() {
    super();
    this.particles = [];
  }

  add(x1, y1, x2, y2, cor) {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const px = -dy / len, py = dx / len;
    for (let i = 0; i < 22; i++) {
      this.particles.push({
        x1, y1, x2, y2, px, py,
        t: random(0, 0.15),
        speed:  random(0.025, 0.065),
        jitter: random(-20, 20),
        size:   random(4, 9),
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
      const alpha = (1 - s.t) * 255;
      const cx = lx + s.px * offset;
      const cy = ly + s.py * offset;

      const gc = color(s.cor);
      gc.setAlpha(alpha * 0.35);
      fill(gc);
      circle(cx, cy, s.size * 2.6);

      const hot = lerpColor(color(255, 255, 255), color(s.cor), s.t * 1.4);
      hot.setAlpha(alpha);
      fill(hot);
      circle(cx, cy, s.size);
    }
  }
}
