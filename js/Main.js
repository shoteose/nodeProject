let networkManager;
let physicsController;
let renderController;
let interactionController;
let uiManager;
let networkSerializer;

function getCanvasDimensions() {
  const gameArea = document.querySelector('.game-area');
  if (!gameArea) return { width: windowWidth, height: windowHeight };
  const rect = gameArea.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}

function updateCanvasPosition() {
}

function setup() {
  const dims = getCanvasDimensions();

  let canvas = createCanvas(dims.width, dims.height);
  canvas.parent(document.querySelector('.game-area'));

  networkManager = new NetworkManager();
  renderController = new RenderController();
  physicsController = new PhysicsController(networkManager);
  interactionController = new InteractionController(networkManager);
  uiManager = new UIManager(networkManager);
  networkSerializer = new NetworkSerializer(networkManager, uiManager);

  document.addEventListener('contextmenu', e => e.preventDefault());
}

function draw() {
  physicsController.update();
  renderController.clearBackground();

  networkManager.links.forEach(link => link.draw(renderController));

  if (interactionController.isCreatingLinkMode() && interactionController.getLinkStartNode()) {
    renderController.drawLinkPreview(interactionController.getLinkStartNode(), mouseX, mouseY);
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

// --- EVENTOS P5.JS ---
function mousePressed(event) {
  if (isMouseInCanvas() && interactionController) {
    let button = (mouseButton === 'left' || mouseButton === 0) ? 0 :
      (mouseButton === 'right' || mouseButton === 2) ? 2 : 1;
    let ctrlKey = event ? event.ctrlKey : false;
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
  updateCanvasPosition();
}

function isMouseInCanvas() {
  const canvas = document.querySelector('canvas');
  return canvas && mouseX >= 0 && mouseY >= 0 && mouseX <= width && mouseY <= height && window.event.target === canvas;
}

function saveConnections() {
  networkSerializer.saveConnections();
}

function loadConnections() {
  networkSerializer.loadConnections();
}

function toggleSidebar() {
  uiManager.toggleSidebar();
}

function setSelectedNodeName(val) {
  uiManager.setSelectedNodeName(val);
}

function setSelectedNodeSize(val) {
  uiManager.setSelectedNodeSize(val);
}

function setSelectedNodeColor(val) {
  uiManager.setSelectedNodeColor(val);
}

function deselectNode() {
  if (networkManager) {
    networkManager.setSelectedNode(null);
  }
}

function deleteSelectedNode() {
  const selected = networkManager.getSelectedNode();
  if (selected) {
    networkManager.removeNode(selected);
  }
}

function setGlobalFriction(value) {
  if (networkManager) {
    networkManager.friction = parseFloat(value);
  }
}