// ─── Level definitions ────────────────────────────────────────────────────────

const LEVELS = [
{
id:    1,
name:  ‘System Gateway’,
desc:  ‘The core set — fundamentals of every faction’,
sets:  [‘system_gateway’],
color: ‘var(–corp)’,
},
{
id:    2,
name:  ‘Elevation’,
desc:  ‘The second core set — deepens Gateway mechanics’,
sets:  [‘elevation’],
color: ‘var(–runner)’,
},
{
id:    3,
name:  ‘Vantage Point’,
desc:  ‘The latest NSG release’,
sets:  [‘vantage_point’],
color: ‘var(–accent)’,
},
{
id:    4,
name:  ‘Ashes Cycle’,
desc:  ‘Downfall + Uprising’,
sets:  [‘downfall’, ‘uprising’],
color: ‘var(–warn)’,
},
{
id:    5,
name:  ‘Borealis Cycle’,
desc:  ‘Midnight Sun + Parhelion’,
sets:  [‘midnight_sun’, ‘parhelion’],
color: ‘#4a9eff’,
},
{
id:    6,
name:  ‘Liberation Cycle’,
desc:  ‘The Automata Initiative + Rebellion Without Rehearsal’,
sets:  [‘the_automata_initiative’, ‘rebellion_without_rehearsal’],
color: ‘var(–accent)’,
},
];

const STORAGE_KEY_CH      = ‘nrtrainer_card_ratings’;  // shared with Flashcards
const STORAGE_KEY_CH_MODE = ‘nrtrainer_challenge_mode’;

// ─── State ────────────────────────────────────────────────────────────────────

const ch = {
ratings:     loadRatings(),
displayMode: localStorage.getItem(STORAGE_KEY_CH_MODE) || ‘art’,
active:      null,
};

function loadRatings() {
try { return JSON.parse(localStorage.getItem(STORAGE_KEY_CH) || ‘{}’); }
catch { return {}; }
}

function saveRatings() {
try { localStorage.setItem(STORAGE_KEY_CH, JSON.stringify(ch.ratings)); }
catch {}
}

// ─── Pool building ────────────────────────────────────────────────────────────

function buildLevelPool(levelId) {
if (typeof CARD_DATA === ‘undefined’) return [];
const level = LEVELS.find(l => l.id === levelId);
const sets  = new Set(level.sets);
return Object.entries(CARD_DATA)
.filter(([, d]) => sets.has(d.set_id))
.map(([name]) => name);
}

function buildStudyPool(levelId) {
// Study: unseen + unsure + blank only — never knew
return buildLevelPool(levelId).filter(n => ch.ratings[n] !== ‘knew’);
}

function buildWeakPool(levelId) {
return buildLevelPool(levelId).filter(n => {
const r = ch.ratings[n];
return r === ‘unsure’ || r === ‘blank’;
});
}

function shuffle(arr) {
const a = […arr];
for (let i = a.length - 1; i > 0; i–) {
const j = Math.floor(Math.random() * (i + 1));
[a[i], a[j]] = [a[j], a[i]];
}
return a;
}

function buildQueue(pool) {
// Strict order: unseen first, then unsure, then blank
// Each group shuffled randomly within itself
// Queue is popped from end so unseen comes out first
const unseen = pool.filter(n => !ch.ratings[n]);
const unsure = pool.filter(n => ch.ratings[n] === ‘unsure’);
const blank  = pool.filter(n => ch.ratings[n] === ‘blank’);
return […shuffle(blank), …shuffle(unsure), …shuffle(unseen)];
}

// ─── Level stats ──────────────────────────────────────────────────────────────

function levelStats(levelId) {
const pool   = buildLevelPool(levelId);
const knew   = pool.filter(n => ch.ratings[n] === ‘knew’).length;
const unsure = pool.filter(n => ch.ratings[n] === ‘unsure’).length;
const blank  = pool.filter(n => ch.ratings[n] === ‘blank’).length;
return { pool, knew, unsure, blank, total: pool.length };
}

