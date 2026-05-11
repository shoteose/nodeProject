let networkManager;
let physicsController;
let renderController;
let interactionController;
let uiManager;

let lastNodeInfoData = null;
let lastNodeInfoUpdateAt = 0;
const nodeInfoUpdateInterval = 250;

function getCanvasDimensions() {
  const gameArea = document.querySelector('.game-area');
  if (!gameArea) return { width: windowWidth, height: windowHeight };
  const rect = gameArea.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}

function updateCanvasPosition() {
  const sidebar = document.querySelector('.sidebar');
  const isHidden = sidebar && sidebar.classList.contains('hide');
}

function setup() {
  console.log("=== SETUP STARTED ===");
  const dims = getCanvasDimensions();
  console.log("Creating canvas with dimensions:", dims.width, dims.height);
  createCanvas(dims.width, dims.height);
  console.log("Canvas created:", width, height);

  // Position the canvas
  const canvas = document.querySelector('canvas');
  if (canvas) {
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.zIndex = '10';
    updateCanvasPosition();
  }

  networkManager = new NetworkManager();
  console.log("NetworkManager created");
  
  renderController = new RenderController();
  console.log("RenderController created");
  
  physicsController = new PhysicsController(networkManager);
  console.log("PhysicsController created");
  
  interactionController = new InteractionController(networkManager);
  console.log("InteractionController created");
  
  uiManager = new UIManager(networkManager);
  console.log("UIManager created");

  document.addEventListener('contextmenu', function(e) {
    // this will block the  menu of the right button to open
    console.log("Context menu prevented");
    e.preventDefault();
    return false;
  });
}

let frameCount = 0;

function draw() {
  frameCount++;
  
  physicsController.update();

  renderController.clearBackground();
  
  networkManager.links.forEach(link => link.draw(renderController));
  
  // Draw link creation preview
  if (interactionController.isCreatingLinkMode() && interactionController.getLinkStartNode()) {
    renderController.drawLinkPreview(interactionController.getLinkStartNode(), mouseX, mouseY);
  }

  // Draw force vector preview
  if (interactionController.isApplyingForceMode() && interactionController.getForceNode()) {
    let drag = interactionController.getForceDrag();
    renderController.drawForcePreview(interactionController.getForceNode(), drag.x, drag.y);
  }
  
  networkManager.nodes.forEach(node => {
    const selected = networkManager.getSelectedNode();
    const isSelected = selected ? node.id === selected.id : false;
    const isLinkTarget = interactionController.isCreatingLinkMode() && 
                        interactionController.getLinkTargetNode() && 
                        node.id === interactionController.getLinkTargetNode().id;
    node.draw(renderController, isSelected, isLinkTarget);
  });

  uiManager.updateSelectedNodeInfo();
}

function mousePressed() {
  // Only handle mousePressed if click is inside the canvas
  const canvas = document.querySelector('canvas');
  if (!canvas){
    return;
  }

  const rect = canvas.getBoundingClientRect();
  // Use p5 mouseX/mouseY relative to canvas
  if (
    mouseX >= 0 && mouseY >= 0 &&
    mouseX <= width && mouseY <= height &&
    window.event && window.event.target === canvas
  ) {
    // Convert p5.js mouseButton to our expected format
    let button = 0; // default to left
    if (mouseButton === 'left' || mouseButton === 0) button = 0;
    else if (mouseButton === 'right' || mouseButton === 2) button = 2;
    else if (mouseButton === 'center' || mouseButton === 1) button = 1;

    if (interactionController) {
      interactionController.handleMousePressed(mouseX, mouseY, button);
    }
  }
}

function mouseDragged() {

   const canvas = document.querySelector('canvas');
  if (!canvas){
    return;
  }

  const rect = canvas.getBoundingClientRect();
  // Use p5 mouseX/mouseY relative to canvas
  if (
    mouseX >= 0 && mouseY >= 0 &&
    mouseX <= width && mouseY <= height &&
    window.event && window.event.target === canvas
    && interactionController
  ) {
    interactionController.handleMouseDragged(mouseX, mouseY);
    console.log("Drag handled successfully");
  } else {
    console.log("ERROR: interactionController is not defined!");
  }
}

function mouseReleased() {
  if (interactionController) {
    interactionController.handleMouseReleased();
    console.log("Release handled successfully");
  } else {
    console.log("ERROR: interactionController is not defined!");
  }
}


