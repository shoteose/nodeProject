class IComponent {
  constructor() {
    if (this.constructor === IComponent) throw new Error("IComponent é uma interface/classe abstrata.");
    this.entity = null;
  }
}