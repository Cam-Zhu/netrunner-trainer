// ─────────────────────────────────────────────────────────────────────────────
// learning.js — Sequencing puzzles for the Play Helper Learning tab
// Tap-to-order interface. Randomly selects one puzzle per game.
// ─────────────────────────────────────────────────────────────────────────────

const PUZZLES = [

  {
    id: 'corp-turn',
    title: 'Corp Turn',
    prompt: 'Put the Corp turn phases in the correct order.',
    steps: [
      { id: 'ct1',  text: 'Corp gains allotted clicks' },
      { id: 'ct2',  text: 'Paid ability window' },
      { id: 'ct3',  text: 'Recurring credits refill' },
      { id: 'ct4',  text: 'Turn begins' },
      { id: 'ct5',  text: 'Corp draws 1 card (mandatory draw)' },
      { id: 'ct6',  text: 'Paid ability window (start of action phase)' },
      { id: 'ct7',  text: 'Corp takes an action (repeat until no clicks remain)' },
      { id: 'ct8',  text: 'Action phase ends' },
      { id: 'ct9',  text: 'Corp discards cards' },
      { id: 'ct10', text: 'Paid ability window (discard phase)' },
      { id: 'ct11', text: 'Corp loses unspent clicks' },
      { id: 'ct12', text: 'Turn ends — move to Runner\'s turn' },
    ],
    explanation: 'The Corp turn has three phases: Draw Phase (gain clicks → paid window → recurring credits refill → turn begins → draw), Action Phase (paid window → take actions until no clicks remain), and Discard Phase (discard → paid window → lose unspent clicks → turn ends). Paid ability windows occur at the start of the action phase and during the discard phase.',
  },

  {
    id: 'runner-turn',
    title: 'Runner Turn',
    prompt: 'Put the Runner turn phases in the correct order.',
    steps: [
      { id: 'rt1', text: 'Runner gains allotted clicks' },
      { id: 'rt2', text: 'Paid ability window' },
      { id: 'rt3', text: 'Recurring credits refill' },
      { id: 'rt4', text: 'Turn begins' },
      { id: 'rt5', text: 'Paid ability window (start of action phase)' },
      { id: 'rt6', text: 'Runner takes an action (repeat until no clicks remain)' },
      { id: 'rt7', text: 'Action phase ends' },
      { id: 'rt8', text: 'Runner discards cards' },
      { id: 'rt9', text: 'Paid ability window (discard phase)' },
      { id: 'rt10', text: 'Runner loses unspent clicks' },
      { id: 'rt11', text: 'Turn ends — move to Corp\'s turn' },
    ],
    explanation: 'The Runner turn has two phases: Action Phase (gain clicks → paid window → recurring credits refill → turn begins → paid window → take actions until no clicks remain) and Discard Phase (discard → paid window → lose unspent clicks → turn ends). Unlike the Corp, the Runner has no mandatory draw — but does have an extra paid ability window at the very start of their action phase.',
  },

  {
    id: 'run-phases',
    title: 'Run Phases',
    prompt: 'Put the phases of a run in the correct order.',
    steps: [
      { id: 'rp1', text: 'Initiation Phase — Runner declares the run and target server' },
      { id: 'rp2', text: 'Approach Ice Phase — Runner approaches the outermost piece of ICE' },
      { id: 'rp3', text: 'Encounter Ice Phase — Runner encounters rezzed ICE and breaks subroutines' },
      { id: 'rp4', text: 'Movement Phase — Runner passes the ICE or jack out' },
      { id: 'rp5', text: 'Success Phase — Run is declared successful, Runner breaches the server' },
      { id: 'rp6', text: 'Run Ends Phase — Run concludes, lingering effects expire' },
    ],
    explanation: 'A run moves through six phases: Initiation → Approach ICE → Encounter ICE → Movement → Success → Run Ends. Not every phase occurs every run — if there is no ICE, the run skips straight from Initiation to Success.',
  },

  {
    id: 'encounter',
    title: 'ICE Encounter',
    prompt: 'Put the steps of an ICE encounter in the correct order.',
    steps: [
      { id: 'en1', text: 'Runner approaches the ICE — paid ability window opens' },
      { id: 'en2', text: 'Corp may rez the ICE (only during Approach Phase)' },
      { id: 'en3', text: 'If ICE is unrezzed, Runner may jack out or pass' },
      { id: 'en4', text: 'Encounter begins — "when encountered" abilities trigger' },
      { id: 'en5', text: 'Runner may use icebreakers to break subroutines' },
      { id: 'en6', text: 'Unbroken subroutines resolve in order' },
      { id: 'en7', text: 'Encounter ends — Runner moves inward or run ends' },
    ],
    explanation: 'The key timing point: the Corp can only rez ICE during the Approach Phase, before the encounter begins. Once the encounter starts, rez windows close. Paid ability windows open at each phase transition.',
  },

  {
    id: 'accessing',
    title: 'Accessing Cards',
    prompt: 'Put the steps of accessing a card in the correct order.',
    steps: [
      { id: 'ac1', text: 'Runner breaches the server — access begins' },
      { id: 'ac2', text: 'Runner chooses a card to access (from eligible candidates)' },
      { id: 'ac3', text: 'Card is revealed if facedown' },
      { id: 'ac4', text: '"When accessed" abilities trigger' },
      { id: 'ac5', text: 'If agenda: Runner steals it' },
      { id: 'ac6', text: 'If other card: Runner may trash it (paying trash cost)' },
      { id: 'ac7', text: 'Access ends — repeat for remaining candidates or end breach' },
    ],
    explanation: 'Accessing is distinct from running — you can only access after a successful run. When accessing, the Runner always steals agendas (they cannot decline). Trash costs must be paid immediately during access.',
  },

  {
    id: 'trace',
    title: 'Trace Resolution',
    prompt: 'Put the steps of resolving a trace in the correct order.',
    steps: [
      { id: 'tr1', text: 'Trace initiates — base trace strength is announced (e.g. Trace 3)' },
      { id: 'tr2', text: 'Corp boosts trace strength by spending credits' },
      { id: 'tr3', text: 'Runner\'s link value is calculated (printed link + any boosts)' },
      { id: 'tr4', text: 'Runner boosts link strength by spending credits' },
      { id: 'tr5', text: 'Compare: if trace strength > link strength, trace succeeds' },
      { id: 'tr6', text: 'Trace effect resolves (if successful) or fails (if not)' },
    ],
    explanation: 'Key point: the Corp commits credits first, then the Runner responds with full information. Trace succeeds if trace strength STRICTLY exceeds link strength — a tie means the trace fails. Both players always spend whatever credits they committed.',
  },

];

