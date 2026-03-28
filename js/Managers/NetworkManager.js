class NetworkManager {
  constructor() {
    console.log("NetworkManager constructor called");
    this.nodes = [];
    this.links = [];
    this.selectedNode = null;
    this.isDragging = false;
  }

  addNode(node) { 
    console.log("addNode called with node:", node.id);
    this.nodes.push(node); 
    console.log("Total nodes now:", this.nodes.length);
  }
  
  addLink(link) { 
    console.log("addLink called between:", link.source.id, "and", link.target.id);
    this.links.push(link); 
    console.log("Total links now:", this.links.length);
  }
  
  getNodeById(id) { 
    const node = this.nodes.find(n => n.id === id);
    console.log("getNodeById called for id:", id, "found:", node ? node.id : "null");
    return node;
  }
  
  setSelectedNode(node) { 
    console.log("setSelectedNode called with:", node ? node.id : "null");
    this.selectedNode = node; 
  }
  
  getSelectedNode() { 
    //console.log("getSelectedNode called, returning:", this.selectedNode ? this.selectedNode.id : "null");
    return this.selectedNode; 
  }

  setDragging(isDragging) { 
    console.log("setDragging called with:", isDragging);
    this.isDragging = isDragging; 
  }
  
  getDragging() { 
    console.log("getDragging called, returning:", this.isDragging);
    return this.isDragging; 
  }
}





