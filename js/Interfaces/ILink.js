class ILink extends IEntity {
  constructor(id) {
    super(id);
    if (this.constructor === ILink) throw new Error("ILink é abstrata.");
  }
}
