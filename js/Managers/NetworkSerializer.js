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
    const nm = this.networkManager;
    let data = '1.1\n';
    data += nm.saveVersion + '\n';
    data += nm.friction + '\n';
    data += nm.nodes.length + '\n';
    for (const node of nm.nodes) {
      const t = node.getComponent(TransformComponent);
      const r = node.getComponent(RenderComponent);
      if (t && r) data += `${node.id};${r.nome};${r.tamanho};${r.cor};${t.x};${t.y}\n`;
    }
    data += nm.links.length + '\n';
    for (const link of nm.links) {
      data += `${link.source.id};${link.target.id};${link.distancia};${link.forca}\n`;
    }
    return data;
  }

  serializeJson() {
    const nm = this.networkManager;
    const nodes = nm.nodes.map(node => {
      const t = node.getComponent(TransformComponent);
      const r = node.getComponent(RenderComponent);
      return { id: node.id, name: r.nome, size: r.tamanho, color: r.cor, x: t.x, y: t.y };
    });
    const links = nm.links.map(link => ({
      sourceId: link.source.id,
      targetId: link.target.id,
      distance: link.distancia,
      force: link.forca,
      color: link.cor
    }));
    const payload = {
      version: '2.0',
      state: {
        friction: nm.friction,
        nextNodeId: nm.nextNodeId,
        saveVersion: nm.saveVersion
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
      this.parseV2(JSON.parse(trimmed));
    } else {
      this.parseV1(trimmed.split('\n'));
    }
  }

  parseV1(lines) {
    let i = 0;
    const version = lines[i++];
    if (version !== '1.0' && version !== '1.1') throw new Error(`Versão TXT não suportada: ${version}`);

    let saveVersion = 0;
    if (version === '1.1') saveVersion = parseInt(lines[i++]);

    const friction = parseFloat(lines[i++]);
    this.resetNetwork(friction);
    this.networkManager.saveVersion = saveVersion;

    const nodeCount = parseInt(lines[i++]);
    for (let n = 0; n < nodeCount; n++) {
      const parts = lines[i++].split(';');
      if (parts.length < 6) throw new Error('Formato inválido: linha de node incompleta');
      const [id, nome, tamanho, cor, x, y] = parts;
      const node = new StandardNode(parseInt(id), nome, parseFloat(tamanho), cor, parseFloat(x), parseFloat(y));
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
        this.networkManager.addLink(new SpringLink(source, target, parseFloat(distancia), parseFloat(forca), '#7f8c8d'));
      }
    }
  }

  parseV2(obj) {
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
      const node = new StandardNode(n.id, n.name, n.size, n.color, n.x, n.y);
      this.networkManager.addNode(node);
    }

    for (const l of obj.links) {
      const source = this.networkManager.getNodeById(l.sourceId);
      const target = this.networkManager.getNodeById(l.targetId);
      if (source && target) {
        this.networkManager.addLink(new SpringLink(source, target, l.distance, l.force, l.color || '#7f8c8d'));
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
