// ─── Level definitions ────────────────────────────────────────────────────────
// Each level maps to one or more set_id values from CARD_DATA.
// The fetch script stores set_id as the NRDB set code (e.g. "sg", "elev").
// Cumulative mode includes all sets from level 1 up to and including this level.

const LEVELS = [
  {
    id:      1,
    name:    'System Gateway',
    desc:    'The core set — fundamentals of every faction',
    sets:    ['system_gateway'],
    color:   'var(--corp)',
  },
  {
    id:      2,
    name:    'Elevation',
    desc:    'The second core set — deepens Gateway mechanics',
    sets:    ['elevation'],
    color:   'var(--runner)',
  },
  {
    id:      3,
    name:    'Vantage Point',
    desc:    'The latest NSG release',
    sets:    ['vantage_point'],
    color:   'var(--accent)',
  },
  {
    id:      4,
    name:    'Ashes Cycle',
    desc:    'Downfall + Uprising',
    sets:    ['downfall', 'uprising'],
    color:   'var(--warn)',
  },
  {
    id:      5,
    name:    'Borealis Cycle',
    desc:    'Midnight Sun + Parhelion',
    sets:    ['midnight_sun', 'parhelion'],
    color:   '#4a9eff',
  },
  {
    id:      6,
    name:    'Liberation Cycle',
    desc:    'The Automata Initiative + Rebellion Without Rehearsal',
    sets:    ['the_automata_initiative', 'rebellion_without_rehearsal'],
    color:   'var(--accent)',
  },
];

const PASS_THRESHOLD = 0.80; // 80% "knew it" to pass
const STORAGE_KEY_CH = 'nrtrainer_challenge';
const STORAGE_KEY_CH_MODE = 'nrtrainer_challenge_mode';

// ─── State ────────────────────────────────────────────────────────────────────

const ch = {
  // Persisted: { "1_set": true, "1_cum": true, "2_set": false, ... }
  progress: loadProgress(),

  // Display mode: 'art' (art first) or 'name' (name first) — persisted
  displayMode: localStorage.getItem(STORAGE_KEY_CH_MODE) || 'art',

  // Active level session
  active: null,
};

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_CH) || '{}'); }
  catch { return {}; }
}

function saveProgress() {
  try { localStorage.setItem(STORAGE_KEY_CH, JSON.stringify(ch.progress)); }
  catch {}
}

function progressKey(levelId, mode) { return `${levelId}_${mode}`; }

function isPassed(levelId, mode) {
  return !!ch.progress[progressKey(levelId, mode)];
}

// Level 1 always unlocked; each subsequent level unlocks when the previous
// level has been passed in at least one mode.
function isUnlocked(levelId) {
  if (levelId === 1) return true;
  const prev = LEVELS.find(l => l.id === levelId - 1);
  if (!prev) return false;
  return isPassed(prev.id, 'set') || isPassed(prev.id, 'cum');
}

// ─── Pool building ────────────────────────────────────────────────────────────

function buildChallengePool(levelId, mode) {
  if (typeof CARD_DATA === 'undefined') return [];

  let targetSets;
  if (mode === 'set') {
    const level = LEVELS.find(l => l.id === levelId);
    targetSets = new Set(level.sets);
  } else {
    // Cumulative — all sets up to and including this level
    targetSets = new Set();
    LEVELS.filter(l => l.id <= levelId).forEach(l => l.sets.forEach(s => targetSets.add(s)));
  }

  return Object.entries(CARD_DATA)
    .filter(([, d]) => targetSets.has(d.set_id))
    .map(([name]) => name);
}

function buildChallengeQueue(pool, results) {
  // Weight: blank → 3×, unsure → 2×, not yet seen or knew → 1×
  const q = [];
  for (const name of pool) {
    const r = results[name];
    const weight = r === 'blank' ? 3 : r === 'unsure' ? 2 : 1;
    for (let i = 0; i < weight; i++) q.push(name);
  }
  for (let i = q.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [q[i], q[j]] = [q[j], q[i]];
  }
  return q;
}

// ─── DOM refs ─────────────────────────────────────────────────────────────────

