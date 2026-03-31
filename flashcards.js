// ─── Page navigation ─────────────────────────────────────────────────────────

document.querySelectorAll('.page-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const page = tab.dataset.page;
    document.querySelectorAll('.page-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('page-start').style.display      = page === 'start'      ? '' : 'none';
    document.getElementById('page-decks').style.display      = page === 'decks'      ? '' : 'none';
    document.getElementById('page-trainer').style.display    = page === 'trainer'    ? '' : 'none';
    document.getElementById('page-flashcards').style.display = page === 'flashcards' ? '' : 'none';
    document.getElementById('page-challenge').style.display  = page === 'challenge'  ? '' : 'none';
    document.getElementById('page-mechanics').style.display  = page === 'mechanics'  ? '' : 'none';
    if (page === 'flashcards' && !fc.currentCard) fc.drawCard();
    if (page === 'challenge') ch.renderLevelMap();
    if (page === 'mechanics') window.initMechanicsOnce();
    // Scroll active tab into view on mobile
    tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    // Plausible analytics
    if (typeof window.plausible !== 'undefined') {
      window.plausible('Tab switch', { props: { tab: page } });
    }
  });
});

// ─── Flashcard state ──────────────────────────────────────────────────────────

const STORAGE_KEY = 'nrtrainer_fc_ratings';

const fc = {
  pool:        'decks',   // 'decks' | 'all'
  deckFilter:  'both',    // 'both' | 'corp' | 'runner'
  cycleFilter: '',        // cycle_id or '' for all
  setFilter:   '',        // set_id or '' for all
  currentCard: null,
  isFlipped:   false,
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

// ─── Pool building ────────────────────────────────────────────────────────────

function buildPool() {
  if (fc.pool === 'all') {
    if (typeof CARD_DATA === 'undefined') return [];
    return Object.entries(CARD_DATA)
      .filter(([, d]) => {
        if (fc.cycleFilter && d.cycle_id !== fc.cycleFilter) return false;
        if (fc.setFilter   && d.set_id   !== fc.setFilter)   return false;
        return true;
      })
      .map(([name]) => name);
  }

  // My decks — pull unique names from the deck arrays in app.js state
  const names = new Set();
  if (fc.deckFilter === 'corp' || fc.deckFilter === 'both') {
    state.decks.corp.forEach(n => names.add(n));
  }
  if (fc.deckFilter === 'runner' || fc.deckFilter === 'both') {
    state.decks.runner.forEach(n => names.add(n));
  }
  return [...names];
}

// Build a weighted queue: cards rated 'blank' appear 3×, 'unsure' 2×, rest 1×
function buildQueue(pool) {
  const q = [];
  for (const name of pool) {
    const r = fc.ratings[name];
    const weight = r
      ? (r.blank > r.knew ? 3 : r.unsure > r.knew ? 2 : 1)
      : 1;
    for (let i = 0; i < weight; i++) q.push(name);
  }
  // Shuffle
  for (let i = q.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [q[i], q[j]] = [q[j], q[i]];
  }
  return q;
}

// ─── DOM refs ─────────────────────────────────────────────────────────────────

const fcEls = {
  card:         document.getElementById('fc-card'),
  front:        document.getElementById('fc-front'),
  back:         document.getElementById('fc-back'),
  art:          document.getElementById('fc-art'),
  artPlaceholder: document.getElementById('fc-art-placeholder'),
  artWrap:      document.getElementById('fc-art-wrap'),
  cardName:     document.getElementById('fc-card-name'),
  cardMeta:     document.getElementById('fc-card-meta'),
  backName:     document.getElementById('fc-back-name'),
  oracle:       document.getElementById('fc-oracle'),
  coachText:    document.getElementById('fc-coach-text'),
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
        fcEls.deckGroup.style.display  = isAll ? 'none' : '';
        fcEls.cycleGroup.style.display = isAll ? '' : 'none';
        fcEls.setGroup.style.display   = isAll ? '' : 'none';
      }
      fc.queue = [];
      fc.drawCard();
    });
  });
}

bindFcToggle('fc-pool-toggle',  'pool');
bindFcToggle('fc-deck-toggle',  'deckFilter');

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

// Init selects on load
populateCycleSelect();
populateSetSelect('');

document.getElementById('fc-reveal-btn').addEventListener('click', fcReveal);
document.getElementById('fc-skip-btn').addEventListener('click', () => fc.drawCard());
document.getElementById('fc-knew-btn').addEventListener('click',   () => fcRate('knew'));
document.getElementById('fc-unsure-btn').addEventListener('click', () => fcRate('unsure'));
document.getElementById('fc-blank-btn').addEventListener('click',  () => fcRate('blank'));
document.getElementById('fc-coach-btn').addEventListener('click',  fcAskCoach);
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

  // Refill queue when empty
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

  // Reset card UI
  fcEls.card.classList.remove('is-flipped');
  fcEls.actionsFront.style.display = '';
  fcEls.actionsBack.style.display  = 'none';
  fcEls.coachText.innerHTML = '<span class="coach-placeholder">Press "Ask coach" for a coaching note on this card.</span>';

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

  // Name + minimal meta (type only — no text on front)
  fcEls.cardName.textContent = name;
  fcEls.cardMeta.textContent = data
    ? formatMeta(data, false)
    : '';

  updateProgress(pool.length);
};

// ─── Reveal ───────────────────────────────────────────────────────────────────

function fcReveal() {
  fc.isFlipped = true;
  fcEls.card.classList.add('is-flipped');
  fcEls.actionsFront.style.display = 'none';
  fcEls.actionsBack.style.display  = '';

  const name = fc.currentCard;
  const data = typeof CARD_DATA !== 'undefined' ? CARD_DATA[name] : null;

  fcEls.backName.textContent = name;

  if (data) {
    const stats = formatMeta(data, true);
    fcEls.oracle.innerHTML =
      `<div class="fc-oracle-stats">${stats}</div>` +
      (data.text ? escFc(data.text) : '<em>No oracle text</em>');
  } else {
    fcEls.oracle.textContent = 'No card data available. Run the fetch script to generate card-data.js.';
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

// ─── Ask coach ────────────────────────────────────────────────────────────────

async function fcAskCoach() {
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
}

// ─── Progress ─────────────────────────────────────────────────────────────────

function updateProgress(poolSize) {
  const total   = poolSize;
  const seen    = fc.session.seen;
  const pct     = total > 0 ? Math.min(100, Math.round((seen / total) * 100)) : 0;
  fcEls.progressFill.style.width  = pct + '%';
  fcEls.progressLabel.textContent = `${seen} shown this session — pool: ${total} cards`;
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
  fc.session = { knew: 0, unsure: 0, blank: 0, seen: 0 };
  fc.queue   = [];
  fcEls.knew.textContent   = '0';
  fcEls.unsure.textContent = '0';
  fcEls.blank.textContent  = '0';
  fcEls.weakList.innerHTML = '';
  fcEls.weakCount.textContent = '';
  Object.keys(sessionWeak).forEach(k => delete sessionWeak[k]);
  fc.drawCard();
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
