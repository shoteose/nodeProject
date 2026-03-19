let networkManager;
let physicsController;
let renderController;
let interactionController;
let uiManager;

let lastNodeInfoData = null;
let lastNodeInfoUpdateAt = 0;
const nodeInfoUpdateInterval = 250;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  networkManager = new NetworkManager();
  renderController = new RenderController();
  physicsController = new PhysicsController(networkManager);
  interactionController = new InteractionController(networkManager);
  uiManager = new UIManager(networkManager);

  injetarDadosMock(networkManager);
}

function draw() {
  physicsController.update();

  renderController.clearBackground();
  
  networkManager.links.forEach(link => link.draw(renderController));
  
  networkManager.nodes.forEach(node => {
    const selected = networkManager.getSelectedNode();
    let isSelected = selected ? node.id === selected.id : false;
    node.draw(renderController, isSelected);
  });

  uiManager.updateSelectedNodeInfo();
}

function updateSelectedNodeInfo() {
  const display = document.getElementById('selected-node-info');
  const selected = networkManager.getSelectedNode();
  if (!display) return;

  if (!selected) {
    lastNodeInfoData = null;
    display.innerHTML = '<strong>Nenhum nó selecionado</strong>';
    return;
  }

  const now = Date.now();
  if (now - lastNodeInfoUpdateAt < nodeInfoUpdateInterval) return;

  const active = document.activeElement;
  if (active && ['node-name', 'node-pos-x', 'node-pos-y', 'node-vx', 'node-vy', 'node-size'].includes(active.id)) {
    return; 
  }

  const transform = selected.getComponent(TransformComponent);
  const render = selected.getComponent(RenderComponent);

  const currentData = {
    id: selected.id,
    name: render ? render.nome : '',
    x: transform ? parseFloat(transform.x.toFixed(1)) : 0,
    y: transform ? parseFloat(transform.y.toFixed(1)) : 0,
    vx: transform ? parseFloat(transform.vx.toFixed(2)) : 0,
    vy: transform ? parseFloat(transform.vy.toFixed(2)) : 0,
    size: render ? parseFloat(render.tamanho.toFixed(1)) : 0
  };

  if (lastNodeInfoData && lastNodeInfoData.id === currentData.id &&
      lastNodeInfoData.name === currentData.name &&
      lastNodeInfoData.x === currentData.x &&
      lastNodeInfoData.y === currentData.y &&
      lastNodeInfoData.vx === currentData.vx &&
      lastNodeInfoData.vy === currentData.vy &&
      lastNodeInfoData.size === currentData.size) {
    return; // buffered no change
  }

  lastNodeInfoData = currentData;
  lastNodeInfoUpdateAt = now;

  display.innerHTML = `
    <div><strong>ID:</strong> ${selected.id}</div>
    <div><strong>Nome:</strong> <input id="node-name" value="${render ? render.nome : ''}" oninput="setSelectedNodeName(this.value)"></div>
    <div><strong>Posição:</strong> 
      <input id="node-pos-x" type="number" value="${transform ? transform.x.toFixed(1) : 0}" step="0.1" onchange="setSelectedNodePosition(parseFloat(this.value), parseFloat(document.getElementById('node-pos-y').value))"> , 
      <input id="node-pos-y" type="number" value="${transform ? transform.y.toFixed(1) : 0}" step="0.1" onchange="setSelectedNodePosition(parseFloat(document.getElementById('node-pos-x').value), parseFloat(this.value))">
    </div>
    <div><strong>Velocidade:</strong> 
      <input id="node-vx" type="number" value="${transform ? transform.vx.toFixed(2) : 0}" step="0.1" onchange="setSelectedNodeVelocity(parseFloat(this.value), parseFloat(document.getElementById('node-vy').value))"> , 
      <input id="node-vy" type="number" value="${transform ? transform.vy.toFixed(2) : 0}" step="0.1" onchange="setSelectedNodeVelocity(parseFloat(document.getElementById('node-vx').value), parseFloat(this.value))">
    </div>
    <div><strong>Tamanho:</strong> <input id="node-size" type="number" value="${render ? render.tamanho : 0}" step="0.5" onchange="setSelectedNodeSize(parseFloat(this.value))"></div>
  `;
}

function saveConnections() {
  const status = document.getElementById('connection-status');
  console.log('Save connections (mock)');
  if (status) status.textContent = 'Saving connections (mock)';
}

function loadConnections() {
  const status = document.getElementById('connection-status');
  console.log('Load connections (mock)');
  if (status) status.textContent = 'Loading connections (mock)';
}

function setSelectedNodeName(name) {
  const selected = networkManager.getSelectedNode();
  if (!selected) return;
  const render = selected.getComponent(RenderComponent);
  if (render) render.nome = name;
}

function setSelectedNodePosition(x, y) {
  const selected = networkManager.getSelectedNode();
  if (!selected) return;
  const transform = selected.getComponent(TransformComponent);
  if (transform) {
    transform.x = x;
    transform.y = y;
  }
}

function setSelectedNodeVelocity(vx, vy) {
  const selected = networkManager.getSelectedNode();
  if (!selected) return;
  const transform = selected.getComponent(TransformComponent);
  if (transform) {
    transform.vx = vx;
    transform.vy = vy;
  }
}

function setSelectedNodeSize(size) {
  const selected = networkManager.getSelectedNode();
  if (!selected) return;
  const render = selected.getComponent(RenderComponent);
  if (render) render.tamanho = size;
}


function toggleSidebar() {
  if (uiManager) uiManager.toggleSidebar();
}

function mousePressed() {
  interactionController.handleMousePressed(mouseX, mouseY);
}

function mouseDragged() {
  interactionController.handleMouseDragged(mouseX, mouseY);
}

function mouseReleased() {
  interactionController.handleMouseReleased();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function injetarDadosMock(manager) {
  manager.addNode(new StandardNode(1, "1", 30, "#e74c3c", random(width), random(height)));
  manager.addNode(new StandardNode(2, "2", 40, "#e74c3c", random(width), random(height)));
  manager.addNode(new StandardNode(3, "3", 40, "#e74c3c", random(width), random(height)));
  manager.addNode(new StandardNode(4, "4", 40, "#e74c3c", random(width), random(height)));

  manager.addLink(new SpringLink(manager.getNodeById(1), manager.getNodeById(2), 100, 0.3, "#7f8c8d"));
  manager.addLink(new SpringLink(manager.getNodeById(1), manager.getNodeById(3), 140, 0.4, "#7f8c8d"));
  manager.addLink(new SpringLink(manager.getNodeById(2), manager.getNodeById(3), 300, 0.5, "#7f8c8d"));
  manager.addLink(new SpringLink(manager.getNodeById(3), manager.getNodeById(4), 100, 0.5, "#7f8c8d"));

  manager.setSelectedNode(manager.getNodeById(3));
}