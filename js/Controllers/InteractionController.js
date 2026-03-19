class InteractionController {
  constructor(networkManager) {
    this.network = networkManager;
  }

  handleMousePressed(mx, my) {
    for (let node of this.network.nodes) {
      if (node.contains(mx, my)) {
        this.network.setSelectedNode(node);
        return true;
      }
    }
    return false;
  }
}