// ─── Default decklists ──────────────────────────────────────────────────────

const DEFAULTS = {
  corp: `3x Hedge Fund
3x Rashida Jaheem
2x IPO
3x Ice Wall
2x Hagen
2x Brân 1.0
1x Hadrian's Wall
2x Border Control
2x Tollbooth
2x Engram Flush
2x Hostile Takeover
3x Project Atlas
1x Armored Servers
1x SSL Endorsement
2x Building a Better World
3x NGO Front
2x Dedication Ceremony
2x Audacity
3x Preemptive Action
2x Archer
1x The Board`,

  runner: `3x Sure Gamble
2x Diesel
3x Dirty Laundry
3x Earthrise Hotel
2x Liberated Account
3x Fermenter
2x Imp
2x Carpe Diem
3x Paladin Polet Hyndman
2x Knobkierie
3x Orca
2x Trickster Taka
2x Botulus
2x Chisel
2x Buzzsaw
2x Leech
1x Devil Charm
3x Steelskin Scarring
2x Bankhar`,
};

// ─── Card type inference ─────────────────────────────────────────────────────

const TYPE_PATTERNS = [
  [/hedge fund|sure gamble|ipo|dirty laundry|earthrise|liberated account|fermenter|ngo front|preemptive action|rashida/i, 'Economy'],
  [/ice wall|hadrian|hagen|brân|border control|tollbooth|engram flush|archer|chisel|botulus|buzzsaw|orca/i, 'Ice / Icebreaker'],
  [/atlas|hostile takeover|ssl endorsement|armored servers|the board/i, 'Agenda / Threat'],
  [/dedication ceremony|audacity|knobkierie|devil charm|building a better world/i, 'Operation / Hardware'],
  [/imp|taka|paladin|steelskin|bankhar|carpe diem|leech/i, 'Resource / Asset'],
];

function guessType(name) {
  for (const [re, label] of TYPE_PATTERNS) {
    if (re.test(name)) return label;
  }
  return 'Card';
}

// ─── Deck parsing ────────────────────────────────────────────────────────────

function parseDeck(text) {
  const cards = [];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('//') || line.startsWith('#')) continue;
    const m = line.match(/^(\d+)x\s+(.+)$/i) || line.match(/^(.+?)\s+x(\d+)$/i);
    if (m) {
      const count = parseInt(m[1]) || parseInt(m[2]);
      const name  = (m[2] || m[1]).trim();
      for (let i = 0; i < count; i++) cards.push(name);
    } else {
      cards.push(line);
    }
  }
  return cards;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── App state ───────────────────────────────────────────────────────────────

const state = {
  activeDeck:   'corp',
  mode:         'opening',
  decks:        { corp: parseDeck(DEFAULTS.corp), runner: parseDeck(DEFAULTS.runner) },
  hand:         [],
  selectedCard: null,
  mulligans:    0,
  loading:      false,
};

// ─── DOM refs ────────────────────────────────────────────────────────────────

const $ = id => document.getElementById(id);

const els = {
  handGrid:    $('hand-grid'),
  handStatus:  $('hand-status'),
  coachBody:   $('coach-body'),
  drawBtn:     $('draw-btn'),
  mulliganBtn: $('mulligan-btn'),
  analyseBtn:  $('analyse-btn'),
  handSize:    $('hand-size'),
  handSizeOut: $('hand-size-out'),
  corpInput:   $('corp-input'),
  runnerInput: $('runner-input'),
};

// ─── Initialise inputs ───────────────────────────────────────────────────────

els.corpInput.value   = DEFAULTS.corp;
els.runnerInput.value = DEFAULTS.runner;

// ─── Toggle controls ─────────────────────────────────────────────────────────

function bindToggle(groupId, key) {
  const group = $(groupId);
  group.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state[key] = btn.dataset.value;
      if (key === 'activeDeck') resetHand();
    });
  });
}

bindToggle('deck-toggle', 'activeDeck');
bindToggle('mode-toggle', 'mode');

// ─── Hand size slider ────────────────────────────────────────────────────────

els.handSize.addEventListener('input', () => {
  els.handSizeOut.textContent = els.handSize.value;
});

// ─── Draw / mulligan ─────────────────────────────────────────────────────────

els.drawBtn.addEventListener('click', drawHand);
els.mulliganBtn.addEventListener('click', () => { state.mulligans++; drawHand(); });
els.analyseBtn.addEventListener('click', analyseHand);

function drawHand() {
  const deck = state.decks[state.activeDeck];
  const size = parseInt(els.handSize.value);
  if (deck.length < size) {
    showCoach('Not enough cards in deck — add more cards in the editor below.');
    return;
  }
  state.hand = shuffle(deck).slice(0, size);
  state.selectedCard = null;
  renderHand();
  const mulliganNote = state.mulligans > 0 ? ` (mulligan ×${state.mulligans})` : ' (first draw)';
  els.handStatus.textContent = `${size} cards drawn${mulliganNote}`;
  els.mulliganBtn.disabled = false;
  els.analyseBtn.disabled  = false;
  showCoach('Click any card for focused coaching, or use "Analyse full hand" for an opening assessment.');
}

