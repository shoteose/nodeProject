class LinkClickableComponent extends IComponent {
  contains(px, py) {
    const connection = this.entity.getComponent(ConnectionComponent);
    if (!connection) return false;

    const a = connection.source.getComponent(TransformComponent);
    const b = connection.target.getComponent(TransformComponent);
    if (!a || !b) return false;

    const lineLen = dist(a.x, a.y, b.x, b.y);
    const sum = dist(px, py, a.x, a.y) + dist(px, py, b.x, b.y);
    return sum < lineLen + 0.5;
  }
}
