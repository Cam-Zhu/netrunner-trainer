// ─── Rules tab init ───────────────────────────────────────────────────────────

window.initRulesOnce = (() => {
  let done = false;
  return () => {
    if (!done) { done = true; initRules(); }
  };
})();

function initRules() {
  // Sub-tab toggle
  document.getElementById('rules-toggle').querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('rules-toggle').querySelectorAll('.toggle-btn')
        .forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.dataset.view;
      document.getElementById('rules-turn').style.display = view === 'turn' ? '' : 'none';
      document.getElementById('rules-run').style.display  = view === 'run'  ? '' : 'none';
      document.getElementById('rules-hint').textContent   =
        view === 'run' ? 'Tap YES or NO at each decision point to follow the run.' : '';
      if (view === 'run') renderRunFlow(RUN_STATE_START);
    });
  });

  document.getElementById('rules-hint').textContent = '';
  renderRunFlow(RUN_STATE_START);
}

// ─── Run flow data ────────────────────────────────────────────────────────────
// Each node: { id, phase, title, steps[], decision?, yes?, no?, terminal? }
// decision nodes show YES/NO buttons; terminal nodes show a reset button.

const RUN_PHASES = {
  initiation: { label: '1. Initiation Phase',    color: 'var(--corp)' },
  approach:   { label: '2. Approach Ice Phase',   color: '#7c6cfa' },
  encounter:  { label: '3. Encounter Ice Phase',  color: 'var(--danger)' },
  movement:   { label: '4. Movement Phase',       color: 'var(--warn)' },
  success:    { label: '5. Success Phase',        color: 'var(--accent)' },
  runends:    { label: '6. Run Ends Phase',       color: 'var(--text-dim)' },
  breach:     { label: 'Breaching a Server',      color: 'var(--accent)' },
};

const RUN_NODES = {

  initiation: {
    phase: 'initiation',
    steps: [
      'Runner announces the attacked server.',
      'Runner gains bad publicity credits.',
      'The run begins.',
      'Runner position set to outermost ice, if any.',
      'Paid ability window.',
    ],
    decision: 'Does Runner position correspond to ice?',
    yes: 'approach',
    no:  'movement',
  },

  approach: {
    phase: 'approach',
    steps: [
      'Runner approaches ice.',
      'Paid ability window — Corp may rez ice here.',
    ],
    decision: 'Is the approached ice rezzed?',
    yes: 'encounter',
    no:  'movement',
  },

  encounter: {
    phase: 'encounter',
    steps: [
      'Runner encounters ice.',
      'Paid ability window — Runner may break subroutines.',
    ],
    decision: 'Are there unbroken subroutines?',
    yesLabel: 'YES — Runner resolves next',
    noLabel:  'NO — go to movement',
    yes: 'encounter_sub',
    no:  'movement',
  },

  encounter_sub: {
    phase: 'encounter',
    steps: [
      'Corp resolves the next unbroken subroutine.',
    ],
    decision: 'Are there more unbroken subroutines?',
    yes: 'encounter_sub',
    no:  'movement',
  },

  movement: {
    phase: 'movement',
    steps: [
      'If here from Approach or Encounter, Runner passes ice.',
      'Paid ability window.',
      'The Runner may jack out.',
    ],
    decision: 'Does Runner jack out?',
    yesLabel: 'YES — jack out',
    noLabel:  'NO — continue',
    yes: 'jackout',
    no:  'movement_continue',
  },

  jackout: {
    phase: 'movement',
    steps: [
      'Runner jacks out.',
      'The run ends unsuccessfully.',
    ],
    terminal: true,
    terminalLabel: 'Run ends — jack out',
    terminalColor: 'var(--danger)',
  },

  movement_continue: {
    phase: 'movement',
    steps: [
      'Runner moves 1 position inward, if able.',
      'Paid ability window.',
    ],
    decision: 'Does Runner move to a new ice position?',
    yes: 'approach',
    no:  'movement_server',
  },

  movement_server: {
    phase: 'movement',
    steps: [
      'Runner approaches the server.',
    ],
    next: 'success',
  },

  success: {
    phase: 'success',
    steps: [
      'The run is declared successful.',
      'Runner breaches the attacked server.',
    ],
    next: 'runends',
  },

  runends: {
    phase: 'runends',
    steps: [
      'Close or resolve priority windows from before "end the run".',
      'Runner loses unspent bad publicity credits.',
      'If applicable, declare run unsuccessful.',
      'The run is complete.',
    ],
    terminal: true,
    terminalLabel: 'Run complete',
    terminalColor: 'var(--accent)',
  },

};

const RUN_STATE_START = 'initiation';

// ─── Run flow renderer ────────────────────────────────────────────────────────

let runHistory = [];

function renderRunFlow(nodeId) {
  const container = document.getElementById('run-flow');
  container.innerHTML = '';

  // Render history nodes (collapsed)
  runHistory.forEach((id, i) => {
    const node = RUN_NODES[id];
    if (!node) return;
    const phase = RUN_PHASES[node.phase];
    const el = document.createElement('div');
    el.className = 'run-node run-node--past';
    el.innerHTML = `<div class="run-node-phase" style="color:${phase.color}">${phase.label}</div>`;
    container.appendChild(el);
  });

  // Render current node
  const node = RUN_NODES[nodeId];
  if (!node) return;
  const phase = RUN_PHASES[node.phase];

  const el = document.createElement('div');
  el.className = 'run-node run-node--active';
  el.style.borderColor = phase.color;

  let html = `<div class="run-node-phase" style="color:${phase.color}">${phase.label}</div>`;
  html += '<ol class="run-node-steps">';
  node.steps.forEach(s => { html += `<li>${s}</li>`; });
  html += '</ol>';

  if (node.terminal) {
    html += `<div class="run-terminal" style="color:${node.terminalColor}">${node.terminalLabel}</div>`;
    html += `<button class="btn btn-primary run-reset-btn" id="run-reset">Start a new run</button>`;
  } else if (node.decision) {
    html += `<div class="run-decision">${node.decision}</div>`;
    html += '<div class="run-decision-btns">';
    html += `<button class="btn run-yes-btn" data-next="${node.yes}">${node.yesLabel || 'YES'}</button>`;
    html += `<button class="btn run-no-btn"  data-next="${node.no}">${node.noLabel  || 'NO'}</button>`;
    html += '</div>';
  } else if (node.next) {
    html += `<button class="btn btn-primary run-next-btn" data-next="${node.next}">Continue →</button>`;
  }

  el.innerHTML = html;
  container.appendChild(el);

  // Scroll to active node
  setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);

  // Wire buttons
  const yesBtn = el.querySelector('.run-yes-btn');
  const noBtn  = el.querySelector('.run-no-btn');
  const nextBtn = el.querySelector('.run-next-btn');
  const resetBtn = el.querySelector('#run-reset');

  if (yesBtn) yesBtn.addEventListener('click', () => advance(nodeId, node.yes));
  if (noBtn)  noBtn.addEventListener('click',  () => advance(nodeId, node.no));
  if (nextBtn) nextBtn.addEventListener('click', () => advance(nodeId, node.next));
  if (resetBtn) resetBtn.addEventListener('click', resetRun);
}

function advance(fromId, toId) {
  runHistory.push(fromId);
  renderRunFlow(toId);
}

function resetRun() {
  runHistory = [];
  renderRunFlow(RUN_STATE_START);
}
