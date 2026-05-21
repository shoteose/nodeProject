class BurstEffect extends IGlobalEffect {
  constructor() {
    super();
    this.particles = [];
  }

  add(x, y, cor, count = 14) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * TWO_PI;
      const speed = random(1.5, 5);
      this.particles.push({
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
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.92; p.vy *= 0.92;
      p.alpha -= 9;
      if (p.alpha <= 0) this.particles.splice(i, 1);
    }
  }

  draw() {
    noStroke();
    for (const p of this.particles) {
      const c = color(p.cor);
      c.setAlpha(p.alpha);
      fill(c);
      circle(p.x, p.y, p.size * 2);
    }
  }
}
