class TensionEffectComponent extends IEffectComponent {
  constructor() {
    super();
    this.particles = [];
  }

  update() {
    const phys = this.entity.getComponent(SpringPhysicsComponent);
    const conn = this.entity.getComponent(ConnectionComponent);
    if (!phys || !conn) return;

    const t = phys.tension;
    const absT = Math.abs(t);

    if (absT > 0.5) {
      const t1 = conn.source.getComponent(TransformComponent);
      const t2 = conn.target.getComponent(TransformComponent);
      if (t1 && t2 && Math.random() < (absT - 0.5) * 2) {
        const frac = random(0.3, 0.7);
        this.particles.push({
          x:  lerp(t1.x, t2.x, frac),
          y:  lerp(t1.y, t2.y, frac),
          vx: random(-1, 1),
          vy: random(-1.5, -0.3),
          alpha: 200 * absT,
          cor: t > 0 ? '#e74c3c' : '#3498db'
        });
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 10;
      if (p.alpha <= 0) this.particles.splice(i, 1);
    }
  }

  draw(renderer) {
    if (this.particles.length === 0) return;
    renderer.drawTensionParticles(this);
  }
}
