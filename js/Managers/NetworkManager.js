class NetworkManager {
  constructor() {
    this.nodes = [];
    this.links = [];
    this.selectedNode = null;
    this.isDragging = false;
  }

  addNode(node) { this.nodes.push(node); }
  addLink(link) { this.links.push(link); }
  
  getNodeById(id) { return this.nodes.find(n => n.id === id); }
  
  setSelectedNode(node) { this.selectedNode = node; }
  getSelectedNode() { 
    return this.selectedNode; 
  }

  setDragging(isDragging) { this.isDragging = isDragging; }
  getDragging() { return this.isDragging; }
}





