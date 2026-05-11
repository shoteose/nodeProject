class InteractionController {
  constructor(networkManager) {
    console.log("InteractionController constructor called");
    this.network = networkManager;
    this.isDraggingNode = false;
    this.draggedNode = null;
    this.isCreatingLink = false;
    this.linkStartNode = null;
    this.linkTargetNode = null; // For highlighting during link creation
    this.nodePressedForDrag = null; // Track node pressed for drag
    this.isPressedForAddingForce = false; // Track if mouse is pressed for adding force
    this.isApplyingForce = false; // Ctrl + right-click force mode
    this.forceNode = null; // Node receiving the force
    this.forceDragX = 0; // Current mouse drag position
    this.forceDragY = 0;
    this.forceMultiplier = 1.0; // UI-controlled force multiplier
  }

  handleMousePressed(mx, my, button) {
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

      // Ctrl + Right-click: start force vector mode on any node
      if (button === 2 && keyIsDown(CONTROL) && clickedNode) {
        this.isApplyingForce = true;
        this.forceNode = clickedNode;
        let transform = clickedNode.getComponent(TransformComponent);
        this.forceDragX = transform ? transform.x : mx;
        this.forceDragY = transform ? transform.y : my;
        return false;
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
          } else if (!keyIsDown(CONTROL)) {
            this.network.setSelectedNode(clickedNode);
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
        }
        // Right click on empty space does nothing
      }
    } catch (error) {
      console.error("ERROR in handleMousePressed:", error);
    }
    return false; // Prevent default behavior
  }

  handleMouseDragged(mx, my) {
    try {
      console.log("handleMouseDragged called - X:", mx, "Y:", my);
      
      // Force vector drag
      if (this.isApplyingForce && this.forceNode) {
        this.forceDragX = mx;
        this.forceDragY = my;
        return;
      }

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
        console.log("Link creation preview - target:", targetNode ? targetNode.id : "none");
        return;
      } 

      // Only start dragging if the initial mouse down was on a node
      if (this.nodePressedForDrag && !this.isDraggingNode) {
        this.network.setDragging(true);
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
      console.log("handleMouseReleased called");
      
      // Apply force from drag vector
      if (this.isApplyingForce && this.forceNode) {
        let transform = this.forceNode.getComponent(TransformComponent);
        let physics = this.forceNode.getComponent(PhysicsComponent);
        if (transform) {
          let dx = this.forceDragX - transform.x;
          let dy = this.forceDragY - transform.y;
          // Apply force in opposite direction, scaled
          let forceFactor = 0.1 * this.forceMultiplier;
          let fx = -dx * forceFactor;
          let fy = -dy * forceFactor;

          if (physics) {
            physics.applyForce(fx, fy);
          } else {
            transform.vx += fx;
            transform.vy += fy;
          }

          console.log("Force applied to node", this.forceNode.id, "fx:", fx, "fy:", fy);
        }
        this.isApplyingForce = false;
        this.forceNode = null;
        return;
      }

      if (this.isCreatingLink && this.linkStartNode && this.linkTargetNode) {
        console.log("Completing link creation between", this.linkStartNode.id, "and", this.linkTargetNode.id);
        this.createLink(this.linkStartNode, this.linkTargetNode);
      } else if (this.isCreatingLink) {
        console.log("Cancelling link creation - released on empty space");
      }
      
      // Reset all
      this.network.setDragging(false);
      this.isDraggingNode = false;
      this.draggedNode = null;
      this.isCreatingLink = false;
      this.linkStartNode = null;
      this.linkTargetNode = null;
      console.log("Interaction state reset");
    } catch (error) {
      console.error("ERROR in handleMouseReleased:", error);
    }
  }

  createNode(x, y) {
    try {
      console.log("createNode called - X:", x, "Y:", y);
      const id = Math.max(...this.network.nodes.map(n => n.id), 0) + 1;
      const name = `Node ${id}`;
      const size = 30;
      const color = '#3498db';
      console.log("Creating node with id:", id, "name:", name);
      const node = new StandardNode(id, name, size, color, x, y);
      this.network.addNode(node);
      console.log("Node created and added to network");
    } catch (error) {
      console.error("ERROR in createNode:", error);
    }
  }

  createLink(node1, node2) {
    try {
      console.log("createLink called between nodes:", node1.id, "and", node2.id);
      // Check if link already exists
      const existingLink = this.network.links.find(link =>
        (link.source === node1 && link.target === node2) ||
        (link.source === node2 && link.target === node1)
      );
      if (existingLink) {
        console.log("Link already exists, skipping creation");
        return;
      }

      const distance = 100;
      const force = 0.3;
      const color = '#7f8c8d';
      console.log("Creating link with distance:", distance, "force:", force);
      const link = new SpringLink(node1, node2, distance, force, color);
      this.network.addLink(link);
      console.log("Link created and added to network");
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

  isApplyingForceMode() {
    return this.isApplyingForce;
  }

  getForceNode() {
    return this.forceNode;
  }

  getForceDrag() {
    return { x: this.forceDragX, y: this.forceDragY };
  }
}