class EffectController {
  constructor() {
    this.ripple = new RippleEffect();
  }

  addRipple(x, y){
    this.ripple.add(x, y); 
  }

  update() {
    this.ripple.update();
  }

  draw(renderer) {
    this.ripple.draw(renderer);
  }
}
