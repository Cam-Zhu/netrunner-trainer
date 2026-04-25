// ─── Page navigation ─────────────────────────────────────────────────────────

const VALID_PAGES = ['start', 'decks', 'flashcards', 'challenge', 'rules', 'mechanics'];

function switchPage(page) {
  // Validate — fall back to start if unknown or hidden tab
  const tabEl = document.querySelector(`.page-tab[data-page="${page}"]`);
  if (!tabEl || !VALID_PAGES.includes(page)) page = 'start';

  document.querySelectorAll('.page-tab').forEach(t => t.classList.remove('active'));
  if (tabEl) tabEl.classList.add('active');

  document.getElementById('page-start').style.display      = page === 'start'      ? '' : 'none';
  document.getElementById('page-decks').style.display      = page === 'decks'      ? '' : 'none';
  document.getElementById('page-flashcards').style.display = page === 'flashcards' ? '' : 'none';
  document.getElementById('page-challenge').style.display  = page === 'challenge'  ? '' : 'none';
  document.getElementById('page-rules').style.display      = page === 'rules'      ? '' : 'none';
  document.getElementById('page-mechanics').style.display  = page === 'mechanics'  ? '' : 'none';

  if (page === 'flashcards' && !fc.currentCard) fc.drawCard();
  if (page === 'challenge') ch.renderLevelMap();
  if (page === 'mechanics') window.initMechanicsOnce();
  if (page === 'rules') window.initRulesOnce();
  if (page === 'start') window.initSkillTreeOnce();
  if (page === 'decks') initDeckAnalysis();

  // Update URL hash so the link is bookmarkable / shareable
  history.replaceState(null, '', page === 'start' ? ' ' : `#${page}`);

  if (tabEl) tabEl.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });

  if (typeof window.plausible !== 'undefined') {
    window.plausible('Tab switch', { props: { tab: page } });
  }
}

document.querySelectorAll('.page-tab').forEach(tab => {
  tab.addEventListener('click', () => switchPage(tab.dataset.page));
});

// ─── Flashcard state ──────────────────────────────────────────────────────────

const STORAGE_KEY = 'nrtrainer_fc_ratings';

const fc = {
  pool:        'all',    // 'decks' | 'all'
  deckFilter:  'both',   // 'both' | 'corp' | 'runner'
  mode:        'art',    // 'art' | 'name'
  cycleFilter: '',        // cycle_id or '' for all
  setFilter:   '',        // set_id or '' for all
  typeFilter:  '',        // type key or '' for all
  factionFilter: '',      // faction or '' for all
  currentCard: null,
  isFlipped:   false,
  pass:        1,         // 1 = full pool, 2 = weak cards only
  session:     { knew: 0, unsure: 0, blank: 0, seen: 0 },

  // Persisted across sessions: { cardName: { knew, unsure, blank } }
  ratings: loadRatings(),

  // Weighted draw queue for this session
  queue: [],
};

function loadRatings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch { return {}; }
}

function saveRatings() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(fc.ratings)); } catch {}
}

// ─── Card name resolver ───────────────────────────────────────────────────────
// Deck list names may differ from CARD_DATA keys in three ways:
//   1. Accents stripped:  "Brân 1.0" in deck vs "Bran 1.0" in data
//   2. Identity subtitles: "Building a Better World" vs "Weyland Consortium: ..."
//   3. Community shorthands or old names that don't match the canonical key

const CARD_ALIASES = {
  'bankhar':                     'Tsakhia Bankhar Gantulga',
  'tsakhia "bankhar" gantulga':  'Tsakhia Bankhar Gantulga',
  'paladin polet hyndman':       'Paladin Poemu',
  'paladin':                     'Paladin Poemu',
};

const CARD_NAME_MAP = (() => {
  if (typeof CARD_DATA === 'undefined') return {};
  const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const map = {};
  for (const key of Object.keys(CARD_DATA)) {
    // exact (normalised)
    map[normalize(key)] = key;
    // subtitle only — strip "Faction: " prefix if present
    const colon = key.indexOf(': ');
    if (colon !== -1) map[normalize(key.slice(colon + 2))] = key;
  }
  return map;
})();

