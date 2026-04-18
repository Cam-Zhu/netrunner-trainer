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

// ─── Neural trace effect ──────────────────────────────────────────────────────

const SPARK_THRESHOLDS = [5, 10, 15, 20];

const TRACE_COLOURS = [
  '#00e5a0', // accent (cyan)
  '#f0a500', // warn (amber)
  '#4a9eff', // corp (blue)
  '#c084fc', // runner (purple)
];

function fireSparks(tier) {
  const nodeCounts   = [16, 32, 52, 80];
  const durations    = [1200, 1800, 2600, 3600];
  const nodeCount    = nodeCounts[tier - 1];
  const ms           = durations[tier - 1];

  let canvas = document.getElementById('st-spark-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'st-spark-canvas';
    canvas.style.cssText = `
      position:fixed; inset:0; width:100%; height:100%;
      pointer-events:none; z-index:9999;
    `;
    document.body.appendChild(canvas);
  }

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  const W = canvas.width;
  const H = canvas.height;

  // Generate nodes scattered across the viewport
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    x:      W * (0.08 + Math.random() * 0.84),
    y:      H * (0.08 + Math.random() * 0.84),
    r:      tier >= 3 ? 4 + Math.random() * 3 : 3 + Math.random() * 2,
    colour: TRACE_COLOURS[i % TRACE_COLOURS.length],
    lit:    false,
    litAt:  null,
    pulse:  0,
  }));

  // Build edges — each node connects to its 2–3 nearest neighbours
  const edges = [];
  const maxEdgeDist = Math.min(W, H) * (0.18 + tier * 0.04);
  nodes.forEach((a, i) => {
    const neighbours = nodes
      .map((b, j) => ({ j, d: Math.hypot(b.x - a.x, b.y - a.y) }))
      .filter(({ j, d }) => j !== i && d < maxEdgeDist)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2 + tier);
    neighbours.forEach(({ j }) => {
      if (!edges.find(e => (e.a === i && e.b === j) || (e.a === j && e.b === i))) {
        edges.push({ a: i, b: j, progress: 0, active: false, colour: nodes[i].colour });
      }
    });
  });

  // Cascade: start from a random node, spread outward through edges
  const cascade = [];
  let delay = 0;
  const delayStep = ms * 0.06;
  const visited = new Set();

  function scheduleNode(idx) {
    if (visited.has(idx)) return;
    visited.add(idx);
    cascade.push({ idx, delay });
    delay += delayStep * (0.5 + Math.random() * 0.5);
    // Schedule connected nodes
    edges
      .filter(e => e.a === idx || e.b === idx)
      .forEach(e => scheduleNode(e.a === idx ? e.b : e.a));
  }
  scheduleNode(Math.floor(Math.random() * nodeCount));
  // Any unvisited nodes (disconnected) get scheduled after
  nodes.forEach((_, i) => { if (!visited.has(i)) scheduleNode(i); });

  const start = performance.now();

  function frame(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, W, H);

    // Light up nodes per cascade schedule
    cascade.forEach(({ idx, delay: d }) => {
      if (elapsed >= d && !nodes[idx].lit) {
        nodes[idx].lit   = true;
        nodes[idx].litAt = elapsed;
        // Activate edges connected to this node where other end is also lit
        edges.forEach(e => {
          if ((e.a === idx && nodes[e.b].lit) || (e.b === idx && nodes[e.a].lit)) {
            e.active = true;
            e.startAt = elapsed;
          }
        });
      }
    });

    const fadeStart = ms * 0.65;
    const fadeEnd   = ms * 1.1;

    // Draw edges
    edges.forEach(e => {
      if (!e.active) return;
      const age = elapsed - e.startAt;
      const edgeDur = 300 + tier * 80;
      const drawProgress = Math.min(age / edgeDur, 1);
      const a_node = nodes[e.a];
      const b_node = nodes[e.b];
      const ex = a_node.x + (b_node.x - a_node.x) * drawProgress;
      const ey = a_node.y + (b_node.y - a_node.y) * drawProgress;

      let alpha = 0.7;
      if (elapsed > fadeStart) alpha *= 1 - (elapsed - fadeStart) / (fadeEnd - fadeStart);
      alpha = Math.max(0, alpha);

      ctx.beginPath();
      ctx.moveTo(a_node.x, a_node.y);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = e.colour;
      ctx.globalAlpha = alpha;
      ctx.lineWidth   = tier >= 3 ? 1.5 : 1;
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(node => {
      if (!node.lit) return;
      const age = elapsed - node.litAt;
      node.pulse = Math.min(age / 200, 1);

      let alpha = 1;
      if (elapsed > fadeStart) alpha *= 1 - (elapsed - fadeStart) / (fadeEnd - fadeStart);
      alpha = Math.max(0, alpha);

      const r = node.r * (0.5 + node.pulse * 0.5);

      // Outer glow ring
      if (tier >= 2) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 3, 0, Math.PI * 2);
        ctx.fillStyle   = node.colour;
        ctx.globalAlpha = alpha * 0.08 * node.pulse;
        ctx.fill();
      }

      // Core node
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle   = node.colour;
      ctx.globalAlpha = alpha;
      ctx.fill();

      // Bright centre
      ctx.beginPath();
      ctx.arc(node.x, node.y, r * 0.45, 0, Math.PI * 2);
      ctx.fillStyle   = '#ffffff';
      ctx.globalAlpha = alpha * 0.7 * node.pulse;
      ctx.fill();
    });

    ctx.globalAlpha = 1;

    if (elapsed < fadeEnd) {
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, W, H);
    }
  }

  requestAnimationFrame(frame);
}

// ─────────────────────────────────────────────────────────────────────────────

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
    // Remember which branches are open before rebuilding
    const openBranches = new Set(
      [...container.querySelectorAll('details.st-branch[open]')]
        .map(el => el.dataset.branch)
    );

    const checked = totalChecked();
    const total = BRANCHES.reduce((s, b) => s + b.nodes.length, 0);

    container.innerHTML = `
      <div class="st-header">
        <div class="st-title">The Run Log</div>
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
            <details class="st-branch ${complete ? 'st-branch--complete' : ''}" data-branch="${branch.id}">
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

    // Restore open state
    container.querySelectorAll('details.st-branch').forEach(el => {
      if (openBranches.has(el.dataset.branch)) el.open = true;
    });

    // Click handlers for manual nodes only
    container.querySelectorAll('.st-node:not([data-auto="true"])').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = el.dataset.id;
        const prevCount = totalChecked();
        treeState[id] = !treeState[id];
        saveTreeState(treeState);
        const newCount = totalChecked();
        // Fire sparks if a threshold was crossed upward
        SPARK_THRESHOLDS.forEach((thresh, i) => {
          if (prevCount < thresh && newCount >= thresh) {
            fireSparks(i + 1);
          }
        });
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
