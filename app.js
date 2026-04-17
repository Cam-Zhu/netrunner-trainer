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

const STORAGE_KEY_DECKS = 'nrtrainer_decks';

function loadSavedDecks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY_DECKS) || '{}');
    return {
      corp:   saved.corp   || DEFAULTS.corp,
      runner: saved.runner || DEFAULTS.runner,
    };
  } catch { return { corp: DEFAULTS.corp, runner: DEFAULTS.runner }; }
}

function saveDeckToStorage(side, text) {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY_DECKS) || '{}');
    saved[side] = text;
    localStorage.setItem(STORAGE_KEY_DECKS, JSON.stringify(saved));
  } catch {}
}

// ─── App state ───────────────────────────────────────────────────────────────

const savedDecks = loadSavedDecks();

const state = {
  activeDeck:   'corp',
  mode:         'opening',
  decks:        { corp: parseDeck(savedDecks.corp), runner: parseDeck(savedDecks.runner) },
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

els.corpInput.value   = savedDecks.corp;
els.runnerInput.value = savedDecks.runner;

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

// ─── Deck identity detection ──────────────────────────────────────────────────

// Scans the active deck for an identity card and returns a description
// of the deck for use in coaching prompts.
function detectDeckInfo(side) {
  if (typeof CARD_DATA === 'undefined') {
    return side === 'corp' ? 'Corp' : 'Runner';
  }

  const deck = state.decks[side];

  // Find the identity card
  const identityCard = deck.find(name => {
    const d = CARD_DATA[name];
    return d && d.type === 'identity';
  });

  // Collect all factions represented in the deck (excluding neutral)
  const factions = new Set();
  deck.forEach(name => {
    const d = CARD_DATA[name];
    if (d && d.faction && !d.faction.includes('neutral')) {
      factions.add(d.faction.replace(/_/g, ' '));
    }
  });

  if (identityCard) {
    const d = CARD_DATA[identityCard];
    const faction = d.faction ? d.faction.replace(/_/g, ' ') : '';
    return `${identityCard}${faction ? ` (${faction})` : ''}`;
  }

  // No identity found — describe by faction composition
  if (factions.size === 1) return `${[...factions][0]} ${side}`;
  if (factions.size > 1)   return `${side} (${[...factions].join(' / ')})`;
  return side === 'corp' ? 'Corp' : 'Runner';
}

// ─── Card selection ───────────────────────────────────────────────────────────

function selectCard(card) {
  state.selectedCard = card;
  renderHand();
  const deckLabel = detectDeckInfo(state.activeDeck);
  const prompt = buildCardPrompt(card, deckLabel);
  callCoach(prompt);
}

// ─── Analyse whole hand ───────────────────────────────────────────────────────

function analyseHand() {
  if (!state.hand.length) { drawHand(); return; }
  const deckLabel = detectDeckInfo(state.activeDeck);
  const prompt = buildHandPrompt(deckLabel);
  callCoach(prompt);
}

// ─── Card context builder ─────────────────────────────────────────────────────

// Returns a compact oracle text block for a list of card names, sourced from
// CARD_DATA (card-data.js). Gracefully skips cards not in the map.
function buildCardContext(cardNames) {
  if (typeof CARD_DATA === 'undefined') return '';
  const lines = [];
  const seen = new Set();
  for (const name of cardNames) {
    if (seen.has(name)) continue;
    seen.add(name);
    const d = CARD_DATA[name];
    if (!d) continue;

    const parts = [];
    parts.push(`[${d.type}${d.subtypes.length ? ' — ' + d.subtypes.join(', ') : ''}]`);
    if (d.cost      != null) parts.push(`Cost: ${d.cost}`);
    if (d.strength  != null) parts.push(`Str: ${d.strength}`);
    if (d.mu_cost   != null) parts.push(`MU: ${d.mu_cost}`);
    if (d.trash_cost != null) parts.push(`Trash: ${d.trash_cost}`);
    if (d.agenda_points != null) parts.push(`Agenda: ${d.advancement}/${d.agenda_points}`);
    if (d.influence != null && d.influence > 0) parts.push(`Inf: ${d.influence}`);

    lines.push(`${name} ${parts.join(' | ')}${d.text ? '\n  "' + d.text + '"' : ''}`);
  }
  return lines.length ? '\nCARD ORACLE TEXT:\n' + lines.join('\n') + '\n' : '';
}

// ─── System prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an expert Android: Netrunner coach helping a player prepare for competitive play in the Standard format (Elevation card pool, 2026 season).

Key rules to apply precisely:
- Corp scores agendas from their hand by installing and fully advancing them (costs 1 click + credits to advance). Scoring costs 1 click.
- Runner accesses cards by making successful runs. Running costs 1 click.
- Each player has 4 clicks per turn unless modified.
- ICE is installed unrezzed. Rezzing costs credits. The Runner encounters ICE when running.
- Subroutines on unbroken ICE fire. Icebreakers break subroutines by spending credits.
- Cards with [->] are subroutines on ICE.
- Recurring credits refill at the start of each turn.
- Tags remain until the Runner spends 1 click and 2 credits to remove each one.
- Hoshiko Shiro, Bankhar, Cleaver, and several other cards are banned in Standard for the 2026 season.

Faction archetypes for reference:
- Haas-Bioroid: efficient ice, click manipulation, fast advance
- Jinteki: net damage, ambushes, taxing remotes, traps
- NBN: tagging, asset spam, fast advance, news cycles
- Weyland Consortium: big ice, glacier scoring, meat damage, economic operations
- Anarch: virus pressure, ice destruction, aggressive runs, resource denial
- Criminal: credits, run events, bypass, disruption
- Shaper: efficient breakers, recursion, setup-heavy, powerful late game

The player's identity and faction will be specified in each prompt. Coach accordingly — adapt your advice to the actual cards and identity provided, not generic assumptions. If oracle text is provided for a card, treat it as authoritative. Never invent card abilities. Be direct and concise.`;

// ─── Prompt builders ──────────────────────────────────────────────────────────

function buildCardPrompt(card, deckLabel) {
  const handList = state.hand.join(', ');
  const context  = buildCardContext(state.hand);
  return `Player is preparing for a District Championship with ${deckLabel}.

They selected: "${card}"
Full hand: ${handList}
${context}
Give tight coaching on this card:
- What it does (1 sentence)
- When to play it in this hand — turn 1, later, or hold?
- Any sequencing tip with the other cards visible
- One thing to watch out for

Max 80 words. Be direct.`;
}

function buildHandPrompt(deckLabel) {
  const handList = state.hand.join(', ');
  const context  = buildCardContext(state.hand);
  const modeInstructions = {
    opening:   `Assess this opening hand for ${deckLabel}. Should they keep or mulligan, and why? Then describe exactly what to do on turns 1, 2, and 3. Be specific — name the cards and the order.`,
    card:      `Explain what each card in this hand does and how they interact. Identify the 1-2 priority plays and why.`,
    situation: `Invent a plausible mid-game board state where these cards are relevant. Describe the position in 1-2 sentences, then give the correct line of play and the key decision point.`,
  };
  return `Player is preparing for a District Championship with ${deckLabel}.

Hand: ${handList}
${context}
${modeInstructions[state.mode]}

Max 120 words. Be direct.`;
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
      body: JSON.stringify({
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await res.json();
    if (res.status === 429) {
      showCoach(data.error || 'Daily coach limit reached. Come back tomorrow.');
    } else if (!res.ok) {
      showCoach(`Error: HTTP ${res.status}.\n\nMake sure ANTHROPIC_API_KEY is set in your Netlify environment variables.`);
    } else {
      const text = (data.content || []).map(b => b.text || '').join('').trim();
      showCoach(text || '(no response)');
    }
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
  saveDeckToStorage(side, text);
  status.textContent = `Saved — ${state.decks[side].length} cards in pool`;
  if (state.activeDeck === side) resetHand();
}
