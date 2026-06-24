let networkManager;
let physicsController;
let renderController;
let interactionController;
let uiManager;
let networkSerializer;
let effectController;

function getCanvasDimensions() {
  const gameArea = document.querySelector('.game-area');
  if (!gameArea) return { width: windowWidth, height: windowHeight };
  const rect = gameArea.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}

function setup() {
  const dims = getCanvasDimensions();
  const canvas = createCanvas(dims.width, dims.height);
  canvas.parent(document.querySelector('.game-area'));

  networkManager = new NetworkManager();
  renderController = new RenderController();
  effectController = new EffectController();
  physicsController = new PhysicsController(networkManager, effectController);
  interactionController = new InteractionController(networkManager, effectController);
  uiManager = new UIManager(networkManager);
  networkSerializer = new NetworkSerializer(networkManager, uiManager);

  document.addEventListener('contextmenu', e => e.preventDefault());

  const gameArea = document.querySelector('.game-area');
  if (gameArea) {
    new ResizeObserver(() => {
      const dims = getCanvasDimensions();
      resizeCanvas(dims.width, dims.height);
    }).observe(gameArea);
  }
}

function draw() {
  physicsController.update();
  renderController.clearBackground();

  effectController.update();
  effectController.draw();

  const selectedLink = networkManager.getSelectedLink();
  networkManager.links.forEach(link => link.draw(renderController, link === selectedLink));

  if (interactionController.isCreatingLinkMode() && interactionController.getLinkStartNode()) {
    renderController.drawLinkPreview(interactionController.getLinkStartNode(), mouseX, mouseY);
  }

  const selectedNode = networkManager.getSelectedNode();
  const linkTarget = interactionController.isCreatingLinkMode() ? interactionController.getLinkTargetNode() : null;
  networkManager.nodes.forEach(node => {
    node.draw(renderController, node === selectedNode, node === linkTarget);
  });

  uiManager.updateInspector();
  uiManager.updateNetworkStats();
}

// --- p5.js events ---
function mousePressed(event) {
  if (isMouseInCanvas() && interactionController) {
    const button = (mouseButton === 'left' || mouseButton === 0) ? 0 :
      (mouseButton === 'right' || mouseButton === 2) ? 2 : 1;
    const ctrlKey = event ? event.ctrlKey : false;
    interactionController.handleMousePressed(mouseX, mouseY, button, ctrlKey);
  }
}

function mouseDragged() {
  if (isMouseInCanvas() && interactionController) {
    interactionController.handleMouseDragged(mouseX, mouseY);
  }
}

function mouseReleased() {
  if (interactionController) interactionController.handleMouseReleased();
}

function windowResized() {
  const dims = getCanvasDimensions();
  resizeCanvas(dims.width, dims.height);
}

function isMouseInCanvas() {
  const canvas = document.querySelector('canvas');
  return canvas && mouseX >= 0 && mouseY >= 0 && mouseX <= width && mouseY <= height && window.event.target === canvas;
}

function saveConnectionsTxt() { networkSerializer.saveConnectionsTxt(); }
function saveConnectionsJson() { networkSerializer.saveConnectionsJson(); }
function loadConnections() { networkSerializer.loadConnections(); }
function clearNetwork() {
  networkManager.clearNetwork();
  uiManager.setConnectionStatus('Sem ações recentes');
}

function toggleSidebar() { uiManager.toggleSidebar(); }

function setSelectedNodeName(val) { uiManager.setSelectedNodeName(val); }
function setSelectedNodeSize(val) { uiManager.setSelectedNodeSize(val); }
function setSelectedNodeColor(val) { uiManager.setSelectedNodeColor(val); }
function setSelectedNodeGlow(val) { uiManager.setSelectedNodeGlow(val); }

function deselectNode() { if (networkManager) networkManager.setSelectedNode(null); }
function deleteSelectedNode() {
  interactionController.deleteSelected();
}

function deselectLink() { if (networkManager) networkManager.setSelectedLink(null); }
function deleteSelectedLink() {
  interactionController.deleteSelected();
}

function setSelectedLinkDistance(val) { uiManager.setSelectedLinkDistance(val); }
function setSelectedLinkForce(val) { uiManager.setSelectedLinkForce(val); }
function setSelectedLinkColor(val) { uiManager.setSelectedLinkColor(val); }

function setGlobalFriction(value) {
  if (networkManager) {
    networkManager.friction = parseFloat(value);
    const valueEl = document.getElementById('friction-value');
    if (valueEl) valueEl.textContent = parseFloat(value).toFixed(2);
  }
}
