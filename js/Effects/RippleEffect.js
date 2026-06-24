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
      const ripple = this.particles[i];
      ripple.radius += 4;
      ripple.alpha  -= 10;
      if (ripple.alpha <= 0) this.particles.splice(i, 1);
    }
  }

  draw(renderer) {
    renderer.drawRipple(this);
  }
}
