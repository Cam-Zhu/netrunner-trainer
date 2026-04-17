// ─────────────────────────────────────────────────────────────────────────────
// skilltree.js — Runner's Journey skill tree
// Self-reported nodes saved to localStorage; toolkit nodes auto-detected.
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY_TREE = 'nrtrainer_skilltree';

const BRANCHES = [
  {
    id: 'community',
    label: 'Jacking In',
    sublabel: 'Community',
    color: 'var(--runner)',
    nodes: [
      { id: 'c1', text: 'Played a game on Jinteki.net' },
      { id: 'c2', text: 'Created a NetrunnerDB account' },
      { id: 'c3', text: 'Joined a community Discord or Slack' },
      { id: 'c4', text: 'Attended a local meetup or game night' },
      { id: 'c5', text: 'Published a decklist publicly' },
    ],
  },
  {
    id: 'rules',
    label: 'Powering Up',
    sublabel: 'Rules Mastery',
    color: 'var(--corp)',
    nodes: [
      { id: 'r1', text: 'Read the Learn to Play booklet' },
      { id: 'r2', text: 'Completed a full turn without rules lookups' },
      { id: 'r3', text: 'Read the Comprehensive Rules (or key sections)' },
      { id: 'r4', text: 'Correctly resolved a complex run (traces, on-encounter effects, etc.)' },
      { id: 'r5', text: 'Taught the game to a new player' },
    ],
  },
  {
    id: 'competitive',
    label: 'Entering the Arena',
    sublabel: 'Competitive Play',
    color: 'var(--warn)',
    nodes: [
      { id: 'p1', text: 'Played a casual match vs. a human opponent' },
      { id: 'p2', text: 'Entered a Game Night Kit or store event' },
      { id: 'p3', text: 'Played in a District Championship or equivalent' },
      { id: 'p4', text: 'Played in a Continental or Circuit Opener' },
      { id: 'p5', text: 'Played at Worlds or achieved a top-cut finish at any tier' },
    ],
  },
  {
    id: 'toolkit',
    label: 'Toolkit Mastery',
    sublabel: 'Auto-tracked',
    color: 'var(--accent)',
    auto: true,
    nodes: [
      { id: 't1', text: 'Saved a Corp deck and a Runner deck in My decks',       auto: true },
      { id: 't2', text: 'Completed a Flashcards session in Art first mode',       auto: true },
      { id: 't3', text: 'Completed a Flashcards session in Name first mode',      auto: true },
      { id: 't4', text: 'Passed Challenge Level 1 (System Gateway)',              auto: true },
      { id: 't5', text: 'Passed all 6 Challenge levels',                          auto: true },
    ],
  },
];

// ─── State ────────────────────────────────────────────────────────────────────

function loadTreeState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_TREE) || '{}'); }
  catch { return {}; }
}

function saveTreeState(state) {
  try { localStorage.setItem(STORAGE_KEY_TREE, JSON.stringify(state)); }
  catch {}
}

// ─── Auto-detection ───────────────────────────────────────────────────────────

function detectAutoNodes() {
  const detected = {};

  // t1 — both decks saved
  try {
    const saved = JSON.parse(localStorage.getItem('nrtrainer_decks') || '{}');
    detected.t1 = !!(saved.corp && saved.corp.trim() && saved.runner && saved.runner.trim());
  } catch { detected.t1 = false; }

  // t2 — completed art-first flashcard session
  try {
    detected.t2 = !!(localStorage.getItem('nrtrainer_fc_session_art'));
  } catch { detected.t2 = false; }

  // t3 — completed name-first flashcard session
  try {
    detected.t3 = !!(localStorage.getItem('nrtrainer_fc_session_name'));
  } catch { detected.t3 = false; }

  // t4 — passed challenge level 1 (either mode)
  try {
    const ch = JSON.parse(localStorage.getItem('nrtrainer_challenge') || '{}');
    detected.t4 = !!(ch['1_set'] || ch['1_cum']);
  } catch { detected.t4 = false; }

  // t5 — passed all 6 challenge levels (at least one mode each)
  try {
    const ch = JSON.parse(localStorage.getItem('nrtrainer_challenge') || '{}');
    detected.t5 = [1,2,3,4,5,6].every(n => ch[`${n}_set`] || ch[`${n}_cum`]);
  } catch { detected.t5 = false; }

  return detected;
}

// ─── Render ───────────────────────────────────────────────────────────────────

function initSkillTree() {
  const container = document.getElementById('skill-tree-root');
  if (!container) return;

  let treeState = loadTreeState();
  const autoState = detectAutoNodes();

  function isChecked(nodeId, auto) {
    if (auto) return !!autoState[nodeId];
    return !!treeState[nodeId];
  }

  function totalChecked() {
    let n = 0;
    BRANCHES.forEach(b => b.nodes.forEach(node => {
      if (isChecked(node.id, node.auto)) n++;
    }));
    return n;
  }

  function branchChecked(branch) {
    return branch.nodes.filter(n => isChecked(n.id, n.auto)).length;
  }

  function render() {
    const checked = totalChecked();
    const total = BRANCHES.reduce((s, b) => s + b.nodes.length, 0);

    container.innerHTML = `
      <div class="st-header">
        <div class="st-title">Runner's Journey</div>
        <div class="st-progress-wrap">
          <div class="st-progress-bar">
            <div class="st-progress-fill" style="width:${Math.round(checked/total*100)}%"></div>
          </div>
          <div class="st-progress-label">${checked} / ${total} milestones</div>
        </div>
      </div>
      <div class="st-branches">
        ${BRANCHES.map(branch => {
          const done = branchChecked(branch);
          const total = branch.nodes.length;
          const complete = done === total;
          return `
            <details class="st-branch ${complete ? 'st-branch--complete' : ''}">
              <summary class="st-branch-header" style="--branch-color:${branch.color}">
                <div class="st-branch-label">${branch.label}</div>
                <div class="st-branch-sub">${branch.sublabel}</div>
                <div class="st-branch-count">${done}/${total}</div>
              </summary>
              <div class="st-nodes">
                ${branch.nodes.map(node => {
                  const checked = isChecked(node.id, node.auto);
                  return `
                    <div class="st-node ${checked ? 'st-node--checked' : ''} ${node.auto ? 'st-node--auto' : ''}"
                         data-id="${node.id}" data-auto="${!!node.auto}">
                      <div class="st-node-pip"></div>
                      <div class="st-node-text">${node.text}</div>
                      ${node.auto ? '<div class="st-node-auto-badge">auto</div>' : ''}
                    </div>`;
                }).join('')}
              </div>
            </details>`;
        }).join('')}
      </div>
      ${checked === total ? '<div class="st-complete-msg">All milestones reached. Netrunner mastery unlocked.</div>' : ''}
    `;

    // Click handlers for manual nodes only
    container.querySelectorAll('.st-node:not([data-auto="true"])').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.dataset.id;
        treeState[id] = !treeState[id];
        saveTreeState(treeState);
        render();
      });
    });
  }

  render();
}

// Called when the start page is shown
window.initSkillTreeOnce = (() => {
  let done = false;
  return () => {
    if (!done) { done = true; initSkillTree(); }
    // Re-render each time start page is shown to pick up new auto-detections
    else { initSkillTree(); }
  };
})();