function resolveCardName(name) {
  if (typeof CARD_DATA !== 'undefined' && CARD_DATA[name]) return name;
  const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const norm = normalize(name);
  if (CARD_ALIASES[norm]) return CARD_ALIASES[norm];
  return CARD_NAME_MAP[norm] || name;
}

// ─── Pool building ────────────────────────────────────────────────────────────

function matchesTypeFilter(d, typeFilter) {
  if (!typeFilter) return true;
  const sub = d.subtypes || [];
  switch (typeFilter) {
    case 'ice':              return d.type === 'ice';
    case 'ice:barrier':     return d.type === 'ice' && sub.includes('barrier');
    case 'ice:code_gate':   return d.type === 'ice' && sub.includes('code_gate');
    case 'ice:sentry':      return d.type === 'ice' && sub.includes('sentry');
    case 'icebreaker':      return d.type === 'program' && sub.includes('icebreaker');
    case 'program':         return d.type === 'program' && !sub.includes('icebreaker');
    case 'event_operation': return d.type === 'event' || d.type === 'operation';
    case 'resource_asset':  return d.type === 'resource' || d.type === 'asset';
    case 'hardware_upgrade':return d.type === 'hardware' || d.type === 'upgrade';
    case 'agenda':          return d.type === 'agenda';
    default:                return true;
  }
}

function buildPool() {
  if (fc.pool === 'all') {
    if (typeof CARD_DATA === 'undefined') return [];
    return Object.entries(CARD_DATA)
      .filter(([, d]) => {
        if (d.type === 'corp_identity' || d.type === 'runner_identity') return false;
        if (fc.cycleFilter  && d.cycle_id  !== fc.cycleFilter)  return false;
        if (fc.setFilter    && d.set_id    !== fc.setFilter)    return false;
        if (fc.factionFilter && d.faction  !== fc.factionFilter) return false;
        if (!matchesTypeFilter(d, fc.typeFilter))               return false;
        return true;
      })
      .map(([name]) => name);
  }

  // My decks — pull unique names from the deck arrays in app.js state
  const names = new Set();
  if (fc.deckFilter === 'corp' || fc.deckFilter === 'both') {
    state.decks.corp.forEach(n => names.add(resolveCardName(n)));
  }
  if (fc.deckFilter === 'runner' || fc.deckFilter === 'both') {
    state.decks.runner.forEach(n => names.add(resolveCardName(n)));
  }
  // Apply type/faction filters to deck pool too
  if (fc.typeFilter || fc.factionFilter) {
    return [...names].filter(name => {
      const d = typeof CARD_DATA !== 'undefined' ? CARD_DATA[name] : null;
      if (!d) return true; // unknown card — keep it
      if (fc.factionFilter && d.faction !== fc.factionFilter) return false;
      if (!matchesTypeFilter(d, fc.typeFilter)) return false;
      return true;
    });
  }
  return [...names];
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build a single-pass queue: each card appears exactly once, but order is
// weighted so weaker cards tend to appear earlier in the session.
function buildQueue(pool) {
  const groups = { blank: [], unsure: [], other: [] };
  for (const name of pool) {
    const r = fc.ratings[name];
    if (r && r.blank > r.knew) groups.blank.push(name);
    else if (r && r.unsure > r.knew) groups.unsure.push(name);
    else groups.other.push(name);
  }
  return [...shuffle(groups.other), ...shuffle(groups.unsure), ...shuffle(groups.blank)].reverse();
}

// ─── DOM refs ─────────────────────────────────────────────────────────────────

const fcEls = {
  card:         document.getElementById('fc-card'),
  front:        document.getElementById('fc-front'),
  frontName:    document.getElementById('fc-front-name'),
  back:         document.getElementById('fc-back'),
  backImage:    document.getElementById('fc-back-image'),
  art:          document.getElementById('fc-art'),
  artPlaceholder: document.getElementById('fc-art-placeholder'),
  artWrap:      document.getElementById('fc-art-wrap'),
  cardName:     document.getElementById('fc-card-name'),
  cardMeta:     document.getElementById('fc-card-meta'),
  nameOnly:     document.getElementById('fc-name-only'),
  backName:     document.getElementById('fc-back-name'),
  oracle:       document.getElementById('fc-oracle'),
  fullArt:      document.getElementById('fc-full-art'),
  actionsFront: document.getElementById('fc-actions-front'),
  actionsBack:  document.getElementById('fc-actions-back'),
  progressFill: document.getElementById('fc-progress-fill'),
  progressLabel:document.getElementById('fc-progress-label'),
  knew:         document.getElementById('fc-knew'),
  unsure:       document.getElementById('fc-unsure'),
  blank:        document.getElementById('fc-blank'),
  weakList:     document.getElementById('fc-weak-list'),
  weakCount:    document.getElementById('fc-weak-count'),
  deckGroup:    document.getElementById('fc-deck-group'),
  cycleGroup:   document.getElementById('fc-cycle-group'),
  setGroup:     document.getElementById('fc-set-group'),
  cycleSelect:  document.getElementById('fc-cycle-select'),
  setSelect:    document.getElementById('fc-set-select'),
  typeSelect:   document.getElementById('fc-type-select'),
  factionSelect:document.getElementById('fc-faction-select'),
};

// ─── Controls ─────────────────────────────────────────────────────────────────

function bindFcToggle(groupId, key) {
  document.getElementById(groupId).querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById(groupId).querySelectorAll('.toggle-btn')
        .forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      fc[key] = btn.dataset.value;
      if (key === 'pool') {
        const isAll = fc.pool === 'all';
        fcEls.deckGroup.style.display    = isAll ? 'none' : '';
        fcEls.cycleGroup.style.display   = isAll ? '' : 'none';
        fcEls.setGroup.style.display     = isAll ? '' : 'none';
        document.getElementById('fc-type-group').style.display    = isAll ? '' : 'none';
        document.getElementById('fc-faction-group').style.display = isAll ? '' : 'none';
        // Reset type/faction filters when switching to deck mode
        if (!isAll) {
          fc.typeFilter = '';
          fc.factionFilter = '';
          fcEls.typeSelect.value = '';
          fcEls.factionSelect.value = '';
        }
      }
      fc.queue = [];
      fc.drawCard();
    });
  });
}