function isMastered(levelId) {
const { knew, total } = levelStats(levelId);
return total > 0 && knew === total;
}

// ─── DOM refs ─────────────────────────────────────────────────────────────────

const chEls = {
levelMap:       document.getElementById(‘ch-level-map’),
active:         document.getElementById(‘ch-active’),
activeTitle:    document.getElementById(‘ch-active-title’),
activeSub:      document.getElementById(‘ch-active-sub’),
quitBtn:        document.getElementById(‘ch-quit-btn’),
thresholdFill:  document.getElementById(‘ch-threshold-fill’),
thresholdLabel: document.getElementById(‘ch-threshold-label’),
card:           document.getElementById(‘ch-card’),
front:          document.getElementById(‘ch-front’),
frontName:      document.getElementById(‘ch-front-name’),
back:           document.getElementById(‘ch-back’),
backImage:      document.getElementById(‘ch-back-image’),
art:            document.getElementById(‘ch-art’),
artPlaceholder: document.getElementById(‘ch-art-placeholder’),
artWrap:        document.getElementById(‘ch-art-wrap’),
cardName:       document.getElementById(‘ch-card-name’),
cardMeta:       document.getElementById(‘ch-card-meta’),
nameOnly:       document.getElementById(‘ch-name-only’),
backName:       document.getElementById(‘ch-back-name’),
oracle:         document.getElementById(‘ch-oracle’),
fullArt:        document.getElementById(‘ch-full-art’),
actionsFront:   document.getElementById(‘ch-actions-front’),
actionsBack:    document.getElementById(‘ch-actions-back’),
progressFill:   document.getElementById(‘ch-progress-fill’),
progressLabel:  document.getElementById(‘ch-progress-label’),
result:         document.getElementById(‘ch-result’),
resultIcon:     document.getElementById(‘ch-result-icon’),
resultTitle:    document.getElementById(‘ch-result-title’),
resultBody:     document.getElementById(‘ch-result-body’),
resultNext:     document.getElementById(‘ch-result-next’),
resultRetry:    document.getElementById(‘ch-result-retry’),
};

// ─── Event listeners ──────────────────────────────────────────────────────────

chEls.quitBtn.addEventListener(‘click’, () => {
ch.active = null;
chEls.active.style.display   = ‘none’;
chEls.result.style.display   = ‘none’;
chEls.levelMap.style.display = ‘’;
ch.renderLevelMap();
});

document.getElementById(‘ch-reveal-btn’).addEventListener(‘click’, chReveal);
document.getElementById(‘ch-knew-btn’).addEventListener(‘click’,   () => chRate(‘knew’));
document.getElementById(‘ch-unsure-btn’).addEventListener(‘click’, () => chRate(‘unsure’));
document.getElementById(‘ch-blank-btn’).addEventListener(‘click’,  () => chRate(‘blank’));

chEls.resultNext.addEventListener(‘click’, () => {
chEls.result.style.display   = ‘none’;
chEls.levelMap.style.display = ‘’;
ch.active = null;
ch.renderLevelMap();
});

chEls.resultRetry.addEventListener(‘click’, () => {
chEls.result.style.display = ‘none’;
if (!ch.active) return;
const { levelId, mode, customPool, pool } = ch.active;
if (customPool) {
window.chStartCustomPool(pool);
} else if (mode === ‘weak’ && buildWeakPool(levelId).length === 0) {
chStartLevel(levelId, ‘study’);
} else {
chStartLevel(levelId, mode);
}
});

// ─── Level map ────────────────────────────────────────────────────────────────

