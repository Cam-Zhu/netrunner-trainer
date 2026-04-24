// ─── Default decklists ──────────────────────────────────────────────────────

const DEFAULTS = {
  corp: `Weyland Consortium: Built to Last
3x SDS Drone Deployment
3x The Basalt Spire
2x Charlotte Caçador
3x Clearinghouse
2x Spin Doctor
3x Wall to Wall
3x Hedge Fund
2x Key Performance Indicators
3x Measured Response
3x Petty Cash
1x Seamless Launch
1x Mavirus
3x Akhet
2x Logjam
2x Pharos
3x Tree Line
3x Mestnichestvo
2x Hammer`,

  runner: `Az McCaffrey: Mechanical Prodigy
3x Bravado
2x Meeting of Minds
2x Mutual Favor
3x Sure Gamble
2x Transfer of Wealth
2x Boomerang
1x Flip Switch
1x Hermes
1x Poison Vial
1x Asmund Pudlat
2x Dr. Nuka Vrolyck
1x Eru Ayase-Pessoa
3x Friend of a Friend
2x Juli Moreira Lee
1x Manuel Lattes de Moura
3x Open Market
1x Rent Rioters
2x Side Hustle
3x The Class Act
1x Valentina Ferreira Carvalho
1x Carmen
2x Curupira
1x Revolver
1x Shibboleth
1x Unity
1x Physarum Entangler
1x Tranquilizer`,
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
  let foundQuantityLine = false;

  for (const raw of text.split('\n')) {
    let line = raw.trim();
    if (!line || line.startsWith('//') || line.startsWith('#')) continue;

    // Strip NetrunnerDB influence pips (● and variations)
    line = line.replace(/\s*[●•·]+[\s●•·½]*/g, '').trim();

    // Skip category headers e.g. "Agenda (6)", "Barrier (10)"
    if (/^[A-Za-z\s\/]+\(\d+\)$/.test(line)) continue;

    // Skip footer lines
    if (/^\d+\s+(influence|agenda point|card)/i.test(line)) continue;
    if (/^cards up to/i.test(line)) continue;

    // Match quantity prefix: "3x Card Name" or "Card Name x3"
    const m = line.match(/^(\d+)x\s+(.+)$/i) || line.match(/^(.+?)\s+x(\d+)$/i);
    if (m) {
      foundQuantityLine = true;
      const count = parseInt(m[1]) || parseInt(m[2]);
      const name  = (m[2] || m[1]).trim();
      for (let i = 0; i < count; i++) cards.push(name);
    } else {
      // No quantity — skip the deck name (bare line before any quantity lines
      // and without a colon, which identity lines always have)
      if (!foundQuantityLine && !line.includes(':')) continue;
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
  decks:        { corp: parseDeck(savedDecks.corp), runner: parseDeck(savedDecks.runner) },
};

// ─── DOM refs ────────────────────────────────────────────────────────────────

const $ = id => document.getElementById(id);

const els = {
  corpInput:   $('corp-input'),
  runnerInput: $('runner-input'),
};

// ─── Initialise inputs ───────────────────────────────────────────────────────

els.corpInput.value   = savedDecks.corp;
els.runnerInput.value = savedDecks.runner;

// ─── Deck save ────────────────────────────────────────────────────────────────

function saveDeck(side) {
  const input  = $(side + '-input');
  const status = $(side + '-status');
  const text   = input.value.trim();
  if (!text) { status.textContent = 'Nothing to save.'; return; }
  state.decks[side] = parseDeck(text);
  saveDeckToStorage(side, text);
  status.textContent = `Saved — ${state.decks[side].length} cards in pool`;
  if (typeof window.refreshDeckAnalysis !== 'undefined') window.refreshDeckAnalysis(side);
  if (typeof window.plausible !== 'undefined') {
    window.plausible('Deck saved', { props: { side } });
  }
}
