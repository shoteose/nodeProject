class ParticleSystem {
  constructor() {
    this._bursts = [];
    this._trails = [];
    this._flowMap = new Map();
  }

  // ── Public API ──────────────────────────────────────────

  burst(x, y, cor, count = 14) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * TWO_PI;
      const speed = random(1.5, 5);
      this._bursts.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 230,
        cor,
        size: random(3, 7)
      });
    }
  }

  // Call once per frame with current node list
  trackTrails(nodes) {
    for (const node of nodes) {
      const t = node.getComponent(TransformComponent);
      const r = node.getComponent(RenderComponent);
      if (!t || !r) continue;
      const speed = Math.hypot(t.vx, t.vy);
      if (speed > 0.8) {
        this._trails.push({
          x: t.x, y: t.y,
          alpha: Math.min(speed * 25, 160),
          size: r.tamanho * 0.45
        });
      }
    }
  }

  // Call once per frame with current link list
  syncLinkFlows(links) {
    for (const [link] of this._flowMap) {
      if (!links.includes(link)) this._flowMap.delete(link);
    }
    for (const link of links) {
      if (!this._flowMap.has(link)) {
        this._flowMap.set(link, [
          { t: random(0, 0.5), speed: random(0.003, 0.006) },
          { t: random(0.5, 1), speed: random(0.003, 0.006) }
        ]);
      }
      for (const p of this._flowMap.get(link)) {
        p.t += p.speed;
        if (p.t > 1) p.t -= 1;
      }
    }
  }

  update() {
    for (let i = this._trails.length - 1; i >= 0; i--) {
      this._trails[i].alpha -= 18;
      if (this._trails[i].alpha <= 0) this._trails.splice(i, 1);
    }
    for (let i = this._bursts.length - 1; i >= 0; i--) {
      const p = this._bursts[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.92;
      p.vy *= 0.92;
      p.alpha -= 9;
      if (p.alpha <= 0) this._bursts.splice(i, 1);
    }
  }

  draw() {
    noStroke();

    // Trails - soft white ghosts
    for (const t of this._trails) {
      fill(200, 210, 255, t.alpha);
      circle(t.x, t.y, t.size * 2);
    }

    // Flow dots along links
    for (const [link, particles] of this._flowMap) {
      const src = link.source.getComponent(TransformComponent);
      const tgt = link.target.getComponent(TransformComponent);
      if (!src || !tgt) continue;
      for (const p of particles) {
        const x = src.x + (tgt.x - src.x) * p.t;
        const y = src.y + (tgt.y - src.y) * p.t;
        fill(255, 255, 255, 190);
        circle(x, y, 5);
      }
    }

    // Burst particles - use node's own color
    for (const p of this._bursts) {
      const c = color(p.cor);
      c.setAlpha(p.alpha);
      fill(c);
      circle(p.x, p.y, p.size * 2);
    }
  }
}