function updateSelectedNodeInfo() {
  const display = document.getElementById('selected-node-info');
  const selected = networkManager.getSelectedNode();
  if (!display) return;

  if (!selected) {
    lastNodeInfoData = null;
    display.innerHTML = '<strong>No node selected</strong>';
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
    return;
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
  try {
    const data = serializeNetwork();
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'network.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (status) status.textContent = 'Network saved successfully';
  } catch (error) {
    console.error('Save failed:', error);
    if (status) status.textContent = 'Save failed: ' + error.message;
  }
}

function loadConnections() {
  const status = document.getElementById('connection-status');
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.txt';
  input.onchange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          deserializeNetwork(data);
          if (status) status.textContent = 'Network loaded successfully';
        } catch (error) {
          console.error('Load failed:', error);
          if (status) status.textContent = 'Load failed: ' + error.message;
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
}

function serializeNetwork() {
  const version = '1.0';
  let data = version + '\n';

  // Nodes
  data += networkManager.nodes.length + '\n';
  for (const node of networkManager.nodes) {
    const transform = node.getComponent(TransformComponent);
    const render = node.getComponent(RenderComponent);
    if (transform && render) {
      data += `${node.id};${render.nome};${render.tamanho}\n`;
    }
  }

  // Links
  data += networkManager.links.length + '\n';
  for (const link of networkManager.links) {
    data += `${link.source.id};${link.target.id};${link.distancia};${link.forca}\n`;
  }

  return data;
}

function deserializeNetwork(data) {
  const lines = data.trim().split('\n');
  let lineIndex = 0;

  // Skip version for now
  lineIndex++;

  // Clear existing network
  networkManager.nodes = [];
  networkManager.links = [];
  networkManager.selectedNode = null;

  // Read nodes
  const nodeCount = parseInt(lines[lineIndex++]);
  for (let i = 0; i < nodeCount; i++) {
    const [id, nome, tamanho] = lines[lineIndex++].split(';');
    const node = new StandardNode(parseInt(id), nome, parseFloat(tamanho), '#3498db', random(width), random(height));
    networkManager.addNode(node);
  }

  // Read links
  const linkCount = parseInt(lines[lineIndex++]);
  for (let i = 0; i < linkCount; i++) {
    const [id1, id2, distancia, forca] = lines[lineIndex++].split(';');
    const source = networkManager.getNodeById(parseInt(id1));
    const target = networkManager.getNodeById(parseInt(id2));
    if (source && target) {
      const link = new SpringLink(source, target, parseFloat(distancia), parseFloat(forca), '#7f8c8d');
      networkManager.addLink(link);
    }
  }
}

function setSelectedNodeName(name) {
  const selected = networkManager.getSelectedNode();
  if (!selected)
  {
    return;
  }
  const render = selected.getComponent(RenderComponent);
  if (render) render.nome = name;
}

function setSelectedNodePosition(x, y) {
  const selected = networkManager.getSelectedNode();
  if (!selected)
  {
    return;
  }
  const transform = selected.getComponent(TransformComponent);
  if (transform) {
    transform.x = x;
    transform.y = y;
  }
}

function setSelectedNodeVelocity(vx, vy) {
  const selected = networkManager.getSelectedNode();
  if (!selected)
  {
    return;
  }
  const transform = selected.getComponent(TransformComponent);
  if (transform) {
    transform.vx = vx;
    transform.vy = vy;
  }
}

function setSelectedNodeSize(size) {
  const selected = networkManager.getSelectedNode();
  if (!selected)
  {
    return;
  }
  const render = selected.getComponent(RenderComponent);
  if (render) render.tamanho = size;
}

function setSelectedNodeColor(color) {
  const selected = networkManager.getSelectedNode();
  if (!selected)
{
    return;
}
  const render = selected.getComponent(RenderComponent);
  if (render) render.cor = color;
}

function setForceMultiplier(value) {
  if (interactionController) {
    interactionController.forceMultiplier = value;
  }
  const display = document.getElementById('force-multiplier-value');
  if (display) display.textContent = value.toFixed(1);
}

function toggleSidebar() {
  if (uiManager) uiManager.toggleSidebar();
}

function keyPressed() {
  // Handle keyboard input here

  if(key !=='Escape' || keyCode !== 27) {
    return;
  }

  networkManager.setSelectedNode(null);

  console.log("Key pressed:", key, "keyCode:", keyCode);
}


function windowResized() {
  const dims = getCanvasDimensions();
  resizeCanvas(dims.width, dims.height);
  updateCanvasPosition();
}