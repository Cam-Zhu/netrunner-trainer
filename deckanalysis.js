// ─────────────────────────────────────────────────────────────────────────────
// deckanalysis.js — Deck Analysis Dashboard
// Five panels computed from card-data.js — no curation required.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Hypergeometric probability ───────────────────────────────────────────────

function hypergeomCDF(population, successes, draws, minSuccesses) {
  // P(X >= minSuccesses) where X ~ Hypergeometric(N, K, n)
  let prob = 0;
  for (let k = minSuccesses; k <= Math.min(successes, draws); k++) {
    prob += hypergeomPMF(population, successes, draws, k);
  }
  return Math.min(prob, 1);
}

function hypergeomPMF(N, K, n, k) {
  return (comb(K, k) * comb(N - K, n - k)) / comb(N, n);
}

function comb(n, k) {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  k = Math.min(k, n - k);
  let result = 1;
  for (let i = 0; i < k; i++) {
    result *= (n - i) / (i + 1);
  }
  return result;
}

// ─── Parse deck into card objects ─────────────────────────────────────────────

function parseDeckForAnalysis(deckArray) {
  // deckArray is already parsed by app.js parseDeck — array of card name strings
  // Count occurrences
  const counts = {};
  deckArray.forEach(name => {
    const resolved = resolveCardName ? resolveCardName(name) : name;
    counts[resolved] = (counts[resolved] || 0) + 1;
  });
  // Build card objects with data
  return Object.entries(counts).map(([name, qty]) => {
    const data = typeof CARD_DATA !== 'undefined' ? CARD_DATA[name] : null;
    return { name, qty, data };
  }).filter(c => c.data); // skip unresolved cards
}

// ─── Faction colour + label map ───────────────────────────────────────────────

const FACTION_META = {
  haas_bioroid:       { label: 'Haas-Bioroid',        color: '#4a9eff' },
  jinteki:            { label: 'Jinteki',              color: '#e05555' },
  nbn:                { label: 'NBN',                  color: '#f0a500' },
  weyland_consortium: { label: 'Weyland Consortium',   color: '#4caf50' },
  anarch:             { label: 'Anarch',               color: '#e05555' },
  criminal:           { label: 'Criminal',             color: '#4a9eff' },
  shaper:             { label: 'Shaper',               color: '#4caf50' },
  adam:               { label: 'Adam',                 color: '#f0a500' },
  apex:               { label: 'Apex',                 color: '#e05555' },
  sunny_lebeau:       { label: 'Sunny Lebeau',         color: '#c084fc' },
  neutral_corp:       { label: 'Neutral',              color: '#5a6478' },
  neutral_runner:     { label: 'Neutral',              color: '#5a6478' },
};

function renderIdentityBar(identity) {
  if (!identity) {
    return `<div class="da-id-bar da-id-bar--empty">No identity card found — paste your full decklist including the identity line for faction analysis.</div>`;
  }

  const { name, data } = identity;
  const faction = FACTION_META[data.faction] || { label: data.faction, color: 'var(--text-dim)' };
  const extras = [];
  if (data.link)     extras.push(`${data.link}⟡ link`);
  if (data.min_deck) extras.push(`${data.min_deck} card minimum`);
  if (data.inf_limit != null) extras.push(`${data.inf_limit} influence`);

  return `
    <div class="da-id-bar" style="--id-color:${faction.color};">
      <div class="da-id-accent"></div>
      <div class="da-id-body">
        <div class="da-id-top">
          <span class="da-id-name">${name}</span>
          <span class="da-id-faction">${faction.label}</span>
        </div>
        <div class="da-id-text">${data.text || ''}</div>
        ${extras.length ? `<div class="da-id-extras">${extras.join(' · ')}</div>` : ''}
      </div>
    </div>`;
}

// ─── Panel renderers ──────────────────────────────────────────────────────────