ch.renderLevelMap = function() {
chEls.levelMap.innerHTML = ‘’;

// Display mode toggle
const modeBar = document.createElement(‘div’);
modeBar.className = ‘ch-mode-bar’;
modeBar.innerHTML = `<span class="ch-mode-bar-label">Card display</span> <div class="toggle-group" id="ch-display-toggle"> <button class="toggle-btn ${ch.displayMode === 'art'  ? 'active' : ''}" data-display="art">Art first</button> <button class="toggle-btn ${ch.displayMode === 'name' ? 'active' : ''}" data-display="name">Name first</button> </div>`;
modeBar.querySelectorAll(’.toggle-btn’).forEach(btn => {
btn.addEventListener(‘click’, () => {
modeBar.querySelectorAll(’.toggle-btn’).forEach(b => b.classList.remove(‘active’));
btn.classList.add(‘active’);
ch.displayMode = btn.dataset.display;
try { localStorage.setItem(STORAGE_KEY_CH_MODE, ch.displayMode); } catch {}
});
});
chEls.levelMap.appendChild(modeBar);

LEVELS.forEach(level => {
const { knew, unsure, blank, total } = levelStats(level.id);
const unrated  = total - knew - unsure - blank;
const mastered = isMastered(level.id);
const hasWeak  = (unsure + blank) > 0;

```
// Bar widths as percentages
const kW = total > 0 ? Math.round((knew   / total) * 100) : 0;
const uW = total > 0 ? Math.round((unsure / total) * 100) : 0;
const bW = total > 0 ? Math.round((blank  / total) * 100) : 0;
const nW = 100 - kW - uW - bW;

// Counts + percentages for labels
const kPct = kW;
const uPct = total > 0 ? Math.round((unsure  / total) * 100) : 0;
const bPct = total > 0 ? Math.round((blank   / total) * 100) : 0;
const nPct = total > 0 ? Math.round((unrated / total) * 100) : 0;

const card = document.createElement('div');
card.className = `ch-level-card${mastered ? ' ch-level-mastered' : ''}`;
if (mastered) card.style.setProperty('--level-color', 'var(--corp)');

card.innerHTML = `
  <div class="ch-level-num">${level.id}</div>
  <div class="ch-level-info">
    <div class="ch-level-name">${escCh(level.name)}</div>
    <div class="ch-level-desc">${escCh(level.desc)}</div>
    <div class="ch-level-pips">
      <span class="ch-pip ch-pip--knew"   title="Knew it">● ${knew} <span class="ch-pip-pct">(${kPct}%)</span></span>
      <span class="ch-pip ch-pip--unsure" title="Unsure">● ${unsure} <span class="ch-pip-pct">(${uPct}%)</span></span>
      <span class="ch-pip ch-pip--blank"  title="Blank">● ${blank} <span class="ch-pip-pct">(${bPct}%)</span></span>
      <span class="ch-pip ch-pip--unseen" title="Not yet seen">● ${unrated} <span class="ch-pip-pct">(${nPct}%)</span></span>
    </div>
    <div class="ch-level-bar" title="${knew} knew · ${unsure} unsure · ${blank} blank · ${unrated} unseen">
      <div class="ch-bar-seg ch-bar--knew"   style="width:${kW}%"></div>
      <div class="ch-bar-seg ch-bar--unsure" style="width:${uW}%"></div>
      <div class="ch-bar-seg ch-bar--blank"  style="width:${bW}%"></div>
      <div class="ch-bar-seg ch-bar--unseen" style="width:${nW}%"></div>
    </div>
  </div>
  <div class="ch-level-actions">
    ${!mastered ? `<button class="btn btn-primary btn-sm ch-study-btn" data-level="${level.id}">Study</button>` : ''}
    ${mastered  ? `<button class="btn btn-primary btn-sm ch-studyall-btn" data-level="${level.id}">Study all</button>` : ''}
    ${hasWeak   ? `<button class="btn btn-ghost btn-sm ch-review-btn" data-level="${level.id}">Review weak</button>` : ''}
  </div>
`;

const studyBtn = card.querySelector('.ch-study-btn');
if (studyBtn) {
  studyBtn.addEventListener('click', e => {
    e.stopPropagation();
    chStartLevel(level.id, 'study');
  });
}

const studyAllBtn = card.querySelector('.ch-studyall-btn');
if (studyAllBtn) {
  studyAllBtn.addEventListener('click', e => {
    e.stopPropagation();
    chStartLevel(level.id, 'all');
  });
}

const reviewBtn = card.querySelector('.ch-review-btn');
if (reviewBtn) {
  reviewBtn.addEventListener('click', e => {
    e.stopPropagation();
    chStartLevel(level.id, 'weak');
  });
}

chEls.levelMap.appendChild(card);
```

});
};

