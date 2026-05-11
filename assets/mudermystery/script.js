/*
 * Script to power The Black Codicil murder mystery dashboard.
 * Loads JSON data files and renders sections with dynamic behaviour.
 */

(() => {
  let hostMode = false;
  let data = {};
  const dataBase = 'assets/mudermystery/data';
  const toggleBtn = document.getElementById('toggleMode');
  const body = document.body;
  const navLinks = document.querySelectorAll('.nav-link');

  // Section elements
  const sections = {
    overview: document.getElementById('overview'),
    characters: document.getElementById('characters'),
    relationships: document.getElementById('relationships'),
    acts: document.getElementById('acts'),
    locations: document.getElementById('locations'),
    plot: document.getElementById('plot'),
    props: document.getElementById('props'),
    speeches: document.getElementById('speeches'),
    actors: document.getElementById('actors'),
    handouts: document.getElementById('handouts'),
    hostnotes: document.getElementById('hostnotes')
  };

  // Fetch all JSON files
  async function loadData() {
    const files = [
      'characters.json',
      'relationships.json',
      'acts.json',
      'locations.json',
      'plot-hooks.json',
      'props.json',
      'speeches.json',
      'actor-instructions.json',
      'handouts.json',
      'host-notes.json'
    ];
    const keys = [
      'characters', 'relationships', 'acts', 'locations',
      'plotHooks', 'props', 'speeches', 'actors', 'handouts', 'hostnotes'
    ];

    async function fetchJson(file) {
      const response = await fetch(`${dataBase}/${file}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${file}: ${response.status} ${response.statusText}`);
      }
      return response.json();
    }

    const results = await Promise.all(files.map(fetchJson));
    results.forEach((json, i) => {
      data[keys[i]] = json[keys[i]] || json[keys[i] + 's'] || json[keys[i]] || Object.values(json)[0];
    });
  }

  // Mode toggling
  function toggleHostMode() {
    hostMode = !hostMode;
    if (hostMode) {
      body.classList.add('host-mode');
      toggleBtn.textContent = 'Switch to Player Mode';
    } else {
      body.classList.remove('host-mode');
      toggleBtn.textContent = 'Switch to Host Mode';
    }
    // re-render sections that depend on mode
    renderOverview();
    renderPlotHooks();
    renderProps();
    renderActors();
    renderHostNotes();
  }

  // Navigation handling
  function setupNavigation() {
    navLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        // update active class
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        // show/hide sections
        Object.keys(sections).forEach(id => {
          sections[id].classList.add('hidden');
        });
        sections[targetId].classList.remove('hidden');
      });
    });
  }

  // Render Overview
  function renderOverview() {
    const container = document.getElementById('overviewContent');
    const intro = document.createElement('div');
    intro.className = 'card';
    const p1 = document.createElement('p');
    p1.textContent = 'J. Baroo, patriarch of the Baroo family, has died. Ten guests assemble for dinner before the formal reading of his will. The Executor holds a sealed Black Envelope containing a codicil. After dinner, a staged blackout knocks everyone out. When they wake, the Executor is dead, the envelope is missing and the dining wing is locked.';
    const p2 = document.createElement('p');
    p2.textContent = 'Players must investigate the murder, search the manor and grounds, decipher the bell signal, and confront one another. The truth will be revealed when the real codicil is found and the murderer is exposed.';
    intro.appendChild(p1);
    intro.appendChild(p2);
    if (hostMode) {
      const spoiler = document.createElement('div');
      spoiler.className = 'spoiler';
      spoiler.innerHTML = '<strong>Host:</strong> The Director is the killer. He murdered the Executor during the blackout, stole the real envelope, hid it in the Blind Judge statue and planted a fake envelope outside to mislead the guests.';
      intro.appendChild(spoiler);
    }
    container.innerHTML = '';
    container.appendChild(intro);
  }

  // Render Characters
  function renderCharacters() {
    const list = document.getElementById('characterList');
    const details = document.getElementById('characterDetails');
    list.innerHTML = '';
    details.innerHTML = '<p>Select a character to view details.</p>';
    data.characters.forEach(char => {
      const card = document.createElement('div');
      card.className = 'character-card';
      card.textContent = char.name;
      card.addEventListener('click', () => {
        showCharacterDetails(char);
      });
      list.appendChild(card);
    });

    function showCharacterDetails(char) {
      details.innerHTML = '';
      const heading = document.createElement('h3');
      heading.textContent = char.name;
      details.appendChild(heading);
      // tabs
      const tabBar = document.createElement('div');
      tabBar.className = 'tabs';
      const tabs = ['Public Profile', 'Private Motives', 'Relationships', 'Act Objectives', 'Clues'];
      let currentTab = 0;
      const content = document.createElement('div');
      content.className = 'tab-content';

      tabs.forEach((t, idx) => {
        const btn = document.createElement('button');
        btn.className = 'tab-btn' + (idx === 0 ? ' active' : '');
        btn.textContent = t;
        btn.addEventListener('click', () => {
          currentTab = idx;
          tabBar.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          updateContent();
        });
        tabBar.appendChild(btn);
      });
      details.appendChild(tabBar);
      details.appendChild(content);

      function updateContent() {
        content.innerHTML = '';
        const p = document.createElement('p');
        if (currentTab === 0) {
          // Public Profile
          p.innerHTML = `<strong>Role:</strong> ${char.publicRole}<br><strong>Bio:</strong> ${char.publicBio}<br><strong>Personality:</strong> ${char.personality}`;
        } else if (currentTab === 1) {
          // Private Motives
          p.innerHTML = `<strong>Bio:</strong> ${char.privateBio}<br><strong>Secret pressure:</strong> ${char.secretPressure}<br><strong>Wants:</strong> ${char.wants}<br><strong>Fears:</strong> ${char.fears}<br><strong>Red herring:</strong> ${char.redHerring}`;
        } else if (currentTab === 2) {
          // Relationships
          const out = data.relationships.filter(r => r.from === char.id);
          const incoming = data.relationships.filter(r => r.to === char.id);
          const listEl = document.createElement('div');
          const outList = document.createElement('ul');
          outList.innerHTML = '<strong>Outgoing:</strong>';
          out.forEach(rel => {
            const li = document.createElement('li');
            const target = data.characters.find(c => c.id === rel.to);
            li.textContent = `${char.name} → ${target.name}: ${rel.category}`;
            li.title = rel.text;
            outList.appendChild(li);
          });
          const inList = document.createElement('ul');
          inList.innerHTML = '<strong>Incoming:</strong>';
          incoming.forEach(rel => {
            const source = data.characters.find(c => c.id === rel.from);
            const li = document.createElement('li');
            li.textContent = `${source.name} → ${char.name}: ${rel.category}`;
            li.title = rel.text;
            inList.appendChild(li);
          });
          listEl.appendChild(outList);
          listEl.appendChild(inList);
          content.appendChild(listEl);
          return;
        } else if (currentTab === 3) {
          // Act Objectives
          const listEl = document.createElement('ul');
          listEl.innerHTML = '<strong>Objectives by act:</strong>';
          Object.keys(char.actObjectives).forEach(actId => {
            const actObj = document.createElement('li');
            const act = data.acts.find(a => a.id === actId);
            actObj.textContent = `${act ? act.title : actId}: ${char.actObjectives[actId]}`;
            listEl.appendChild(actObj);
          });
          content.appendChild(listEl);
          return;
        } else if (currentTab === 4) {
          // Clues
          const listEl = document.createElement('ul');
          listEl.innerHTML = '<strong>Associated clues:</strong>';
          char.clues.forEach(c => {
            const li = document.createElement('li');
            li.textContent = c;
            listEl.appendChild(li);
          });
          content.appendChild(listEl);
          return;
        }
        content.appendChild(p);
      }
      updateContent();
    }
  }

  // Relationship graph functions
  function renderGraph() {
    const svg = document.getElementById('relationshipGraph');
    const info = document.getElementById('graphInfo');
    const showAllBtn = document.getElementById('showAllRelations');
    const clearBtn = document.getElementById('clearFocus');

    const W = 1800;
    const H = 1800;
    const cx = W / 2;
    const cy = H / 2;
    const ringR = 675;
    const nodeR = 88;
    const chars = data.characters;
    const relationships = data.relationships;
    const pos = {};
    let focusId = null;

    // Clean previous content
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    // Define markers for arrowheads
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const categories = ['positive', 'negative', 'aware', 'unknown'];
    const colours = {
      positive: getComputedStyle(document.documentElement).getPropertyValue('--positive').trim(),
      negative: getComputedStyle(document.documentElement).getPropertyValue('--negative').trim(),
      aware: getComputedStyle(document.documentElement).getPropertyValue('--aware').trim(),
      unknown: getComputedStyle(document.documentElement).getPropertyValue('--unknown').trim()
    };
    categories.forEach(cat => {
      const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
      marker.setAttribute('id', `arrow-${cat}`);
      marker.setAttribute('markerWidth', '12');
      marker.setAttribute('markerHeight', '12');
      marker.setAttribute('refX', '10');
      marker.setAttribute('refY', '4');
      marker.setAttribute('orient', 'auto');
      marker.setAttribute('markerUnits', 'strokeWidth');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M0,0 L0,8 L11,4 z');
      path.setAttribute('fill', colours[cat]);
      marker.appendChild(path);
      defs.appendChild(marker);
    });
    svg.appendChild(defs);

    function polarPoint(i, n) {
      const angle = -Math.PI / 2 + i * 2 * Math.PI / n;
      return { x: cx + ringR * Math.cos(angle), y: cy + ringR * Math.sin(angle) };
    }
    chars.forEach((c, i) => {
      pos[c.id] = polarPoint(i, chars.length);
    });

    function edgePath(from, to) {
      const a = pos[from];
      const b = pos[to];
      const i = chars.findIndex(c => c.id === from);
      const j = chars.findIndex(c => c.id === to);
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy);
      const ux = dx / d;
      const uy = dy / d;
      const start = { x: a.x + ux * (nodeR + 14), y: a.y + uy * (nodeR + 14) };
      const end = { x: b.x - ux * (nodeR + 22), y: b.y - uy * (nodeR + 22) };
      const nx = -uy;
      const ny = ux;
      const rawGap = Math.abs(i - j);
      const span = Math.min(rawGap, chars.length - rawGap);
      const baseBySpan = {1: 92, 2: 128, 3: 164, 4: 200, 5: 236};
      const base = baseBySpan[span] || 150;
      const low = Math.min(i, j);
      const high = Math.max(i, j);
      const nudge = ((low * 37 + high * 19) % 31) - 15;
      const curve = base + nudge;
      const mx = (start.x + end.x) / 2;
      const my = (start.y + end.y) / 2;
      const qx = mx + nx * curve;
      const qy = my + ny * curve;
      return `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} Q ${qx.toFixed(1)} ${qy.toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}`;
    }

    function nameOf(id) {
      const c = chars.find(x => x.id === id);
      return c ? c.name : id;
    }

    function draw() {
      // Remove existing edges and nodes
      svg.querySelectorAll('.edge, .node, .node-label').forEach(el => el.remove());
      relationships.forEach(rel => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', edgePath(rel.from, rel.to));
        path.setAttribute('class', `edge ${rel.category}${focusId && rel.from !== focusId ? ' dimmed' : ''}${focusId && rel.from === focusId ? ' highlight' : ''}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-width', focusId && rel.from === focusId ? '5.4' : '2.3');
        path.setAttribute('opacity', focusId && rel.from !== focusId ? '0.08' : '0.62');
        path.setAttribute('stroke', colours[rel.category]);
        path.setAttribute('marker-end', `url(#arrow-${rel.category})`);
        // Tooltip
        path.addEventListener('mouseenter', () => {
          path.classList.add('highlight');
          info.innerHTML = `<strong>${nameOf(rel.from)} → ${nameOf(rel.to)}: ${rel.category.charAt(0).toUpperCase() + rel.category.slice(1)}</strong><br>${rel.text}`;
        });
        path.addEventListener('mouseleave', () => {
          path.classList.remove('highlight');
          info.textContent = focusId ? `Focused on ${nameOf(focusId)} outgoing relationships.` : 'Hover over a line to read the directional relationship. Click a character to focus its outgoing arrows.';
        });
        svg.appendChild(path);
      });
      // Nodes
      chars.forEach((c, i) => {
        const p = pos[c.id];
        const node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        node.setAttribute('cx', p.x);
        node.setAttribute('cy', p.y);
        node.setAttribute('r', nodeR);
        node.setAttribute('class', `node ${c.group}${focusId === c.id ? ' selected' : ''}`);
        node.setAttribute('stroke', '#222');
        node.setAttribute('stroke-width', focusId === c.id ? '6' : '2');
        node.setAttribute('fill', c.group === 'family' ? getComputedStyle(document.documentElement).getPropertyValue('--family').trim() : getComputedStyle(document.documentElement).getPropertyValue('--compatriot').trim());
        node.addEventListener('click', () => {
          if (focusId === c.id) {
            focusId = null;
          } else {
            focusId = c.id;
          }
          draw();
        });
        svg.appendChild(node);
        // Label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', p.x);
        label.setAttribute('y', p.y);
        label.setAttribute('class', 'node-label');
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('dominant-baseline', 'middle');
        const parts = c.name.split(' / ');
        if (parts.length > 1) {
          label.textContent = c.name; // one line; fallback if slash
        } else {
          label.textContent = c.name;
        }
        label.style.pointerEvents = 'none';
        svg.appendChild(label);
      });
    }
    draw();
    // Buttons
    showAllBtn.addEventListener('click', () => {
      focusId = null;
      draw();
      info.textContent = 'Showing all directed relationships.';
    });
    clearBtn.addEventListener('click', () => {
      focusId = null;
      draw();
      info.textContent = 'Showing all directed relationships.';
    });
  }

  // Relationship matrix
  function renderMatrix() {
    const container = document.getElementById('matrixContainer');
    container.innerHTML = '';
    const table = document.createElement('table');
    table.className = 'relation-matrix';
    const headerRow = document.createElement('tr');
    // top-left empty corner
    const corner = document.createElement('th');
    corner.textContent = '';
    headerRow.appendChild(corner);
    // column headers
    data.characters.forEach(c => {
      const th = document.createElement('th');
      th.textContent = c.name.split(' / ')[0];
      th.title = c.name;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
    // rows
    data.characters.forEach(rowChar => {
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.textContent = rowChar.name.split(' / ')[0];
      th.title = rowChar.name;
      tr.appendChild(th);
      data.characters.forEach(colChar => {
        const td = document.createElement('td');
        if (rowChar.id === colChar.id) {
          td.textContent = '–';
          td.className = 'self';
        } else {
          const rel = data.relationships.find(r => r.from === rowChar.id && r.to === colChar.id);
          if (rel) {
            td.classList.add(rel.category);
            td.textContent = rel.category.charAt(0).toUpperCase();
            td.title = rel.text;
          } else {
            td.textContent = '';
          }
        }
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
    container.appendChild(table);
  }

  // Render acts
  function renderActs() {
    const container = document.getElementById('actsList');
    container.innerHTML = '';
    data.acts.forEach(act => {
      const card = document.createElement('div');
      card.className = 'card';
      const h3 = document.createElement('h3');
      h3.textContent = act.title;
      const p = document.createElement('p');
      p.textContent = act.description;
      card.appendChild(h3);
      card.appendChild(p);
      const rooms = document.createElement('p');
      rooms.innerHTML = `<strong>Locations:</strong> ${act.rooms.join(', ')}`;
      card.appendChild(rooms);
      const clues = document.createElement('ul');
      clues.innerHTML = '<strong>Key clues:</strong>';
      act.keyClues.forEach(c => {
        const li = document.createElement('li');
        li.textContent = c;
        clues.appendChild(li);
      });
      card.appendChild(clues);
      const obj = document.createElement('ul');
      obj.innerHTML = '<strong>Objectives:</strong>';
      act.objectives.forEach(o => {
        const li = document.createElement('li');
        li.textContent = o;
        obj.appendChild(li);
      });
      card.appendChild(obj);
      container.appendChild(card);
    });
  }

  // Render locations
  function renderLocations() {
    const container = document.getElementById('locationsList');
    container.innerHTML = '';
    data.locations.forEach(loc => {
      const card = document.createElement('div');
      card.className = 'card';
      const h3 = document.createElement('h3');
      h3.textContent = loc.name;
      const p = document.createElement('p');
      p.textContent = loc.description;
      card.appendChild(h3);
      card.appendChild(p);
      const acts = document.createElement('p');
      acts.innerHTML = `<strong>Accessible in:</strong> ${loc.acts.map(a => {
        const found = data.acts.find(act => act.id === a);
        return found ? found.title : a;
      }).join(', ')}`;
      card.appendChild(acts);
      const clues = document.createElement('ul');
      clues.innerHTML = '<strong>Clues:</strong>';
      loc.clues.forEach(c => {
        const li = document.createElement('li');
        li.textContent = c;
        clues.appendChild(li);
      });
      card.appendChild(clues);
      const actor = document.createElement('p');
      actor.innerHTML = `<strong>Actor responsible:</strong> ${loc.actor}`;
      card.appendChild(actor);
      if (loc.relatedCharacters && loc.relatedCharacters.length > 0) {
        const rel = document.createElement('p');
        const names = loc.relatedCharacters.map(id => {
          const ch = data.characters.find(c => c.id === id);
          return ch ? ch.name : id;
        });
        rel.innerHTML = `<strong>Related characters:</strong> ${names.join(', ')}`;
        card.appendChild(rel);
      }
      container.appendChild(card);
    });
  }

  // Render plot hooks
  function renderPlotHooks() {
    const container = document.getElementById('plotHooks');
    container.innerHTML = '';
    data.plotHooks.forEach(hook => {
      const card = document.createElement('div');
      card.className = 'card';
      const h3 = document.createElement('h3');
      h3.textContent = hook.title;
      const p = document.createElement('p');
      p.textContent = hook.description;
      card.appendChild(h3);
      card.appendChild(p);
      const acts = document.createElement('p');
      acts.innerHTML = `<strong>Acts:</strong> ${hook.acts.map(a => {
        const act = data.acts.find(x => x.id === a);
        return act ? act.title : a;
      }).join(', ')}`;
      card.appendChild(acts);
      if (hook.spoiler && hostMode) {
        const spoiler = document.createElement('div');
        spoiler.className = 'spoiler';
        spoiler.innerHTML = `<strong>Resolution:</strong> ${hook.resolution}`;
        card.appendChild(spoiler);
      }
      container.appendChild(card);
    });
  }

  // Render props
  function renderProps() {
    const container = document.getElementById('propsList');
    container.innerHTML = '';
    data.props.forEach(prop => {
      const card = document.createElement('div');
      card.className = 'card';
      const h3 = document.createElement('h3');
      h3.textContent = prop.name;
      const p = document.createElement('p');
      p.textContent = prop.description;
      card.appendChild(h3);
      card.appendChild(p);
      const loc = document.createElement('p');
      loc.innerHTML = `<strong>Location:</strong> ${prop.location}`;
      card.appendChild(loc);
      if (hostMode) {
        const spoiler = document.createElement('div');
        spoiler.className = 'spoiler';
        spoiler.innerHTML = `<strong>Host detail:</strong> ${prop.spoilerDetail}`;
        card.appendChild(spoiler);
      }
      container.appendChild(card);
    });
  }

  // Render speeches
  function renderSpeeches() {
    const container = document.getElementById('speechesList');
    container.innerHTML = '';
    data.speeches.forEach(s => {
      const card = document.createElement('div');
      card.className = 'card';
      const h3 = document.createElement('h3');
      h3.textContent = s.title + (s.role ? ` – ${s.role}` : '');
      const p = document.createElement('p');
      p.textContent = s.text;
      card.appendChild(h3);
      card.appendChild(p);
      container.appendChild(card);
    });
  }

  // Render actors (host only)
  function renderActors() {
    const container = document.getElementById('actorsList');
    container.innerHTML = '';
    if (!hostMode) {
      container.innerHTML = '<p>This section is visible only to the host.</p>';
      return;
    }
    data.actors.forEach(act => {
      const card = document.createElement('div');
      card.className = 'card';
      const h3 = document.createElement('h3');
      h3.textContent = act.role;
      const p = document.createElement('p');
      p.textContent = act.description;
      const list = document.createElement('ul');
      act.instructions.forEach(line => {
        const li = document.createElement('li');
        li.textContent = line;
        list.appendChild(li);
      });
      card.appendChild(h3);
      card.appendChild(p);
      card.appendChild(list);
      container.appendChild(card);
    });
  }

  // Render handouts
  function renderHandouts() {
    const container = document.getElementById('handoutsList');
    container.innerHTML = '';
    data.handouts.forEach(handout => {
      const div = document.createElement('div');
      div.className = 'handout';
      const h3 = document.createElement('h3');
      h3.textContent = handout.title;
      const p = document.createElement('p');
      p.textContent = handout.content;
      div.appendChild(h3);
      div.appendChild(p);
      container.appendChild(div);
    });
  }

  // Render host notes
  function renderHostNotes() {
    const container = document.getElementById('hostNotesList');
    container.innerHTML = '';
    if (!hostMode) {
      container.innerHTML = '<p>This section is visible only to the host.</p>';
      return;
    }
    data.hostnotes.forEach(note => {
      const card = document.createElement('div');
      card.className = 'card';
      const h3 = document.createElement('h3');
      h3.textContent = note.title;
      const p = document.createElement('p');
      p.textContent = note.content;
      card.appendChild(h3);
      card.appendChild(p);
      container.appendChild(card);
    });
  }

  // Initialise
  async function init() {
    await loadData();
    setupNavigation();
    toggleBtn.addEventListener('click', toggleHostMode);
    renderOverview();
    renderCharacters();
    renderGraph();
    renderMatrix();
    renderActs();
    renderLocations();
    renderPlotHooks();
    renderProps();
    renderSpeeches();
    renderActors();
    renderHandouts();
    renderHostNotes();
  }
  init();
})();