const chEls = {
  levelMap:       document.getElementById('ch-level-map'),
  active:         document.getElementById('ch-active'),
  activeTitle:    document.getElementById('ch-active-title'),
  activeSub:      document.getElementById('ch-active-sub'),
  quitBtn:        document.getElementById('ch-quit-btn'),
  thresholdFill:  document.getElementById('ch-threshold-fill'),
  thresholdLabel: document.getElementById('ch-threshold-label'),
  card:           document.getElementById('ch-card'),
  front:          document.getElementById('ch-front'),
  frontName:      document.getElementById('ch-front-name'),
  back:           document.getElementById('ch-back'),
  backImage:      document.getElementById('ch-back-image'),
  art:            document.getElementById('ch-art'),
  artPlaceholder: document.getElementById('ch-art-placeholder'),
  artWrap:        document.getElementById('ch-art-wrap'),
  cardName:       document.getElementById('ch-card-name'),
  cardMeta:       document.getElementById('ch-card-meta'),
  nameOnly:       document.getElementById('ch-name-only'),
  backName:       document.getElementById('ch-back-name'),
  oracle:         document.getElementById('ch-oracle'),
  fullArt:        document.getElementById('ch-full-art'),
  actionsFront:   document.getElementById('ch-actions-front'),
  actionsBack:    document.getElementById('ch-actions-back'),
  progressFill:   document.getElementById('ch-progress-fill'),
  progressLabel:  document.getElementById('ch-progress-label'),
  result:         document.getElementById('ch-result'),
  resultIcon:     document.getElementById('ch-result-icon'),
  resultTitle:    document.getElementById('ch-result-title'),
  resultBody:     document.getElementById('ch-result-body'),
  resultNext:     document.getElementById('ch-result-next'),
  resultRetry:    document.getElementById('ch-result-retry'),
};

// ─── Event listeners ──────────────────────────────────────────────────────────

chEls.quitBtn.addEventListener('click', () => {
  ch.active = null;
  chEls.active.style.display = 'none';
  chEls.result.style.display = 'none';
  chEls.levelMap.style.display = '';
  ch.renderLevelMap();
});

document.getElementById('ch-reveal-btn').addEventListener('click', chReveal);
document.getElementById('ch-knew-btn').addEventListener('click',   () => chRate('knew'));
document.getElementById('ch-unsure-btn').addEventListener('click', () => chRate('unsure'));
document.getElementById('ch-blank-btn').addEventListener('click',  () => chRate('blank'));
// document.getElementById('ch-coach-btn').addEventListener('click',  chAskCoach);

chEls.resultNext.addEventListener('click', () => {
  chEls.result.style.display = 'none';
  chEls.levelMap.style.display = '';
  ch.active = null;
  ch.renderLevelMap();
});

chEls.resultRetry.addEventListener('click', () => {
  chEls.result.style.display = 'none';
  if (ch.active) {
    const { levelId, mode } = ch.active;
    chStartLevel(levelId, mode);
  }
});

// ─── Level map rendering ──────────────────────────────────────────────────────

