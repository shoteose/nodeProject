class UIManager {
  constructor(networkManager) {
    this.networkManager = networkManager;
    this.lastInspectorData = null;
    this.lastInspectorUpdateAt = 0;
    this.inspectorUpdateInterval = 250;
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
      const display = document.getElementById('selected-node-info');
      if (display) display.innerHTML = '<p class="m-0 text-center text-secondary small">Nenhum selecionado</p>';
    }
  }

  showNodeInspector(selected) {
    const display = document.getElementById('selected-node-info');
    if (!display) return;

    const now = Date.now();
    if (now - this.lastInspectorUpdateAt < this.inspectorUpdateInterval) return;

    const active = document.activeElement;
    if (active && ['node-name', 'node-size', 'node-color'].includes(active.id)) {
      if (active.id !== 'node-color') return;
    }

    const transform = selected.getComponent(TransformComponent);
    const renderComp = selected.getComponent(RenderComponent);
    const glowComp = selected.getComponent(GlowEffectComponent);

    const currentData = {
      type: 'node',
      id: selected.id,
      name: renderComp ? renderComp.nome : '',
      x: transform ? parseFloat(transform.x.toFixed(1)) : 0,
      y: transform ? parseFloat(transform.y.toFixed(1)) : 0,
      size: renderComp ? parseFloat(renderComp.tamanho.toFixed(1)) : 0,
      glow: glowComp ? glowComp.enabled : false
    };

    if (this.lastInspectorData &&
      this.lastInspectorData.type === 'node' &&
      this.lastInspectorData.id === currentData.id &&
      this.lastInspectorData.name === currentData.name &&
      this.lastInspectorData.x === currentData.x &&
      this.lastInspectorData.y === currentData.y &&
      this.lastInspectorData.size === currentData.size &&
      this.lastInspectorData.glow === currentData.glow) return;

    this.lastInspectorData = currentData;
    this.lastInspectorUpdateAt = now;

    display.innerHTML = `
      <div class="mb-3 border-bottom border-secondary pb-2">
        <span class="badge bg-primary">ID: ${selected.id}</span>
      </div>
      <div class="mb-2">
        <label class="form-label text-light small mb-1" for="node-name">Nome:</label>
        <input id="node-name" name="node-name" class="form-control form-control-sm bg-dark text-light border-secondary" value="${renderComp ? renderComp.nome : ''}" oninput="setSelectedNodeName(this.value)">
      </div>
      <div class="mb-2">
        <label class="form-label text-light small mb-1" for="node-color">Cor:</label>
        <input id="node-color" name="node-color" type="color" class="form-control form-control-color form-control-sm w-100 bg-dark border-secondary p-1" value="${renderComp ? renderComp.cor : '#3498db'}" onchange="setSelectedNodeColor(this.value)">
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
        <input id="node-size" name="node-size" type="number" class="form-control form-control-sm bg-dark text-light border-secondary" value="${renderComp ? renderComp.tamanho : 0}" step="0.5" onchange="setSelectedNodeSize(parseFloat(this.value))">
      </div>
      <div class="mb-3 d-flex align-items-center gap-2">
        <input type="checkbox" class="form-check-input bg-dark border-secondary" id="node-glow"
          ${glowComp && glowComp.enabled ? 'checked' : ''}
          onchange="setSelectedNodeGlow(this.checked)">
        <label class="form-check-label text-light small" for="node-glow">Glow</label>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-warning btn-sm w-50" onclick="deselectNode()">Deselecionar</button>
        <button class="btn btn-outline-danger btn-sm w-50" onclick="deleteSelectedNode()">Eliminar</button>
      </div>
    `;
  }

  showLinkInspector(link) {
    const display = document.getElementById('selected-node-info');
    if (!display) return;

    const now = Date.now();
    if (now - this.lastInspectorUpdateAt < this.inspectorUpdateInterval) return;

    const active = document.activeElement;
    if (active && ['link-distance', 'link-force', 'link-color'].includes(active.id)) return;

    const conn = link.getComponent(ConnectionComponent);
    const phys = link.getComponent(SpringPhysicsComponent);
    const rend = link.getComponent(SpringRenderComponent);
    const currentData = {
      type: 'link',
      srcId: conn?.source.id,
      tgtId: conn?.target.id,
      distance: phys?.distancia,
      force: phys?.forca,
      color: rend?.cor
    };

    if (this.lastInspectorData &&
      this.lastInspectorData.type === 'link' &&
      this.lastInspectorData.srcId === currentData.srcId &&
      this.lastInspectorData.tgtId === currentData.tgtId &&
      this.lastInspectorData.distance === currentData.distance &&
      this.lastInspectorData.force === currentData.force &&
      this.lastInspectorData.color === currentData.color) return;

    this.lastInspectorData = currentData;
    this.lastInspectorUpdateAt = now;

    const srcRender = conn?.source.getComponent(RenderComponent);
    const tgtRender = conn?.target.getComponent(RenderComponent);
    const srcName = srcRender ? srcRender.nome : `#${conn?.source.id}`;
    const tgtName = tgtRender ? tgtRender.nome : `#${conn?.target.id}`;

    display.innerHTML = `
      <div class="mb-3 border-bottom border-secondary pb-2">
        <span class="badge bg-warning text-dark">Ligação</span>
      </div>
      <div class="mb-2">
        <label class="form-label text-light small mb-1" for="link-endpoints">De -> Para:</label>
        <input id="link-endpoints" class="form-control form-control-sm bg-dark text-light border-secondary opacity-50" value="${srcName} -> ${tgtName}" readonly>
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
    const phys = this.networkManager.getSelectedLink()?.getComponent(SpringPhysicsComponent);
    if (phys) phys.distancia = value;
  }

  setSelectedLinkForce(value) {
    const phys = this.networkManager.getSelectedLink()?.getComponent(SpringPhysicsComponent);
    if (phys) phys.forca = value;
  }

  setSelectedLinkColor(value) {
    const rend = this.networkManager.getSelectedLink()?.getComponent(SpringRenderComponent);
    if (rend) rend.cor = value;
  }
}