// ─── Start a level ────────────────────────────────────────────────────────────

function chStartLevel(levelId, mode) {
// Reload ratings fresh in case Flashcards wrote new ratings this session
ch.ratings = loadRatings();

const pool =
mode === ‘weak’ ? buildWeakPool(levelId) :
mode === ‘all’  ? buildLevelPool(levelId) :
buildStudyPool(levelId);

if (!pool.length) {
if (mode === ‘study’) {
// All cards known — shouldn’t happen as Study is hidden when mastered
// but handle gracefully
chStartLevel(levelId, ‘all’);
return;
}
alert(mode === ‘weak’
? ‘No weak cards to review for this level.’
: ‘No cards found. Make sure card-data.js is up to date.’);
return;
}

const level = LEVELS.find(l => l.id === levelId);
const label = mode === ‘weak’ ? ‘Review weak cards’ :
mode === ‘all’  ? ‘Study all cards’ :
‘Study’;

ch.active = {
levelId,
mode,
reviewOnly: mode === ‘weak’,
customPool: false,
pool,
queue:         buildQueue(mode === ‘all’ ? pool : pool),
currentCard:   null,
isFlipped:     false,
seen:          new Set(),
sessionKnew:   0,
sessionUnsure: 0,
sessionBlank:  0,
};

chEls.activeTitle.textContent = `Level ${levelId}: ${level.name}`;
chEls.activeSub.textContent   = `${label} · ${pool.length} cards`;

chEls.levelMap.style.display = ‘none’;
chEls.result.style.display   = ‘none’;
chEls.active.style.display   = ‘’;

if (typeof window.plausible !== ‘undefined’) {
window.plausible(‘Study session started’, { props: { set: level.name } });
}

chDraw();
}

// ─── Draw next card ───────────────────────────────────────────────────────────

function chDraw() {
const a = ch.active;
if (!a) return;

if (a.seen.size >= a.pool.length && a.queue.length === 0) {
chShowResult();
return;
}

if (!a.queue.length) {
chShowResult();
return;
}

let name = a.queue.pop();
if (name === a.currentCard && a.queue.length) {
a.queue.unshift(name);
name = a.queue.pop();
}

a.currentCard = name;
a.isFlipped   = false;
a.seen.add(name);

chEls.card.classList.remove(‘is-flipped’);
chEls.actionsFront.style.display = ‘’;
chEls.actionsBack.style.display  = ‘none’;
chEls.back.style.display         = ‘none’;
chEls.backImage.style.display    = ‘none’;

if (ch.displayMode === ‘name’) {
chEls.front.style.display     = ‘none’;
chEls.frontName.style.display = ‘’;
chEls.nameOnly.textContent    = name;
} else {
chEls.front.style.display     = ‘’;
chEls.frontName.style.display = ‘none’;

```
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
```

}

chUpdateProgress();
}

// ─── Reveal ───────────────────────────────────────────────────────────────────

