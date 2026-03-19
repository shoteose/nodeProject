class InteractionController {
  constructor(networkManager) {
    this.network = networkManager;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
  }

  handleMousePressed(mx, my) {
    for (let node of this.network.nodes) {
      let clickable = node.getComponent(ClickableComponent);
      if (clickable && clickable.contains(mx, my)) {
        this.network.setSelectedNode(node);
        this.network.setDragging(true);
        this.lastMouseX = mx;
        this.lastMouseY = my;
        return true;
      }
    }
    return false;
  }

  handleMouseDragged(mx, my) {
    let selected = this.network.getSelectedNode();
    if (!selected || !this.network.getDragging()) return;

    let transform = selected.getComponent(TransformComponent);
    if (!transform) return;

    // apply the drag vector to selected node velocity and position
    let dx = mx - this.lastMouseX;
    let dy = my - this.lastMouseY;
    transform.vx = dx * 0.4;
    transform.vy = dy * 0.4;
    transform.x = mx;
    transform.y = my;

    this.lastMouseX = mx;
    this.lastMouseY = my;
  }

  handleMouseReleased() {
    this.network.setDragging(false);
  }
}