// ─── State ────────────────────────────────────────────────────────────────────

const lrn = {
  puzzle:    null,   // current puzzle object
  shuffled:  [],     // shuffled steps array
  selected:  [],     // steps in order as user taps them
  complete:  false,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function lrnShuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function lrnPickPuzzle(excludeId) {
  const pool = excludeId
    ? PUZZLES.filter(p => p.id !== excludeId)
    : PUZZLES;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── Render ───────────────────────────────────────────────────────────────────

function lrnRender() {
  const root = document.getElementById('rules-learning');
  if (!root) return;

  const p = lrn.puzzle;
  const selectedIds = lrn.selected.map(s => s.id);

  const unselected = lrn.shuffled.filter(s => !selectedIds.includes(s.id));
  const isComplete = lrn.complete;

  // Check answer
  let resultHtml = '';
  if (isComplete) {
    const correct = lrn.selected.every((s, i) => s.id === p.steps[i].id);
    resultHtml = `
      <div class="lrn-result ${correct ? 'lrn-result--correct' : 'lrn-result--wrong'}">
        <div class="lrn-result-icon">${correct ? '✓' : '✗'}</div>
        <div class="lrn-result-text">${correct ? 'Correct!' : 'Not quite.'}</div>
      </div>
      <div class="lrn-explanation">${p.explanation}</div>
      ${!correct ? `
        <div class="lrn-correct-order">
          <div class="lrn-correct-title">Correct order:</div>
          ${p.steps.map((s, i) => `
            <div class="lrn-correct-step">
              <span class="lrn-num">${i + 1}</span>
              <span>${s.text}</span>
            </div>`).join('')}
        </div>` : ''}
      <div class="lrn-actions">
        <button class="btn btn-primary" id="lrn-next-btn">Try another</button>
      </div>`;
  }

  root.innerHTML = `
    <div class="lrn-header">
      <div class="lrn-title">${p.title}</div>
      <div class="lrn-prompt">${p.prompt}</div>
    </div>

    ${!isComplete ? `
    <div class="lrn-columns">
      <div class="lrn-col">
        <div class="lrn-col-label">Tap to place in order</div>
        <div class="lrn-steps" id="lrn-unselected">
          ${unselected.map(s => `
            <button class="lrn-step" data-id="${s.id}">${s.text}</button>
          `).join('')}
        </div>
      </div>
      <div class="lrn-col">
        <div class="lrn-col-label">Your sequence</div>
        <div class="lrn-sequence" id="lrn-sequence">
          ${lrn.selected.map((s, i) => `
            <div class="lrn-placed" data-id="${s.id}">
              <span class="lrn-num">${i + 1}</span>
              <span class="lrn-placed-text">${s.text}</span>
              <button class="lrn-remove" data-id="${s.id}">✕</button>
            </div>
          `).join('')}
          ${lrn.selected.length === 0 ? '<div class="lrn-empty-seq">Tap a step to place it first</div>' : ''}
        </div>
        ${lrn.selected.length === p.steps.length
          ? '<button class="btn btn-primary lrn-submit" id="lrn-submit-btn">Check answer</button>'
          : ''}
      </div>
    </div>` : resultHtml}

    ${!isComplete ? `
    <div class="lrn-footer">
      <button class="btn btn-ghost btn-sm" id="lrn-skip-btn">Different puzzle</button>
    </div>` : ''}
  `;

  // Event listeners
  if (!isComplete) {
    root.querySelectorAll('.lrn-step').forEach(btn => {
      btn.addEventListener('click', () => {
        const step = p.steps.find(s => s.id === btn.dataset.id)
          || lrn.shuffled.find(s => s.id === btn.dataset.id);
        lrn.selected.push(step);
        lrnRender();
      });
    });

    root.querySelectorAll('.lrn-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        lrn.selected = lrn.selected.filter(s => s.id !== btn.dataset.id);
        lrnRender();
      });
    });

    const submitBtn = document.getElementById('lrn-submit-btn');
    if (submitBtn) submitBtn.addEventListener('click', () => {
      lrn.complete = true;
      const correct = lrn.selected.every((s, i) => s.id === lrn.puzzle.steps[i].id);
      if (typeof window.plausible !== 'undefined') {
        window.plausible('Learning puzzle completed', { props: { puzzle: lrn.puzzle.id, correct: correct ? 'yes' : 'no' } });
      }
      lrnRender();
    });

    const skipBtn = document.getElementById('lrn-skip-btn');
    if (skipBtn) skipBtn.addEventListener('click', () => lrnStart(lrn.puzzle?.id));
  }

  const nextBtn = document.getElementById('lrn-next-btn');
  if (nextBtn) nextBtn.addEventListener('click', () => lrnStart(lrn.puzzle?.id));
}

function lrnStart(excludeId) {
  lrn.puzzle   = lrnPickPuzzle(excludeId);
  lrn.shuffled = lrnShuffle(lrn.puzzle.steps);
  lrn.selected = [];
  lrn.complete = false;
  lrnRender();
}

// ─── Init (called from rules.js when Learning tab is shown) ───────────────────

window.initLearning = function() {
  if (!lrn.puzzle) lrnStart();
  else lrnRender();
};
