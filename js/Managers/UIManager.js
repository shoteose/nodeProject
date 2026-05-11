class UIManager {
  constructor(networkManager) {
    this.networkManager = networkManager;
    this.sidebar = document.querySelector('.sidebar');
    this.toggleButton = document.getElementById('sidebar-toggle');
    this.hideClass = 'hide';

    this.lastNodeInfoData = null;
    this.lastNodeInfoUpdateAt = 0;
    this.nodeInfoUpdateInterval = 250;
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

    setTimeout(() => {
      if (typeof windowResized === 'function') {
        windowResized();
      }
    }, 50);
  }

  setConnectionStatus(message) {
    const status = document.getElementById('connection-status');
    if (status) status.textContent = message;
  }

  updateSelectedNodeInfo() {
    const display = document.getElementById('selected-node-info');
    const selected = this.networkManager.getSelectedNode();
    if (!display) return;

    if (!selected) {
      this.lastNodeInfoData = null;
      display.innerHTML = '<p class=" m-0 text-center">Nenhum Node selecionado</p>';
      return;
    }


    const now = Date.now();
    if (now - this.lastNodeInfoUpdateAt < this.nodeInfoUpdateInterval) return;

    const active = document.activeElement;
    if (active && ['node-name', 'node-size', 'node-color'].includes(active.id)) {
      if (active.id !== 'node-color') return;
    }

    const transform = selected.getComponent(TransformComponent);
    const renderComp = selected.getComponent(RenderComponent);

    const currentData = {
      id: selected.id,
      name: renderComp ? renderComp.nome : '',
      x: transform ? parseFloat(transform.x.toFixed(1)) : 0,
      y: transform ? parseFloat(transform.y.toFixed(1)) : 0,
      size: renderComp ? parseFloat(renderComp.tamanho.toFixed(1)) : 0
    };

    if (this.lastNodeInfoData && this.lastNodeInfoData.id === currentData.id &&
      this.lastNodeInfoData.name === currentData.name &&
      this.lastNodeInfoData.x === currentData.x &&
      this.lastNodeInfoData.y === currentData.y &&
      this.lastNodeInfoData.vx === currentData.vx &&
      this.lastNodeInfoData.vy === currentData.vy &&
      this.lastNodeInfoData.size === currentData.size) {
      return;
    }

    this.lastNodeInfoData = currentData;
    this.lastNodeInfoUpdateAt = now;

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

      <div class="mb-3 border-secondary">
        <label class="form-label text-light small mb-1">Tamanho:</label>
        <input id="node-size" type="number" class="form-control form-control-sm bg-dark text-light border-secondary" value="${renderComp ? renderComp.tamanho : 0}" step="0.5" onchange="setSelectedNodeSize(parseFloat(this.value))">
      </div>
      
      <div class="d-flex gap-2 border-secondary">
        <button class="btn btn-outline-warning btn-sm w-50" onclick="deselectNode()">Deselecionar</button>
        <button class="btn btn-outline-danger btn-sm w-50" onclick="deleteSelectedNode()">Eliminar Node</button>
      </div>
    `;
  }

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

  updateFrictionSlider() {
    const slider = document.getElementById('friction-slider');
    if (slider) {
      slider.value = this.networkManager.friction;
    }
  }
}
