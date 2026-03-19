let networkManager;
let physicsController;
let renderController;
let interactionController;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  networkManager = new NetworkManager();
  renderController = new RenderController();
  physicsController = new PhysicsController(networkManager);
  interactionController = new InteractionController(networkManager);

  injetarDadosMock(networkManager);
}

function draw() {
  physicsController.update();

  renderController.clearBackground();
  
  networkManager.links.forEach(link => link.draw(renderController));
  
  networkManager.nodes.forEach(node => {
    let isSelected = (node === networkManager.getSelectedNode());
    node.draw(renderController, isSelected);
  });
}

function mousePressed() {
  interactionController.handleMousePressed(mouseX, mouseY);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function injetarDadosMock(manager) {
  manager.addNode(new StandardNode(1, "A", 30, "#e74c3c", random(width), random(height)));
  manager.addNode(new StandardNode(2, "B", 40, "#e74c3c", random(width), random(height)));
  manager.addNode(new StandardNode(3, "C", 40, "#e74c3c", random(width), random(height)));
  manager.addNode(new StandardNode(4, "D", 40, "#e74c3c", random(width), random(height)));

  manager.addLink(new SpringLink(manager.getNodeById(1), manager.getNodeById(2), 100, 0.3, "#7f8c8d"));
  manager.addLink(new SpringLink(manager.getNodeById(1), manager.getNodeById(3), 140, 0.4, "#7f8c8d"));
  manager.addLink(new SpringLink(manager.getNodeById(2), manager.getNodeById(3), 300, 0.5, "#7f8c8d"));
  manager.addLink(new SpringLink(manager.getNodeById(3), manager.getNodeById(4), 100, 0.5, "#7f8c8d"));

  manager.setSelectedNode(manager.getNodeById(3));
}