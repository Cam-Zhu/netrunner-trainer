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

  // ── FACTIONS ──────────────────────────────────────────────────────────────

  {
    id: "haas-bioroid",
    term: "Haas-Bioroid",
    type: "faction",
    side: "corp",
    tier: null,
    short: "The efficiency Corp. Bioroid ice, click compression, and program destruction.",
    detail: "Haas-Bioroid (HB) manufactures synthetic bioroids — artificial humanoids used for labour — and their card design reflects total efficiency. HB identities and operations often generate credits or extra clicks for actions you are already taking. Their signature ice are bioroids: strong, efficient pieces whose subroutines can be broken by spending clicks rather than credits, making them taxing against tempo-conscious runners but porous to those willing to sacrifice clicks. HB is the primary fast advance faction via Biotic Labor, and a strong glacier faction with punishing ice like Fairchild. Their secondary threat is core damage and program destruction. Runners facing HB must manage both their credits and their clicks carefully.",
    seeAlso: ["fast-advance", "scoring-window", "core-damage"],
    rulesLink: null,
  },
  {
    id: "jinteki",
    term: "Jinteki",
    type: "faction",
    side: "corp",
    tier: null,
    short: "The trap Corp. Net damage, bluffing, and servers that punish curiosity.",
    detail: "Jinteki is the cloning and biotech megacorporation, and their game plan is built on deception and punishment. They are the primary net damage faction — their ice, ambushes, and traps deal net damage on encounter or access, making every facedown card a potential threat. Jinteki ice tends to be cheap but porous, letting runners in while costing them cards. Their strategic core is information asymmetry: an advanced card in a Jinteki remote could be a scorable agenda or a trap that ends the game. They are widely considered the most difficult Corp faction to pilot well, requiring deep understanding of bluffing, timing, and opponent psychology. Runners facing Jinteki must respect every server, which itself is a victory for the Corp.",
    seeAlso: ["net-damage", "advancing-non-agendas", "flatline-check"],
    rulesLink: null,
  },
  {
    id: "nbn",
    term: "NBN",
    type: "faction",
    side: "corp",
    tier: null,
    short: "The tag Corp. Fast scoring, trace effects, and punishing runners who stay tagged.",
    detail: "NBN is the media and communications giant — they own the data networks and the narrative. Their card design is built around tagging the runner and exploiting those tags, while also being the strongest fast advance faction. NBN ice frequently gives tags on encounter or when subroutines fire, and their operations convert those tags into resource destruction or meat damage. They have the best fast advance tools in the game, capable of scoring agendas from hand in a single turn. Their ice is not the most taxing, but on-encounter effects fire before breakers can act. Runners facing NBN must decide quickly whether to clear tags or accept the risk — and must always be wary of a surprise score out of hand.",
    seeAlso: ["tags", "tag-punishment", "fast-advance", "floating-tags"],
    rulesLink: null,
  },
  {
    id: "weyland-consortium",
    term: "Weyland Consortium",
    type: "faction",
    side: "corp",
    tier: null,
    short: "The money Corp. Big ice, strong economy, and meat damage kill lines.",
    detail: "Weyland Consortium is the megacorporation of construction, resource extraction, and brute force. They have the strongest economy of any Corp faction and build the biggest ice — towering barriers that are expensive to break and can scale with advancement counters. Their kill plan is meat damage, usually enabled by tags from operations like Hard-Hitting News. Weyland's glacier strategy is straightforward: build a fortified remote, accumulate credits, and force the runner to spend more than they can afford to contest it. Some Weyland identities specialise in advancement-counter ice (Akhet, Pharos, Logjam) that rewards a patient scoring plan. Weyland is the most accessible Corp faction for new players — their game plan is clear, their economy is forgiving, and their ice does what it says.",
    seeAlso: ["meat-damage", "tag-punishment", "advancement-counters", "bad-publicity"],
    rulesLink: null,
  },
  {
    id: "anarch",
    term: "Anarch",
    type: "faction",
    side: "runner",
    tier: null,
    short: "The disruption Runner. Virus programs, ice trashing, and relentless pressure.",
    detail: "Anarchs are the rage-fuelled revolutionaries of the runner world — they don't finesse their way past the system, they tear it apart. Their card design is built around virus programs, ice destruction, and resource denial. Where Criminals bypass ice and Shapers build careful rigs, Anarchs trash ice outright, making servers progressively cheaper to run over time. Their breaker suite is powerful and many programs gain strength from virus counters that accumulate through running. Anarchs typically have strong multi-access tools for R&D and forceful disruption events. Their weakness is economy — credits come in bursts and card draw can be inconsistent.",
    seeAlso: ["purge", "credit-denial", "rd-lock", "must-trash-assets"],
    rulesLink: null,
  },
  {
    id: "criminal",
    term: "Criminal",
    type: "faction",
    side: "runner",
    tier: null,
    short: "The finesse Runner. Events, bypass effects, and run-based economy.",
    detail: "Criminals are the professionals of the runner world — cool, calculating, and in it for the score. Their card design is built around powerful events, run-based economy, and ice interaction that doesn't require breaking subroutines: bypass, derez, expose, and the best sentry breakers in the game. Criminals excel at early pressure — their run events generate burst credits and HQ access before the Corp is set up, and identity abilities often reward aggressive running. The tradeoff is that Criminal programs tend to be expensive, and they often rely on out-of-faction breakers for barriers and code gates. They tend to win on tempo rather than inevitability.",
    seeAlso: ["bypassing-ice", "derezzing-ice", "remote-pressure", "burst-economy", "tempo"],
    rulesLink: null,
  },
  {
    id: "shaper",
    term: "Shaper",
    type: "faction",
    side: "runner",
    tier: null,
    short: "The builder Runner. Efficient rigs, strong card draw, and late-game power.",
    detail: "Shapers are the tinkerers and problem-solvers of the runner world — motivated by curiosity and craftsmanship rather than money or rage. Their card design is built around efficient rig construction, the best card draw and program tutoring of any faction, and programs that grow stronger over time. Shapers typically have the best code gate breakers and identity abilities that reduce install costs. They are a late-game faction: slow to set up, but formidable once the rig is complete. Their vulnerability is early pressure — without a full rig, Shapers must be selective about what they run.",
    seeAlso: ["rd-lock", "remote-pressure", "central-pressure", "tempo"],
    rulesLink: null,
  },
  {
    id: "mini-factions",
    term: "Mini-Factions",
    type: "faction",
    side: "runner",
    tier: null,
    short: "Adam, Apex, and Sunny Lebeau — three additional Runner factions with unique rules and unusual playstyles.",
    detail: "In addition to the three main Runner factions, three mini-factions exist: Adam (a bioroid with directive cards that start the game already installed, giving him a pre-built engine from turn one), Apex (a predatory AI who runs facedown installed cards and interacts unusually with Archives), and Sunny Lebeau (a high-link, big-economy runner with a large deck who starts slowly but becomes hard to stop late). Mini-faction identities have higher influence limits than standard Runner identities, compensating for their smaller card pools. All three are legal in competitive play but are uncommon at top tables.",
    seeAlso: ["anarch", "criminal", "shaper"],
    rulesLink: null,
  },

  // ── TERMS ─────────────────────────────────────────────────────────────────

  {
    id: "term-action",
    term: "Action",
    type: "term",
    tier: null,
    short: "Any paid ability that begins with a click cost. Actions can only be taken during your action phase.",
    detail: "An action is any paid ability whose cost starts with one or more clicks. Both players have a set of basic actions always available — gain a credit, draw a card, install a card, play a card, advance a card (Corp), make a run (Runner), remove a tag (Runner), purge virus counters (Corp). Additional actions are provided by cards. Actions can only be taken during the action phase of your own turn.",
    seeAlso: ["term-click", "term-action-phase"],
    rulesLink: null,
  },
  {
    id: "term-action-phase",
    term: "Action Phase",
    type: "term",
    tier: null,
    short: "The main part of a player's turn, during which they spend clicks to take actions.",
    detail: "When the action phase begins, the active player gains their allotted clicks (usually 4 for the Runner, 3 for the Corp). They then spend those clicks taking actions one at a time. The action phase ends when all clicks have been spent. The discard phase follows.",
    seeAlso: ["term-click", "term-allotted-clicks", "term-discard-phase"],
    rulesLink: null,
  },
  {
    id: "term-allotted-clicks",
    term: "Allotted Clicks",
    type: "term",
    tier: null,
    short: "The number of clicks a player gains at the start of their action phase. Usually 4 for the Runner, 3 for the Corp.",
    detail: "At the start of the action phase, a player gains clicks equal to their allotted amount. Card effects can increase or decrease this number permanently or temporarily. You must spend all your clicks before your turn ends — unspent clicks are lost at the end of the discard phase.",
    seeAlso: ["term-click", "term-action-phase"],
    rulesLink: null,
  },
  {
    id: "term-advance",
    term: "Advance",
    type: "term",
    tier: null,
    short: "To place an advancement counter on an installed card. The Corp's basic action costs 1 click and 1 credit.",
    detail: "Advancing a card places one advancement counter on it. Only agendas and cards that explicitly say 'you may advance this card' can be advanced. The Corp's basic advance action costs one click and one credit. Some card effects can place advancement counters without using this action. Advancement is the primary way the Corp scores agendas.",
    seeAlso: ["term-advancement-counter", "term-advancement-requirement", "term-score"],
    rulesLink: null,
  },
  {
    id: "term-advancement-counter",
    term: "Advancement Counter",
    type: "term",
    tier: null,
    short: "A counter placed on installed cards. Agendas need a set number to be scored.",
    detail: "Advancement counters are placed on installed cards, primarily agendas. When an agenda has at least as many advancement counters as its advancement requirement, the Corp may score it during their action phase without spending a click. Some non-agenda cards can also be advanced, becoming more powerful or dangerous as counters accumulate.",
    seeAlso: ["term-advance", "term-advancement-requirement", "term-score"],
    rulesLink: null,
  },
  {
    id: "term-advancement-requirement",
    term: "Advancement Requirement",
    type: "term",
    tier: null,
    short: "The number in the top right of an agenda — how many advancement counters are needed to score it.",
    detail: "The advancement requirement is printed in the top right corner of agenda cards. The Corp must have at least this many advancement counters on the agenda before they can score it. Having more than the requirement is fine — some agendas have effects that reward being scored with extra counters.",
    seeAlso: ["term-advance", "term-advancement-counter", "term-score"],
    rulesLink: null,
  },
  {
    id: "term-access",
    term: "Access",
    type: "term",
    tier: null,
    short: "The procedure the Runner carries out when breaching a server — examining and potentially trashing or stealing each card.",
    detail: "When the Runner breaches a server, they access cards one at a time. During each access, they may pay the card's trash cost to trash it. If the accessed card is an agenda, they must steal it — this cannot normally be declined. Some cards have mid-access abilities that can be triggered during this window. Access is distinct from the run itself; a run must be successful before a breach and access can occur.",
    seeAlso: ["term-breach", "term-trash-cost", "term-steal", "successful-run"],
    rulesLink: null,
  },
  {
    id: "term-archives",
    term: "Archives",
    type: "term",
    tier: null,
    short: "The Corp's discard pile. Also a server the Runner can run.",
    detail: "Archives is where Corp cards go when discarded or trashed. Cards discarded faceup are visible to both players; cards discarded without being seen go facedown. Both players can see faceup cards; only the Corp can see facedown ones. Archives is also a central server — the Corp can protect it with ice and install upgrades there. When the Runner breaches Archives, all cards are turned faceup and the Runner must access every one.",
    seeAlso: ["term-server", "term-central-server", "term-discard", "term-trash"],
    rulesLink: null,
  },
  {
    id: "term-barrier",
    term: "Barrier",
    type: "term",
    tier: null,
    short: "An ICE subtype. Barriers typically end the run if their subroutines fire. Broken by Fracters.",
    detail: "Barrier is one of the three main ICE subtypes. Barriers typically have end-the-run subroutines, stopping the Runner from reaching the server. They are generally broken by icebreaker programs with the Fracter subtype. A Runner without a fracter will struggle to get past barriers without using bypass effects or AI breakers.",
    seeAlso: ["term-ice", "term-code-gate", "term-sentry", "breaking-subroutines"],
    rulesLink: null,
  },
  {
    id: "term-breach",
    term: "Breach",
    type: "term",
    tier: null,
    short: "The procedure for accessing cards in a server after a successful run.",
    detail: "When a run is successful, the Runner breaches the attacked server. During a breach, they access cards one at a time. For HQ they access a random card from the Corp's hand; for R&D they access the top card of the deck; for remote servers they access all installed cards. Some effects allow the Runner to access additional cards. A breach cannot end until all accessible cards have been accessed, unless card text says otherwise.",
    seeAlso: ["term-access", "successful-run", "term-hq", "term-rd", "term-remote-server"],
    rulesLink: null,
  },
  {
    id: "term-break",
    term: "Break",
    type: "term",
    tier: null,
    short: "To prevent a subroutine from resolving during the current encounter.",
    detail: "Breaking a subroutine stops its effect for that encounter only. Once the encounter ends, all subroutines reset and will fire again on future runs. Most breaking is done by icebreaker programs, but some hardware and resources can also break subroutines. To use most icebreaker interface abilities, the breaker's strength must match or exceed the ice's strength.",
    seeAlso: ["term-subroutine", "term-strength", "term-ice", "breaking-subroutines"],
    rulesLink: null,
  },
  {
    id: "term-central-server",
    term: "Central Server",
    type: "term",
    tier: null,
    short: "One of the three servers the Corp starts the game with: HQ, R&D, and Archives.",
    detail: "Central servers exist from the start of the game and cannot be destroyed. HQ is the Corp's hand, R&D is their deck, and Archives is their discard pile. All three can be protected with ice and have upgrades installed in their root. Runners often target central servers to find agendas or disrupt the Corp's hand and deck.",
    seeAlso: ["term-hq", "term-rd", "term-archives", "term-remote-server", "term-server"],
    rulesLink: null,
  },
  {
    id: "term-charge",
    term: "Charge",
    type: "term",
    tier: null,
    short: "To place an additional power counter on a card that already has power counters.",
    detail: "When an effect tells you to charge a card, add one power counter to it, but only if it already has at least one power counter on it. Charging is a way to refuel certain cards that use power counters as a resource.",
    seeAlso: ["term-power-counter", "term-load"],
    rulesLink: null,
  },
  {
    id: "term-click",
    term: "Click",
    type: "term",
    tier: null,
    short: "The primary action resource. Spent to take actions. Represented by the [click] symbol.",
    detail: "Clicks are the currency of actions. The Corp gains 3 clicks per turn and the Runner gains 4 — these are their allotted clicks. Clicks are spent to take actions: gaining credits, drawing cards, installing cards, making runs, and more. Unspent clicks are lost at the end of the discard phase. Some effects cost clicks outside of normal actions, represented as 'Lose [click]'.",
    seeAlso: ["term-action", "term-action-phase", "term-allotted-clicks"],
    rulesLink: null,
  },
  {
    id: "term-code-gate",
    term: "Code Gate",
    type: "term",
    tier: null,
    short: "An ICE subtype. Code gates typically tax or inconvenience the Runner rather than end the run outright. Broken by Decoders.",
    detail: "Code gate is one of the three main ICE subtypes. Code gates often give the Corp an advantage or make the run more difficult for the Runner without simply ending it — taxing credits, giving the Corp cards, or bypassing the Runner's effects. They are generally broken by icebreaker programs with the Decoder subtype.",
    seeAlso: ["term-ice", "term-barrier", "term-sentry", "breaking-subroutines"],
    rulesLink: null,
  },
  {
    id: "term-credit",
    term: "Credit",
    type: "term",
    tier: null,
    short: "The primary economic resource. Used to pay costs throughout the game. Represented by the [credit] symbol.",
    detail: "Credits are used to pay install costs, play costs, rez costs, trash costs, and many other costs throughout the game. Both players start with 5 credits. The basic action to gain a credit gives 1 credit per click. Credits in your credit pool are always visible to your opponent.",
    seeAlso: ["term-install", "term-rez", "term-trash-cost"],
    rulesLink: null,
  },
  {
    id: "term-derez",
    term: "Derez",
    type: "term",
    tier: null,
    short: "To turn a rezzed Corp card facedown, deactivating it. The Corp must pay to rez it again.",
    detail: "Derezzed cards return to an unrezzed facedown state and lose their active effects. The Corp must pay the rez cost again to reactivate the card. Derezzing is distinct from trashing — the card stays installed but inactive. Some Runner cards and abilities can derez ICE or other Corp cards as a disruption tool.",
    seeAlso: ["term-rez", "term-unrezzed", "derezzing-ice"],
    rulesLink: null,
  },
  {
    id: "term-discard",
    term: "Discard",
    type: "term",
    tier: null,
    short: "To put a card into your discard pile — the heap (Runner) or Archives (Corp).",
    detail: "Discarding happens at the end of your turn when you must reduce your hand to your maximum hand size. Discarding is different from trashing — discarded cards do not trigger 'when trashed' effects. If the Runner can see a Corp card as it's discarded, it goes to Archives faceup; otherwise facedown.",
    seeAlso: ["term-heap", "term-archives", "term-trash", "term-discard-phase"],
    rulesLink: null,
  },
  {
    id: "term-discard-phase",
    term: "Discard Phase",
    type: "term",
    tier: null,
    short: "The final phase of a player's turn. Cards are discarded to hand size, then the turn ends.",
    detail: "During the discard phase, the active player discards cards from their hand until they are at or below their maximum hand size (5 for most Runners, 5 for the Corp). There is a paid ability window during this phase. After discarding, the active player loses any unspent clicks and the turn passes to their opponent.",
    seeAlso: ["term-discard", "term-action-phase"],
    rulesLink: null,
  },
  {
    id: "term-double",
    term: "Double",
    type: "term",
    tier: null,
    short: "A subtype on events and operations. Requires spending an additional click to play, for a total of 2 clicks.",
    detail: "A Double is an event (Runner) or operation (Corp) with an additional cost of one click to play, as stated in its card text. This means playing a double costs at least 2 clicks in total. The extra click requirement makes these cards more expensive tempo-wise but they often have powerful effects to compensate.",
    seeAlso: ["term-triple", "term-terminal"],
    rulesLink: null,
  },
  {
    id: "term-grip",
    term: "Grip",
    type: "term",
    tier: null,
    short: "The Runner's hand of cards. Only the Runner may look at them.",
    detail: "The grip is the Runner's hand. Cards are drawn into the grip, played from it, and discarded from it. Only the Runner can see their grip unless a specific card effect says otherwise. The standard maximum hand size is 5 cards, though core damage permanently reduces this.",
    seeAlso: ["term-stack", "term-heap", "term-discard"],
    rulesLink: null,
  },
  {
    id: "term-heap",
    term: "Heap",
    type: "term",
    tier: null,
    short: "The Runner's discard pile. All cards in the heap are always faceup and visible to both players.",
    detail: "The heap is where Runner cards go when trashed or discarded. All cards in the heap are faceup and both players can look at them at any time. Some Runner cards and effects interact with the heap, allowing cards to be recurred or used from it.",
    seeAlso: ["term-grip", "term-stack", "term-archives"],
    rulesLink: null,
  },
  {
    id: "term-hq",
    term: "HQ",
    type: "term",
    tier: null,
    short: "The Corp's hand of cards. Also a central server the Runner can run.",
    detail: "HQ is the name for the Corp's hand. Only the Corp can look at cards in HQ unless a card effect says otherwise. HQ is also a central server — the Corp can protect it with ice and install upgrades in its root. When the Runner breaches HQ, they access one random card from the Corp's hand. Effects that grant additional accesses let the Runner see more cards from HQ one at a time.",
    seeAlso: ["term-rd", "term-archives", "term-central-server", "term-breach"],
    rulesLink: null,
  },
  {
    id: "term-ice",
    term: "ICE",
    type: "term",
    tier: null,
    short: "Cards the Corp installs to protect servers. ICE is encountered during runs and has subroutines the Runner must break.",
    detail: "ICE is installed facedown in front of servers to protect them. When the Runner runs a server, they approach and potentially encounter each piece of ICE protecting it in turn, from outermost to innermost. The Corp can rez ICE when the Runner approaches it. Rezzed ICE fires its subroutines unless the Runner breaks them. The three main ICE subtypes are Barrier, Code Gate, and Sentry.",
    seeAlso: ["term-barrier", "term-code-gate", "term-sentry", "term-subroutine", "term-rez"],
    rulesLink: null,
  },
  {
    id: "term-install",
    term: "Install",
    type: "term",
    tier: null,
    short: "To place a card permanently into play. Installed cards remain until removed by another effect.",
    detail: "Installing puts a card into play. The Runner installs programs, hardware, and resources; the Corp installs ICE, assets, agendas, and upgrades. The basic install action costs one click plus the card's install cost in credits. Corp cards are installed facedown (unrezzed). The Runner cannot exceed their MU limit with programs, and a remote server can only contain one agenda or asset at a time.",
    seeAlso: ["term-rez", "term-unrezzed", "term-remote-server", "term-credit"],
    rulesLink: null,
  },
  {
    id: "term-link",
    term: "Link",
    type: "term",
    tier: null,
    short: "A Runner stat that adds to their base strength when resisting traces. Shown on the identity card.",
    detail: "Link is a permanent Runner attribute shown in the top left of their identity card. It adds directly to the Runner's starting strength when a trace is initiated — a Runner with 2 link starts at 2 before spending any credits. Link has no effect outside of trace resolution but is especially relevant against Corp decks that rely heavily on traces.",
    seeAlso: ["trace", "term-trace"],
    rulesLink: null,
  },
  {
    id: "term-load",
    term: "Load",
    type: "term",
    tier: null,
    short: "To place a specified number of counters on a card. When all counters are removed, the card becomes empty.",
    detail: "Loading places counters (often power counters) on a card as instructed. When all counters that were ever loaded onto a card have been removed, it becomes empty. Most cards with load effects specify what happens when they become empty — often being trashed or removed from the game.",
    seeAlso: ["term-power-counter", "term-charge"],
    rulesLink: null,
  },
  {
    id: "term-mandate",
    term: "Mandate",
    type: "term",
    tier: null,
    short: "A card subtype. Only the first mandate played each turn gets its primary effect.",
    detail: "Mandate is a subtype on certain Runner cards. The card text specifies a powerful effect, but only the first mandate played each turn activates it. Subsequent mandates played in the same turn do not get that effect. This limits how frequently the most powerful aspects of mandate cards can be leveraged.",
    seeAlso: ["term-action"],
    rulesLink: null,
  },
  {
    id: "term-mark",
    term: "Mark",
    type: "term",
    tier: null,
    short: "A randomly identified central server that some Runner cards interact with.",
    detail: "Most of the time, the Runner does not have a mark. When a card tells the Runner to identify their mark, they randomly select a central server and treat it as their mark for the rest of that turn. Some cards provide benefits when running the mark. If the Runner already has a mark, they keep it; if not, one is chosen at random.",
    seeAlso: ["term-central-server", "term-run"],
    rulesLink: null,
  },
  {
    id: "term-power-counter",
    term: "Power Counter",
    type: "term",
    tier: null,
    short: "A common counter type placed on cards. Each card uses them differently — check the card text.",
    detail: "Power counters are a generic counter type placed on cards by various effects. What they do depends entirely on the card they are on — there is no universal rule for power counters beyond the basic counter mechanics. Some cards use them as a resource that depletes, others accumulate them to trigger effects.",
    seeAlso: ["term-load", "term-charge", "term-virus-counter"],
    rulesLink: null,
  },
  {
    id: "term-rd",
    term: "R&D",
    type: "term",
    tier: null,
    short: "The Corp's deck. Also a central server the Runner can run.",
    detail: "R&D is the Corp's deck. Cards drawn by the Corp come from R&D. If the Corp must draw but R&D is empty, they lose the game immediately. No player can look at R&D unless a card effect allows it. R&D is also a central server — it can be protected with ice and have upgrades installed. When the Runner breaches R&D, they access the top card of the deck. Effects that grant additional accesses let the Runner see deeper into the deck.",
    seeAlso: ["term-hq", "term-archives", "term-central-server", "term-breach"],
    rulesLink: null,
  },
  {
    id: "term-remote-server",
    term: "Remote Server",
    type: "term",
    tier: null,
    short: "A server created by the Corp to install agendas and assets. The Corp starts with none.",
    detail: "The Corp creates remote servers by installing cards into them. Each remote server can hold exactly one agenda or asset (not both) plus any number of upgrades, all in its root. Remote servers can be protected with ice like central servers. The Corp scores agendas from remote servers. Runners must apply remote pressure to prevent the Corp from safely advancing and scoring.",
    seeAlso: ["term-central-server", "term-server", "term-root", "remote-pressure"],
    rulesLink: null,
  },
  {
    id: "term-reveal",
    term: "Reveal",
    type: "term",
    tier: null,
    short: "To temporarily show a card to all players without turning it faceup or rezzing it.",
    detail: "Revealing a card shows its face to all players momentarily. This does not rez the card, does not turn it permanently faceup, and does not trigger on-access effects. After being revealed, the card returns to its previous state. Reveal is purely informational.",
    seeAlso: ["term-rez", "term-unrezzed", "expose"],
    rulesLink: null,
  },
  {
    id: "term-rez",
    term: "Rez",
    type: "term",
    tier: null,
    short: "To turn a facedown Corp card faceup and active, paying its rez cost.",
    detail: "The Corp installs cards facedown and unrezzed. Rezzing flips a card faceup and activates its effects. To rez a card, the Corp pays its rez cost in credits (shown in the top left of the card). Most cards can be rezzed at almost any time, including during the Runner's turn. ICE can only be rezzed when the Runner approaches it. Agendas cannot be rezzed.",
    seeAlso: ["term-unrezzed", "term-derez", "term-install", "term-ice"],
    rulesLink: null,
  },
  {
    id: "term-root",
    term: "Root",
    type: "term",
    tier: null,
    short: "The part of a server where upgrades (and for remotes, agendas or assets) are installed.",
    detail: "Every server has a root. Upgrades are installed in a server's root. Remote servers can also have one additional card in their root — either an agenda or an asset, but not both. ICE protecting a server sits outside its root. When the Runner breaches a server, they access all cards in the root.",
    seeAlso: ["term-server", "term-remote-server", "term-install"],
    rulesLink: null,
  },
  {
    id: "term-run",
    term: "Run",
    type: "term",
    tier: null,
    short: "An action the Runner takes to challenge a server, passing its ICE and attempting to breach it.",
    detail: "Making a run is the Runner's primary way to interact with the Corp's installed cards and find agendas. The Runner declares a target server and then approaches each piece of ICE protecting it in turn, from outermost to innermost. If all ICE is passed, the run becomes successful and the Runner breaches the server. Runs can end early if ICE subroutines fire or the Runner jacks out.",
    seeAlso: ["term-breach", "term-ice", "successful-run", "jack-out"],
    rulesLink: null,
  },
  {
    id: "term-sabotage",
    term: "Sabotage",
    type: "term",
    tier: null,
    short: "An instruction that forces the Corp to discard cards — first from HQ, then from the top of R&D.",
    detail: "When a card tells the Runner to sabotage by a number, the Corp must discard that many cards. The Corp may discard any number from HQ first, then must make up the remainder by discarding from the top of R&D. Sabotage is a disruption tool that can strip the Corp's hand and expose the top of their deck.",
    seeAlso: ["term-hq", "term-rd", "term-discard"],
    rulesLink: null,
  },
  {
    id: "term-score",
    term: "Score",
    type: "term",
    tier: null,
    short: "For the Corp: to move an installed agenda with enough advancement counters to their score area. Does not cost a click.",
    detail: "Scoring is how the Corp wins agenda points. An agenda can be scored during the Corp's action phase when it has at least as many advancement counters as its advancement requirement. Scoring does not cost a click and can happen in paid ability windows during the Corp's turn. The Corp wins when they have 7 or more agenda points in their score area.",
    seeAlso: ["term-advancement-counter", "term-advancement-requirement", "steal-vs-score"],
    rulesLink: null,
  },
  {
    id: "term-sentry",
    term: "Sentry",
    type: "term",
    tier: null,
    short: "An ICE subtype. Sentries typically damage the Runner, trash their cards, or give tags. Broken by Killers.",
    detail: "Sentry is one of the three main ICE subtypes. Sentries are aggressive — their subroutines typically deal net damage, trash installed Runner programs, give tags, or some combination. They are generally broken by icebreaker programs with the Killer subtype. Encountering a sentry without a killer can be very dangerous.",
    seeAlso: ["term-ice", "term-barrier", "term-code-gate", "net-damage", "tags"],
    rulesLink: null,
  },
  {
    id: "term-server",
    term: "Server",
    type: "term",
    tier: null,
    short: "A zone the Corp can protect with ICE. Runners make runs to access cards in servers.",
    detail: "Servers are the Corp's defended zones. There are three central servers (HQ, R&D, Archives) that exist from the start, and any number of remote servers the Corp creates by installing cards. All servers can be protected with ICE and have upgrades installed in their root. The Runner runs servers to access agendas, trash assets, and disrupt the Corp.",
    seeAlso: ["term-central-server", "term-remote-server", "term-run", "term-ice"],
    rulesLink: null,
  },
  {
    id: "term-stack",
    term: "Stack",
    type: "term",
    tier: null,
    short: "The Runner's deck. Cards are drawn from the top of the stack.",
    detail: "The stack is the Runner's deck of cards. No player can look at the stack unless a card effect allows it. Unlike the Corp, the Runner does not lose if their stack runs out — they simply continue playing with no cards left to draw. Cards are drawn from the top of the stack into the grip.",
    seeAlso: ["term-grip", "term-heap", "term-rd"],
    rulesLink: null,
  },
  {
    id: "term-steal",
    term: "Steal",
    type: "term",
    tier: null,
    short: "For the Runner: to take an accessed agenda and move it to their score area.",
    detail: "When the Runner accesses an agenda, they must steal it — this cannot normally be declined. The agenda moves to the Runner's score area and they gain its agenda points. The Runner wins when they have 7 or more agenda points. Some agendas have additional costs to steal, which the Runner can decline — if they do, the agenda is not stolen.",
    seeAlso: ["term-access", "term-score", "steal-vs-score"],
    rulesLink: null,
  },
  {
    id: "term-strength",
    term: "Strength",
    type: "term",
    tier: null,
    short: "A value on ICE and icebreakers. An icebreaker must match or exceed the ICE's strength to break its subroutines.",
    detail: "Strength determines whether an icebreaker can interface with a piece of ICE. To break subroutines, the icebreaker's strength must be at least equal to the ICE's strength. Most icebreakers have abilities to boost their strength temporarily during an encounter. Strength boosts on icebreakers that say '+X strength' as their full effect last only until the end of the current encounter.",
    seeAlso: ["term-break", "term-subroutine", "term-ice", "variable-ice-strength"],
    rulesLink: null,
  },
  {
    id: "term-subroutine",
    term: "Subroutine",
    type: "term",
    tier: null,
    short: "A special ability on ICE, marked by the [subroutine] symbol. Unbroken subroutines resolve when the Runner encounters ICE.",
    detail: "Subroutines are the effects ICE has during an encounter. When the Runner encounters rezzed ICE, they have a window to break subroutines using icebreakers or other effects. Any subroutine not broken resolves in order. Subroutines are written as instructions for the Corp — a subroutine saying 'Gain 1 credit' means the Corp gains a credit. The most impactful subroutine is 'End the run', which stops the run entirely.",
    seeAlso: ["term-break", "term-ice", "term-strength", "breaking-subroutines"],
    rulesLink: null,
  },
  {
    id: "term-terminal",
    term: "Terminal",
    type: "term",
    tier: null,
    short: "A subtype on events and operations. Playing a terminal ends your action phase immediately.",
    detail: "When a player plays a terminal event or operation, their action phase ends as soon as the card resolves — any remaining clicks are lost. This is a significant restriction, as the player forfeits all further actions that turn. Terminals typically have powerful effects to justify this cost.",
    seeAlso: ["term-double", "term-action-phase"],
    rulesLink: null,
  },
  {
    id: "term-trace",
    term: "Trace",
    type: "term",
    tier: null,
    short: "A credit contest initiated by the Corp. If trace strength exceeds the Runner's link plus credits spent, the trace succeeds.",
    detail: "A trace is written as 'Trace X'. The Corp boosts their strength from the base X by spending credits. The Runner then responds using their link value plus any credits they choose to spend. If the Corp's final strength strictly exceeds the Runner's, the trace succeeds and its effect resolves. Both players keep whatever credits they spent regardless of outcome.",
    seeAlso: ["trace", "term-link", "link"],
    rulesLink: null,
  },
  {
    id: "term-transaction",
    term: "Transaction",
    type: "term",
    tier: null,
    short: "A subtype on Corp cards, typically operations, that provide the Corp with credits.",
    detail: "Transaction is a subtype placed on Corp cards, most often operations, that cause the Corp to gain credits. The specific amount and conditions are on each individual card. Some identities and cards interact specifically with the transaction subtype.",
    seeAlso: ["term-credit"],
    rulesLink: null,
  },
  {
    id: "term-trash",
    term: "Trash",
    type: "term",
    tier: null,
    short: "To discard a card from wherever it is — into the heap (Runner) or Archives (Corp). Triggers 'when trashed' effects.",
    detail: "Trashing sends a card to the discard pile and triggers any 'when trashed' effects on that card or others. Trashing is distinct from discarding — cards discarded from hand at end of turn are not trashed and do not trigger these effects. The Runner can trash accessed Corp cards by paying their trash cost. Some card abilities have a trash cost (the recycle symbol) requiring the card itself to be trashed to activate.",
    seeAlso: ["term-trash-cost", "term-discard", "term-heap", "term-archives"],
    rulesLink: null,
  },
  {
    id: "term-trash-cost",
    term: "Trash Cost",
    type: "term",
    tier: null,
    short: "A credit cost in the lower right of Corp cards. The Runner pays this during access to trash the card.",
    detail: "Trash cost appears in the lower right corner of assets and upgrades, and occasionally on other Corp cards. When the Runner accesses a card with a trash cost, they may pay that many credits to trash it. This is always optional — the Runner does not have to trash it. The Corp's most powerful assets and upgrades typically have higher trash costs, forcing the Runner to spend significant credits to remove them.",
    seeAlso: ["term-trash", "term-access"],
    rulesLink: null,
  },
  {
    id: "term-triple",
    term: "Triple",
    type: "term",
    tier: null,
    short: "A subtype on events and operations. Requires spending two additional clicks to play, for a total of 3 clicks.",
    detail: "A Triple is an event or operation with an additional cost of two clicks to play, as stated in its card text. This means playing a triple costs at least 3 clicks in total — most of a player's turn. Triples have effects powerful enough to justify this steep tempo cost.",
    seeAlso: ["term-double", "term-terminal"],
    rulesLink: null,
  },
  {
    id: "term-unrezzed",
    term: "Unrezzed",
    type: "term",
    tier: null,
    short: "The facedown state of an installed Corp card. Most effects are inactive while a card is unrezzed.",
    detail: "Corp cards are installed facedown in an unrezzed state. While unrezzed, most of a card's abilities are inactive. However, some effects apply even while unrezzed — install limits, the ability to advance a card, and 'when the Runner accesses this card' abilities all function regardless of rez state. To activate a card's main effects, the Corp must rez it.",
    seeAlso: ["term-rez", "term-derez", "term-install"],
    rulesLink: null,
  },
  {
    id: "term-virus",
    term: "Virus",
    type: "term",
    tier: null,
    short: "A program subtype. Most virus programs accumulate counters or are trashed when the Corp purges.",
    detail: "Virus is a subtype on certain Runner programs. Most virus programs either accumulate virus counters under certain conditions or interact with them in specific ways. The Corp's purge action removes all virus counters from all installed cards simultaneously, which is the primary counterplay against virus-heavy strategies.",
    seeAlso: ["term-virus-counter", "purge"],
    rulesLink: null,
  },
  {
    id: "term-virus-counter",
    term: "Virus Counter",
    type: "term",
    tier: null,
    short: "A counter type used by virus programs. All virus counters are removed when the Corp purges.",
    detail: "Virus counters are placed on cards by virus program effects and other abilities. They accumulate over time and power various effects. The Corp's purge action removes every virus counter from every installed card simultaneously — Runner and Corp cards alike. This hard reset is the primary check on virus-based strategies.",
    seeAlso: ["term-virus", "purge"],
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

  // View toggle: Glossary / Formats / Factions
  document.getElementById("mech-view-toggle").querySelectorAll(".toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById("mech-view-toggle").querySelectorAll(".toggle-btn")
        .forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const view = btn.dataset.view;
      document.getElementById("mech-glossary-view").style.display    = view === "glossary"    ? "" : "none";
      document.getElementById("mech-formats-view").style.display     = view === "formats"     ? "" : "none";
      document.getElementById("mech-cardbrowser-view").style.display = view === "cardbrowser" ? "" : "none";
      if (view === "cardbrowser" && window.initCardBrowser) window.initCardBrowser();
    });
  });

  let activeFilter = "all";
  let activeId = null;

  function getFiltered(query, filter) {
    const q = query.toLowerCase().trim();
    return MECHANICS_DATA.filter((entry) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "mechanic" && entry.type === "mechanic") ||
        (filter === "concept" && entry.type === "concept") ||
        (filter === "faction" && entry.type === "faction") ||
        (filter === "term" && entry.type === "term");
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

    const detailHtml = entry.type === "faction"
      ? entry.detail.split("\n\n").map(p => `<p class="mech-detail-body">${p}</p>`).join("")
      : `<p class="mech-detail-body">${entry.detail}</p>`;

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
      ${detailHtml}
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
