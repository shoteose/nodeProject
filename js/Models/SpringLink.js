class SpringLink extends IEntity {
  constructor(id, sourceNode, targetNode, distancia, forca, cor) {
    super(id);
    this.addComponent(new ConnectionComponent(sourceNode, targetNode));
    this.addComponent(new SpringPhysicsComponent(distancia, forca));
    this.addComponent(new SpringRenderComponent(cor));
    this.addComponent(new TensionEffectComponent());
  }
}