bindFcToggle('fc-pool-toggle',  'pool');
bindFcToggle('fc-deck-toggle',  'deckFilter');

// Mode toggle — art first vs name first
document.getElementById('fc-mode-toggle').querySelectorAll('.toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('fc-mode-toggle').querySelectorAll('.toggle-btn')
      .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    fc.mode = btn.dataset.value;
    fc.queue = [];
    fcResetSession();
  });
});

// Populate cycle select from CARD_SETS
function populateCycleSelect() {
  if (typeof CARD_SETS === 'undefined') {
    console.warn('CARD_SETS not loaded — run scripts/fetch-card-data.js and add card-sets.js to your project');
    return;
  }
  fcEls.cycleSelect.innerHTML = '<option value="">All cycles</option>';
  Object.entries(CARD_SETS).forEach(([cid, cycle]) => {
    const opt = document.createElement('option');
    opt.value = cid;
    opt.textContent = cycle.name;
    fcEls.cycleSelect.appendChild(opt);
  });
  console.log('Cycles loaded:', Object.keys(CARD_SETS));
}

// Populate set select for a given cycle (or all sets if no cycle)
function populateSetSelect(cycleId) {
  fcEls.setSelect.innerHTML = '<option value="">All sets</option>';
  if (typeof CARD_SETS === 'undefined') return;
  const cycles = cycleId ? { [cycleId]: CARD_SETS[cycleId] } : CARD_SETS;
  Object.entries(cycles).forEach(([, cycle]) => {
    if (!cycle) return;
    Object.entries(cycle.sets).forEach(([sid, sname]) => {
      const opt = document.createElement('option');
      opt.value = sid;
      opt.textContent = sname;
      fcEls.setSelect.appendChild(opt);
    });
  });
}

