class NetworkSerializer {
  constructor(networkManager, uiManager) {
    this.networkManager = networkManager;
    this.uiManager = uiManager;
  }

  // ── Save ────────────────────────────────────────────────

  saveConnectionsTxt() {
    this.networkManager.saveVersion++;
    this.download(this.serializeTxt(), 'network.txt', 'text/plain');
    this.uiManager.setConnectionStatus(`Network guardada (TXT) v${this.networkManager.saveVersion}`, 'success');
  }

  saveConnectionsJson() {
    this.networkManager.saveVersion++;
    this.download(this.serializeJson(), 'network.json', 'application/json');
    this.uiManager.setConnectionStatus(`Network guardada (JSON) v${this.networkManager.saveVersion}`, 'success');
  }

  // ── Load ────────────────────────────────────────────────

  loadConnections() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.txt';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          this.deserializeNetwork(e.target.result);
          this.uiManager.setConnectionStatus('Network carregada com sucesso', 'success');
        } catch (error) {
          console.error('Erro a carregar:', error);
          this.uiManager.setConnectionStatus('Erro: ' + error.message, 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  // ── Serialize ───────────────────────────────────────────

  serializeTxt() {
    const networkManager = this.networkManager;
    let data = networkManager.saveVersion + '\n';
    data += networkManager.friction + '\n';
    data += networkManager.nodes.length + '\n';
    for (const node of networkManager.nodes) {
      const transformComponent = node.getComponent(TransformComponent);
      const renderComponent = node.getComponent(RenderComponent);
      const glowEffectComponent = node.getComponent(GlowEffectComponent);
      if (transformComponent && renderComponent) data += `${node.id};${renderComponent.nome};${renderComponent.tamanho};${renderComponent.cor};${transformComponent.x};${transformComponent.y};${glowEffectComponent && glowEffectComponent.enabled ? 1 : 0}\n`;
    }
    data += networkManager.links.length + '\n';
    for (const link of networkManager.links) {
      const connectionComponent = link.getComponent(ConnectionComponent);
      const springPhysicsComponent = link.getComponent(SpringPhysicsComponent);
      if (connectionComponent && springPhysicsComponent) data += `${connectionComponent.source.id};${connectionComponent.target.id};${springPhysicsComponent.distancia};${springPhysicsComponent.forca}\n`;
    }
    return data;
  }

  serializeJson() {
    const networkManager = this.networkManager;
    const nodes = networkManager.nodes.map(node => {
      const transformComponent = node.getComponent(TransformComponent);
      const renderComponent = node.getComponent(RenderComponent);
      const glowEffectComponent = node.getComponent(GlowEffectComponent);
      return { id: node.id, name: renderComponent.nome, size: renderComponent.tamanho, color: renderComponent.cor, x: transformComponent.x, y: transformComponent.y, glow: glowEffectComponent ? glowEffectComponent.enabled : false };
    });

    const links = networkManager.links.map(link => {
      const connectionComponent = link.getComponent(ConnectionComponent);
      const springPhysicsComponent = link.getComponent(SpringPhysicsComponent);
      const springRenderComponent = link.getComponent(SpringRenderComponent);
      return {
        sourceId: connectionComponent.source.id,
        targetId: connectionComponent.target.id,
        distance: springPhysicsComponent.distancia,
        force: springPhysicsComponent.forca,
        color: springRenderComponent.cor
      };

    });
    
    const payload = {
      state: {
        friction: networkManager.friction,
        nextNodeId: networkManager.nextNodeId,
        saveVersion: networkManager.saveVersion
      },
      nodes,
      links
    };
    return JSON.stringify(payload, null, 2);
  }

  // ── Deserialize ─────────────────────────────────────────

  deserializeNetwork(text) {
    const trimmed = text.trim();
    if (trimmed.startsWith('{')) {
      this.parseJson(JSON.parse(trimmed));
    } else {
      this.parseTxt(trimmed.split('\n'));
    }
  }

  parseTxt(lines) {
    let i = 0;
    const saveVersion = parseInt(lines[i++]);
    const friction = parseFloat(lines[i++]);
    this.resetNetwork(friction);
    this.networkManager.saveVersion = saveVersion;

    const nodeCount = parseInt(lines[i++]);
    for (let n = 0; n < nodeCount; n++) {
      const parts = lines[i++].split(';');
      if (parts.length < 6) throw new Error('Formato inválido: linha de node incompleta');
      const [id, name, size, color, x, y, glowFlag] = parts;
      const node = new StandardNode(parseInt(id), name, parseFloat(size), color, parseFloat(x), parseFloat(y));
      if (glowFlag === '1') {
        const glowEffectComponent = node.getComponent(GlowEffectComponent);
        if (glowEffectComponent) glowEffectComponent.enabled = true;
      }
      this.networkManager.addNode(node);
    }

    const linkCount = parseInt(lines[i++]);
    for (let n = 0; n < linkCount; n++) {
      const parts = lines[i++].split(';');
      if (parts.length < 4) throw new Error('Formato inválido: linha de ligação incompleta');
      const [id1, id2, distancia, forca] = parts;
      const source = this.networkManager.getNodeById(parseInt(id1));
      const target = this.networkManager.getNodeById(parseInt(id2));
      if (source && target) {
        this.networkManager.addLink(new SpringLink(this.networkManager.nextLinkId, source, target, parseFloat(distancia), parseFloat(forca), '#7f8c8d'));
      }
    }
  }

  parseJson(obj) {
    if (!obj.state || !Array.isArray(obj.nodes) || !Array.isArray(obj.links))
      throw new Error('JSON inválido: campos obrigatórios em falta (state, nodes, links)');

    this.resetNetwork(obj.state.friction);

    if (obj.state.nextNodeId != null) {
      this.networkManager.nextNodeId = obj.state.nextNodeId;
    }
    if (obj.state.saveVersion != null) {
      this.networkManager.saveVersion = obj.state.saveVersion;
    }

    for (const n of obj.nodes) {
      const nodeData = n;
      const node = new StandardNode(nodeData.id, nodeData.name, nodeData.size, nodeData.color, nodeData.x, nodeData.y);
      if (nodeData.glow) {
        const glowEffectComponent = node.getComponent(GlowEffectComponent);
        if (glowEffectComponent) glowEffectComponent.enabled = true;
      }
      this.networkManager.addNode(node);
    }

    for (const linkData of obj.links) {
      const source = this.networkManager.getNodeById(linkData.sourceId);
      const target = this.networkManager.getNodeById(linkData.targetId);
      if (source && target) {
        this.networkManager.addLink(new SpringLink(this.networkManager.nextLinkId, source, target, linkData.distance, linkData.force, linkData.color || '#7f8c8d'));
      }
    }
  }

  resetNetwork(friction) {
    this.networkManager.clearNetwork();
    this.networkManager.friction = friction;
    this.uiManager.updateFrictionSlider();
  }

  download(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
