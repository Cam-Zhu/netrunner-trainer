// ─────────────────────────────────────────────────────────────────────────────
// mechanics.js  —  Mechanics glossary tab
// Two entry types: "mechanic" (rules-grounded) and "concept" (named strategy vocab)
// Rules cross-referenced against NSG Comprehensive Rules v26.03
// ─────────────────────────────────────────────────────────────────────────────

const MECHANICS_DATA = [

  // ── MECHANIC DEFINITIONS ─────────────────────────────────────────────────

  {
    id: "run-structure",
    term: "Run Structure",
    type: "mechanic",
    tier: 0,
    short: "The sequence of phases that define how a run progresses from initiation to end.",
    detail: "A run moves through six defined phases: Initiation → Approach Ice → Encounter Ice (if ice is rezzed) → Movement → Success → Run Ends. Each phase has specific windows for paid abilities, rezzing, jack out timing, and trigger checks. The Movement Phase handles passing ice and moving inward; the Success Phase declares the run successful and initiates a breach. Getting this sequence wrong causes cascading errors with replacement effects, mid-run Corp abilities, and run-result triggers.",
    seeAlso: ["paid-ability-windows", "jack-out", "successful-run"],
    rulesLink: null,
  },
  {
    id: "paid-ability-windows",
    term: "Paid Ability Windows",
    type: "mechanic",
    tier: 0,
    short: "Specific moments during a run when players may trigger paid abilities.",
    detail: "Paid ability windows open throughout the game — during turns and during runs. The active player receives priority first, then both players alternate, with the window closing when both players pass consecutively. During the Corp's turn, the Corp acts first; during the Runner's turn, the Runner acts first. Within a run, specific windows allow rezzing ice (Approach Phase only) or scoring agendas; other windows are paid-ability only. Paid abilities are distinct from conditional abilities — the latter fire automatically at checkpoints rather than being chosen by a player.",
    seeAlso: ["run-structure", "trigger-types"],
    rulesLink: null,
  },
  {
    id: "trigger-types",
    term: "Trigger Types & Resolution",
    type: "mechanic",
    tier: 0,
    short: "The rules that determine when and in what order card effects fire.",
    detail: "Triggers are either mandatory (must fire) or optional (may fire). When conditional abilities meet their trigger conditions, a reaction window opens and both players alternate resolving their pending abilities, starting with the active player. Mandatory abilities must be triggered before a player can pass. When multiple triggers happen simultaneously, each player orders and resolves their own pending abilities in turn. Key words: 'when' fires once on the specific event; 'whenever' fires each time the condition occurs; abilities with 'instead' are replacement effects that override normal resolution.",
    seeAlso: ["paid-ability-windows", "replacement-effects"],
    rulesLink: null,
  },
  {
    id: "trace",
    term: "Trace",
    type: "mechanic",
    tier: 1,
    short: "A Corp-initiated credit contest where the Corp sets a strength and the Runner resists with link plus credits.",
    detail: "Structure: Trace X — if successful, do Y. The Corp commits credits first (boosting trace strength above the base X), then the Runner responds with their link value plus credits. If trace strength strictly exceeds link strength, the trace succeeds. Traces are credit-pressure tools and information games — the Corp commits first, giving the Runner full information before deciding how much to spend.",
    seeAlso: ["link", "threat-assessment"],
    rulesLink: null,
  },
  {
    id: "link",
    term: "Link",
    type: "mechanic",
    tier: 1,
    short: "A Runner stat that passively adds to trace resistance before any credits are spent.",
    detail: "Link is a permanent Runner attribute that reduces the credit cost of resisting traces. A Runner with 2 link needs the Corp to spend 2 extra credits to match what a 0-link Runner could achieve for free. Link does nothing outside trace resolution, but in a trace-heavy meta it functions as recurring savings.",
    seeAlso: ["trace"],
    rulesLink: null,
  },
  {
    id: "tags",
    term: "Tags",
    type: "mechanic",
    tier: 1,
    short: "A persistent negative Runner status that enables Corp punishment effects.",
    detail: "Tags remain on the Runner until actively removed (1 click + 2 credits per tag, as an action during the Runner's action phase). While tagged, the Corp can use tag-conditional abilities including resource destruction (click + 2 credits as a basic action) and damage operations. Tags are checked continuously — any tag-conditional ability is live the moment a tag exists. See also: Floating Tags, Tag Punishment.",
    seeAlso: ["tag-punishment", "floating-tags", "tag-removal-windows"],
    rulesLink: null,
  },
  {
    id: "tag-punishment",
    term: "Tag Punishment",
    type: "mechanic",
    tier: 1,
    short: "Corp effects that become active or lethal while the Runner is tagged.",
    detail: "Tag punishment converts tags from a warning into a win condition. Effects range from resource trashing (denying Runner economy) to meat damage operations that can flatline. The key distinction: tags don't hurt directly — it's the punishment cards that kill. Identifying which punishment cards exist in the Corp's deck determines how long tags can be safely floated.",
    seeAlso: ["tags", "floating-tags", "meat-damage", "flatline-check"],
    rulesLink: null,
  },
  {
    id: "floating-tags",
    term: "Floating Tags",
    type: "mechanic",
    tier: 1,
    short: "Deliberately choosing to remain tagged to preserve tempo or credits.",
    detail: "Floating tags is a calculated risk. It's correct only when the Corp cannot realistically execute a punishment line on their next turn — wrong credits, wrong cards, wrong clicks. Most fatal turns begin one turn earlier when a player floats tags against a deck that can punish. Floating is intentional, not convenient.",
    seeAlso: ["tags", "tag-punishment", "threat-assessment"],
    rulesLink: null,
  },
  {
    id: "tag-removal-windows",
    term: "Tag Removal Windows",
    type: "mechanic",
    tier: 1,
    short: "The specific moments when the Runner can legally remove tags.",
    detail: "Tags can be removed during the Runner's action phase: spend 1 click and 2 credits as a basic action to remove 1 tag. This cannot be done during runs, during the Corp's turn, or in response to a punishment being played. Misunderstanding this timing leads to illegal plays or fatal delays.",
    seeAlso: ["tags", "floating-tags"],
    rulesLink: null,
  },
  {
    id: "net-damage",
    term: "Net Damage",
    type: "mechanic",
    tier: 1,
    short: "Damage that randomly trashes cards from the Runner's grip, representing digital or neural harm.",
    detail: "For each point of net damage, one card is randomly trashed from the Runner's grip. Multiple damage resolves simultaneously — the cards are all chosen and trashed at once. Net damage ignores credits and board state entirely. It cannot be reduced by spending credits; prevention requires specific installed cards. If the Runner suffers more damage than they have cards in their grip, they flatline immediately.",
    seeAlso: ["meat-damage", "core-damage", "flatline-check", "damage-prevention"],
    rulesLink: null,
  },
  {
    id: "meat-damage",
    term: "Meat Damage",
    type: "mechanic",
    tier: 1,
    short: "Physical damage that trashes cards from grip — the primary flatline vector in Standard.",
    detail: "Meat damage works identically to net damage in resolution: one card randomly trashed from grip per point, all simultaneously. It is triggered by different cards, typically tag-punishment operations, and is the most common kill mechanism in Standard. Prevention is type-specific — net damage prevention does not stop meat damage. Tags frequently enable meat damage operations.",
    seeAlso: ["net-damage", "core-damage", "tag-punishment", "flatline-check"],
    rulesLink: null,
  },
  {
    id: "core-damage",
    term: "Core Damage",
    type: "mechanic",
    tier: 1,
    short: "Permanent damage that trashes cards from grip AND reduces the Runner's maximum hand size.",
    detail: "Core damage (sometimes called 'brain damage' on older cards — the terms are interchangeable) is cumulative and irreversible. Each point randomly trashes a card from the grip and permanently reduces max hand size by 1. A Runner with 2 core damage has a max hand of 3 — half the normal threshold before flatline. Core damage compounds other threats and cannot be undone in Standard.",
    seeAlso: ["net-damage", "meat-damage", "flatline-check"],
    rulesLink: null,
  },
  {
    id: "flatline-check",
    term: "Flatline Check",
    type: "mechanic",
    tier: 1,
    short: "The Runner immediately loses if they suffer more damage than they have cards in grip.",
    detail: "The flatline condition is checked when damage resolves: if the Runner suffers more damage than they have cards in their grip, they lose. Multiple damage cards are randomly chosen and trashed simultaneously — there is no one-at-a-time resolution. The game ends when the damage is resolved if the Runner had fewer cards than the total damage dealt. Additionally, if the Runner's maximum hand size is less than 0 at the start of their discard phase, they are also flatlined.",
    seeAlso: ["net-damage", "meat-damage", "core-damage"],
    rulesLink: null,
  },
  {
    id: "damage-prevention",
    term: "Damage Prevention",
    type: "mechanic",
    tier: 1,
    short: "Effects that stop or reduce incoming damage before it resolves.",
    detail: "Prevention effects are type-specific — a card that prevents net damage does nothing against meat damage. Prevention reduces the damage value before it resolves, using interrupt abilities triggered during the interrupt window. Layered kill attempts often exploit this by mixing damage types to bypass partial defenses.",
    seeAlso: ["net-damage", "meat-damage", "hybrid-damage"],
    rulesLink: null,
  },
  {
    id: "hybrid-damage",
    term: "Hybrid Damage",
    type: "mechanic",
    tier: 2,
    short: "Kill lines that combine multiple damage types to bypass type-specific prevention.",
    detail: "Hybrid damage sequences combine net, meat, or core damage in one effect or across a turn. Because prevention is type-specific, a Runner protected against meat damage may be unprotected against the net damage component. Understanding which combination a Corp deck uses determines which prevention is actually worth installing.",
    seeAlso: ["net-damage", "meat-damage", "damage-prevention"],
    rulesLink: null,
  },
  {
    id: "breaking-subroutines",
    term: "Breaking Subroutines",
    type: "mechanic",
    tier: 1,
    short: "Using icebreaker abilities to prevent individual subroutines from resolving.",
    detail: "Breaking a subroutine stops its effect for that encounter only — the ice remains rezzed and will fire again next run. Breaking does not bypass or disable the ice. Each subroutine must be broken individually unless a breaker specifies otherwise. If any subroutine is left unbroken, the Corp resolves it. Icebreakers can only use interface abilities if their strength is equal to or greater than the encountered ice's strength.",
    seeAlso: ["bypassing-ice", "derezzing-ice", "avoiding-encounters"],
    rulesLink: null,
  },
  {
    id: "bypassing-ice",
    term: "Bypassing Ice",
    type: "mechanic",
    tier: 1,
    short: "Passing ice without encountering it — the Encounter Ice Phase is aborted entirely.",
    detail: "When the Runner bypasses a piece of ice, the Encounter Ice Phase is aborted and the Runner immediately proceeds to pass that ice. Subroutines are neither broken nor resolved, and encounter abilities do not trigger. Bypass effects typically specify a cost or condition and apply to specific ice types or situations. Note: bypass still requires the Runner to have approached the ice first — it skips the encounter, not the approach.",
    seeAlso: ["breaking-subroutines", "derezzing-ice", "avoiding-encounters"],
    rulesLink: null,
  },
  {
    id: "derezzing-ice",
    term: "Derezzing Ice",
    type: "mechanic",
    tier: 1,
    short: "Turning rezzed ice facedown, disabling its abilities until rezzed again.",
    detail: "Derezzing does not remove ice from the server — it returns it to an unrezzed state, forcing the Corp to spend the rez cost again if they want it active. This resets the Corp's investment and can open future scoring windows if the Corp runs out of credits. An unrezzed piece of ice can still be approached during a run, but the Runner will not encounter it unless the Corp rezzes it during the Approach Ice Phase.",
    seeAlso: ["breaking-subroutines", "bypassing-ice"],
    rulesLink: null,
  },
  {
    id: "avoiding-encounters",
    term: "Avoiding Encounters",
    type: "mechanic",
    tier: 1,
    short: "Preventing an ice encounter from occurring entirely, before subroutines become relevant.",
    detail: "This is informal community vocabulary, not a formal rules category. In practice, it refers to effects that prevent the Runner from being placed in an encounter at all — distinct from bypass, which aborts an encounter that has already begun. The rules distinction matters: some 'when the Runner encounters ice' abilities may trigger on bypass but not on effects that prevent the encounter from starting. The precise wording of each card determines whether an effect creates a bypass or prevents the encounter.",
    seeAlso: ["bypassing-ice", "breaking-subroutines"],
    rulesLink: null,
  },
  {
    id: "replacement-effects",
    term: "Replacement Effects",
    type: "mechanic",
    tier: 2,
    short: "Effects that change what happens instead of the normal game action.",
    detail: "Replacement effects use the word 'instead' in their text. They override normal resolution entirely — the replaced event does not happen. They are applied automatically when the relevant instruction becomes imminent, before players receive priority in the interrupt window. Multiple replacement effects can interact; if they apply to a targeted card, that card's controller chooses the order. Understanding replacement effects is what separates clean rules knowledge from actual competitive play.",
    seeAlso: ["trigger-types", "damage-prevention"],
    rulesLink: null,
  },
  {
    id: "advancement-counters",
    term: "Advancement Counters",
    type: "mechanic",
    tier: 2,
    short: "Counters placed on cards to enable agenda scoring or power other abilities.",
    detail: "The Corp's basic action to advance a card costs 1 click and 1 credit, placing one advancement counter on an installed card. Card abilities can also place or move advancement counters without this cost — that is not the same as advancing a card for rules purposes. Agendas require a specific number of advancement counters to score. Non-agenda cards can also be advanced if their text says so, creating ambiguity that forces Runners to respect threats that may not be agendas.",
    seeAlso: ["fast-advance", "scoring-window", "advancing-non-agendas"],
    rulesLink: null,
  },
  {
    id: "advancing-non-agendas",
    term: "Advancing Non-Agenda Cards",
    type: "mechanic",
    tier: 2,
    short: "Placing advancement counters on assets, ice, or upgrades to create ambiguity or power effects.",
    detail: "The Corp can advance any installed card that says 'you can advance this card' or has an ability that triggers on advancement. This mechanic creates uncertainty: an advanced card in a remote could be an agenda or a trap. Runners must decide whether to check it (run) or respect it (assume dangerous) — both can be wrong.",
    seeAlso: ["advancement-counters"],
    rulesLink: null,
  },
  {
    id: "fast-advance",
    term: "Fast Advance",
    type: "mechanic",
    tier: 2,
    short: "Scoring an agenda without building a protected remote, typically in a single turn from hand.",
    detail: "Fast advance compresses scoring into a single turn: install the agenda and advance it to completion using cards that provide extra advancement or allow scoring from hand. Scoring an agenda does not cost a click — it is done during a paid ability window. Fast advance denies the Runner any window to steal and punishes Runners who rely purely on remote pressure and ignore HQ.",
    seeAlso: ["advancement-counters", "scoring-window"],
    rulesLink: null,
  },
  {
    id: "scoring-window",
    term: "Score Windows",
    type: "mechanic",
    tier: 2,
    short: "Moments when the Corp can safely advance or score an agenda without immediate theft risk.",
    detail: "Score windows are created by credit leads (Runner can't afford runs), Runner disruption (key breaker trashed), or threat density (too many servers to check). They are not guaranteed by board state alone — a Runner with enough credits can always make a run. Identifying and creating score windows is the central Corp skill.",
    seeAlso: ["advancement-counters", "fast-advance"],
    rulesLink: null,
  },
  {
    id: "bad-publicity",
    term: "Bad Publicity",
    type: "mechanic",
    tier: 1,
    short: "A persistent Corp drawback that gives the Runner extra credits to spend during each run.",
    detail: "Each bad publicity counter causes the Runner to add 1 credit to their bad publicity fund at the start of each run (step 6.9.1b). These credits are kept in a dedicated fund separate from the Runner's credit pool — they are not recurring credits. The Runner can spend them freely during that run, and any unspent credits are returned to the bank when the run ends (step 6.9.6b). Bad publicity does not stack between runs; credits are added fresh each run and any leftovers are lost. A single bad publicity over a long game can represent significant effective value — it pays at exactly the moment it's most useful.",
    seeAlso: ["recurring-credits"],
    rulesLink: null,
  },
  {
    id: "recurring-credits",
    term: "Recurring Credits",
    type: "mechanic",
    tier: 1,
    short: "Credits placed on a card that refill automatically each turn and can only be spent on specific things.",
    detail: "When a card has recurring credits, those credits are placed on it when it first becomes active. At the start of each player's turn (before other turn-beginning abilities), recurring credits refill up to the card's stated amount — they do not accumulate beyond that number. They can only be spent as specified by the card (e.g. 'to pay for icebreaker abilities' or 'during traces'). The spending restriction is what keeps them balanced. Bad publicity credits are distinct — they use a separate bad publicity fund, not a recurring credit mechanic.",
    seeAlso: ["bad-publicity"],
    rulesLink: null,
  },
  {
    id: "purge",
    term: "Purge",
    type: "mechanic",
    tier: 2,
    short: "A Corp basic action costing 3 clicks that removes all virus counters from all cards.",
    detail: "Purging is a single basic action with a cost of 3 clicks (the Corp's full allotment). It globally removes all virus counters from every card in play. If the Corp has additional clicks from card effects, they may still act after purging. This is the primary counterplay to virus-based Runner strategies. The cost is steep but non-negotiable when virus pressure becomes lethal.",
    seeAlso: ["custom-counters"],
    rulesLink: null,
  },
  {
    id: "psi-game",
    term: "Psi Game",
    type: "mechanic",
    tier: 2,
    short: "A simultaneous secret bid (0, 1, or 2 credits) where matching or differing bids trigger different outcomes.",
    detail: "Both players secretly choose 0, 1, or 2 credits, reveal simultaneously, and both spend whatever they bid. The card specifies what happens if bids match vs differ. Psi games are information and credit-pressure tools — they reward pattern disruption and punish predictability. Both players always pay their bid regardless of outcome. The most common rules error is forgetting that both players pay.",
    seeAlso: [],
    rulesLink: null,
  },
  {
    id: "expose",
    term: "Expose",
    type: "mechanic",
    tier: 2,
    short: "Revealing a facedown Corp card without accessing it — no on-access effects, no steal window.",
    detail: "Expose lets the Runner see a card's identity without triggering access consequences. Only installed, unrezzed cards can be exposed. Trash costs do not apply, on-access abilities do not fire, and the Runner cannot steal an agenda through expose. After exposing, the card returns to its previous facedown state. Useful for identifying traps before committing to a run.",
    seeAlso: ["steal-vs-score"],
    rulesLink: null,
  },
  {
    id: "steal-vs-score",
    term: "Steal vs Score",
    type: "mechanic",
    tier: 1,
    short: "Steal is when the Runner takes an agenda; Score is when the Corp claims one. Many effects care which happened.",
    detail: "These are mechanically distinct events. Score: the Corp has an agenda with enough advancement counters and scores it during a paid ability window — this does not cost a click and is not an action. Steal: the Runner accesses an agenda and takes it (the Runner generally cannot decline to steal). Many card effects trigger only on one — 'when you score' abilities do not fire when the Corp's agenda is stolen, and vice versa. Misplaying this distinction is a common competitive error.",
    seeAlso: ["expose"],
    rulesLink: null,
  },
  {
    id: "hosting",
    term: "Hosting",
    type: "mechanic",
    tier: 2,
    short: "Placing a card or counter on another card, creating a host relationship.",
    detail: "Hosted objects exist in the same zone as their host. A host relationship can only be created by a card ability — any card in an eligible location can act as a host, but the relationship must be explicitly permitted. Trashing the host causes all hosted objects to be trashed at the next checkpoint (this cannot be prevented). A hosted card may be installed or not installed; the two states have different rules implications. Hosting is not transitive: if A is hosted on B, and B on C, A is not considered hosted on C.",
    seeAlso: [],
    rulesLink: null,
  },
  {
    id: "click-compression",
    term: "Click Compression",
    type: "mechanic",
    tier: 2,
    short: "Any effect that produces more than one click's worth of value from a single action.",
    detail: "Click compression is how strong turns are constructed. Examples: gaining credits and drawing in one click, installing and getting a discount, triggering multiple abilities from one action. Click compression lets a player outpace the opponent's turn economy — a player getting 5 clicks of value from 4 actions is structurally ahead regardless of credits.",
    seeAlso: ["burst-economy"],
    rulesLink: null,
  },
  {
    id: "mandatory-draw",
    term: "Mandatory Draw",
    type: "mechanic",
    tier: 0,
    short: "The Corp draws 1 card at the start of their turn; this is mandatory and cannot be skipped.",
    detail: "The Corp must draw one card during their Draw Phase (step 5.6.1e). This is a rules obligation, not a choice, and does not cost a click. It interacts with R&D density — if the Corp must draw and R&D is empty, the Runner wins immediately. This makes agenda-dense R&D slightly more dangerous to the Corp as the game progresses.",
    seeAlso: [],
    rulesLink: null,
  },
  {
    id: "jack-out",
    term: "Jack Out",
    type: "mechanic",
    tier: 0,
    short: "The Runner voluntarily ends a run during the Movement Phase, after passing a piece of ice.",
    detail: "The Runner can jack out during step 6.9.4c of the Movement Phase — after passing a piece of ice, before moving to the next position. If there is no ice protecting the server, the Runner can jack out before approaching the server. The Runner cannot jack out during an encounter or during the Approach Ice Phase. Jacking out ends the run as unsuccessful. Some Corp cards trigger specifically if the Runner jacks out, making the abort decision potentially punishable.",
    seeAlso: ["run-structure", "successful-run"],
    rulesLink: null,
  },
  {
    id: "successful-run",
    term: "Successful Run",
    type: "mechanic",
    tier: 0,
    short: "A run that reaches the Success Phase, triggering 'if successful' abilities and granting a breach.",
    detail: "A run is declared successful when it reaches step 6.9.5a of the Success Phase — this happens after the Runner passes all ice and approaches the server. The run being successful is what triggers 'if successful' abilities and grants the Runner a breach of the attacked server. Accessing cards is a consequence of the breach, not a condition of success. A run that ends before reaching the Success Phase (jacked out, ended by subroutine) is not successful and these abilities do not fire.",
    seeAlso: ["run-structure", "jack-out"],
    rulesLink: null,
  },
  {
    id: "conditional-subroutines",
    term: "Conditional Subroutines",
    type: "mechanic",
    tier: 2,
    short: "Subroutines that only resolve if a specific condition is met at resolution time.",
    detail: "A conditional subroutine checks its condition when it fires, not when the ice is encountered. If the condition is not met at that moment, the subroutine does nothing even if unbroken. This means some ice is situationally much more dangerous depending on game state — the same ice that was harmless last run can be lethal this run.",
    seeAlso: ["breaking-subroutines"],
    rulesLink: null,
  },
  {
    id: "scaling-ice",
    term: "Scaling Ice",
    type: "mechanic",
    tier: 2,
    short: "Ice whose strength, subroutines, or effects change based on game state.",
    detail: "Scaling ice grows more dangerous over time based on advancement counters, installed cards, credits, or other board conditions. It forces the Runner to reassess servers dynamically — ice that was breakable on turn 3 may not be breakable on turn 8. Runners must check scaling ice early or accept that it may become impassable.",
    seeAlso: ["advancement-counters", "variable-ice-strength"],
    rulesLink: null,
  },
  {
    id: "variable-ice-strength",
    term: "Variable Ice Strength",
    type: "mechanic",
    tier: 2,
    short: "Ice whose strength is recalculated continuously based on conditions, not fixed at rez.",
    detail: "Variable strength ice is not a fixed number — it is recalculated whenever checked. This means an icebreaker that matched strength at encounter start may fall behind mid-encounter if the strength changes. Strength boosts and timing decisions become critical. Some ice can become unbreakable mid-run if conditions shift.",
    seeAlso: ["scaling-ice", "breaking-subroutines"],
    rulesLink: null,
  },

  // ── NAMED CONCEPTS ────────────────────────────────────────────────────────

  {
    id: "tempo",
    term: "Tempo",
    type: "concept",
    tier: null,
    short: "Who is accumulating useful resources and progressing their strategy faster.",
    detail: "Tempo is one of the most-discussed concepts in Netrunner community writing, with an extensive Stimhack article series dedicated to it. It refers to the efficiency with which each player converts their available resources (clicks, credits, cards) into meaningful progress. A player gaining tempo is advancing their win condition or disrupting the opponent's; a player losing tempo is reacting, recovering, or wasting resources on low-value actions. Tempo advantages compound — the player ahead dictates the pace while the player behind scrambles to respond.",
    seeAlso: ["click-compression", "burst-economy", "tempo-swing"],
    rulesLink: null,
  },
  {
    id: "tempo-swing",
    term: "Tempo Swing",
    type: "concept",
    tier: null,
    short: "A sequence of actions that dramatically shifts the tempo balance between players.",
    detail: "Tempo swings are the decisive moments of most Netrunner games. A single turn that rezzes two key pieces of ice, scores an agenda, and tags the Runner is a massive swing in the Corp's favour. Account Siphon is a classic example from the other side — a 15-credit swing that simultaneously helps the Runner and cripples the Corp. Recognising when a swing turn is available, and either executing it or preventing the opponent from executing theirs, is a core skill at tournament level.",
    seeAlso: ["tempo", "click-compression"],
    rulesLink: null,
  },
  {
    id: "scoring-window",
    term: "Scoring Window",
    type: "concept",
    tier: null,
    short: "A period when the Corp can safely advance and score an agenda without the Runner being able to steal it.",
    detail: "Scoring window is established community vocabulary, named explicitly in Stimhack strategy articles. A scoring window opens when the Runner is too poor to make a run, lacks the right breaker, has just had a key program trashed, or simply cannot contest a well-defended remote. The Corp's entire mid-game is about creating and exploiting these windows. Fast advance bypasses the need for a window entirely by scoring from hand in a single turn.",
    seeAlso: ["remote-pressure", "fast-advance", "tempo"],
    rulesLink: null,
  },
  {
    id: "burst-economy",
    term: "Burst Economy",
    type: "concept",
    tier: null,
    short: "Economy that delivers large credit value immediately rather than over time.",
    detail: "Burst economy cards (Sure Gamble, Hedge Fund, etc.) are powerful for recovering from a dangerous credit position, funding a decisive run, or enabling a scoring push. They create credit peaks and troughs rather than a steady income. The community distinguishes burst economy from drip economy (PAD Campaign, recurring credits) — burst is better when you need credits right now; drip is better when you have time to let it accumulate.",
    seeAlso: ["tempo", "credit-denial"],
    rulesLink: null,
  },
  {
    id: "credit-denial",
    term: "Credit Denial",
    type: "concept",
    tier: null,
    short: "A strategy that wins by preventing the opponent from accumulating or keeping credits.",
    detail: "Credit denial is a recognised Netrunner archetype and strategy concept, appearing in Stimhack articles and NetrunnerDB decklists. It works by making everything the opponent does more expensive — taxing ice, trash-cost assets, and economy disruption operations. Many game mechanics scale directly with available credits: traces, trash costs, breaking ice. Forcing the opponent below the threshold where they can respond to threats is often sufficient to win without ever dealing a killing blow.",
    seeAlso: ["tempo", "remote-pressure"],
    rulesLink: null,
  },
  {
    id: "remote-pressure",
    term: "Remote Pressure",
    type: "concept",
    tier: null,
    short: "The Runner's effort to contest Corp remote servers, preventing scoring or asset snowballing.",
    detail: "Remote pressure is the Runner's primary tool for preventing the Corp from scoring agendas safely. A Runner applying consistent remote pressure forces the Corp to either protect every remote (expensive) or accept agenda steals. It requires credits, the right breakers, and correct timing. Over-committing to remote pressure leaves centrals uncontested, letting the Corp dig through R&D freely. The skill is knowing when to pressure remotes vs shift to centrals.",
    seeAlso: ["central-pressure", "scoring-window"],
    rulesLink: null,
  },
  {
    id: "central-pressure",
    term: "Central Pressure",
    type: "concept",
    tier: null,
    short: "Pressure on HQ, R&D, and Archives to disrupt Corp plans or threaten agenda steals.",
    detail: "Central pressure is typically cheaper than remote pressure but less immediately decisive. Running R&D repeatedly can steal agendas and is often called an 'R&D lock' when the Runner can reliably access it every turn. Running HQ disrupts the Corp's hand. Switching between central and remote pressure forces the Corp to defend everywhere, which is often more effective than hammering one server.",
    seeAlso: ["remote-pressure", "rd-lock"],
    rulesLink: null,
  },
  {
    id: "rd-lock",
    term: "R&D Lock",
    type: "concept",
    tier: null,
    short: "A state where the Runner can access R&D reliably every turn, making it very difficult for the Corp to score.",
    detail: "R&D lock is established community terminology, used explicitly in Stimhack strategy articles. It describes a late-game Runner position where they can run R&D every turn at acceptable cost, accessing enough cards to find agendas before the Corp can score them. It is the standard win condition for control and multi-access Runner decks. The Corp's response is to either heavily ice R&D, draw through the accessed portion using card draw effects, or score agendas faster than the Runner can access them.",
    seeAlso: ["central-pressure", "remote-pressure"],
    rulesLink: null,
  },
  {
    id: "face-checking",
    term: "Face-Checking",
    type: "concept",
    tier: null,
    short: "Running into unrezzed ice without knowing what it is, to force the Corp to spend credits rezzing it or gather information.",
    detail: "Face-checking is established community vocabulary for running into unknown ice. Early in the game, face-checking is often correct — the Corp must either rez (spending credits) or leave the ice unrezzed (giving you information). The risk is running into ice with immediately punishing subroutines before you have breakers. Experienced players face-check selectively based on what ice they can afford to hit: barriers and code gates tend to be safer early; sentries (which can trash programs or deal damage) are riskier. The decision is essentially a cost-benefit of information and tempo vs risk.",
    seeAlso: ["remote-pressure", "tempo"],
    rulesLink: null,
  },
  {
    id: "must-trash-assets",
    term: "Must-Trash Assets",
    type: "concept",
    tier: null,
    short: "Assets that cannot be safely ignored because their ongoing effect is too damaging to allow.",
    detail: "Must-trash is standard community vocabulary when discussing asset-heavy Corp decks. Not every asset demands a response — PAD Campaign can sometimes be ignored if you are racing — but must-trash assets are those where leaving them active creates compounding advantages you cannot recover from: win conditions going live, economy engines snowballing, or recursion enabling the Corp to replay key pieces indefinitely. Identifying which assets are must-trash vs can-ignore is one of the central skill points when playing against asset spam.",
    seeAlso: ["drip-economy-assets", "remote-pressure", "tempo"],
    rulesLink: null,
  },
  {
    id: "drip-economy-assets",
    term: "Drip Economy Assets",
    type: "concept",
    tier: null,
    short: "Assets that generate value slowly over multiple turns if left unchecked.",
    detail: "Drip economy assets (PAD Campaign, Nico Campaign, Rashida Jaheem, etc.) don't threaten you immediately — they threaten you if you ignore them long enough for the Corp to pull far ahead economically. The Runner's decision is whether to spend tempo trashing them now or accept the long-term cost. In a fast game, ignoring them may be correct; in a slow glacier game, a drip economy engine left running for four turns can be game-deciding. The community discussion around 'should I trash the PAD Campaign?' is a classic Netrunner tempo calculation.",
    seeAlso: ["must-trash-assets", "tempo"],
    rulesLink: null,
  },
  {
    id: "threat-assessment",
    term: "Threat Assessment",
    type: "concept",
    tier: null,
    short: "Evaluating what the opponent can realistically do from their current board and credit state.",
    detail: "Good Netrunner play requires continuously asking: what is the most dangerous thing my opponent can legally do right now, and can I survive it? This determines whether a given turn is safe or risky. Running into a server when the Corp has 8 credits and a rezzed Tollbooth is a very different calculation than the same run when they have 2 credits. Threat assessment informs every decision — when to run, when to build, when to clear tags, and when to simply take credits. Misreading the threat level is one of the most common causes of unexpected losses.",
    seeAlso: ["face-checking", "must-trash-assets", "tempo"],
    rulesLink: null,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// UI
// ─────────────────────────────────────────────────────────────────────────────

const TIER_LABELS = {
  0: "Tier 0 — Foundations",
  1: "Tier 1 — Core Literacy",
  2: "Tier 2 — Standard Era",
};

function initMechanics() {
  const searchInput = document.getElementById("mech-search");
  const filterBtns = document.querySelectorAll(".mech-filter-btn");
  const resultsList = document.getElementById("mech-results");
  const detailPanel = document.getElementById("mech-detail");
  const countEl = document.getElementById("mech-count");

  let activeFilter = "all";
  let activeId = null;

  function getFiltered(query, filter) {
    const q = query.toLowerCase().trim();
    return MECHANICS_DATA.filter((entry) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "mechanic" && entry.type === "mechanic") ||
        (filter === "concept" && entry.type === "concept");
      const matchesQuery =
        !q ||
        entry.term.toLowerCase().includes(q) ||
        entry.short.toLowerCase().includes(q) ||
        entry.detail.toLowerCase().includes(q) ||
        (entry.seeAlso || []).some((id) => id.toLowerCase().includes(q));
      return matchesFilter && matchesQuery;
    });
  }

  function renderList(entries) {
    countEl.textContent = `${entries.length} entr${entries.length === 1 ? "y" : "ies"}`;
    if (entries.length === 0) {
      resultsList.innerHTML = `<div class="mech-empty">No entries match — try a different search.</div>`;
      return;
    }
    resultsList.innerHTML = entries
      .map(
        (e) => `
        <button class="mech-list-item ${e.id === activeId ? "active" : ""}" data-id="${e.id}">
          <span class="mech-item-term">${e.term}</span>
          <span class="mech-item-badge mech-badge-${e.type}">${e.type}</span>
        </button>`
      )
      .join("");
    resultsList.querySelectorAll(".mech-list-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeId = btn.dataset.id;
        showDetail(activeId);
        renderList(getFiltered(searchInput.value, activeFilter));
      });
    });
  }

  function showDetail(id) {
    const entry = MECHANICS_DATA.find((e) => e.id === id);
    if (!entry) {
      detailPanel.innerHTML = `<div class="mech-detail-empty">Select a term to see its definition.</div>`;
      return;
    }
    const tierHtml =
      entry.tier !== null
        ? `<span class="mech-detail-tier">${TIER_LABELS[entry.tier] ?? `Tier ${entry.tier}`}</span>`
        : "";
    const seeAlsoHtml =
      entry.seeAlso && entry.seeAlso.length > 0
        ? `<div class="mech-see-also">
            <span class="mech-see-also-label">See also:</span>
            ${entry.seeAlso
              .map((id) => {
                const rel = MECHANICS_DATA.find((e) => e.id === id);
                return rel
                  ? `<button class="mech-see-also-link" data-id="${id}">${rel.term}</button>`
                  : "";
              })
              .join("")}
          </div>`
        : "";

    detailPanel.innerHTML = `
      <div class="mech-detail-header">
        <div class="mech-detail-title-row">
          <h2 class="mech-detail-term">${entry.term}</h2>
          <span class="mech-item-badge mech-badge-${entry.type}">${entry.type}</span>
        </div>
        ${tierHtml}
      </div>
      <p class="mech-detail-short">${entry.short}</p>
      <div class="mech-detail-divider"></div>
      <p class="mech-detail-body">${entry.detail}</p>
      ${seeAlsoHtml}
    `;

    detailPanel.querySelectorAll(".mech-see-also-link").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeId = btn.dataset.id;
        showDetail(activeId);
        renderList(getFiltered(searchInput.value, activeFilter));
        setTimeout(() => {
          const active = resultsList.querySelector(".mech-list-item.active");
          if (active) active.scrollIntoView({ block: "nearest" });
        }, 50);
      });
    });
  }

  function refresh() {
    const entries = getFiltered(searchInput.value, activeFilter);
    renderList(entries);
    if (activeId && !entries.find((e) => e.id === activeId)) {
      activeId = null;
      detailPanel.innerHTML = `<div class="mech-detail-empty">Select a term to see its definition.</div>`;
    }
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;
      refresh();
    });
  });

  searchInput.addEventListener("input", refresh);

  document.addEventListener("keydown", (e) => {
    if (
      e.key === "/" &&
      document.getElementById("page-mechanics").style.display !== "none" &&
      document.activeElement !== searchInput
    ) {
      e.preventDefault();
      searchInput.focus();
    }
  });

  refresh();
  const first = getFiltered("", "all")[0];
  if (first) {
    activeId = first.id;
    showDetail(first.id);
    renderList(getFiltered("", "all"));
  }
}

window.initMechanicsOnce = (() => {
  let done = false;
  return () => {
    if (!done) {
      done = true;
      initMechanics();
    }
  };
})();
