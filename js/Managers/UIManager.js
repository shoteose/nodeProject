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
    status.className = 'alert py-2 px-3 mb-4 text-center';
    if (type === 'success') status.classList.add('alert-success');
    else if (type === 'error') status.classList.add('alert-danger');
    else status.classList.add('alert-secondary', 'border-secondary', 'text-light');
  }

  updateNetworkStats() {
    const nodeEl = document.getElementById('stat-nodes');
    const linkEl = document.getElementById('stat-links');
    if (nodeEl) nodeEl.textContent = this.networkManager.nodes.length;
    if (linkEl) linkEl.textContent = this.networkManager.links.length;
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
      if (display) display.innerHTML = '<p class="m-0 text-center">Nenhum selecionado</p>';
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

    const currentData = {
      type: 'node',
      id: selected.id,
      name: renderComp ? renderComp.nome : '',
      x: transform ? parseFloat(transform.x.toFixed(1)) : 0,
      y: transform ? parseFloat(transform.y.toFixed(1)) : 0,
      size: renderComp ? parseFloat(renderComp.tamanho.toFixed(1)) : 0
    };

    if (this.lastInspectorData &&
      this.lastInspectorData.type === 'node' &&
      this.lastInspectorData.id === currentData.id &&
      this.lastInspectorData.name === currentData.name &&
      this.lastInspectorData.x === currentData.x &&
      this.lastInspectorData.y === currentData.y &&
      this.lastInspectorData.size === currentData.size) return;

    this.lastInspectorData = currentData;
    this.lastInspectorUpdateAt = now;

    display.innerHTML = `
      <div class="mb-3 border-bottom border-secondary pb-2">
        <span class="badge bg-primary">ID: ${selected.id}</span>
      </div>
      <div class="mb-2">
        <label class="form-label text-light small mb-1">Nome:</label>
        <input id="node-name" class="form-control form-control-sm bg-dark text-light border-secondary" value="${renderComp ? renderComp.nome : ''}" oninput="setSelectedNodeName(this.value)">
      </div>
      <div class="mb-2">
        <label class="form-label text-light small mb-1">Cor:</label>
        <input id="node-color" type="color" class="form-control form-control-color form-control-sm w-100 bg-dark border-secondary p-1" value="${renderComp ? renderComp.cor : '#3498db'}" onchange="setSelectedNodeColor(this.value)">
      </div>
      <div class="row g-2 mb-2">
        <div class="col-6">
          <label class="form-label text-light small mb-1">Pos. X:</label>
          <input class="form-control form-control-sm bg-dark text-light border-secondary opacity-50" value="${transform ? transform.x.toFixed(1) : 0}" readonly>
        </div>
        <div class="col-6">
          <label class="form-label text-light small mb-1">Pos. Y:</label>
          <input class="form-control form-control-sm bg-dark text-light border-secondary opacity-50" value="${transform ? transform.y.toFixed(1) : 0}" readonly>
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label text-light small mb-1">Tamanho:</label>
        <input id="node-size" type="number" class="form-control form-control-sm bg-dark text-light border-secondary" value="${renderComp ? renderComp.tamanho : 0}" step="0.5" onchange="setSelectedNodeSize(parseFloat(this.value))">
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

    const currentData = {
      type: 'link',
      srcId: link.source.id,
      tgtId: link.target.id,
      distance: link.distancia,
      force: link.forca,
      color: link.cor
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

    const srcRender = link.source.getComponent(RenderComponent);
    const tgtRender = link.target.getComponent(RenderComponent);
    const srcName = srcRender ? srcRender.nome : `#${link.source.id}`;
    const tgtName = tgtRender ? tgtRender.nome : `#${link.target.id}`;

    display.innerHTML = `
      <div class="mb-3 border-bottom border-secondary pb-2">
        <span class="badge bg-warning text-dark">Ligação</span>
      </div>
      <div class="mb-2">
        <label class="form-label text-light small mb-1">De → Para:</label>
        <input class="form-control form-control-sm bg-dark text-light border-secondary opacity-50" value="${srcName} → ${tgtName}" readonly>
      </div>
      <div class="mb-2">
        <label class="form-label text-light small mb-1">Distância:</label>
        <input id="link-distance" type="number" class="form-control form-control-sm bg-dark text-light border-secondary" value="${link.distancia}" step="5" onchange="setSelectedLinkDistance(parseFloat(this.value))">
      </div>
      <div class="mb-2">
        <label class="form-label text-light small mb-1">Força:</label>
        <input id="link-force" type="number" class="form-control form-control-sm bg-dark text-light border-secondary" value="${link.forca}" step="0.05" min="0.01" max="2" onchange="setSelectedLinkForce(parseFloat(this.value))">
      </div>
      <div class="mb-3">
        <label class="form-label text-light small mb-1">Cor:</label>
        <input id="link-color" type="color" class="form-control form-control-color form-control-sm w-100 bg-dark border-secondary p-1" value="${link.cor}" onchange="setSelectedLinkColor(this.value)">
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

  // Link setters
  setSelectedLinkDistance(value) {
    const link = this.networkManager.getSelectedLink();
    if (link) link.distancia = value;
  }

  setSelectedLinkForce(value) {
    const link = this.networkManager.getSelectedLink();
    if (link) link.forca = value;
  }

  setSelectedLinkColor(value) {
    const link = this.networkManager.getSelectedLink();
    if (link) link.cor = value;
  }
}
