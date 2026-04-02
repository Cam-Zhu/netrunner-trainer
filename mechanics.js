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
    seeAlso: ["link", "credit-floor"],
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
    seeAlso: ["tags", "tag-punishment", "kill-window"],
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
    seeAlso: ["fast-advance", "score-windows", "advancing-non-agendas"],
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
    seeAlso: ["advancement-counters", "score-windows"],
    rulesLink: null,
  },
  {
    id: "score-windows",
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
    id: "credit-floor",
    term: "Credit Floor",
    type: "concept",
    tier: null,
    short: "The minimum credits you must stay above to avoid losing to known threats next turn.",
    detail: "Your credit floor is not a fixed number — it is the worst-case Corp commitment on their next turn, plus a safety margin. Calculate it by asking: what is the most dangerous legal play they could make? How much does it cost to survive that? Stay above this number even if it delays pressure. Your floor rises when you are tagged, low on cards, or the Corp just gained credits.",
    seeAlso: ["threat-range", "kill-window"],
    rulesLink: null,
  },
  {
    id: "threat-range",
    term: "Threat Range",
    type: "concept",
    tier: null,
    short: "The set of actions the opponent can legally execute from their current board and credit state.",
    detail: "Playing within threat range means you are accepting that the opponent could punish you if they have the right cards. Playing outside it means you have calculated that they cannot realistically execute any dangerous line. Correct play is not about avoiding all risk — it is about correctly identifying what the opponent can and cannot do right now.",
    seeAlso: ["credit-floor", "kill-window", "check-vs-respect"],
    rulesLink: null,
  },
  {
    id: "kill-window",
    term: "Kill Window",
    type: "concept",
    tier: null,
    short: "A brief period where the Corp can legally and realistically flatline the Runner.",
    detail: "Kill windows open when the Runner is low on cards, credits, or protection — and close just as quickly when the Runner recovers. The Corp's entire tag-punishment strategy is about creating and exploiting kill windows. The Runner's job is to identify when a window is open and not give the Corp their turn with it active.",
    seeAlso: ["credit-floor", "threat-range", "flatline-check"],
    rulesLink: null,
  },
  {
    id: "tempo",
    term: "Tempo",
    type: "concept",
    tier: null,
    short: "Who is advancing their win condition faster while limiting the opponent's options.",
    detail: "Tempo is not clicks or credits alone — it is the measure of who is dictating the pace of meaningful actions. Spending 3 clicks gaining credits is low tempo. Spending 3 clicks scoring an agenda, trashing a key resource, and rezzing a key ice is high tempo. Tempo advantages compound: the player ahead gets to act more efficiently while the player behind reacts.",
    seeAlso: ["click-compression", "burst-economy"],
    rulesLink: null,
  },
  {
    id: "burst-economy",
    term: "Burst Economy",
    type: "concept",
    tier: null,
    short: "Economy that delivers large value immediately rather than over time.",
    detail: "Burst economy (Sure Gamble, Hedge Fund, etc.) is powerful for swing turns, recovering from danger, and forcing decisive action. It is less reliable as a foundation because it creates credit peaks and troughs. Burst economy is safer than drawing when you are below your credit floor — credits buy survival, and you cannot leverage card advantage if you are flatlined.",
    seeAlso: ["tempo", "credit-floor"],
    rulesLink: null,
  },
  {
    id: "credit-denial",
    term: "Credit Denial",
    type: "concept",
    tier: null,
    short: "Effects that reduce, restrict, or punish low credit totals, forcing the opponent into unsafe states.",
    detail: "Credit denial is a win condition, not just an inconvenience. Many mechanics scale directly with available credits — traces, trash costs, damage prevention. Forcing the opponent below their credit floor enables punishment lines that would otherwise be blocked. A Corp deck built on credit denial doesn't need to kill outright; it just needs the Runner to run out of options.",
    seeAlso: ["credit-floor", "threat-range"],
    rulesLink: null,
  },
  {
    id: "inevitability",
    term: "Inevitability",
    type: "concept",
    tier: null,
    short: "A game state where one player will win over time if nothing changes.",
    detail: "Recognising inevitability determines whether you should slow the game or force risky lines. If you are losing to inevitability, passive play accelerates your loss — you must take risks to disrupt the trajectory. If you have inevitability, patience is a weapon: let the opponent make mistakes trying to catch up.",
    seeAlso: ["tempo", "safe-turn"],
    rulesLink: null,
  },
  {
    id: "safe-turn",
    term: "Safe Turn",
    type: "concept",
    tier: null,
    short: "A turn where you can advance your plan without being meaningfully punished.",
    detail: "Safe turns are created by being above your credit floor, having no active kill windows, and the opponent lacking the means to disrupt your plan this turn. Identifying safe turns lets you take efficient actions. Misidentifying them — thinking you are safe when you are not — is one of the most common causes of sudden losses at tournament level.",
    seeAlso: ["credit-floor", "kill-window", "threat-range"],
    rulesLink: null,
  },
  {
    id: "check-vs-respect",
    term: "Check vs Respect",
    type: "concept",
    tier: null,
    short: "Whether to run and test a threat (check) or assume it is dangerous and play around it (respect).",
    detail: "Checking costs tempo and possibly credits or cards if the threat is real. Respecting costs tempo by giving the Corp free development time if the threat is a bluff. Neither is always correct — the right answer depends on what you can afford to be wrong about. Misidentifying this choice is one of the most common tournament mistakes.",
    seeAlso: ["threat-range", "inevitability"],
    rulesLink: null,
  },
  {
    id: "swing-turn",
    term: "Swing Turn",
    type: "concept",
    tier: null,
    short: "A turn where one sequence of actions dramatically shifts the game balance.",
    detail: "Swing turns happen when a player executes multiple high-value actions in sequence — scoring + tagging + rezzing, or running + stealing + trashing a key asset. They reward preparation (having the pieces lined up) and punish mispositioning. Both players should be tracking when a swing turn is possible for the opponent and whether they can prevent it.",
    seeAlso: ["tempo", "click-compression"],
    rulesLink: null,
  },
  {
    id: "hard-lock",
    term: "Hard Lock",
    type: "concept",
    tier: null,
    short: "A game state where a player is functionally unable to progress, even if not technically eliminated.",
    detail: "A hard lock arises from overlapping denial effects: ice the Runner cannot break, economy the Runner cannot establish, resources the Runner cannot keep. The game isn't technically over but the outcome is decided. Recognising a hard lock early — on either side — prevents wasted time and helps with concede decisions in timed rounds.",
    seeAlso: ["inevitability", "credit-denial"],
    rulesLink: null,
  },
  {
    id: "must-check-assets",
    term: "Must-Check Assets",
    type: "concept",
    tier: null,
    short: "Assets that cannot be safely ignored because they threaten a win condition or create irreversible advantage.",
    detail: "Not every Corp asset demands a response — but some do. Must-check assets are those where leaving them active for another turn creates an advantage you cannot recover from (a kill threat going live, an economy engine snowballing beyond your ability to contest). Identifying which assets are must-check vs can-ignore is one of the core Standard skills.",
    seeAlso: ["delayed-payoff-assets", "check-vs-respect"],
    rulesLink: null,
  },
  {
    id: "delayed-payoff-assets",
    term: "Delayed-Payoff Assets",
    type: "concept",
    tier: null,
    short: "Assets that grow stronger or generate value over time if left unchecked.",
    detail: "Delayed-payoff assets don't threaten you immediately — they threaten you in 3 turns if you ignore them. The decision is whether to spend tempo trashing them now or accept the long-term cost. The calculation changes based on how fast the game is moving: in a fast game, ignore them; in a slow glacier game, they can become game-deciding.",
    seeAlso: ["must-check-assets", "tempo"],
    rulesLink: null,
  },
  {
    id: "remote-pressure",
    term: "Remote Pressure",
    type: "concept",
    tier: null,
    short: "The Runner's effort to contest Corp remote servers, preventing scoring or asset snowballing.",
    detail: "Remote pressure is the Runner's primary tool for preventing the Corp from scoring agendas safely. It requires credits, the right breakers, and correct timing. Excessive remote pressure can leave centrals uncontested, letting the Corp build R&D safely. The skill is knowing when to pressure remotes vs shift to centrals.",
    seeAlso: ["central-pressure", "score-windows"],
    rulesLink: null,
  },
  {
    id: "central-pressure",
    term: "Central Pressure",
    type: "concept",
    tier: null,
    short: "Pressure on HQ, R&D, and Archives to disrupt Corp plans, deny setup, or threaten agenda steals.",
    detail: "Central pressure is typically cheaper than remote pressure but less decisive. Running R&D threatens agenda steals; running HQ disrupts the Corp's hand and can expose fast-advance pieces; running Archives can recur cards or punish Archives-based Corp strategies. Switching between central and remote pressure forces the Corp to defend everywhere.",
    seeAlso: ["remote-pressure"],
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