function renderBreakerCoverage(cards) {
  const BREAKER_TYPES = [
    { key: 'fracter',  label: 'Barrier',   required: true  },
    { key: 'decoder',  label: 'Code Gate', required: true  },
    { key: 'killer',   label: 'Sentry',    required: true  },
    { key: 'ai',       label: 'AI',        required: false },
  ];

  const rows = BREAKER_TYPES.map(({ key, label, required }) => {
    const breakers = cards.filter(c =>
      c.data.type === 'program' &&
      (c.data.subtypes || []).includes(key)
    );
    const isEmpty = breakers.length === 0;
    const flagEmpty = isEmpty && required;
    const breakerList = breakers.map(c =>
      `<span class="da-breaker-name">${c.name}</span><span class="da-breaker-qty">×${c.qty}</span>`
    ).join('');

    return `
      <div class="da-breaker-row ${flagEmpty ? 'da-breaker-row--missing' : ''}">
        <div class="da-breaker-type">${label}</div>
        <div class="da-breaker-cards">
          ${isEmpty
            ? (required ? '<span class="da-flag">⚠ None</span>' : '<span class="da-none">—</span>')
            : breakerList}
        </div>
      </div>`;
  });

  return `
    <div class="da-panel">
      <div class="da-panel-title">Breaker Coverage</div>
      <div class="da-breaker-grid">${rows.join('')}</div>
    </div>`;
}

function renderIceComposition(cards) {
  const ICE_TYPES = ['barrier', 'code_gate', 'sentry', 'other'];
  const ICE_LABELS = { barrier: 'Barrier', code_gate: 'Code Gate', sentry: 'Sentry', other: 'Other' };
  const ICE_COLOURS = {
    barrier:   'var(--corp)',
    code_gate: 'var(--accent)',
    sentry:    'var(--danger)',
    other:     'var(--text-dim)',
  };

  const iceCards = cards.filter(c => c.data.type === 'ice');
  const total = iceCards.reduce((s, c) => s + c.qty, 0);

  if (total === 0) {
    return `
      <div class="da-panel">
        <div class="da-panel-title">ICE Composition</div>
        <div class="da-empty">No ICE in deck</div>
      </div>`;
  }

  const buckets = { barrier: 0, code_gate: 0, sentry: 0, other: 0 };
  iceCards.forEach(c => {
    const subs = c.data.subtypes || [];
    if (subs.includes('barrier'))   buckets.barrier   += c.qty;
    else if (subs.includes('code_gate')) buckets.code_gate += c.qty;
    else if (subs.includes('sentry'))    buckets.sentry    += c.qty;
    else                                  buckets.other     += c.qty;
  });

  const bars = ICE_TYPES.map(type => {
    const count = buckets[type];
    if (count === 0) return '';
    const pct = Math.round((count / total) * 100);
    return `
      <div class="da-ice-row">
        <div class="da-ice-label">${ICE_LABELS[type]}</div>
        <div class="da-bar-wrap">
          <div class="da-bar" style="width:${pct}%; background:${ICE_COLOURS[type]}"></div>
        </div>
        <div class="da-ice-count">${count}</div>
      </div>`;
  }).join('');

  return `
    <div class="da-panel">
      <div class="da-panel-title">ICE Composition <span class="da-panel-sub">${total} ICE total</span></div>
      <div class="da-ice-grid">${bars}</div>
    </div>`;
}

function renderAgendaDensity(cards, deckSize) {
  const agendas = cards.filter(c => c.data.type === 'agenda');
  const totalAgendas = agendas.reduce((s, c) => s + c.qty, 0);
  const totalAP = agendas.reduce((s, c) => s + (c.data.agenda_points || 0) * c.qty, 0);

  if (totalAgendas === 0) {
    return `
      <div class="da-panel">
        <div class="da-panel-title">Agenda Density</div>
        <div class="da-empty">No agendas found</div>
      </div>`;
  }

  // P(Runner sees 2+ agendas in opening 5-card HQ)
  const hqProb = hypergeomCDF(deckSize, totalAgendas, 5, 2);
  // P(Runner steals enough to win from 18 random R&D accesses)
  // Runner needs 7AP to win; approximate using agenda count / deckSize
  const winFromRD = hypergeomCDF(deckSize, totalAgendas, 18, Math.ceil(7 / (totalAP / totalAgendas)));

  const agendaList = agendas.map(c =>
    `<div class="da-agenda-item">
      <span class="da-agenda-name">${c.name}</span>
      <span class="da-agenda-detail">${c.qty}× · ${c.data.agenda_points}AP · ${c.data.advancement} adv</span>
    </div>`
  ).join('');

  return `
    <div class="da-panel">
      <div class="da-panel-title">Agenda Density</div>
      <div class="da-agenda-list">${agendaList}</div>
      <div class="da-stats-grid">
        <div class="da-stat">
          <div class="da-stat-value">${totalAgendas}</div>
          <div class="da-stat-label">Agendas</div>
        </div>
        <div class="da-stat">
          <div class="da-stat-value">${totalAP}</div>
          <div class="da-stat-label">Total AP</div>
        </div>
        <div class="da-stat ${hqProb > 0.5 ? 'da-stat--warn' : ''}">
          <div class="da-stat-value">${Math.round(hqProb * 100)}%</div>
          <div class="da-stat-label">2+ agendas in 5-card HQ</div>
        </div>
        <div class="da-stat">
          <div class="da-stat-value">${Math.round(winFromRD * 100)}%</div>
          <div class="da-stat-label">Runner wins from 18 R&D accesses</div>
        </div>
      </div>
    </div>`;
}

