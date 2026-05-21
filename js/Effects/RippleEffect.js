class RippleEffect extends IGlobalEffect {
  constructor() {
    super();
    this.particles = [];
  }

  add(x, y) {
    this.particles.push({ x, y, radius: 0, alpha: 180 });
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const r = this.particles[i];
      r.radius += 4;
      r.alpha  -= 10;
      if (r.alpha <= 0) this.particles.splice(i, 1);
    }
  }

  draw() {
    noFill();
    for (const r of this.particles) {
      stroke(220, 230, 255, r.alpha);
      strokeWeight(1);
      circle(r.x, r.y, r.radius * 2);
    }
  }
}
