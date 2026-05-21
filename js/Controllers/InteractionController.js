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

  handleMousePressed(mx, my, button, ctrlKey = false) {
    const clickedNode = this.getNodeAt(mx, my);

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
        }
      } else {
        const clickedLink = this.getLinkAt(mx, my);
        if (clickedLink) {
          this.network.setSelectedLink(clickedLink);
        } else {
          this.network.setSelectedNode(null);
          this.network.setSelectedLink(null);
          this.createNode(mx, my);
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

  handleMouseDragged(mx, my) {
    if (this.isCreatingLink && this.linkStartNode) {
      this.linkTargetNode = null;
      for (const node of this.network.nodes) {
        if (node !== this.linkStartNode) {
          const clickable = node.getComponent(ClickableComponent);
          if (clickable && clickable.contains(mx, my)) {
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
        transform.x = mx;
        transform.y = my;
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
      const selected = this.network.getSelectedNode();
      const selectedLink = this.network.getSelectedLink();
      if (selected) {
        this.burstNode(selected);
        this.network.removeNode(selected);
      } else if (selectedLink) {
        this.network.removeLink(selectedLink);
      }
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

  cancelLinkCreation() {
    this.isCreatingLink = false;
    this.linkStartNode = null;
    this.linkTargetNode = null;
  }

  getNodeAt(mx, my) {
    for (const node of this.network.nodes) {
      const clickable = node.getComponent(ClickableComponent);
      if (clickable && clickable.contains(mx, my)) return node;
    }
    return null;
  }

  getLinkAt(mx, my) {
    for (const link of this.network.links) {
      const t1 = link.source.getComponent(TransformComponent);
      const t2 = link.target.getComponent(TransformComponent);
      if (t1 && t2 && this.pointToSegmentDist(mx, my, t1.x, t1.y, t2.x, t2.y) < 8) {
        return link;
      }
    }
    return null;
  }

  pointToSegmentDist(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return Math.hypot(px - x1, py - y1);
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  }

  createNode(x, y) {
    const id = this.network.nextNodeId;
    const node = new StandardNode(id, `Node ${id}`, 45, '#3498db', x, y);
    this.network.addNode(node);
    this.network.setSelectedNode(node);
    if (this.effectController) this.effectController.addBurst(x, y, '#3498db');
  }

  createLink(node1, node2) {
    const exists = this.network.links.some(l =>
      (l.source === node1 && l.target === node2) ||
      (l.source === node2 && l.target === node1)
    );
    if (exists) return;
    this.network.addLink(new SpringLink(node1, node2, 100, 0.3, '#7f8c8d'));
  }

  burstNode(node) {
    if (!this.effectController) return;
    const t = node.getComponent(TransformComponent);
    const r = node.getComponent(RenderComponent);
    if (t && r) this.effectController.addBurst(t.x, t.y, r.cor, 18);
  }
}
