class UIManager {
  constructor(networkManager) {
    this.networkManager = networkManager;
    this.lastInspectorData = null;
    this.lastInspectorUpdateAt = 0;
    this.inspectorUpdateInterval = 250;
  }

  getInspectorDisplay() {
    return document.getElementById('selected-node-info');
  }

  shouldThrottleInspectorUpdate() {
    const currentTime = Date.now();
    return currentTime - this.lastInspectorUpdateAt < this.inspectorUpdateInterval;
  }

  isEditingInspectorField(blockedFieldIds, allowedFieldId = null) {
    const activeElement = document.activeElement;
    if (!activeElement || !blockedFieldIds.includes(activeElement.id)) return false;
    return activeElement.id !== allowedFieldId;
  }

  isSameInspectorData(currentData) {
    const previousData = this.lastInspectorData;
    if (!previousData || previousData.type !== currentData.type) return false;

    const currentKeys = Object.keys(currentData);
    if (currentKeys.length !== Object.keys(previousData).length) return false;

    return currentKeys.every((key) => previousData[key] === currentData[key]);
  }

  applyInspectorUpdate(display, currentData, html) {
    this.lastInspectorData = currentData;
    this.lastInspectorUpdateAt = Date.now();
    display.innerHTML = html;
  }

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainArea = document.getElementById('game-main');
    const btnOpen = document.getElementById('sidebar-toggle-open');
    if (!sidebar || !mainArea) return;

    sidebar.classList.toggle('d-none');
    const isHidden = sidebar.classList.contains('d-none');