function renderInfluenceBreakdown(cards, identity) {
  const infLimit = identity?.data?.inf_limit ?? 15;
  const identityFaction = identity?.data?.faction ?? null;

  // Only cards whose faction differs from the identity faction cost influence.
  // Neutral cards (neutral_corp, neutral_runner) never cost influence.
  const outOfFaction = cards.filter(c => {
    if (!c.data.influence || c.data.influence === 0) return false;
    if (!identityFaction) return true; // no identity found — show all with influence > 0
    if (c.data.faction === identityFaction) return false;
    if (c.data.faction?.startsWith('neutral')) return false;
    return true;
  });

  const totalSpent = outOfFaction.reduce((s, c) => s + c.data.influence * c.qty, 0);

  if (outOfFaction.length === 0) {
    return `
      <div class="da-panel">
        <div class="da-panel-title">Influence <span class="da-panel-sub">${totalSpent}/${infLimit} spent</span></div>
        <div class="da-empty">No out-of-faction cards${!identityFaction ? ' — save a deck with an identity card for accurate results' : ''}</div>
      </div>`;
  }

  const sorted = [...outOfFaction].sort((a, b) =>
    (b.data.influence * b.qty) - (a.data.influence * a.qty)
  );

  const pct = Math.min(100, Math.round((totalSpent / infLimit) * 100));
  const items = sorted.map(c => {
    const inf = c.data.influence * c.qty;
    const itemPct = Math.round((inf / infLimit) * 100);
    return `
      <div class="da-inf-row">
        <div class="da-inf-name">${c.name} ×${c.qty}</div>
        <div class="da-bar-wrap">
          <div class="da-bar da-bar--inf" style="width:${itemPct}%"></div>
        </div>
        <div class="da-inf-cost">${inf}inf</div>
      </div>`;
  }).join('');

  return `
    <div class="da-panel">
      <div class="da-panel-title">Influence <span class="da-panel-sub">${totalSpent}/${infLimit} spent</span></div>
      <div class="da-inf-total-bar">
        <div class="da-inf-total-fill ${totalSpent > infLimit ? 'da-bar--over' : ''}" style="width:${pct}%"></div>
      </div>
      <div class="da-inf-grid">${items}</div>
    </div>`;
}

function renderInstallCurve(cards) {
  const installable = cards.filter(c => {
    const t = c.data.type;
    return ['ice', 'asset', 'upgrade', 'program', 'hardware', 'resource'].includes(t);
  });

  if (installable.length === 0) {
    return `
      <div class="da-panel">
        <div class="da-panel-title">Install Curve</div>
        <div class="da-empty">No installable cards</div>
      </div>`;
  }

  // Build cost buckets 0–7+
  const buckets = {};
  installable.forEach(c => {
    const cost = parseInt(c.data.cost) || 0;
    const key = cost >= 7 ? '7+' : String(cost);
    buckets[key] = (buckets[key] || 0) + c.qty;
  });

  const labels = ['0','1','2','3','4','5','6','7+'];
  const values = labels.map(l => buckets[l] || 0);
  const max = Math.max(...values, 1);
  const total = values.reduce((s, v) => s + v, 0);
  const avg = (installable.reduce((s, c) => s + (parseInt(c.data.cost) || 0) * c.qty, 0) / total).toFixed(1);

  const bars = labels.map((label, i) => {
    const val = values[i];
    const pct = Math.round((val / max) * 100);
    return `
      <div class="da-curve-col">
        <div class="da-curve-bar-wrap">
          <div class="da-curve-bar" style="height:${pct}%"></div>
        </div>
        <div class="da-curve-count">${val || ''}</div>
        <div class="da-curve-label">${label}</div>
      </div>`;
  }).join('');

  return `
    <div class="da-panel">
      <div class="da-panel-title">Install Curve <span class="da-panel-sub">avg ${avg} credits</span></div>
      <div class="da-curve">${bars}</div>
    </div>`;
}