// Cycle select change → repopulate sets, reset set filter
fcEls.cycleSelect.addEventListener('change', () => {
  fc.cycleFilter = fcEls.cycleSelect.value;
  fc.setFilter   = '';
  populateSetSelect(fc.cycleFilter);
  fcEls.setSelect.value = '';
  fc.queue = [];
  fc.drawCard();
});

// Set select change → update filter
fcEls.setSelect.addEventListener('change', () => {
  fc.setFilter = fcEls.setSelect.value;
  fc.queue = [];
  fc.drawCard();
});

// Type select change → update filter
fcEls.typeSelect.addEventListener('change', () => {
  fc.typeFilter = fcEls.typeSelect.value;
  fc.queue = [];
  fc.drawCard();
});

// Faction select change → update filter
fcEls.factionSelect.addEventListener('change', () => {
  fc.factionFilter = fcEls.factionSelect.value;
  fc.queue = [];
  fc.drawCard();
});

// Init selects on load
populateCycleSelect();
populateSetSelect('');

document.getElementById('fc-reveal-btn').addEventListener('click', fcReveal);
document.getElementById('fc-knew-btn').addEventListener('click',   () => fcRate('knew'));
document.getElementById('fc-unsure-btn').addEventListener('click', () => fcRate('unsure'));
document.getElementById('fc-blank-btn').addEventListener('click',  () => fcRate('blank'));
// document.getElementById('fc-coach-btn').addEventListener('click',  fcAskCoach);
document.getElementById('fc-reset-stats').addEventListener('click', fcResetSession);

// ─── Draw card ────────────────────────────────────────────────────────────────

fc.drawCard = function() {
  const pool = buildPool();
  if (!pool.length) {
    // Reset to a clean empty state so buttons don't stay broken
    fc.currentCard = null;
    fc.isFlipped   = false;
    fcEls.card.classList.remove('is-flipped');
    fcEls.actionsFront.style.display = 'none';
    fcEls.actionsBack.style.display  = 'none';
    fcEls.art.src = '';
    fcEls.artPlaceholder.classList.remove('hidden');
    fcEls.cardName.textContent = 'No cards in pool';
    const hasSets = typeof CARD_SETS !== 'undefined';
    const cycleSelected = fc.cycleFilter || fc.setFilter;
    fcEls.cardMeta.textContent = cycleSelected
      ? 'No cards found for this cycle / set filter'
      : fc.pool === 'all' && !hasSets
        ? 'card-sets.js not found — run the fetch script'
        : 'Add cards to your decks or switch to All cards';
    fcEls.progressLabel.textContent = 'Pool is empty';
    fcEls.progressFill.style.width  = '0%';
    return;
  }

  // End of pass 1 — check if we should start pass 2 or end the session
  if (!fc.queue.length && fc.session.seen > 0 && fc.session.seen >= buildPool().length) {
    const weakCards = Object.keys(sessionWeak);
    if (fc.pass === 1 && weakCards.length > 0) {
      // Start pass 2: review only unsure/blank cards
      fc.pass = 2;
      fc.queue = shuffle([...weakCards]);
      showPass2Banner(weakCards.length);
      return;
    }
    showSessionComplete(pool.length);
    return;
  }

  // First draw — build the queue
  if (!fc.queue.length) fc.queue = buildQueue(pool);

  // Pick next, skipping repeats of the current card if possible
  let name = fc.queue.pop();
  if (name === fc.currentCard && fc.queue.length) {
    fc.queue.unshift(name);
    name = fc.queue.pop();
  }

  fc.currentCard = name;
  fc.isFlipped   = false;
  fc.session.seen++;

  // Reset card UI — show the correct front face for the current mode
  fcEls.card.classList.remove('is-flipped');
  fcEls.actionsFront.style.display = '';
  fcEls.actionsBack.style.display  = 'none';
  fcEls.back.style.display      = 'none';
  fcEls.backImage.style.display = 'none';

  if (fc.mode === 'name') {
    // Name-first: show only the card name, hide art front
    fcEls.front.style.display     = 'none';
    fcEls.frontName.style.display = '';
    fcEls.nameOnly.textContent    = name;
  } else {
    // Art-first: normal front face
    fcEls.front.style.display     = '';
    fcEls.frontName.style.display = 'none';

    // Artwork
    const imgUrl = typeof CARD_IMAGES !== 'undefined' ? CARD_IMAGES[name] : null;
    const data   = typeof CARD_DATA   !== 'undefined' ? CARD_DATA[name]   : null;
    const isIce  = data?.type === 'ice';

    if (imgUrl) {
      fcEls.art.src = imgUrl;
      fcEls.art.className = isIce ? 'ice-art' : '';
      fcEls.art.style.opacity = '1';
      fcEls.artPlaceholder.classList.add('hidden');
    } else {
      fcEls.art.src = '';
      fcEls.artPlaceholder.classList.remove('hidden');
    }

    // Name + minimal meta
    fcEls.cardName.textContent = name;
    fcEls.cardMeta.textContent = data ? formatMeta(data, false) : '';
  }

  updateProgress(pool.length);
};