    if (isHidden) {
      mainArea.classList.remove('col-md-9', 'col-lg-10');
      mainArea.classList.add('col-12');
      btnOpen.classList.remove('d-none');
    } else {
      mainArea.classList.add('col-md-9', 'col-lg-10');
      mainArea.classList.remove('col-12');
      btnOpen.classList.add('d-none');
    }

  }

  setConnectionStatus(message, type = 'info') {
    const status = document.getElementById('connection-status');
    if (!status) return;
    status.textContent = message;
    status.className = 'py-1 px-2 mb-3 text-center rounded border border-secondary bg-dark';
    status.style.fontSize = '0.78rem';
    if (type === 'success') status.classList.add('text-success');
    else if (type === 'error') status.classList.add('text-danger');
    else status.classList.add('text-secondary');
  }

  updateNetworkStats() {
    const nodeEl = document.getElementById('stat-nodes');
    const linkEl = document.getElementById('stat-links');
    const verEl = document.getElementById('stat-version');
    if (nodeEl) nodeEl.textContent = this.networkManager.nodes.length;
    if (linkEl) linkEl.textContent = this.networkManager.links.length;
    if (verEl) verEl.textContent = this.networkManager.saveVersion;
  }

  updateFrictionSlider() {
    const slider = document.getElementById('friction-slider');
    const valueEl = document.getElementById('friction-value');
    if (slider) slider.value = this.networkManager.friction;
    if (valueEl) valueEl.textContent = parseFloat(this.networkManager.friction).toFixed(2);
  }

  updateInspector() {
    const selectedLink = this.networkManager.getSelectedLink();
    const selectedNode = this.networkManager.getSelectedNode();

    if (selectedLink) {
      this.showLinkInspector(selectedLink);
    } else if (selectedNode) {
      this.showNodeInspector(selectedNode);
    } else {
      this.showEmptyInspector();
    }
  }

  showEmptyInspector() {
    if (this.lastInspectorData !== null) {
      this.lastInspectorData = null;
      const display = this.getInspectorDisplay();
      if (display) display.innerHTML = '<p class="m-0 text-center text-secondary small">Nenhum selecionado</p>';
    }
  }

  showNodeInspector(selected) {
    const display = this.getInspectorDisplay();
    if (!display) return;
    if (this.shouldThrottleInspectorUpdate()) return;
    if (this.isEditingInspectorField(['node-name', 'node-size', 'node-color'], 'node-color')) return;

    const transform = selected.getComponent(TransformComponent);
    const renderComponent = selected.getComponent(RenderComponent);
    const glowEffectComponent = selected.getComponent(GlowEffectComponent);

    const currentData = {
      type: 'node',
      id: selected.id,
      name: renderComponent ? renderComponent.nome : '',
      x: transform ? parseFloat(transform.x.toFixed(1)) : 0,
      y: transform ? parseFloat(transform.y.toFixed(1)) : 0,
      size: renderComponent ? parseFloat(renderComponent.tamanho.toFixed(1)) : 0,
      glow: glowEffectComponent ? glowEffectComponent.enabled : false
    };

    if (this.isSameInspectorData(currentData)) return;

    const html = `
      <div class="mb-3 border-bottom border-secondary pb-2">
        <span class="badge bg-primary">ID: ${selected.id}</span>
      </div>
      <div class="mb-2">
        <label class="form-label text-light small mb-1" for="node-name">Nome:</label>
        <input id="node-name" name="node-name" class="form-control form-control-sm bg-dark text-light border-secondary" value="${renderComponent ? renderComponent.nome : ''}" oninput="setSelectedNodeName(this.value)">
      </div>
      <div class="mb-2">
        <label class="form-label text-light small mb-1" for="node-color">Cor:</label>
        <input id="node-color" name="node-color" type="color" class="form-control form-control-color form-control-sm w-100 bg-dark border-secondary p-1" value="${renderComponent ? renderComponent.cor : '#3498db'}" onchange="setSelectedNodeColor(this.value)">
      </div>
      <div class="row g-2 mb-2">
        <div class="col-6">
          <label class="form-label text-light small mb-1" for="node-pos-x">Pos. X:</label>
          <input id="node-pos-x" class="form-control form-control-sm bg-dark text-light border-secondary opacity-50" value="${transform ? transform.x.toFixed(1) : 0}" readonly>
        </div>
        <div class="col-6">
          <label class="form-label text-light small mb-1" for="node-pos-y">Pos. Y:</label>
          <input id="node-pos-y" class="form-control form-control-sm bg-dark text-light border-secondary opacity-50" value="${transform ? transform.y.toFixed(1) : 0}" readonly>
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label text-light small mb-1" for="node-size">Tamanho:</label>
        <input id="node-size" name="node-size" type="number" class="form-control form-control-sm bg-dark text-light border-secondary" value="${renderComponent ? renderComponent.tamanho : 0}" step="0.5" onchange="setSelectedNodeSize(parseFloat(this.value))">
      </div>
      <div class="mb-3 d-flex align-items-center gap-2">
        <input type="checkbox" class="form-check-input bg-dark border-secondary" id="node-glow"
          ${glowEffectComponent && glowEffectComponent.enabled ? 'checked' : ''}
          onchange="setSelectedNodeGlow(this.checked)">
        <label class="form-check-label text-light small" for="node-glow">Glow</label>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-warning btn-sm w-50" onclick="deselectNode()">Deselecionar</button>
        <button class="btn btn-outline-danger btn-sm w-50" onclick="deleteSelectedNode()">Eliminar</button>
      </div>
    `;

    this.applyInspectorUpdate(display, currentData, html);
  }

  showLinkInspector(link) {
    const display = this.getInspectorDisplay();
    if (!display) return;
    if (this.shouldThrottleInspectorUpdate()) return;
    if (this.isEditingInspectorField(['link-distance', 'link-force', 'link-color'])) return;

    const connectionComponent = link.getComponent(ConnectionComponent);
    const springPhysicsComponent = link.getComponent(SpringPhysicsComponent);
    const springRenderComponent = link.getComponent(SpringRenderComponent);
    const currentData = {
      type: 'link',
      srcId: connectionComponent?.source.id,
      tgtId: connectionComponent?.target.id,
      distance: springPhysicsComponent?.distancia,
      force: springPhysicsComponent?.forca,
      color: springRenderComponent?.cor
    };

    if (this.isSameInspectorData(currentData)) return;

    const sourceRenderComponent = connectionComponent?.source.getComponent(RenderComponent);
    const targetRenderComponent = connectionComponent?.target.getComponent(RenderComponent);
    const sourceName = sourceRenderComponent ? sourceRenderComponent.nome : `#${connectionComponent?.source.id}`;
    const targetName = targetRenderComponent ? targetRenderComponent.nome : `#${connectionComponent?.target.id}`;

    const html = `
      <div class="mb-3 border-bottom border-secondary pb-2">
        <span class="badge bg-warning text-dark">Ligação</span>
      </div>
      <div class="mb-2">
        <label class="form-label text-light small mb-1" for="link-endpoints">De -> Para:</label>
        <input id="link-endpoints" class="form-control form-control-sm bg-dark text-light border-secondary opacity-50" value="${sourceName} -> ${targetName}" readonly>
      </div>
      <div class="mb-2">
        <label class="form-label text-light small mb-1" for="link-distance">Distância:</label>
        <input id="link-distance" name="link-distance" type="number" class="form-control form-control-sm bg-dark text-light border-secondary" value="${currentData.distance}" step="5" onchange="setSelectedLinkDistance(parseFloat(this.value))">
      </div>
      <div class="mb-2">
        <label class="form-label text-light small mb-1" for="link-force">Força:</label>
        <input id="link-force" name="link-force" type="number" class="form-control form-control-sm bg-dark text-light border-secondary" value="${currentData.force}" step="0.05" min="0.01" max="2" onchange="setSelectedLinkForce(parseFloat(this.value))">
      </div>
      <div class="mb-3">
        <label class="form-label text-light small mb-1" for="link-color">Cor:</label>
        <input id="link-color" name="link-color" type="color" class="form-control form-control-color form-control-sm w-100 bg-dark border-secondary p-1" value="${currentData.color}" onchange="setSelectedLinkColor(this.value)">
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-warning btn-sm w-50" onclick="deselectLink()">Deselecionar</button>
        <button class="btn btn-outline-danger btn-sm w-50" onclick="deleteSelectedLink()">Eliminar</button>
      </div>
    `;

    this.applyInspectorUpdate(display, currentData, html);
  }

  // Node setters
  setSelectedNodeName(name) {
    const selected = this.networkManager.getSelectedNode();
    if (selected) {
      const render = selected.getComponent(RenderComponent);
      if (render) render.nome = name;
    }
  }

  setSelectedNodeSize(size) {
    const selected = this.networkManager.getSelectedNode();
    if (selected) {
      const render = selected.getComponent(RenderComponent);
      if (render) render.tamanho = size;
    }
  }

  setSelectedNodeColor(color) {
    const selected = this.networkManager.getSelectedNode();
    if (selected) {
      const render = selected.getComponent(RenderComponent);
      if (render) render.cor = color;
    }
  }

  setSelectedNodeGlow(val) {
    const selected = this.networkManager.getSelectedNode();
    if (selected) {
      const glow = selected.getComponent(GlowEffectComponent);
      if (glow) glow.enabled = val;
    }
  }

  // Link setters
  setSelectedLinkDistance(value) {
    const springPhysicsComponent = this.networkManager.getSelectedLink()?.getComponent(SpringPhysicsComponent);
    if (springPhysicsComponent) springPhysicsComponent.distancia = value;
  }

  setSelectedLinkForce(value) {
    const springPhysicsComponent = this.networkManager.getSelectedLink()?.getComponent(SpringPhysicsComponent);
    if (springPhysicsComponent) springPhysicsComponent.forca = value;
  }

  setSelectedLinkColor(value) {
    const springRenderComponent = this.networkManager.getSelectedLink()?.getComponent(SpringRenderComponent);
    if (springRenderComponent) springRenderComponent.cor = value;
  }
}
