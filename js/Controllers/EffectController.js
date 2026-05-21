class EffectController {
  constructor() {
    this.burst  = new BurstEffect();
    this.spark  = new SparkEffect();
    this.ripple = new RippleEffect();
  }

  addBurst(x, y, cor, count = 14)   { this.burst.add(x, y, cor, count); }
  addLinkSpark(x1, y1, x2, y2, cor) { this.spark.add(x1, y1, x2, y2, cor); }
  addRipple(x, y)                   { this.ripple.add(x, y); }

  update() {
    this.burst.update();
    this.spark.update();
    this.ripple.update();
  }

  draw() {
    this.ripple.draw();
    this.burst.draw();
    this.spark.draw();
  }
}
