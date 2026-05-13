class InteractionController {
  constructor(networkManager) {
    this.network = networkManager;
    this.isDraggingNode = false;
    this.draggedNode = null;
    this.isCreatingLink = false;
    this.linkStartNode = null;
    this.linkTargetNode = null;
    this.nodePressedForDrag = null;
  }

  handleMousePressed(mx, my, button, ctrlKey = false) {
    try {
      // Find node under cursor
      let clickedNode = null;
      for (let node of this.network.nodes) {
        let clickable = node.getComponent(ClickableComponent);
        if (clickable && clickable.contains(mx, my)) {
          clickedNode = node;
          break;
        }
      }

      // Track node pressed for drag
      if (button === 0) {
        this.nodePressedForDrag = clickedNode;
      } else {
        this.nodePressedForDrag = null;
      }

      if (button === 0) { // Left click
        if (clickedNode) {
          if (this.isCreatingLink) {
            // Complete link creation
            if (this.linkStartNode && this.linkStartNode !== clickedNode) {
              this.createLink(this.linkStartNode, clickedNode);
            }
            this.isCreatingLink = false;
            this.linkStartNode = null;
          } else {
            if (!ctrlKey) {
              this.network.setSelectedNode(clickedNode);
            }
          }
        } else {
          // Create new node at position
          this.createNode(mx, my);
        }
      } else if (button === 2) { // Right click
        if (clickedNode) {
          this.isCreatingLink = true;
          this.linkStartNode = clickedNode;
          this.linkTargetNode = null;
        } else {
          this.network.setSelectedNode(null);
        }
      }
    } catch (error) {
      console.error("ERROR in handleMousePressed:", error);
    }
    return false; // Prevent default behavior
  }

  handleMouseDragged(mx, my) {
    try {
      if (this.isCreatingLink && this.linkStartNode) {
        // Update link creation preview 
        // check for target node under cursor
        let targetNode = null;
        for (let node of this.network.nodes) {
          if (node !== this.linkStartNode) {
            let clickable = node.getComponent(ClickableComponent);
            if (clickable && clickable.contains(mx, my)) {
              targetNode = node;
              break;
            }
          }
        }
        this.linkTargetNode = targetNode;
        return;
      }

      // Only start dragging if the initial mouse down was on a node
      if (this.nodePressedForDrag && !this.isDraggingNode) {
        this.network.setDragging(true);
        this.network.setDraggedNode(this.nodePressedForDrag);
        this.isDraggingNode = true;
        this.draggedNode = this.nodePressedForDrag;
      }

      if (this.isDraggingNode && this.draggedNode) {
        let transform = this.draggedNode.getComponent(TransformComponent);
        if (transform) {
          transform.x = mx;
          transform.y = my;
          transform.vx = 0;
          transform.vy = 0;
        }
      }
    } catch (error) {
      console.error("ERROR in handleMouseDragged:", error);
    }
  }

  handleMouseReleased() {
    try {
      if (this.isCreatingLink && this.linkStartNode && this.linkTargetNode) {
        this.createLink(this.linkStartNode, this.linkTargetNode);
      } else if (this.isCreatingLink) {
        // Cancelling link creation - released on empty space
      }

      // Reset all
      this.network.setDragging(false);
      this.network.setDraggedNode(null);
      this.isDraggingNode = false;
      this.draggedNode = null;
      this.isCreatingLink = false;
      this.linkStartNode = null;
      this.linkTargetNode = null;
    } catch (error) {
      console.error("ERROR in handleMouseReleased:", error);
    }
  }

  createNode(x, y) {
    try {
      const id = Math.max(...this.network.nodes.map(n => n.id), 0) + 1;
      const name = `Node ${id}`;
      const size = 45;
      const color = '#3498db';
      const node = new StandardNode(id, name, size, color, x, y);
      this.network.addNode(node);
      this.network.setSelectedNode(node);
    } catch (error) {
      console.error("ERROR in createNode:", error);
    }
  }

  createLink(node1, node2) {
    try {
      // Check if link already exists
      const existingLink = this.network.links.find(link =>
        (link.source === node1 && link.target === node2) ||
        (link.source === node2 && link.target === node1)
      );
      if (existingLink) {
        return;
      }

      const distance = 100;
      const force = 0.3;
      const color = '#7f8c8d';
      const link = new SpringLink(node1, node2, distance, force, color);
      this.network.addLink(link);
    } catch (error) {
      console.error("ERROR in createLink:", error);
    }
  }

  getLinkTargetNode() {
    return this.linkTargetNode;
  }

  getLinkStartNode() {
    return this.linkStartNode;
  }

  isCreatingLinkMode() {
    return this.isCreatingLink;
  }
}