function renderMemoryUsage(cards) {
  const BASE_MU = 4;
  const programs = cards.filter(c => c.data.type === 'program' && c.data.mu_cost != null);

  if (programs.length === 0) {
    return `
      <div class="da-panel">
        <div class="da-panel-title">Memory Usage</div>
        <div class="da-empty">No programs in deck</div>
      </div>`;
  }

  const totalMU = programs.reduce((s, c) => s + c.data.mu_cost, 0);
  const overLimit = totalMU > BASE_MU;

  const rows = programs
    .sort((a, b) => b.data.mu_cost - a.data.mu_cost)
    .map(c => {
      const mu = c.data.mu_cost;
      const pct = Math.min(100, Math.round((mu / totalMU) * 100));
      return `
        <div class="da-inf-row">
          <div class="da-inf-name">${c.name}</div>
          <div class="da-bar-wrap">
            <div class="da-bar da-bar--mu" style="width:${pct}%"></div>
          </div>
          <div class="da-inf-cost">${mu}MU</div>
        </div>`;
    }).join('');

  return `
    <div class="da-panel">
      <div class="da-panel-title">Full Memory Usage <span class="da-panel-sub">${totalMU}MU total${overLimit ? ' — exceeds base 4MU' : ''}</span></div>
      <div class="da-stats-grid" style="margin-bottom:10px;">
        <div class="da-stat ${overLimit ? 'da-stat--warn' : ''}">
          <div class="da-stat-value">${totalMU}</div>
          <div class="da-stat-label">MU required (full rig)</div>
        </div>
        <div class="da-stat">
          <div class="da-stat-value">${totalMU - BASE_MU > 0 ? '+' + (totalMU - BASE_MU) : BASE_MU - totalMU}</div>
          <div class="da-stat-label">${totalMU > BASE_MU ? 'MU support needed' : 'MU headroom'}</div>
        </div>
      </div>
      <div class="da-inf-grid">${rows}</div>
    </div>`;
}

// ─── Main render ──────────────────────────────────────────────────────────────

function renderDeckAnalysis(side) {
  const root = document.getElementById('da-root');
  if (!root) return;

  if (typeof CARD_DATA === 'undefined') {
    root.innerHTML = '<div class="da-empty">Card data not loaded.</div>';
    return;
  }

  const deckArray = state.decks[side];
  if (!deckArray || deckArray.length === 0) {
    root.innerHTML = '<div class="da-empty">No deck saved. Paste a decklist above and hit Save.</div>';
    return;
  }

  const cards = parseDeckForAnalysis(deckArray);
  const deckSize = deckArray.length;

  // Find identity card if present
  const identity = cards.find(c =>
    c.data.type === 'corp_identity' || c.data.type === 'runner_identity'
  );

  const panels = side === 'runner'
    ? [
        renderBreakerCoverage(cards),
        renderMemoryUsage(cards),
        renderInstallCurve(cards),
        renderInfluenceBreakdown(cards, identity),
      ]
    : [
        renderIceComposition(cards),
        renderAgendaDensity(cards, deckSize),
        renderInstallCurve(cards),
        renderInfluenceBreakdown(cards, identity),
      ];

  root.innerHTML = renderIdentityBar(identity) + `<div class="da-grid">${panels.join('')}</div>`;
}

// ─── Init ─────────────────────────────────────────────────────────────────────

function initDeckAnalysis() {
  const root = document.getElementById('da-root');
  if (!root) return;

  // Wire up toggle buttons
  document.querySelectorAll('.da-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.da-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderDeckAnalysis(btn.dataset.side);
    });
  });

  // Fire render and Plausible event when analysis accordion is opened
  const accordion = document.getElementById('da-accordion');
  if (accordion) {
    accordion.addEventListener('toggle', () => {
      if (accordion.open) {
        renderDeckAnalysis(
          document.querySelector('.da-toggle-btn.active')?.dataset.side || 'corp'
        );
        if (typeof window.plausible !== 'undefined') {
          window.plausible('Deck Analysis opened');
        }
      }
    });
  }

  // Plausible event when explainer accordion is opened
  const explainer = document.getElementById('da-explainer-accordion');
  if (explainer) {
    explainer.addEventListener('toggle', () => {
      if (explainer.open && typeof window.plausible !== 'undefined') {
        window.plausible('Deck Analysis Explainer opened');
      }
    });
  }

  // Initial render
  renderDeckAnalysis('corp');
}

// Expose so app.js can call it after saveDeck
window.refreshDeckAnalysis = function(side) {
  renderDeckAnalysis(side);
};
