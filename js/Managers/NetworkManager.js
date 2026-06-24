class NetworkManager {
  constructor() {
    this.nodes = [];
    this.links = [];
    this.selectedNode = null;
    this.selectedLink = null;
    this.isDragging = false;
    this.draggedNode = null;
    this.friction = 0.15;
    this.nextNodeId = 1;
    this.nextLinkId = 1;
    this.saveVersion = 1;
  }

  addNode(node) {
    this.nodes.push(node);
    this.nextNodeId = Math.max(this.nextNodeId, node.id + 1);
  }

  removeNode(nodeToRemove) {
    if (!nodeToRemove) return;
    this.links = this.links.filter(link => {
      const connectionComponent = link.getComponent(ConnectionComponent);
      return !connectionComponent || (connectionComponent.source !== nodeToRemove && connectionComponent.target !== nodeToRemove);
    });
    this.nodes = this.nodes.filter(node => node !== nodeToRemove);
    if (this.selectedNode === nodeToRemove) this.selectedNode = null;
  }

  removeLink(linkToRemove) {
    if (!linkToRemove) return;
    this.links = this.links.filter(l => l !== linkToRemove);
    if (this.selectedLink === linkToRemove) this.selectedLink = null;
  }

  addLink(link) {
    this.links.push(link);
    this.nextLinkId++;
  }

  clearNetwork() {
    this.nodes = [];
    this.links = [];
    this.selectedNode = null;
    this.selectedLink = null;
    this.isDragging = false;
    this.draggedNode = null;
    this.nextNodeId = 1;
    this.nextLinkId = 1;
    this.saveVersion = 1;
  }

  getNodeById(id) {
    return this.nodes.find(node => node.id === id) ?? null;
  }

  setSelectedNode(node) {
    this.selectedNode = node;
    if (node) this.selectedLink = null;
  }

  getSelectedNode() {
    return this.selectedNode;
  }

  setSelectedLink(link) {
    this.selectedLink = link;
    if (link) this.selectedNode = null;
  }

  getSelectedLink() {
    return this.selectedLink;
  }

  setDragging(isDragging) {
    this.isDragging = isDragging;
  }

  getDragging() {
    return this.isDragging;
  }

  setDraggedNode(node) {
    this.draggedNode = node;
  }

  getDraggedNode() {
    return this.draggedNode;
  }
}