function chReveal() {
const a = ch.active;
if (!a) return;
a.isFlipped = true;
chEls.actionsFront.style.display = ‘none’;
chEls.actionsBack.style.display  = ‘’;

setTimeout(() => {
const rect = chEls.actionsBack.getBoundingClientRect();
if (rect.bottom > window.innerHeight) {
chEls.actionsBack.scrollIntoView({ behavior: ‘smooth’, block: ‘nearest’ });
}
}, 50);

const name = a.currentCard;
const data = typeof CARD_DATA !== ‘undefined’ ? CARD_DATA[name] : null;

if (ch.displayMode === ‘name’) {
chEls.frontName.style.display = ‘none’;
chEls.back.style.display      = ‘none’;
chEls.backImage.style.display = ‘block’;
const imgUrl = typeof CARD_IMAGES !== ‘undefined’ ? CARD_IMAGES[name] : null;
if (imgUrl) {
chEls.fullArt.src = imgUrl.replace(’/small/’, ‘/large/’);
chEls.fullArt.alt = name;
chEls.fullArt.onload = () => {
const rect = chEls.actionsBack.getBoundingClientRect();
if (rect.bottom > window.innerHeight) {
chEls.actionsBack.scrollIntoView({ behavior: ‘smooth’, block: ‘nearest’ });
}
};
} else {
chEls.fullArt.src = ‘’;
}
} else {
chEls.front.style.display     = ‘none’;
chEls.back.style.display      = ‘block’;
chEls.backImage.style.display = ‘none’;
chEls.backName.textContent    = name;
if (data) {
chEls.oracle.innerHTML =
`<div class="fc-oracle-stats">${chFormatMeta(data, true)}</div>` +
(data.text ? escCh(data.text) : ‘<em>No oracle text</em>’);
} else {
chEls.oracle.textContent = ‘No card data — run the fetch script.’;
}
}
}

// ─── Rate a card ──────────────────────────────────────────────────────────────

