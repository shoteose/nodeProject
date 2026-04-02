class IEntity {
  constructor(id) {
    if (this.constructor === IEntity) throw new Error("IEntity é uma interface/classe abstrata.");
    this.id = id;
    this.components = new Map();
  }

  addComponent(component) {
    this.components.set(component.constructor.name, component);
    component.entity = this;
  }

  getComponent(componentClass) {
    return this.components.get(componentClass.name);
  }

  hasComponent(componentClass) {
    return this.components.has(componentClass.name);
  }

  update(...args) {
    for (let component of this.components.values()) {
      if (component.update) component.update(...args);
    }
  }

  draw(renderController, ...args) {
    for (let component of this.components.values()) {
      if (component.draw) component.draw(renderController, ...args);
    }
  }
}