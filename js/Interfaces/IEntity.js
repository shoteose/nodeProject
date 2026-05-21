class IEntity {
  constructor(id) {
    if (this.constructor === IEntity) throw new Error("IEntity é uma interface/classe abstrata.");
    this.id = id;
    this.components = new Map();
    this.updatables = [];
  }

  addComponent(component) {
    this.components.set(component.constructor.name, component);
    component.entity = this;
    if (typeof component.update === 'function') this.updatables.push(component);
  }

  getComponent(componentClass) {
    return this.components.get(componentClass.name);
  }

  hasComponent(componentClass) {
    return this.components.has(componentClass.name);
  }

  update(...args) {
    for (const c of this.updatables) c.update(...args);
  }

  draw(renderController, ...args) {
    for (const component of this.components.values()) {
      if (component.draw) component.draw(renderController, ...args);
    }
  }
}
