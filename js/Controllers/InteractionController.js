class InteractionController {
  constructor(networkManager, effectController) {
    this.network = networkManager;
    this.effectController = effectController;
    this.isDraggingNode = false;
    this.draggedNode = null;
    this.isCreatingLink = false;
    this.linkStartNode = null;
    this.linkTargetNode = null;
    this.nodePressedForDrag = null;

    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  handleMousePressed(mouseXPosition, mouseYPosition, button, ctrlKey = false) {
    const clickedNode = this.getNodeAt(mouseXPosition, mouseYPosition);

    if (button === 0) {
      this.nodePressedForDrag = clickedNode;
    } else {
      this.nodePressedForDrag = null;
    }

    if (button === 0) {
      if (clickedNode) {
        if (this.isCreatingLink) {
          if (this.linkStartNode && this.linkStartNode !== clickedNode) {
            this.createLink(this.linkStartNode, clickedNode);
          }
          this.cancelLinkCreation();
        } else if (!ctrlKey) {
          this.network.setSelectedNode(clickedNode);
          const pulse = clickedNode.getComponent(PulseEffectComponent);
          const renderComponent = clickedNode.getComponent(RenderComponent);
          if (pulse && renderComponent) pulse.trigger(renderComponent.cor, renderComponent.tamanho);
        }
      } else {
        const clickedLink = this.getLinkAt(mouseXPosition, mouseYPosition);
        if (clickedLink) {
          this.network.setSelectedLink(clickedLink);
        } else {
          this.network.setSelectedNode(null);
          this.network.setSelectedLink(null);
          this.createNode(mouseXPosition, mouseYPosition);
        }
      }
    } else if (button === 2) {
      if (clickedNode) {
        this.isCreatingLink = true;
        this.linkStartNode = clickedNode;
        this.linkTargetNode = null;
      } else {
        this.network.setSelectedNode(null);
        this.network.setSelectedLink(null);
      }
    }
    return false;
  }

  handleMouseDragged(mouseXPosition, mouseYPosition) {
    if (this.isCreatingLink && this.linkStartNode) {
      this.linkTargetNode = null;
      for (const node of this.network.nodes) {
        if (node !== this.linkStartNode) {
          const clickable = node.getComponent(ClickableComponent);
          if (clickable && clickable.contains(mouseXPosition, mouseYPosition)) {
            this.linkTargetNode = node;
            break;
          }
        }
      }
      return;
    }

    if (this.nodePressedForDrag && !this.isDraggingNode) {
      this.network.setDragging(true);
      this.network.setDraggedNode(this.nodePressedForDrag);
      this.isDraggingNode = true;
      this.draggedNode = this.nodePressedForDrag;
    }

    if (this.isDraggingNode && this.draggedNode) {
      const transform = this.draggedNode.getComponent(TransformComponent);
      if (transform) {
        transform.x = mouseXPosition;
        transform.y = mouseYPosition;
        transform.vx = 0;
        transform.vy = 0;
      }
    }
  }

  handleMouseReleased() {
    if (this.isCreatingLink && this.linkStartNode && this.linkTargetNode) {
      this.createLink(this.linkStartNode, this.linkTargetNode);
    }
    this.cancelLinkCreation();
    this.network.setDragging(false);
    this.network.setDraggedNode(null);
    this.isDraggingNode = false;
    this.draggedNode = null;
  }

  getLinkTargetNode() { return this.linkTargetNode; }
  getLinkStartNode() { return this.linkStartNode; }
  isCreatingLinkMode() { return this.isCreatingLink; }

  handleKeyDown(e) {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (e.key === 'Delete' || e.key === 'Backspace') {
      this.deleteSelected();
    }

    if (e.key === 'Escape') {
      if (this.isCreatingLink) {
        this.cancelLinkCreation();
      } else {
        this.network.setSelectedNode(null);
        this.network.setSelectedLink(null);
      }
    }
  }

  deleteSelected() {
    const selected = this.network.getSelectedNode();
    const selectedLink = this.network.getSelectedLink();
    if (selected) {
      this.network.removeNode(selected);
    } else if (selectedLink) {
      this.network.removeLink(selectedLink);
    }
  }

  cancelLinkCreation() {
    this.isCreatingLink = false;
    this.linkStartNode = null;
    this.linkTargetNode = null;
  }

  getNodeAt(mouseXPosition, mouseYPosition) {
    for (const node of this.network.nodes) {
      const clickable = node.getComponent(ClickableComponent);
      if (clickable && clickable.contains(mouseXPosition, mouseYPosition)) return node;
    }
    return null;
  }

  getLinkAt(mouseXPosition, mouseYPosition) {
    for (const link of this.network.links) {
      const clickable = link.getComponent(LinkClickableComponent);
      if (clickable && clickable.contains(mouseXPosition, mouseYPosition)) return link;
    }
    return null;
  }

  createNode(x, y) {
    const id = this.network.nextNodeId;
    const node = new StandardNode(id, `Node ${id}`, 45, '#3498db', x, y);
    this.network.addNode(node);
    this.network.setSelectedNode(node);
    if (this.effectController) {
      this.effectController.addRipple(x, y);
    }
    const pulse = node.getComponent(PulseEffectComponent);
    if (pulse) pulse.trigger('#3498db', 45);
  }

  createLink(node1, node2) {
    const linkAlreadyExists = this.network.links.some(link => {
      const connectionComponent = link.getComponent(ConnectionComponent);
      if (!connectionComponent) return false;
      return (connectionComponent.source === node1 && connectionComponent.target === node2) ||
             (connectionComponent.source === node2 && connectionComponent.target === node1);
    });
    if (linkAlreadyExists) return;
    this.network.addLink(new SpringLink(this.network.nextLinkId, node1, node2, 100, 0.3, '#7f8c8d'));
  }
}
