/*
 * Script to power The Black Codicil murder mystery dashboard.
 * Public mode loads only overview + character bios. Host mode unlocks the rest.
 */

(() => {
  const HOST_PASSWORD_HASH = 'db8d94d3987fe273056a88cd53a45198aa2eb4683e1477af139fe5f5239d16f3';
  const HOST_ACCESS_KEY = 'murderMysteryHostAccess';
  const dataBase = 'assets/mudermystery/data';
  const CHARACTER_PLACEHOLDER_IMAGE = 'assets/mudermystery/photos/agathaplaceholder.png';
  const PRIVATE_CHARACTER_FILE = 'private-characters.json';
  const ESTATE_MAP_IMAGE = 'assets/mudermystery/Map/MapImages/EstateMap.jpeg';
  const mapImageBase = 'assets/mudermystery/Map/MapImages';
  const publicSections = new Set(['overview', 'characters', 'map']);
  const mapTargets = [
    {
      id: 'main-house',
      label: 'Main House',
      x: 17.5,
      y: 17.7,
      images: [`${mapImageBase}/Outside/MAINHOUSE.png`]
    },
    {
      id: 'baroos-room',
      label: "Baroo's Room",
      x: 40.5,
      y: 13.8,
      images: [`${mapImageBase}/Baroos Room/BaroosRoom.png`]
    },
    {
      id: 'parlour',
      label: 'Parlour',
      x: 21.8,
      y: 27,
      images: [`${mapImageBase}/Parlour/Parlour.png`]
    },
    {
      id: 'west-bathroom',
      label: 'Bathroom 1',
      title: 'West Bathroom',
      x: 8.7,
      y: 29.4,
      images: [`${mapImageBase}/Bathrooms/Bathroom_01.png`]
    },
    {
      id: 'acacia-bedroom',
      label: 'Acacia Bedroom',
      title: 'Acacia Bedroom',
      x: 15.5,
      y: 33.5,
      images: [`${mapImageBase}/Bedrooms/AcaciaBedroom.png`]
    },
    {
      id: 'estate-kitchen',
      label: 'Estate Kitchen',
      x: 15.3,
      y: 38.4,
      images: [`${mapImageBase}/Kitchen/EstateKitchen.png`]
    },
    {
      id: 'waiting-room',
      label: 'Waiting Room',
      x: 14.8,
      y: 43.1,
      images: []
    },
    {
      id: 'banquet-hall',
      label: 'Banquet Hall',
      x: 15.4,
      y: 52.1,
      images: [`${mapImageBase}/Banquet Hall/BanquetHall.png`]
    },
    {
      id: 'central-bathroom',
      label: 'Bathroom 2',
      title: 'Central Bathroom',
      x: 33.7,
      y: 28.6,
      images: [`${mapImageBase}/Bathrooms/Bathroom_02.png`]
    },
    {
      id: 'banksia-bedroom',
      label: 'Banksia Bedroom',
      title: 'Banksia Bedroom',
      x: 30.5,
      y: 53.6,
      images: [`${mapImageBase}/Bedrooms/BanksiaBedroom.png`]
    },
    {
      id: 'morning-room',
      label: 'Morning Room',
      x: 30.8,
      y: 43.5,
      images: [`${mapImageBase}/Morning Room/MorningRoom.png`]
    },
    {
      id: 'eucalyptus-bedroom',
      label: 'Eucalyptus Bedroom',
      title: 'Eucalyptus Bedroom',
      x: 33.1,
      y: 34.4,
      images: [`${mapImageBase}/Bedrooms/EucalyptusBedroom.png`]
    },
    {
      id: 'east-bathroom',
      label: 'Bathroom 3',
      title: 'East Bathroom',
      x: 41.2,
      y: 26.5,
      images: [`${mapImageBase}/Bathrooms/Bathroom_03.png`]
    },
    {
      id: 'widows-suite',
      label: "Widow's Suite",
      x: 54,
      y: 27.2,
      images: [`${mapImageBase}/Bedrooms/WidowsSuite.png`]
    },
    {
      id: 'east-verandah',
      label: 'Verandah',
      title: 'East Verandah',
      x: 50.8,
      y: 33.1,
      images: [`${mapImageBase}/Outside/Varandah_eastside.png`]
    },
    {
      id: 'front-verandah',
      label: 'Verandah',
      title: 'Front Verandah',
      x: 23.5,
      y: 59.1,
      images: [`${mapImageBase}/Outside/Verandah_FrontDoor.png`, `${mapImageBase}/Outside/Varandah_02.png`]
    },
    {
      id: 'baroos-retreat',
      label: "Baroo's Retreat",
      x: 72,
      y: 17.2,
      images: [`${mapImageBase}/Bedrooms/BaroosRetreat.png`]
    },
    {
      id: 'cottage-kitchen',
      label: 'Cottage Kitchen',
      x: 81.2,
      y: 17.5,
      images: []
    },
    {
      id: 'washroom',
      label: 'Washroom',
      x: 89.6,
      y: 18.3,
      images: []
    },
    {
      id: 'lounge',
      label: 'Lounge',
      x: 93.4,
      y: 15.2,
      images: []
    },
    {
      id: 'cottage-verandah',
      label: 'Verandah',
      title: 'Cottage Verandah',
      x: 75.3,
      y: 22.5,
      images: [`${mapImageBase}/Outside/Varandah_cottage.png`]
    },
    {
      id: 'garden-room',
      label: 'Garden Room',
      x: 90.8,
      y: 29.8,
      images: [`${mapImageBase}/Bedrooms/GardenRoom.png`]
    },
    {
      id: 'conservatory-garden',
      label: 'Conservatory Garden',
      x: 89,
      y: 40.9,
      images: []
    },
    {
      id: 'estate-grove',
      label: 'Estate Grove',
      x: 65.2,
      y: 62,
      images: []
    },
    {
      id: 'lake',
      label: 'Lake',
      x: 58.3,
      y: 78,
      images: [`${mapImageBase}/Outside/POND.png`]
    },
    {
      id: 'driveway-garden',
      label: 'Driveway Garden',
      x: 13,
      y: 79.6,
      images: []
    }
  ];
  const hostFiles = [
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
  const hostKeys = [
    'relationships',
    'acts',
    'locations',
    'plotHooks',
    'props',
    'speeches',
    'actors',
    'handouts',
    'hostnotes'
  ];

  let hostMode = false;
  let hostAuthenticated = false;
  let hostDataLoaded = false;
  let activeSection = 'overview';
  let selectedCharacterId = null;
  let selectedMapTargetId = mapTargets[0].id;
  let mapHotspotsVisible = true;
  let data = {
    characters: [],
    mapDescriptions: []
  };

  const body = document.body;
  const toggleBtn = document.getElementById('toggleMode');
  const hostStatus = document.getElementById('hostStatus');
  const hostAccessForm = document.getElementById('hostAccessForm');
  const hostPasswordInput = document.getElementById('hostPassword');
  const hostAccessError = document.getElementById('hostAccessError');
  const cancelHostAccessBtn = document.getElementById('cancelHostAccess');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const characterModeNote = document.getElementById('characterModeNote');

  const sections = {
    overview: document.getElementById('overview'),
    characters: document.getElementById('characters'),
    map: document.getElementById('map'),
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

  function getStoredHostAccess() {
    try {
      return sessionStorage.getItem(HOST_ACCESS_KEY) === 'granted';
    } catch (error) {
      return false;
    }
  }

  function setStoredHostAccess(value) {
    try {
      if (value) {
        sessionStorage.setItem(HOST_ACCESS_KEY, 'granted');
      } else {
        sessionStorage.removeItem(HOST_ACCESS_KEY);
      }
    } catch (error) {
      // Ignore storage failures and continue with in-memory access.
    }
  }

  function normaliseDisplayText(text) {
    return String(text || '')
      .replace(/\r\n/g, '\n')
      .replace(/\n[ \t]+/g, '\n')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  async function sha256Hex(value) {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  async function isValidHostPassword(value) {
    return (await sha256Hex(value)) === HOST_PASSWORD_HASH;
  }

  async function fetchJson(file) {
    const response = await fetch(`${dataBase}/${file}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${file}: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async function loadPublicData() {
    const [characterJson, mapDescriptionJson] = await Promise.all([
      fetchJson('characters.json'),
      fetchJson('map-descriptions.json')
    ]);
    data.characters = characterJson.characters || [];
    data.mapDescriptions = mapDescriptionJson.rooms || [];
  }

  function mergePrivateCharacters(publicCharacters, privateCharacters) {
    const privateById = new Map((privateCharacters || []).map(character => [character.id, character.private || {}]));
    return publicCharacters.map(character => ({
      ...character,
      private: privateById.get(character.id) || {}
    }));
  }

  async function loadHostData() {
    if (hostDataLoaded) {
      return;
    }

    const privateCharacterJson = await fetchJson(PRIVATE_CHARACTER_FILE);
    data.characters = mergePrivateCharacters(data.characters, privateCharacterJson.characters || []);

    const results = await Promise.all(hostFiles.map(fetchJson));
    results.forEach((json, index) => {
      const key = hostKeys[index];
      data[key] = json[key] || json[`${key}s`] || Object.values(json)[0];
    });
    hostDataLoaded = true;
  }

  function isSectionAccessible(id) {
    return hostMode || publicSections.has(id);
  }

  function showSection(id) {
    activeSection = isSectionAccessible(id) ? id : 'overview';
    Object.keys(sections).forEach(sectionId => {
      sections[sectionId].classList.toggle('hidden', sectionId !== activeSection);
    });
    navLinks.forEach(link => {
      const targetId = link.getAttribute('href').slice(1);
      link.classList.toggle('active', targetId === activeSection);
    });
  }

  function syncNavigation() {
    navLinks.forEach(link => {
      const targetId = link.getAttribute('href').slice(1);
      link.parentElement.classList.toggle('hidden-nav', !isSectionAccessible(targetId));
    });

    if (!isSectionAccessible(activeSection)) {
      activeSection = 'overview';
    }
    showSection(activeSection);
  }

  function syncHostUi() {
    body.classList.toggle('host-mode', hostMode);

    if (hostMode) {
      toggleBtn.textContent = 'Switch to Player Mode';
      hostStatus.textContent = 'Host Mode active. All mystery materials are visible.';
    } else if (hostAuthenticated) {
      toggleBtn.textContent = 'Switch to Host Mode';
      hostStatus.textContent = 'Host access unlocked. Public view is active.';
    } else {
      toggleBtn.textContent = 'Enter Host Mode';
      hostStatus.textContent = 'Host Mode locked. Public overview and bios only.';
    }

    characterModeNote.textContent = hostMode
      ? 'These are the characters of our Murder Mystery. For each is an overview, their biography, private motives, relationships, act objectives, clues, and all planning materials.'
      : 'These are the characters of our Murder Mystery. For each is an overview and their biography.';
  }

  function openHostAccessForm() {
    hostAccessForm.classList.remove('hidden');
    hostAccessError.classList.add('hidden');
    hostPasswordInput.value = '';
    hostPasswordInput.focus();
  }

  function closeHostAccessForm() {
    hostAccessForm.classList.add('hidden');
    hostAccessError.classList.add('hidden');
    hostPasswordInput.value = '';
  }

  function setupNavigation() {
    navLinks.forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        showSection(link.getAttribute('href').slice(1));
      });
    });
  }

  async function handleToggleClick() {
    if (hostMode) {
      hostMode = false;
      closeHostAccessForm();
      syncHostUi();
      syncNavigation();
      renderAll();
      return;
    }

    if (!hostAuthenticated) {
      openHostAccessForm();
      return;
    }

    await loadHostData();
    hostMode = true;
    syncHostUi();
    syncNavigation();
    renderAll();
  }

  async function handleHostAccessSubmit(event) {
    event.preventDefault();
    if (!(await isValidHostPassword(hostPasswordInput.value))) {
      hostAccessError.classList.remove('hidden');
      hostPasswordInput.select();
      return;
    }

    hostAuthenticated = true;
    setStoredHostAccess(true);
    await loadHostData();
    hostMode = true;
    closeHostAccessForm();
    syncHostUi();
    syncNavigation();
    renderAll();
  }

  function renderOverview() {
    const container = document.getElementById('overviewContent');
    const intro = document.createElement('div');
    intro.className = 'card';

    const p1 = document.createElement('p');
    p1.textContent = 'J. Baroo is dead. A sudden heart attack has left his family, friends and business partners all to grieve for the loss.';

    const p2 = document.createElement('p');
    p2.textContent = 'In his death the patriarch of the Baroo family has left behind a grand fortune, a powerhouse company, a collection of antiques and art, and finally a final set of instructions that has drawn nine guests to the Baroo estate. Some are family. Some are old friends. Some are business associates. All have a direct connection to Baroo, and all have a reason to care what happens this night.';

    const p3 = document.createElement('p');
    p3.textContent = 'Before the formal reading of the will, the guests have been invited to dinner. The Executor is expected to present Baroo’s final arrangements later that evening, including a sealed Black Envelope that has only recently been added to the will. The Executor has been told that it contains a codicil that will reshape the will in its entirety.';

    const p4 = document.createElement('p');
    p4.textContent = 'Around the table will be old loyalties, recent grudges, unfinished business, and people who know more about one another than even the person in question knows. Gathered in that one room will be every problem that J. Baroo was thinking about when he drew up the changes to his will, and likely the problems he was thinking about on the night he died.';

    const p5 = document.createElement('p');
    p5.textContent = 'The evening begins with dinner. What follows will decide who inherits, and who is left wanting.';

    intro.appendChild(p1);
    intro.appendChild(p2);
    intro.appendChild(p3);
    intro.appendChild(p4);
    intro.appendChild(p5);

    container.innerHTML = '';
    container.appendChild(intro);
  }

  function renderCharacters() {
    const section = document.getElementById('characters');
    const list = document.getElementById('characterList');
    const details = document.getElementById('characterDetails');
    const characters = data.characters || [];

    section.appendChild(list);
    section.appendChild(details);

    list.innerHTML = '';
    details.innerHTML = '<p>Select a character to view details.</p>';

    characters.forEach(character => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `character-pill${selectedCharacterId === character.id ? ' active' : ''}`;
      button.textContent = character.name;
      button.addEventListener('click', () => {
        selectedCharacterId = character.id;
        showCharacterDetails(character);
        list.querySelectorAll('.character-pill').forEach(pill => pill.classList.remove('active'));
        button.classList.add('active');
      });
      list.appendChild(button);
    });

    if (selectedCharacterId) {
      const selectedCharacter = characters.find(character => character.id === selectedCharacterId);
      if (selectedCharacter) {
        showCharacterDetails(selectedCharacter);
      } else {
        selectedCharacterId = null;
      }
    }

    function showCharacterDetails(character) {
      details.innerHTML = '';

      const heading = document.createElement('h3');
      heading.textContent = character.name;
      const roleLine = document.createElement('p');
      roleLine.className = 'character-role-line';
      roleLine.textContent = character.role || character.public?.role || '';

      const tabBar = document.createElement('div');
      tabBar.className = 'tabs';
      const content = document.createElement('div');
      content.className = 'tab-content';
      const imagePanel = document.createElement('aside');
      imagePanel.className = 'character-image-panel';
      const image = document.createElement('img');
      const hasCustomImage = Boolean(character.imagePath && character.imagePath !== CHARACTER_PLACEHOLDER_IMAGE);
      image.className = 'character-portrait';
      image.src = character.imagePath || CHARACTER_PLACEHOLDER_IMAGE;
      image.alt = hasCustomImage
        ? `${character.name} portrait`
        : `${character.name} placeholder portrait`;
      const imageCaption = document.createElement('p');
      imageCaption.className = 'character-image-caption';
      imageCaption.textContent = hasCustomImage ? 'Character portrait' : 'Placeholder portrait';
      imagePanel.appendChild(image);
      imagePanel.appendChild(imageCaption);

      const infoPanel = document.createElement('div');
      infoPanel.className = 'character-info-panel';
      const infoHeader = document.createElement('div');
      infoHeader.className = 'character-info-header';
      infoHeader.appendChild(heading);
      infoHeader.appendChild(roleLine);
      infoPanel.appendChild(infoHeader);

      const tabs = hostMode
        ? ['Biography', 'Private Motives', 'Relationships', 'Act Objectives', 'Clues']
        : ['Biography'];

      let currentTab = 0;

      tabs.forEach((tabName, index) => {
        const button = document.createElement('button');
        button.className = `tab-btn${index === 0 ? ' active' : ''}`;
        button.textContent = tabName;
        button.addEventListener('click', () => {
          currentTab = index;
          tabBar.querySelectorAll('.tab-btn').forEach(tabButton => tabButton.classList.remove('active'));
          button.classList.add('active');
          updateContent();
        });
        tabBar.appendChild(button);
      });

      infoPanel.appendChild(tabBar);
      infoPanel.appendChild(content);

      const layout = document.createElement('div');
      layout.className = 'character-layout';
      layout.appendChild(imagePanel);
      layout.appendChild(infoPanel);
      details.appendChild(layout);

      function updateContent() {
        content.innerHTML = '';

        if (currentTab === 0) {
          const profileSections = [
            {
              title: 'Role',
              body: character.public?.role || ''
            },
            {
              title: 'Bio',
              body: normaliseDisplayText(character.public?.bio).replace(/\n/g, '<br>')
            },
            {
              title: 'Personality',
              body: character.public?.personality || ''
            }
          ];

          profileSections.forEach(section => {
            const card = document.createElement('section');
            card.className = 'profile-box';
            const heading = document.createElement('h4');
            heading.textContent = section.title;
            const body = document.createElement('p');
            body.innerHTML = section.body;
            card.appendChild(heading);
            card.appendChild(body);
            content.appendChild(card);
          });
          return;
        }

        if (currentTab === 1) {
          const p = document.createElement('p');
          p.innerHTML = `<strong>Bio:</strong> ${character.private?.bio || ''}<br><strong>Secret pressure:</strong> ${character.private?.secretPressure || ''}<br><strong>Wants:</strong> ${character.private?.wants || ''}<br><strong>Fears:</strong> ${character.private?.fears || ''}<br><strong>Red herring:</strong> ${character.private?.redHerring || ''}`;
          content.appendChild(p);
          return;
        }

        if (currentTab === 2) {
          const wrapper = document.createElement('div');
          const outgoingList = document.createElement('ul');
          const incomingList = document.createElement('ul');
          outgoingList.innerHTML = '<strong>Outgoing:</strong>';
          incomingList.innerHTML = '<strong>Incoming:</strong>';

          data.relationships
            .filter(relationship => relationship.from === character.id)
            .forEach(relationship => {
              const li = document.createElement('li');
              const target = data.characters.find(candidate => candidate.id === relationship.to);
              li.textContent = `${character.name} → ${target ? target.name : relationship.to}: ${relationship.category}`;
              li.title = relationship.text;
              outgoingList.appendChild(li);
            });

          data.relationships
            .filter(relationship => relationship.to === character.id)
            .forEach(relationship => {
              const li = document.createElement('li');
              const source = data.characters.find(candidate => candidate.id === relationship.from);
              li.textContent = `${source ? source.name : relationship.from} → ${character.name}: ${relationship.category}`;
              li.title = relationship.text;
              incomingList.appendChild(li);
            });

          wrapper.appendChild(outgoingList);
          wrapper.appendChild(incomingList);
          content.appendChild(wrapper);
          return;
        }

        if (currentTab === 3) {
          const listEl = document.createElement('ul');
          listEl.innerHTML = '<strong>Objectives by act:</strong>';
          Object.keys(character.private?.actObjectives || {}).forEach(actId => {
            const li = document.createElement('li');
            const act = data.acts.find(candidate => candidate.id === actId);
            li.textContent = `${act ? act.title : actId}: ${character.private.actObjectives[actId]}`;
            listEl.appendChild(li);
          });
          content.appendChild(listEl);
          return;
        }

        const listEl = document.createElement('ul');
        listEl.innerHTML = '<strong>Associated clues:</strong>';
        (character.private?.clues || []).forEach(clue => {
          const li = document.createElement('li');
          li.textContent = clue;
          listEl.appendChild(li);
        });
        content.appendChild(listEl);
      }

      updateContent();
    }
  }

  function renderMap() {
    const container = document.getElementById('mapContent');
    container.innerHTML = '';

    const selectedTarget = mapTargets.find(target => target.id === selectedMapTargetId) || mapTargets[0];
    selectedMapTargetId = selectedTarget.id;

    const layout = document.createElement('div');
    layout.className = 'map-layout';

    const leftPanel = document.createElement('div');
    leftPanel.className = 'map-left-panel';

    const controls = document.createElement('div');
    controls.className = 'map-controls';

    const hotspotToggle = document.createElement('button');
    hotspotToggle.type = 'button';
    hotspotToggle.className = 'control-btn';
    hotspotToggle.textContent = mapHotspotsVisible ? 'Hide hotspots' : 'Show hotspots';
    hotspotToggle.addEventListener('click', () => {
      mapHotspotsVisible = !mapHotspotsVisible;
      renderMap();
    });
    controls.appendChild(hotspotToggle);

    const shell = document.createElement('div');
    shell.className = 'estate-map-shell';

    const stage = document.createElement('div');
    stage.className = `estate-map-stage${mapHotspotsVisible ? '' : ' hotspots-hidden'}`;

    const mapImage = document.createElement('img');
    mapImage.className = 'estate-map-image';
    mapImage.src = ESTATE_MAP_IMAGE;
    mapImage.alt = 'Illustrated map of Baroo Estate with labelled rooms and estate areas.';
    stage.appendChild(mapImage);

    mapTargets.forEach(target => {
      const galleryTitle = target.title || target.label;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'map-hotspot';
      button.style.left = `${target.x}%`;
      button.style.top = `${target.y}%`;
      button.textContent = target.label;
      button.title = `Open gallery for ${galleryTitle}`;
      button.setAttribute('aria-label', `Open gallery for ${galleryTitle}`);
      button.classList.toggle('active', target.id === selectedMapTargetId);
      button.addEventListener('click', () => {
        selectedMapTargetId = target.id;
        renderMap();
      });
      stage.appendChild(button);
    });

    shell.appendChild(stage);
    leftPanel.appendChild(controls);
    leftPanel.appendChild(shell);

    const rightPanel = document.createElement('div');
    rightPanel.className = 'map-right-panel';
    rightPanel.appendChild(renderMapGalleryPanel(selectedTarget));
    rightPanel.appendChild(renderMapTextPanel(selectedTarget));

    layout.appendChild(leftPanel);
    layout.appendChild(rightPanel);
    container.appendChild(layout);
  }

  function getMapRoomDetails(target) {
    return data.mapDescriptions.find(room => room.id === target.id) || {};
  }

  function getMapRoomName(target) {
    const details = getMapRoomDetails(target);
    return details.name || target.title || target.label;
  }

  function renderMapGalleryPanel(target) {
    const galleryTitle = getMapRoomName(target);
    const panel = document.createElement('section');
    panel.className = 'map-side-card map-gallery-card';

    const header = document.createElement('div');
    header.className = 'map-gallery-header';

    const title = document.createElement('h3');
    title.textContent = galleryTitle;

    header.appendChild(title);
    panel.appendChild(header);

    const gallery = document.createElement('div');
    gallery.className = 'map-gallery-grid';

    if (target.images.length > 0) {
      target.images.forEach((imagePath, index) => {
        const figure = document.createElement('figure');
        figure.className = 'map-gallery-item';

        const image = document.createElement('img');
        image.src = imagePath;
        image.alt = `${galleryTitle} gallery image ${index + 1}`;

        const caption = document.createElement('figcaption');
        caption.textContent = target.images.length > 1
          ? `${galleryTitle} view ${index + 1}`
          : galleryTitle;

        figure.appendChild(image);
        figure.appendChild(caption);
        gallery.appendChild(figure);
      });
    } else {
      const empty = document.createElement('p');
      empty.className = 'map-gallery-empty';
      empty.textContent = 'No gallery image has been added for this area yet.';
      gallery.appendChild(empty);
    }

    panel.appendChild(gallery);
    return panel;
  }

  function renderMapTextPanel(target) {
    const details = getMapRoomDetails(target);
    const galleryTitle = getMapRoomName(target);
    const panel = document.createElement('section');
    panel.className = 'map-side-card map-description-card';

    const tabs = document.createElement('div');
    tabs.className = 'tabs';

    const descriptionTab = document.createElement('button');
    descriptionTab.type = 'button';
    descriptionTab.className = 'tab-btn active';
    descriptionTab.textContent = 'Description';
    tabs.appendChild(descriptionTab);

    const content = document.createElement('div');
    content.className = 'tab-content';

    const description = document.createElement('p');
    description.textContent = details.description || `${galleryTitle} is a selectable area on the Baroo Estate map. Select another hotspot to update this gallery and description panel.`;
    content.appendChild(description);

    panel.appendChild(tabs);
    panel.appendChild(content);
    return panel;
  }

  function renderGraph() {
    if (!hostMode || !data.relationships) {
      return;
    }

    const svg = document.getElementById('relationshipGraph');
    const info = document.getElementById('graphInfo');
    const showAllBtn = document.getElementById('showAllRelations');
    const clearBtn = document.getElementById('clearFocus');

    const width = 1800;
    const height = 1800;
    const centerX = width / 2;
    const centerY = height / 2;
    const ringRadius = 675;
    const nodeRadius = 88;
    const characters = data.characters;
    const relationships = data.relationships;
    const positions = {};
    let focusId = null;

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const categories = ['positive', 'negative', 'aware', 'unknown'];
    const colours = {
      positive: getComputedStyle(document.documentElement).getPropertyValue('--positive').trim(),
      negative: getComputedStyle(document.documentElement).getPropertyValue('--negative').trim(),
      aware: getComputedStyle(document.documentElement).getPropertyValue('--aware').trim(),
      unknown: getComputedStyle(document.documentElement).getPropertyValue('--unknown').trim()
    };

    categories.forEach(category => {
      const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
      marker.setAttribute('id', `arrow-${category}`);
      marker.setAttribute('markerWidth', '12');
      marker.setAttribute('markerHeight', '12');
      marker.setAttribute('refX', '10');
      marker.setAttribute('refY', '4');
      marker.setAttribute('orient', 'auto');
      marker.setAttribute('markerUnits', 'strokeWidth');

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M0,0 L0,8 L11,4 z');
      path.setAttribute('fill', colours[category]);
      marker.appendChild(path);
      defs.appendChild(marker);
    });

    svg.appendChild(defs);

    function polarPoint(index, total) {
      const angle = -Math.PI / 2 + index * 2 * Math.PI / total;
      return {
        x: centerX + ringRadius * Math.cos(angle),
        y: centerY + ringRadius * Math.sin(angle)
      };
    }

    characters.forEach((character, index) => {
      positions[character.id] = polarPoint(index, characters.length);
    });

    function edgePath(from, to) {
      const startPoint = positions[from];
      const endPoint = positions[to];
      const fromIndex = characters.findIndex(character => character.id === from);
      const toIndex = characters.findIndex(character => character.id === to);
      const dx = endPoint.x - startPoint.x;
      const dy = endPoint.y - startPoint.y;
      const distance = Math.hypot(dx, dy);
      const unitX = dx / distance;
      const unitY = dy / distance;
      const start = {
        x: startPoint.x + unitX * (nodeRadius + 14),
        y: startPoint.y + unitY * (nodeRadius + 14)
      };
      const end = {
        x: endPoint.x - unitX * (nodeRadius + 22),
        y: endPoint.y - unitY * (nodeRadius + 22)
      };
      const normalX = -unitY;
      const normalY = unitX;
      const rawGap = Math.abs(fromIndex - toIndex);
      const span = Math.min(rawGap, characters.length - rawGap);
      const baseBySpan = { 1: 92, 2: 128, 3: 164, 4: 200, 5: 236 };
      const base = baseBySpan[span] || 150;
      const low = Math.min(fromIndex, toIndex);
      const high = Math.max(fromIndex, toIndex);
      const nudge = ((low * 37 + high * 19) % 31) - 15;
      const curve = base + nudge;
      const middleX = (start.x + end.x) / 2;
      const middleY = (start.y + end.y) / 2;
      const controlX = middleX + normalX * curve;
      const controlY = middleY + normalY * curve;
      return `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} Q ${controlX.toFixed(1)} ${controlY.toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}`;
    }

    function nameOf(id) {
      const character = characters.find(candidate => candidate.id === id);
      return character ? character.name : id;
    }

    function draw() {
      svg.querySelectorAll('.edge, .node, .node-label').forEach(node => node.remove());

      relationships.forEach(relationship => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', edgePath(relationship.from, relationship.to));
        path.setAttribute('class', `edge ${relationship.category}${focusId && relationship.from !== focusId ? ' dimmed' : ''}${focusId && relationship.from === focusId ? ' highlight' : ''}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-width', focusId && relationship.from === focusId ? '5.4' : '2.3');
        path.setAttribute('opacity', focusId && relationship.from !== focusId ? '0.08' : '0.62');
        path.setAttribute('stroke', colours[relationship.category]);
        path.setAttribute('marker-end', `url(#arrow-${relationship.category})`);

        path.addEventListener('mouseenter', () => {
          path.classList.add('highlight');
          info.innerHTML = `<strong>${nameOf(relationship.from)} → ${nameOf(relationship.to)}: ${relationship.category.charAt(0).toUpperCase() + relationship.category.slice(1)}</strong><br>${relationship.text}`;
        });

        path.addEventListener('mouseleave', () => {
          path.classList.remove('highlight');
          info.textContent = focusId
            ? `Focused on ${nameOf(focusId)} outgoing relationships.`
            : 'Hover over a line to read the directional relationship. Click a character to focus its outgoing arrows.';
        });

        svg.appendChild(path);
      });

      characters.forEach(character => {
        const point = positions[character.id];
        const node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        node.setAttribute('cx', point.x);
        node.setAttribute('cy', point.y);
        node.setAttribute('r', nodeRadius);
        node.setAttribute('class', `node ${character.group}${focusId === character.id ? ' selected' : ''}`);
        node.setAttribute('stroke', '#222');
        node.setAttribute('stroke-width', focusId === character.id ? '6' : '2');
        node.setAttribute('fill', character.group === 'family'
          ? getComputedStyle(document.documentElement).getPropertyValue('--family').trim()
          : getComputedStyle(document.documentElement).getPropertyValue('--compatriot').trim());
        node.addEventListener('click', () => {
          focusId = focusId === character.id ? null : character.id;
          draw();
        });
        svg.appendChild(node);

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', point.x);
        label.setAttribute('y', point.y);
        label.setAttribute('class', 'node-label');
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('dominant-baseline', 'middle');
        label.textContent = character.name;
        label.style.pointerEvents = 'none';
        svg.appendChild(label);
      });
    }

    draw();

    showAllBtn.onclick = () => {
      focusId = null;
      draw();
      info.textContent = 'Showing all directed relationships.';
    };

    clearBtn.onclick = () => {
      focusId = null;
      draw();
      info.textContent = 'Showing all directed relationships.';
    };
  }

  function renderMatrix() {
    if (!hostMode || !data.relationships) {
      return;
    }

    const container = document.getElementById('matrixContainer');
    container.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'relation-matrix';
    const headerRow = document.createElement('tr');
    const corner = document.createElement('th');
    corner.textContent = '';
    headerRow.appendChild(corner);

    data.characters.forEach(character => {
      const th = document.createElement('th');
      th.textContent = character.name.split(' / ')[0];
      th.title = character.name;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    data.characters.forEach(rowCharacter => {
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.textContent = rowCharacter.name.split(' / ')[0];
      th.title = rowCharacter.name;
      tr.appendChild(th);

      data.characters.forEach(columnCharacter => {
        const td = document.createElement('td');
        if (rowCharacter.id === columnCharacter.id) {
          td.textContent = '–';
          td.className = 'self';
        } else {
          const relationship = data.relationships.find(candidate => candidate.from === rowCharacter.id && candidate.to === columnCharacter.id);
          if (relationship) {
            td.classList.add(relationship.category);
            td.textContent = relationship.category.charAt(0).toUpperCase();
            td.title = relationship.text;
          }
        }
        tr.appendChild(td);
      });

      table.appendChild(tr);
    });

    container.appendChild(table);
  }

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
      const rooms = document.createElement('p');
      rooms.innerHTML = `<strong>Locations:</strong> ${act.rooms.join(', ')}`;

      const clues = document.createElement('ul');
      clues.innerHTML = '<strong>Key clues:</strong>';
      act.keyClues.forEach(clue => {
        const li = document.createElement('li');
        li.textContent = clue;
        clues.appendChild(li);
      });

      const objectives = document.createElement('ul');
      objectives.innerHTML = '<strong>Objectives:</strong>';
      act.objectives.forEach(objective => {
        const li = document.createElement('li');
        li.textContent = objective;
        objectives.appendChild(li);
      });

      card.appendChild(h3);
      card.appendChild(p);
      card.appendChild(rooms);
      card.appendChild(clues);
      card.appendChild(objectives);
      container.appendChild(card);
    });
  }

  function renderLocations() {
    const container = document.getElementById('locationsList');
    container.innerHTML = '';

    data.locations.forEach(location => {
      const card = document.createElement('div');
      card.className = 'card';

      const h3 = document.createElement('h3');
      h3.textContent = location.name;
      const p = document.createElement('p');
      p.textContent = location.description;
      const acts = document.createElement('p');
      acts.innerHTML = `<strong>Accessible in:</strong> ${location.acts.map(actId => {
        const act = data.acts.find(candidate => candidate.id === actId);
        return act ? act.title : actId;
      }).join(', ')}`;
      const clues = document.createElement('ul');
      clues.innerHTML = '<strong>Clues:</strong>';
      location.clues.forEach(clue => {
        const li = document.createElement('li');
        li.textContent = clue;
        clues.appendChild(li);
      });
      const actor = document.createElement('p');
      actor.innerHTML = `<strong>Actor responsible:</strong> ${location.actor}`;

      card.appendChild(h3);
      card.appendChild(p);
      card.appendChild(acts);
      card.appendChild(clues);
      card.appendChild(actor);

      if (location.relatedCharacters && location.relatedCharacters.length > 0) {
        const related = document.createElement('p');
        related.innerHTML = `<strong>Related characters:</strong> ${location.relatedCharacters.map(id => {
          const character = data.characters.find(candidate => candidate.id === id);
          return character ? character.name : id;
        }).join(', ')}`;
        card.appendChild(related);
      }

      container.appendChild(card);
    });
  }

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
      const acts = document.createElement('p');
      acts.innerHTML = `<strong>Acts:</strong> ${hook.acts.map(actId => {
        const act = data.acts.find(candidate => candidate.id === actId);
        return act ? act.title : actId;
      }).join(', ')}`;

      card.appendChild(h3);
      card.appendChild(p);
      card.appendChild(acts);

      if (hook.spoiler) {
        const spoiler = document.createElement('div');
        spoiler.className = 'spoiler';
        spoiler.innerHTML = `<strong>Resolution:</strong> ${hook.resolution}`;
        card.appendChild(spoiler);
      }

      container.appendChild(card);
    });
  }

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
      const location = document.createElement('p');
      location.innerHTML = `<strong>Location:</strong> ${prop.location}`;
      const spoiler = document.createElement('div');
      spoiler.className = 'spoiler';
      spoiler.innerHTML = `<strong>Host detail:</strong> ${prop.spoilerDetail}`;

      card.appendChild(h3);
      card.appendChild(p);
      card.appendChild(location);
      card.appendChild(spoiler);
      container.appendChild(card);
    });
  }

  function renderSpeeches() {
    const container = document.getElementById('speechesList');
    container.innerHTML = '';

    data.speeches.forEach(speech => {
      const card = document.createElement('div');
      card.className = 'card';

      const h3 = document.createElement('h3');
      h3.textContent = speech.title + (speech.role ? ` – ${speech.role}` : '');
      const p = document.createElement('p');
      p.textContent = speech.text;

      card.appendChild(h3);
      card.appendChild(p);
      container.appendChild(card);
    });
  }

  function renderActors() {
    const container = document.getElementById('actorsList');
    container.innerHTML = '';

    data.actors.forEach(actor => {
      const card = document.createElement('div');
      card.className = 'card';

      const h3 = document.createElement('h3');
      h3.textContent = actor.role;
      const p = document.createElement('p');
      p.textContent = actor.description;
      const list = document.createElement('ul');
      actor.instructions.forEach(instruction => {
        const li = document.createElement('li');
        li.textContent = instruction;
        list.appendChild(li);
      });

      card.appendChild(h3);
      card.appendChild(p);
      card.appendChild(list);
      container.appendChild(card);
    });
  }

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

  function renderHostNotes() {
    const container = document.getElementById('hostNotesList');
    container.innerHTML = '';

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

  function clearHostOnlyContent() {
    document.getElementById('graphContainer').querySelector('svg').innerHTML = '';
    document.getElementById('matrixContainer').innerHTML = '';
    document.getElementById('actsList').innerHTML = '';
    document.getElementById('locationsList').innerHTML = '';
    document.getElementById('plotHooks').innerHTML = '';
    document.getElementById('propsList').innerHTML = '';
    document.getElementById('speechesList').innerHTML = '';
    document.getElementById('actorsList').innerHTML = '';
    document.getElementById('handoutsList').innerHTML = '';
    document.getElementById('hostNotesList').innerHTML = '';
  }

  function renderAll() {
    renderOverview();
    renderCharacters();
    renderMap();

    if (!hostMode) {
      clearHostOnlyContent();
      return;
    }

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

  async function init() {
    await loadPublicData();
    hostAuthenticated = getStoredHostAccess();

    setupNavigation();
    toggleBtn.addEventListener('click', handleToggleClick);
    hostAccessForm.addEventListener('submit', handleHostAccessSubmit);
    cancelHostAccessBtn.addEventListener('click', closeHostAccessForm);

    if (hostAuthenticated) {
      await loadHostData();
      hostMode = true;
    }

    syncHostUi();
    syncNavigation();
    renderAll();
  }

  init();
})();