function resetHand() {
  state.hand         = [];
  state.selectedCard = null;
  state.mulligans    = 0;
  els.handGrid.innerHTML = `<div class="empty-hand"><span class="empty-icon">&#9632;</span><span>Draw a hand to begin</span></div>`;
  els.handStatus.textContent = 'No hand drawn yet';
  els.mulliganBtn.disabled   = true;
  els.analyseBtn.disabled    = true;
  showCoach('Click any card for focused coaching, or use "Analyse full hand" for an opening assessment.');
}

// ─── Render hand ─────────────────────────────────────────────────────────────

function renderHand() {
  const counts = {};
  state.hand.forEach(c => counts[c] = (counts[c] || 0) + 1);
  const seen = new Set();
  els.handGrid.innerHTML = '';

  state.hand.forEach((card, i) => {
    if (seen.has(card)) return;
    seen.add(card);

    const div = document.createElement('div');
    div.className = 'card-chip' + (state.selectedCard === card ? ' selected' : '');
    div.style.animationDelay = `${seen.size * 40}ms`;
    const imgUrl = (typeof CARD_IMAGES !== 'undefined') ? CARD_IMAGES[card] : null;
    const cardType = guessType(card);
    const isIce = cardType === 'Ice / Icebreaker' && state.activeDeck === 'corp';
    const artPosition = isIce ? 'bottom center' : 'top center';
    div.innerHTML = `
      <div class="card-art">
        ${imgUrl
          ? `<img src="${imgUrl}" alt="${escHtml(card)}" loading="lazy" style="object-position: ${artPosition};" />`
          : `<div class="card-art--missing"><span>${escHtml(card.slice(0,2).toUpperCase())}</span></div>`
        }
      </div>
      <div class="card-info">
        <div class="card-name">${escHtml(card)}</div>
        <div class="card-type">${cardType}</div>
        ${counts[card] > 1 ? `<div class="card-dupe">${counts[card]}× in hand</div>` : ''}
      </div>
    `;
    div.addEventListener('click', () => selectCard(card));
    els.handGrid.appendChild(div);
  });
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ─── Card selection ───────────────────────────────────────────────────────────

function selectCard(card) {
  state.selectedCard = card;
  renderHand();
  const deckLabel = state.activeDeck === 'corp' ? 'Weyland Glacier Corp' : 'Loup Anarch Runner';
  const prompt = buildCardPrompt(card, deckLabel);
  callCoach(prompt);
}

// ─── Analyse whole hand ───────────────────────────────────────────────────────

function analyseHand() {
  if (!state.hand.length) { drawHand(); return; }
  const deckLabel = state.activeDeck === 'corp' ? 'Weyland Glacier Corp' : 'Loup Anarch Runner';
  const prompt = buildHandPrompt(deckLabel);
  callCoach(prompt);
}

// ─── Prompt builders ──────────────────────────────────────────────────────────

function buildCardPrompt(card, deckLabel) {
  const handList = state.hand.join(', ');
  return `You are a competitive Android: Netrunner coach helping a player prepare for a District Championship. They are playing ${deckLabel}.

They selected: "${card}"
Full hand: ${handList}

Give tight, practical coaching on this card:
- What it does (1 sentence, assume the player is still learning)
- When to play it in this hand — turn 1, later, or hold?
- Any sequencing tip with the other cards visible
- One thing to watch out for

Max 80 words. Use Netrunner terminology. Be direct — no fluff.`;
}

function buildHandPrompt(deckLabel) {
  const handList = state.hand.join(', ');
  const modeInstructions = {
    opening: `Assess this opening hand for ${deckLabel}. Should they keep or mulligan, and why? Then describe exactly what to do on turns 1, 2, and 3. Be specific — name the cards and the order.`,
    card:    `Briefly explain what each card in this hand does and how they interact. Identify the 1-2 priority plays and why.`,
    situation: `Invent a plausible mid-game board state where this hand's cards are relevant. Describe the position in 1-2 sentences, then give the correct line of play and the key decision point.`,
  };
  return `You are a competitive Android: Netrunner coach helping a player prepare for a District Championship. They are playing ${deckLabel}.

Hand: ${handList}

${modeInstructions[state.mode]}

Max 120 words. Use Netrunner terminology. No fluff.`;
}

// ─── Coach API call ───────────────────────────────────────────────────────────

async function callCoach(prompt) {
  if (state.loading) return;
  state.loading = true;
  els.coachBody.innerHTML = '<span class="coach-loading">Thinking</span>';

  try {
    const res = await fetch('/api/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const text = (data.content || []).map(b => b.text || '').join('').trim();
    showCoach(text || '(no response)');
  } catch (err) {
    showCoach(`Error: ${err.message}.\n\nMake sure ANTHROPIC_API_KEY is set in your Netlify environment variables.`);
  }

  state.loading = false;
}

function showCoach(text) {
  els.coachBody.textContent = text;
}

// ─── Deck save ────────────────────────────────────────────────────────────────

function saveDeck(side) {
  const input  = $(side + '-input');
  const status = $(side + '-status');
  const text   = input.value.trim();
  if (!text) { status.textContent = 'Nothing to save.'; return; }
  state.decks[side] = parseDeck(text);
  status.textContent = `Saved — ${state.decks[side].length} cards in pool`;
  if (state.activeDeck === side) resetHand();
}
