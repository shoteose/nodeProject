class UIManager {
  constructor(networkManager) {
    this.networkManager = networkManager;
    this.sidebar = document.querySelector('.sidebar');
    this.toggleButton = document.getElementById('sidebar-toggle');
    this.hideClass = 'hide';
  }

  toggleSidebar() {
    if (!this.sidebar || !this.toggleButton) return;
    this.sidebar.classList.toggle(this.hideClass);
    const isHidden = this.sidebar.classList.contains(this.hideClass);
    this.toggleButton.textContent = isHidden ? 'Show Info' : 'Hide Info';
    // Update canvas position after layout change
    setTimeout(() => {
      if (typeof updateCanvasPosition === 'function') {
        updateCanvasPosition();
      }
    }, 0);
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
      lastNodeInfoData = null;
      display.innerHTML = '<strong>Nenhum nó selecionado</strong>';
      return;
    }

    const now = Date.now();
    if (now - lastNodeInfoUpdateAt < nodeInfoUpdateInterval) return;

    const active = document.activeElement;
    if (active && ['node-name', 'node-pos-x', 'node-pos-y', 'node-vx', 'node-vy', 'node-size', 'node-color'].includes(active.id)) {
   
      if (active.id !== 'node-color') return;
    }

    const transform = selected.getComponent(TransformComponent);
    const renderComp = selected.getComponent(RenderComponent);

    const currentData = {
      id: selected.id,
      name: renderComp ? renderComp.nome : '',
      x: transform ? parseFloat(transform.x.toFixed(1)) : 0,
      y: transform ? parseFloat(transform.y.toFixed(1)) : 0,
      vx: transform ? parseFloat(transform.vx.toFixed(2)) : 0,
      vy: transform ? parseFloat(transform.vy.toFixed(2)) : 0,
      size: renderComp ? parseFloat(renderComp.tamanho.toFixed(1)) : 0
    };

    if (lastNodeInfoData && lastNodeInfoData.id === currentData.id &&
      lastNodeInfoData.name === currentData.name &&
      lastNodeInfoData.x === currentData.x &&
      lastNodeInfoData.y === currentData.y &&
      lastNodeInfoData.vx === currentData.vx &&
      lastNodeInfoData.vy === currentData.vy &&
      lastNodeInfoData.size === currentData.size) {
      return;
    }

    lastNodeInfoData = currentData;
    lastNodeInfoUpdateAt = now;

    display.innerHTML = `
      <div><strong>ID:</strong> ${selected.id}</div>
      <div><strong>Nome:</strong> <input id="node-name" value="${renderComp ? renderComp.nome : ''}" oninput="setSelectedNodeName(this.value)"></div>
      <div><strong>Cor:</strong> <input id="node-color" type="color" value="${renderComp ? renderComp.cor : '#3498db'}" onchange="setSelectedNodeColor(this.value)"></div>
      <div>
        <strong>Posição X:</strong> 
        <input id="node-pos-x" type="number" value="${transform ? transform.x.toFixed(1) : 0}" step="0.1" onchange="setSelectedNodePosition(parseFloat(this.value), parseFloat(document.getElementById('node-pos-y').value))"> 

        <strong>Posição Y:</strong> 
        <input id="node-pos-y" type="number" value="${transform ? transform.y.toFixed(1) : 0}" step="0.1" onchange="setSelectedNodePosition(parseFloat(document.getElementById('node-pos-x').value), parseFloat(this.value))">
      </div>
      <div>
        <strong>Velocidade X:</strong> 
        <input id="node-vx" type="number" value="${transform ? transform.vx.toFixed(2) : 0}" step="0.1" onchange="setSelectedNodeVelocity(parseFloat(this.value), parseFloat(document.getElementById('node-vy').value))">  
        
        <strong>Velocidade Y:</strong> 
        <input id="node-vy" type="number" value="${transform ? transform.vy.toFixed(2) : 0}" step="0.1" onchange="setSelectedNodeVelocity(parseFloat(document.getElementById('node-vx').value), parseFloat(this.value))">
      </div>
      <div><strong>Tamanho:</strong> <input id="node-size" type="number" value="${renderComp ? renderComp.tamanho : 0}" step="0.5" onchange="setSelectedNodeSize(parseFloat(this.value))"></div>
    `;
  }
}
