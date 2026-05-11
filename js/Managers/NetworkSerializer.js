class NetworkSerializer {
  constructor(networkManager, uiManager) {
    this.networkManager = networkManager;
    this.uiManager = uiManager;
  }

  saveConnections() {
    try {
      const data = this.serializeNetwork();
      const blob = new Blob([data], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'network.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      this.uiManager.setConnectionStatus('Network guardada com sucesso');
    } catch (error) {
      console.error('Erro a guardar:', error);
      this.uiManager.setConnectionStatus('Erro a guardar: ' + error.message);
    }
  }

  loadConnections() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            this.deserializeNetwork(e.target.result);
            this.uiManager.setConnectionStatus('Network carregada com sucesso');
          } catch (error) {
            console.error('Erro a carregar:', error);
            this.uiManager.setConnectionStatus('Erro a carregar: ' + error.message);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  serializeNetwork() {
    const version = '1.0';
    let data = version + '\n';
    data += this.networkManager.friction + '\n';

    // Nodes
    data += this.networkManager.nodes.length + '\n';
    for (const node of this.networkManager.nodes) {
      const transform = node.getComponent(TransformComponent);
      const render = node.getComponent(RenderComponent);
      if (transform && render) {
        data += `${node.id};${render.nome};${render.tamanho};${render.cor};${transform.x};${transform.y}\n`;
      }
    }

    // Links
    data += this.networkManager.links.length + '\n';
    for (const link of this.networkManager.links) {
      data += `${link.source.id};${link.target.id};${link.distancia};${link.forca}\n`;
    }

    return data;
  }

  deserializeNetwork(data) {
    const lines = data.trim().split('\n');
    let lineIndex = 0;
    const version = lines[lineIndex++];
    const friction = parseFloat(lines[lineIndex++]);
    this.networkManager.friction = friction;
    this.uiManager.updateFrictionSlider();

    // Clear existing network
    this.networkManager.nodes = [];
    this.networkManager.links = [];
    this.networkManager.selectedNode = null;

    // Read nodes
    const nodeCount = parseInt(lines[lineIndex++]);
    for (let i = 0; i < nodeCount; i++) {
      const [id, nome, tamanho, cor, x, y] = lines[lineIndex++].split(';');
      const node = new StandardNode(parseInt(id), nome, parseFloat(tamanho), cor, parseFloat(x), parseFloat(y));
      this.networkManager.addNode(node);
    }

    // Read links
    const linkCount = parseInt(lines[lineIndex++]);
    for (let i = 0; i < linkCount; i++) {
      const [id1, id2, distancia, forca] = lines[lineIndex++].split(';');
      const source = this.networkManager.getNodeById(parseInt(id1));
      const target = this.networkManager.getNodeById(parseInt(id2));
      if (source && target) {
        const link = new SpringLink(source, target, parseFloat(distancia), parseFloat(forca), '#7f8c8d');
        this.networkManager.addLink(link);
      }
    }
  }
}