ch.renderLevelMap = function() {
  chEls.levelMap.innerHTML = '';

  // Display mode toggle
  const modeBar = document.createElement('div');
  modeBar.className = 'ch-mode-bar';
  modeBar.innerHTML = `
    <span class="ch-mode-bar-label">Card display</span>
    <div class="toggle-group" id="ch-display-toggle">
      <button class="toggle-btn ${ch.displayMode === 'art'  ? 'active' : ''}" data-display="art">Art first</button>
      <button class="toggle-btn ${ch.displayMode === 'name' ? 'active' : ''}" data-display="name">Name first</button>
    </div>
  `;
  modeBar.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modeBar.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      ch.displayMode = btn.dataset.display;
      try { localStorage.setItem(STORAGE_KEY_CH_MODE, ch.displayMode); } catch {}
    });
  });
  chEls.levelMap.appendChild(modeBar);

  LEVELS.forEach(level => {
    const unlocked  = isUnlocked(level.id);
    const passedSet = isPassed(level.id, 'set');
    const passCum   = isPassed(level.id, 'cum');
    const both      = passedSet && passCum;

    const card = document.createElement('div');
    card.className = `ch-level-card ${unlocked ? 'unlocked' : 'locked'} ${both ? 'passed-both' : ''}`;

    const setLabel  = passedSet ? '✓ Passed' : 'Not passed';
    const cumLabel  = passCum   ? '✓ Passed' : 'Not passed';

    card.innerHTML = `
      <div class="ch-level-num">${level.id}</div>
      <div class="ch-level-info">
        <div class="ch-level-name" style="color:${unlocked ? level.color : 'var(--text-mute)'}">
          ${escCh(level.name)}
        </div>
        <div class="ch-level-desc">${escCh(level.desc)}</div>
      </div>
      ${unlocked ? `
        <div class="ch-level-modes">
          <button class="ch-mode-btn ${passedSet ? 'passed' : ''}" data-level="${level.id}" data-mode="set">
            <span class="ch-mode-label">Set only</span>
            <span class="ch-mode-badge">${setLabel}</span>
          </button>
          <button class="ch-mode-btn ${passCum ? 'passed' : ''}" data-level="${level.id}" data-mode="cum">
            <span class="ch-mode-label">Cumulative</span>
            <span class="ch-mode-badge">${cumLabel}</span>
          </button>
        </div>
      ` : `<div class="ch-lock-icon">&#128274;</div>`}
    `;

    if (unlocked) {
      card.querySelectorAll('.ch-mode-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          chStartLevel(parseInt(btn.dataset.level), btn.dataset.mode);
        });
      });
    }

    chEls.levelMap.appendChild(card);
  });
};

// ─── Start a level ────────────────────────────────────────────────────────────

function chStartLevel(levelId, mode) {
  const pool = buildChallengePool(levelId, mode);
  if (!pool.length) {
    alert('No cards found for this level. Make sure card-data.js is up to date (run the fetch script).');
    return;
  }

  const level = LEVELS.find(l => l.id === levelId);

  ch.active = {
    levelId, mode, pool,
    queue:       buildChallengeQueue(pool, {}),
    currentCard: null,
    isFlipped:   false,
    results:     {},   // cardName → 'knew' | 'unsure' | 'blank'
    seen:        new Set(),
  };

  const modeLabel = mode === 'set' ? 'Set focus' : 'Cumulative';
  chEls.activeTitle.textContent = `Level ${levelId}: ${level.name}`;
  chEls.activeSub.textContent   = `${modeLabel} · ${pool.length} cards · Pass: ${Math.round(PASS_THRESHOLD * 100)}% knew it`;

  chEls.levelMap.style.display  = 'none';
  chEls.result.style.display    = 'none';
  chEls.active.style.display    = '';

  chDraw();
}

// ─── Draw next card ───────────────────────────────────────────────────────────

function chDraw() {
  const a = ch.active;
  if (!a) return;

  // Refill queue when empty, using latest results for weighting
  if (!a.queue.length) a.queue = buildChallengeQueue(a.pool, a.results);

  // Pick next, avoid immediate repeat
  let name = a.queue.pop();
  if (name === a.currentCard && a.queue.length) {
    a.queue.unshift(name);
    name = a.queue.pop();
  }

  a.currentCard = name;
  a.isFlipped   = false;
  a.seen.add(name);

  // Reset UI
  chEls.card.classList.remove('is-flipped');
  chEls.actionsFront.style.display = '';
  chEls.actionsBack.style.display  = 'none';
  chEls.back.style.display         = 'none';
  chEls.backImage.style.display    = 'none';

  if (ch.displayMode === 'name') {
    chEls.front.style.display     = 'none';
    chEls.frontName.style.display = '';
    chEls.nameOnly.textContent    = name;
  } else {
    chEls.front.style.display     = '';
    chEls.frontName.style.display = 'none';

    const imgUrl = typeof CARD_IMAGES !== 'undefined' ? CARD_IMAGES[name] : null;
    const data   = typeof CARD_DATA   !== 'undefined' ? CARD_DATA[name]   : null;
    const isIce  = data?.type === 'ice';

    if (imgUrl) {
      chEls.art.src = imgUrl;
      chEls.art.className = isIce ? 'ice-art' : '';
      chEls.artPlaceholder.classList.add('hidden');
    } else {
      chEls.art.src = '';
      chEls.artPlaceholder.classList.remove('hidden');
    }

    chEls.cardName.textContent = name;
    chEls.cardMeta.textContent = data ? chFormatMeta(data, false) : '';
  }

  chUpdateProgress();
}

// ─── Reveal ───────────────────────────────────────────────────────────────────

function chReveal() {
  const a = ch.active;
  if (!a) return;
  a.isFlipped = true;
  chEls.actionsFront.style.display = 'none';
  chEls.actionsBack.style.display  = '';

  const name = a.currentCard;
  const data = typeof CARD_DATA !== 'undefined' ? CARD_DATA[name] : null;

  if (ch.displayMode === 'name') {
    chEls.frontName.style.display = 'none';
    chEls.back.style.display      = 'none';
    chEls.backImage.style.display = 'block';
    const imgUrl = typeof CARD_IMAGES !== 'undefined' ? CARD_IMAGES[name] : null;
    if (imgUrl) {
      chEls.fullArt.src = imgUrl.replace('/small/', '/large/');
      chEls.fullArt.alt = name;
    } else {
      chEls.fullArt.src = '';
    }
  } else {
    chEls.front.style.display = 'none';
    chEls.back.style.display  = 'block';
    chEls.backImage.style.display = 'none';
    chEls.backName.textContent = name;
    if (data) {
      chEls.oracle.innerHTML =
        `<div class="fc-oracle-stats">${chFormatMeta(data, true)}</div>` +
        (data.text ? escCh(data.text) : '<em>No oracle text</em>');
    } else {
      chEls.oracle.textContent = 'No card data — run the fetch script.';
    }
  }
}

// ─── Rate and check for level completion ──────────────────────────────────────

function chRate(result) {
  const a = ch.active;
  if (!a) return;

  a.results[a.currentCard] = result;
  chUpdateProgress();

  // Check if all cards have been seen at least once and threshold is met
  const allSeen     = a.pool.every(name => a.seen.has(name));
  const knewCount   = Object.values(a.results).filter(r => r === 'knew').length;
  const ratedCount  = Object.keys(a.results).length;
  const knewPct     = ratedCount > 0 ? knewCount / ratedCount : 0;

  if (allSeen && knewPct >= PASS_THRESHOLD) {
    chShowResult(true);
  } else if (allSeen && a.queue.length === 0) {
    // Exhausted queue with all cards seen — check if still failing
    const remainingWeak = a.pool.filter(n => {
      const r = a.results[n];
      return !r || r === 'blank' || r === 'unsure';
    });
    if (remainingWeak.length === 0) {
      chShowResult(true);
    } else {
      chDraw(); // keep going — cards still need work
    }
  } else {
    chDraw();
  }
}

// ─── Show result ──────────────────────────────────────────────────────────────

function chShowResult(passed) {
  const a = ch.active;
  if (!a) return;

  if (passed) {
    ch.progress[progressKey(a.levelId, a.mode)] = true;
    saveProgress();
    // Plausible analytics
    if (typeof window.plausible !== 'undefined') {
      window.plausible('Level passed', { props: { level: String(a.levelId), mode: a.mode } });
    }
  }

  const knewCount  = Object.values(a.results).filter(r => r === 'knew').length;
  const total      = Object.keys(a.results).length;
  const pct        = total > 0 ? Math.round((knewCount / total) * 100) : 0;
  const level      = LEVELS.find(l => l.id === a.levelId);
  const modeLabel  = a.mode === 'set' ? 'Set focus' : 'Cumulative';

  chEls.active.style.display = 'none';
  chEls.result.style.display = '';

  if (passed) {
    chEls.resultIcon.textContent  = '✓';
    chEls.resultIcon.style.color  = 'var(--accent)';
    chEls.resultTitle.textContent = 'Level passed!';
    chEls.resultTitle.style.color = 'var(--accent)';

    // Check if next level exists
    const nextLevel = LEVELS.find(l => l.id === a.levelId + 1);
    chEls.resultNext.textContent = nextLevel ? `Start Level ${nextLevel.id}` : 'Back to map';
    chEls.resultNext.onclick = () => {
      chEls.result.style.display = 'none';
      chEls.levelMap.style.display = '';
      ch.active = null;
      ch.renderLevelMap();
      if (nextLevel) chStartLevel(nextLevel.id, a.mode);
    };
  } else {
    chEls.resultIcon.textContent  = '✗';
    chEls.resultIcon.style.color  = 'var(--danger)';
    chEls.resultTitle.textContent = 'Not yet…';
    chEls.resultTitle.style.color = 'var(--danger)';
    chEls.resultNext.textContent  = 'Back to map';
    chEls.resultNext.onclick = () => {
      chEls.result.style.display = 'none';
      chEls.levelMap.style.display = '';
      ch.active = null;
      ch.renderLevelMap();
    };
  }

  chEls.resultBody.textContent =
    `${level.name} · ${modeLabel}\n` +
    `${knewCount} / ${total} cards known (${pct}%)\n` +
    `Pass requires ${Math.round(PASS_THRESHOLD * 100)}%`;
}

// ─── Progress update ──────────────────────────────────────────────────────────

function chUpdateProgress() {
  const a = ch.active;
  if (!a) return;

  const total      = a.pool.length;
  const seen       = a.seen.size;
  const knewCount  = Object.values(a.results).filter(r => r === 'knew').length;
  const rated      = Object.keys(a.results).length;
  const knewPct    = rated > 0 ? (knewCount / rated) : 0;

  // Threshold bar shows % of rated cards that are "knew"
  chEls.thresholdFill.style.width = Math.round(knewPct * 100) + '%';
  chEls.thresholdFill.style.background = knewPct >= PASS_THRESHOLD
    ? 'var(--accent)' : 'var(--warn)';

  chEls.thresholdLabel.innerHTML =
    `<span>${Math.round(knewPct * 100)}% knew it</span>` +
    `<span>${Math.round(PASS_THRESHOLD * 100)}% needed to pass</span>`;

  // Card progress bar shows how many cards have been seen
  const seenPct = total > 0 ? Math.round((seen / total) * 100) : 0;
  chEls.progressFill.style.width = seenPct + '%';
  chEls.progressLabel.textContent =
    `${seen} / ${total} cards seen  ·  ${knewCount} knew · ` +
    `${Object.values(a.results).filter(r => r === 'unsure').length} unsure · ` +
    `${Object.values(a.results).filter(r => r === 'blank').length} blank`;
}

// ─── Coach (temporarily disabled) ────────────────────────────────────────────

/* async function chAskCoach() {
  const a = ch.active;
  if (!a || !a.currentCard) return;
  const name = a.currentCard;

  chEls.coachText.innerHTML = '<span class="coach-loading">Thinking</span>';

  const data    = typeof CARD_DATA !== 'undefined' ? CARD_DATA[name] : null;
  const context = data
    ? `\nCARD ORACLE TEXT:\n${name} [${data.type}${data.subtypes?.length ? ' — ' + data.subtypes.join(', ') : ''}]${data.cost != null ? ' | Cost: ' + data.cost : ''}${data.strength != null ? ' | Str: ' + data.strength : ''}\n  "${data.text}"\n`
    : '';

  const prompt =
    `A player is doing challenge mode flashcards for Android: Netrunner. They just revealed: "${name}".${context}\n` +
    `Give a compact coaching note: what it does, when you'd play it, and one key tip. Max 60 words. Direct.`;

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
    chEls.coachText.textContent = text || '(no response)';
  } catch (err) {
    chEls.coachText.textContent = `Error: ${err.message}`;
  }
} */

// ─── Helpers ──────────────────────────────────────────────────────────────────

function chFormatMeta(data, full) {
  const parts = [data.type + (data.subtypes?.length ? ' — ' + data.subtypes.join(', ') : '')];
  if (full) {
    if (data.cost       != null) parts.push(`Cost: ${data.cost}`);
    if (data.strength   != null) parts.push(`Str: ${data.strength}`);
    if (data.mu_cost    != null) parts.push(`MU: ${data.mu_cost}`);
    if (data.trash_cost != null) parts.push(`Trash: ${data.trash_cost}`);
    if (data.agenda_points != null) parts.push(`Agenda: ${data.advancement}/${data.agenda_points}`);
    if (data.influence  != null && data.influence > 0) parts.push(`Inf: ${data.influence}`);
    if (data.set_name)           parts.push(data.set_name);
  }
  return parts.join(' · ');
}

function escCh(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ─── Init ─────────────────────────────────────────────────────────────────────
// Level map is rendered when the Challenge tab is clicked (via flashcards.js nav).
// Pre-render it now so it's ready on first visit.
ch.renderLevelMap();