function chRate(result) {
const a = ch.active;
if (!a) return;

ch.ratings[a.currentCard] = result;
saveRatings();

if (result === ‘knew’)        a.sessionKnew++;
else if (result === ‘unsure’) a.sessionUnsure++;
else                          a.sessionBlank++;

chUpdateProgress();

if (a.seen.size >= a.pool.length) {
chShowResult();
} else {
chDraw();
}
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function chUpdateProgress() {
const a = ch.active;
if (!a) return;

const seen  = a.seen.size;
const total = a.pool.length;
const pct   = total > 0 ? Math.round((seen / total) * 100) : 0;

chEls.progressFill.style.width  = pct + ‘%’;
chEls.progressLabel.textContent =
`${seen} / ${total} cards  ·  ` +
`${a.sessionKnew} knew · ${a.sessionUnsure} unsure · ${a.sessionBlank} blank`;
}

// ─── Show result ──────────────────────────────────────────────────────────────

function chShowResult() {
const a = ch.active;
if (!a) return;

const total = a.sessionKnew + a.sessionUnsure + a.sessionBlank;
const pct   = total > 0 ? Math.round((a.sessionKnew / total) * 100) : 0;

chEls.active.style.display = ‘none’;
chEls.result.style.display = ‘’;

if (a.customPool) {
// Custom pool session from Flashcards
const allKnown = a.pool.every(n => ch.ratings[n] === ‘knew’);
chEls.resultIcon.textContent  = allKnown ? ‘✓’ : ‘●’;
chEls.resultIcon.style.color  = allKnown ? ‘var(–accent)’ : ‘var(–warn)’;
chEls.resultTitle.textContent = allKnown ? ‘All cards known!’ : ‘Session complete’;
chEls.resultTitle.style.color = allKnown ? ‘var(–accent)’ : ‘var(–text)’;
chEls.resultBody.textContent  =
`Flashcard weak cards · ${a.pool.length} cards\n` +
`Session: ${a.sessionKnew} knew · ${a.sessionUnsure} unsure · ${a.sessionBlank} blank (${pct}%)`;
chEls.resultNext.textContent = ‘Back to map’;
chEls.resultNext.onclick = () => {
chEls.result.style.display   = ‘none’;
chEls.levelMap.style.display = ‘’;
ch.active = null;
ch.renderLevelMap();
};
chEls.resultRetry.textContent = ‘Challenge again’;
if (typeof window.plausible !== ‘undefined’) {
window.plausible(‘Challenge session complete’, {
props: { level: ‘custom’, mastered: allKnown ? ‘yes’ : ‘no’ }
});
}
} else {
// Normal level session
const level    = LEVELS.find(l => l.id === a.levelId);
const mastered = isMastered(a.levelId);
const { knew, unsure, blank, total: lvTotal } = levelStats(a.levelId);

```
chEls.resultIcon.textContent  = mastered ? '✓' : '●';
chEls.resultIcon.style.color  = mastered ? 'var(--accent)' : 'var(--warn)';
chEls.resultTitle.textContent = mastered ? 'All cards known!' : 'Session complete';
chEls.resultTitle.style.color = mastered ? 'var(--accent)' : 'var(--text)';
chEls.resultBody.textContent  =
  `${level.name}\n` +
  `Session: ${a.sessionKnew} knew · ${a.sessionUnsure} unsure · ${a.sessionBlank} blank (${pct}%)\n` +
  `Overall: ${knew}/${lvTotal} known · ${unsure} unsure · ${blank} blank`;
chEls.resultNext.textContent = 'Back to map';
chEls.resultNext.onclick = () => {
  chEls.result.style.display   = 'none';
  chEls.levelMap.style.display = '';
  ch.active = null;
  ch.renderLevelMap();
};
chEls.resultRetry.textContent =
  a.mode === 'weak' ? 'Review again' :
  a.mode === 'all'  ? 'Study all again' :
                      'Study again';
if (typeof window.plausible !== 'undefined') {
  window.plausible('Challenge session complete', {
    props: { level: String(a.levelId), mastered: mastered ? 'yes' : 'no' }
  });
}
ch.renderLevelMap();
```

}
}

// ─── Coach (temporarily disabled) ────────────────────────────────────────────

/* async function chAskCoach() { … } */

// ─── Helpers ──────────────────────────────────────────────────────────────────

function chFormatMeta(data, full) {
const parts = [data.type + (data.subtypes?.length ? ’ — ’ + data.subtypes.join(’, ‘) : ‘’)];
if (full) {
if (data.cost          != null) parts.push(`Cost: ${data.cost}`);
if (data.strength      != null) parts.push(`Str: ${data.strength}`);
if (data.mu_cost       != null) parts.push(`MU: ${data.mu_cost}`);
if (data.trash_cost    != null) parts.push(`Trash: ${data.trash_cost}`);
if (data.agenda_points != null) parts.push(`Agenda: ${data.advancement}/${data.agenda_points}`);
if (data.influence     != null && data.influence > 0) parts.push(`Inf: ${data.influence}`);
if (data.set_name)               parts.push(data.set_name);
}
return parts.join(’ · ’);
}

function escCh(s) {
return String(s).replace(/&/g,’&’).replace(/</g,’<’).replace(/>/g,’>’);
}

// ─── Custom pool session (from Flashcards weak list) ─────────────────────────

window.chStartCustomPool = function(pool) {
if (!pool || !pool.length) return;

ch.active = {
levelId:       null,
reviewOnly:    false,
customPool:    true,
pool,
queue:         buildQueue(pool),
currentCard:   null,
isFlipped:     false,
seen:          new Set(),
sessionKnew:   0,
sessionUnsure: 0,
sessionBlank:  0,
};

chEls.activeTitle.textContent = ‘Flashcard Weak Cards’;
chEls.activeSub.textContent   = `Challenge session · ${pool.length} cards`;

chEls.levelMap.style.display = ‘none’;
chEls.result.style.display   = ‘none’;
chEls.active.style.display   = ‘’;

chDraw();
};

// ─── Init ─────────────────────────────────────────────────────────────────────

ch.renderLevelMap();

// Handle cross-tab launch from Flashcards weak list
if (window.chLaunchCustomPool) {
const pool = window.chLaunchCustomPool;
window.chLaunchCustomPool = null;
window.chStartCustomPool(pool);
}