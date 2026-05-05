// ─────────────────────────────────────────────────────────────────────────────
// cardbrowser.js — Card Browser sub-tab on the Glossary page
// Standard pool only. Lazy-loaded images. AND filter logic.
// ─────────────────────────────────────────────────────────────────────────────

const CB_SETS = new Set([
  'system_gateway', 'elevation', 'vantage_point',
  'downfall', 'uprising',
  'midnight_sun', 'parhelion',
  'the_automata_initiative', 'rebellion_without_rehearsal',
]);

const CB_SET_LABELS = {
  system_gateway:              'System Gateway',
  elevation:                   'Elevation',
  vantage_point:               'Vantage Point',
  downfall:                    'Downfall',
  uprising:                    'Uprising',
  midnight_sun:                'Midnight Sun',
  parhelion:                   'Parhelion',
  the_automata_initiative:     'The Automata Initiative',
  rebellion_without_rehearsal: 'Rebellion Without Rehearsal',
};

const CB_TYPE_LABELS = {
  agenda:          'Agenda',
  asset:           'Asset',
  corp_identity:   'Corp Identity',
  ice:             'ICE',
  operation:       'Operation',
  upgrade:         'Upgrade',
  event:           'Event',
  hardware:        'Hardware',
  program:         'Program',
  resource:        'Resource',
  runner_identity: 'Runner Identity',
};

// ─── State ────────────────────────────────────────────────────────────────────

const cb = {
  faction: '',
  type:    '',
  set:     '',
  inited:  false,
};

// ─── Build card list from CARD_DATA ──────────────────────────────────────────

function cbGetCards() {
  if (typeof CARD_DATA === 'undefined') return [];
  return Object.entries(CARD_DATA)
    .filter(([, d]) => CB_SETS.has(d.set_id))
    .map(([name, d]) => ({ name, ...d }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function cbFilter(cards) {
  return cards.filter(c => {
    if (cb.faction && c.faction !== cb.faction) return false;
    if (cb.type    && c.type    !== cb.type)    return false;
    if (cb.set     && c.set_id  !== cb.set)     return false;
    return true;
  });
}

// ─── Populate filter dropdowns ────────────────────────────────────────────────

function cbPopulateFilters(cards) {
  // Factions
  const factions = [...new Set(cards.map(c => c.faction).filter(Boolean))].sort();
  const factionSel = document.getElementById('cb-faction-select');
  factionSel.innerHTML = '<option value="">All factions</option>';
  factions.forEach(f => {
    const label = f.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    factionSel.innerHTML += `<option value="${f}">${label}</option>`;
  });

  // Types
  const types = [...new Set(cards.map(c => c.type).filter(Boolean))].sort();
  const typeSel = document.getElementById('cb-type-select');
  typeSel.innerHTML = '<option value="">All types</option>';
  types.forEach(t => {
    const label = CB_TYPE_LABELS[t] || t;
    typeSel.innerHTML += `<option value="${t}">${label}</option>`;
  });

  // Sets
  const setSel = document.getElementById('cb-set-select');
  setSel.innerHTML = '<option value="">All sets</option>';
  Object.entries(CB_SET_LABELS).forEach(([id, label]) => {
    setSel.innerHTML += `<option value="${id}">${label}</option>`;
  });
}

// ─── Render grid ──────────────────────────────────────────────────────────────

function cbRender() {
  const root    = document.getElementById('cb-grid');
  const count   = document.getElementById('cb-count');
  if (!root) return;

  const allCards      = cbGetCards();
  const filtered      = cbFilter(allCards);

  count.textContent = `${filtered.length} card${filtered.length === 1 ? '' : 's'}`;

  if (!filtered.length) {
    root.innerHTML = '<div class="cb-empty">No cards match the current filters.</div>';
    return;
  }

  root.innerHTML = filtered.map(card => {
    const imgUrl = typeof CARD_IMAGES !== 'undefined' ? CARD_IMAGES[card.name] : null;
    const largeUrl = imgUrl ? imgUrl.replace('/small/', '/large/') : null;
    const typeLabel = CB_TYPE_LABELS[card.type] || card.type || '';
    const faction = card.faction ? card.faction.replace(/_/g, ' ') : '';

    return `
      <div class="cb-card" title="${card.name}">
        ${largeUrl
          ? `<img src="${largeUrl}" alt="${card.name}" loading="lazy" class="cb-card-img" />`
          : `<div class="cb-card-placeholder">
               <div class="cb-card-name-fallback">${card.name}</div>
               <div class="cb-card-type-fallback">${typeLabel}</div>
             </div>`
        }
      </div>`;
  }).join('');
}

// ─── Init ─────────────────────────────────────────────────────────────────────

window.initCardBrowser = function() {
  if (cb.inited) { cbRender(); return; }
  cb.inited = true;

  const allCards = cbGetCards();
  cbPopulateFilters(allCards);

  // Wire up filter dropdowns
  document.getElementById('cb-faction-select').addEventListener('change', e => {
    cb.faction = e.target.value;
    cbRender();
  });
  document.getElementById('cb-type-select').addEventListener('change', e => {
    cb.type = e.target.value;
    cbRender();
  });
  document.getElementById('cb-set-select').addEventListener('change', e => {
    cb.set = e.target.value;
    cbRender();
  });

  // Reset button
  document.getElementById('cb-reset-btn').addEventListener('click', () => {
    cb.faction = '';
    cb.type    = '';
    cb.set     = '';
    document.getElementById('cb-faction-select').value = '';
    document.getElementById('cb-type-select').value    = '';
    document.getElementById('cb-set-select').value     = '';
    cbRender();
  });

  cbRender();
};