// ─── Reveal ───────────────────────────────────────────────────────────────────

function fcReveal() {
  fc.isFlipped = true;
  fcEls.actionsFront.style.display = 'none';
  fcEls.actionsBack.style.display  = '';

  const name = fc.currentCard;
  const data = typeof CARD_DATA !== 'undefined' ? CARD_DATA[name] : null;

  function scrollToButtons() {
    const rect = fcEls.actionsBack.getBoundingClientRect();
    if (rect.bottom > window.innerHeight) {
      fcEls.actionsBack.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  if (fc.mode === 'name') {
    fcEls.frontName.style.display = 'none';
    fcEls.back.style.display      = 'none';
    fcEls.backImage.style.display = 'block';
    const imgUrl = typeof CARD_IMAGES !== 'undefined' ? CARD_IMAGES[name] : null;
    if (imgUrl) {
      fcEls.fullArt.src = imgUrl.replace('/small/', '/large/');
      fcEls.fullArt.alt = name;
      // Wait for image to load before scrolling so height is known
      fcEls.fullArt.onload  = scrollToButtons;
      fcEls.fullArt.onerror = scrollToButtons; // scroll anyway if image fails
    } else {
      fcEls.fullArt.src = '';
      setTimeout(scrollToButtons, 50);
    }
  } else {
    // Art-first: normal text back — no image loading delay
    fcEls.front.style.display = 'none';
    fcEls.back.style.display  = 'block';
    fcEls.backImage.style.display = 'none';
    fcEls.backName.textContent = name;
    if (data) {
      const stats = formatMeta(data, true);
      fcEls.oracle.innerHTML =
        `<div class="fc-oracle-stats">${stats}</div>` +
        (data.text ? escFc(data.text) : '<em>No oracle text</em>');
    } else {
      fcEls.oracle.textContent = 'No card data available. Run the fetch script to generate card-data.js.';
    }
    setTimeout(scrollToButtons, 50);
  }
}

// ─── Rating ───────────────────────────────────────────────────────────────────

function fcRate(result) {
  const name = fc.currentCard;
  if (!name) return;

  // Update persistent ratings
  if (!fc.ratings[name]) fc.ratings[name] = { knew: 0, unsure: 0, blank: 0 };
  fc.ratings[name][result]++;
  saveRatings();

  // Update session counts
  fc.session[result]++;
  fcEls.knew.textContent   = fc.session.knew;
  fcEls.unsure.textContent = fc.session.unsure;
  fcEls.blank.textContent  = fc.session.blank;

  // Update weak list if unsure or blank
  if (result !== 'knew') updateWeakList(name, result);

  fc.drawCard();
}

// ─── Ask coach (temporarily disabled) ────────────────────────────────────────

/* async function fcAskCoach() {
  const name = fc.currentCard;
  if (!name) return;

  fcEls.coachText.innerHTML = '<span class="coach-loading">Thinking</span>';

  const data = typeof CARD_DATA !== 'undefined' ? CARD_DATA[name] : null;
  const context = data
    ? `\nCARD ORACLE TEXT:\n${name} [${data.type}${data.subtypes?.length ? ' — ' + data.subtypes.join(', ') : ''}]${data.cost != null ? ' | Cost: ' + data.cost : ''}${data.strength != null ? ' | Str: ' + data.strength : ''}${data.mu_cost != null ? ' | MU: ' + data.mu_cost : ''}\n  "${data.text}"\n`
    : '';

  const prompt = `A player is learning Android: Netrunner cards using flashcards. They just revealed: "${name}".
${context}
Give a compact coaching note on this card — what it does, when you'd play it, and one key interaction or tip to remember. Max 60 words. Be direct.`;

  try {
    const res = await fetch('/api/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const text = (json.content || []).map(b => b.text || '').join('').trim();
    fcEls.coachText.textContent = text || '(no response)';
  } catch (err) {
    fcEls.coachText.textContent = `Error: ${err.message}`;
  }
} */

// ─── Progress ─────────────────────────────────────────────────────────────────

function updateProgress(poolSize) {
  if (fc.pass === 2) {
    const weakTotal = Object.keys(sessionWeak).length;
    const weakRemaining = fc.queue.length;
    const weakSeen = weakTotal - weakRemaining;
    const pct = weakTotal > 0 ? Math.min(100, Math.round((weakSeen / weakTotal) * 100)) : 0;
    fcEls.progressFill.style.width  = pct + '%';
    fcEls.progressLabel.textContent = `Pass 2 — reviewing ${weakSeen} of ${weakTotal} weak cards`;
  } else {
    const seen = fc.session.seen;
    const pct  = poolSize > 0 ? Math.min(100, Math.round((seen / poolSize) * 100)) : 0;
    fcEls.progressFill.style.width  = pct + '%';
    fcEls.progressLabel.textContent = `Pass 1 — ${seen} of ${poolSize} cards`;
  }
}

// ─── Weak card list ───────────────────────────────────────────────────────────

const sessionWeak = {}; // { name: 'blank' | 'unsure' } — latest rating this session

function updateWeakList(name, result) {
  sessionWeak[name] = result;
  const names = Object.keys(sessionWeak);
  fcEls.weakCount.textContent = `(${names.length})`;
  fcEls.weakList.innerHTML = names.map(n => {
    const r = sessionWeak[n];
    return `<span class="fc-weak-chip ${r}">${escFc(n)}</span>`;
  }).join('');
}

// ─── Reset session ────────────────────────────────────────────────────────────

function fcResetSession() {
  // Record completed session by mode before resetting
  if (fc.session.seen > 0) {
    try {
      const key = fc.mode === 'name' ? 'nrtrainer_fc_session_name' : 'nrtrainer_fc_session_art';
      localStorage.setItem(key, '1');
    } catch {}
  }
  fc.session = { knew: 0, unsure: 0, blank: 0, seen: 0 };
  fc.queue   = [];
  fc.pass    = 1;
  fcEls.knew.textContent   = '0';
  fcEls.unsure.textContent = '0';
  fcEls.blank.textContent  = '0';
  fcEls.weakList.innerHTML = '';
  fcEls.weakCount.textContent = '';
  Object.keys(sessionWeak).forEach(k => delete sessionWeak[k]);
  // Restore hint text and face visibility
  const hintEl = fcEls.front.querySelector('.fc-hint');
  if (hintEl) hintEl.innerHTML = 'Think about what this card does, then reveal';
  const hintElName = fcEls.frontName.querySelector('.fc-hint');
  if (hintElName) hintElName.innerHTML = 'Think about what this card does, then reveal';
  fcEls.artWrap.style.display = '';
  fcEls.back.style.display      = 'none';
  fcEls.backImage.style.display = 'none';
  fc.drawCard();
}
// ─── Session complete ─────────────────────────────────────────────────────────

function showPass2Banner(weakCount) {
  fc.currentCard = null;
  fcEls.actionsFront.style.display = 'none';
  fcEls.actionsBack.style.display  = 'none';
  fcEls.back.style.display      = 'none';
  fcEls.backImage.style.display = 'none';
  // Always show art-first face for summary — it has the hint element we repurpose
  fcEls.front.style.display     = '';
  fcEls.frontName.style.display = 'none';
  fcEls.cardName.textContent = 'Pass 1 complete';
  fcEls.cardMeta.textContent = '';
  fcEls.artWrap.style.display = 'none';

  const hintEl = fcEls.front.querySelector('.fc-hint');
  if (hintEl) {
    hintEl.innerHTML =
      `<div class="fc-session-summary">
        <div class="fc-summary-pct">Reviewing ${weakCount} card${weakCount === 1 ? '' : 's'} you found tricky</div>
        <div class="fc-summary-weak">Unsure and blank cards come up again now.</div>
        <button class="btn btn-primary fc-restart-btn" id="fc-pass2-btn">Start pass 2</button>
      </div>`;
    document.getElementById('fc-pass2-btn').addEventListener('click', () => {
      const hintEl2 = fcEls.front.querySelector('.fc-hint');
      if (hintEl2) hintEl2.innerHTML = 'Think about what this card does, then reveal';
      fcEls.artWrap.style.display = '';
      fc.drawCard();
    });
  }

  fcEls.progressFill.style.width  = '100%';
  fcEls.progressLabel.textContent = `Pass 1 complete — ${weakCount} card${weakCount === 1 ? '' : 's'} to review`;
}

function showSessionComplete(poolSize) {
  fc.currentCard = null;
  const { knew, unsure, blank } = fc.session;
  const total = knew + unsure + blank;
  const pct   = total > 0 ? Math.round((knew / total) * 100) : 0;
  const weakCount = Object.keys(sessionWeak).length;

  fcEls.actionsFront.style.display = 'none';
  fcEls.actionsBack.style.display  = 'none';
  fcEls.back.style.display      = 'none';
  fcEls.backImage.style.display = 'none';
  // Always use art-first face for the summary
  fcEls.front.style.display     = '';
  fcEls.frontName.style.display = 'none';
  fcEls.cardName.textContent = 'Session complete';
  fcEls.cardMeta.textContent = '';
  fcEls.artWrap.style.display = 'none';

  const hintEl = fcEls.front.querySelector('.fc-hint');
  if (hintEl) {
    hintEl.innerHTML =
      `<div class="fc-session-summary">
        <div class="fc-summary-stat fc-summary-knew">&#10003; ${knew} knew it</div>
        <div class="fc-summary-stat fc-summary-unsure">&#126; ${unsure} unsure</div>
        <div class="fc-summary-stat fc-summary-blank">&#215; ${blank} blank</div>
        <div class="fc-summary-pct">${pct}% known across ${poolSize} cards</div>
        ${weakCount > 0 ? `<div class="fc-summary-weak">${weakCount} card${weakCount === 1 ? '' : 's'} to review — see below</div>` : ''}
        <button class="btn btn-primary fc-restart-btn" id="fc-restart-btn">Start again</button>
      </div>`;
    document.getElementById('fc-restart-btn').addEventListener('click', fcResetSession);
  }

  fcEls.progressFill.style.width  = '100%';
  fcEls.progressLabel.textContent = `All ${poolSize} cards seen — session complete`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMeta(data, full) {
  const parts = [];
  const typeStr = data.type + (data.subtypes?.length ? ' — ' + data.subtypes.join(', ') : '');
  parts.push(typeStr);
  if (full) {
    if (data.cost      != null) parts.push(`Cost: ${data.cost}`);
    if (data.strength  != null) parts.push(`Str: ${data.strength}`);
    if (data.mu_cost   != null) parts.push(`MU: ${data.mu_cost}`);
    if (data.trash_cost != null) parts.push(`Trash: ${data.trash_cost}`);
    if (data.agenda_points != null) parts.push(`Agenda: ${data.advancement}/${data.agenda_points}`);
    if (data.influence != null && data.influence > 0) parts.push(`Inf: ${data.influence}`);
    if (data.faction)  parts.push(data.faction.replace(/_/g, ' '));
  }
  return parts.join(' · ');
}

function escFc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ─── Deep link init ───────────────────────────────────────────────────────────
// Must run last — after fc, ch, and all functions are defined.
(function() {
  const hash = window.location.hash.replace('#', '').trim();
  if (hash && VALID_PAGES.includes(hash)) {
    switchPage(hash);
  } else {
    // Default page is start — initialise skill tree
    window.initSkillTreeOnce();
  }
})();
