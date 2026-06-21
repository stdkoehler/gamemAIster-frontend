import { GameType } from "../models/Types";
import { DieFace, DieColor } from "../components/Dice/Die";

export interface DieTypeConfig {
  id: string;
  label: string;
  /** Number of faces on the physical die — drives its top-down outline
   *  (a d10's silhouette looks nothing like a d6's), independent of the
   *  numeric range `roll`/`face` actually produce (e.g. the CoC tens die
   *  rolls 0/10/.../90 but is physically a d10). */
  sides: number;
  color?: DieColor;
  /**
   * Label for the row this die belongs to in the picker and dice rows
   * (e.g. "Base"/"Skill"/"Weapon") — dice sharing a group render together
   * on their own row. Dice without a group all share one implicit row,
   * which is how every other system renders today.
   */
  group?: string;
  defaultCount?: number;
  maxCount?: number;
  roll: () => number;
  face: (value: number) => DieFace;
  /**
   * How to render this value as plain text for the log. Defaults to the
   * face's own number text (or the raw value) — only needed when a die's
   * visual face diverges from its textual value, e.g. CoC's tens die shows
   * an elder sign symbol on 0, but the log should still read "00".
   */
  formatValue?: (value: number) => string;
  /**
   * Shows the rolled number in a small badge in the die's corner even when
   * its face is a symbol or blank. Most systems only care about the face
   * (hit/miss, success/empty), but Shadowrun players also need the raw
   * number for initiative, so it shouldn't be hidden behind the hit icon.
   */
  showValueBadge?: boolean;
}

export interface RolledDie {
  dieId: string;
  value: number;
}

export interface GameDiceConfig {
  dice: DieTypeConfig[];
  summarize: (rolls: RolledDie[], dice: DieTypeConfig[]) => string;
}

const rollRange = (sides: number) => () =>
  1 + Math.floor(Math.random() * sides);
const rollDigit = () => Math.floor(Math.random() * 10);

const numberFace: (value: number) => DieFace = () => ({ kind: "number" });

const pluralize = (n: number, singular: string, plural = `${singular}s`) =>
  `${n} ${n === 1 ? singular : plural}`;

function dieById(dice: DieTypeConfig[], id: string) {
  return dice.find((d) => d.id === id);
}

/**
 * Renders the raw rolled numbers grouped by die label (e.g. "d6: 6, 3, 2 ·
 * hunger: 4"), independent of how a face chooses to *display* a value (an
 * ankh icon, an empty face, etc.) — the log should always show what was
 * actually rolled.
 */
export function describeRolls(
  rolls: RolledDie[],
  dice: DieTypeConfig[],
): string {
  const order: string[] = [];
  const groups = new Map<string, string[]>();
  rolls.forEach((r) => {
    const die = dieById(dice, r.dieId);
    const label = die?.label ?? r.dieId;
    const f = die?.face(r.value);
    const text = die?.formatValue
      ? die.formatValue(r.value)
      : f && f.kind === "number" && f.text
        ? f.text
        : String(r.value);
    if (!groups.has(label)) {
      groups.set(label, []);
      order.push(label);
    }
    groups.get(label)!.push(text);
  });
  return order
    .map((label) => `${label}: ${groups.get(label)!.join(", ")}`)
    .join(" · ");
}

// ───────────────────────── Shadowrun ─────────────────────────
const shadowrunDice: DieTypeConfig[] = [
  {
    id: "sr-d6",
    label: "d6",
    sides: 6,
    defaultCount: 6,
    maxCount: 20,
    showValueBadge: true,
    roll: rollRange(6),
    face: (v) =>
      v === 1
        ? { kind: "symbol", id: "shadowrun-bolt" }
        : v >= 5
          ? { kind: "symbol", id: "shadowrun-hit" }
          : { kind: "empty" },
  },
];

function summarizeShadowrun(rolls: RolledDie[]): string {
  const hits = rolls.filter((r) => r.value >= 5).length;
  const ones = rolls.filter((r) => r.value === 1).length;
  const glitch = rolls.length > 0 && ones > rolls.length / 2;
  // The hit/miss count is what matters for most tests, but initiative rolls
  // care about the actual sum of the dice — show it alongside so it doesn't
  // need a separate manual add-up.
  const total = rolls.reduce((sum, r) => sum + r.value, 0);
  let text = `${pluralize(hits, "hit")} (${total})`;
  if (glitch) text += hits === 0 ? " — critical glitch" : " — glitch";
  return text;
}

// ───────────────────────── Vampire: The Masquerade ─────────────────────────
const vtmDice: DieTypeConfig[] = [
  {
    id: "vtm-normal",
    label: "die",
    sides: 10,
    defaultCount: 5,
    maxCount: 15,
    roll: rollRange(10),
    face: (v) =>
      v <= 5
        ? { kind: "empty" }
        : v <= 9
          ? { kind: "symbol", id: "vtm-ankh" }
          : { kind: "symbol", id: "vtm-ankh-crit" },
  },
  {
    id: "vtm-hunger",
    label: "hunger",
    sides: 10,
    color: "danger",
    defaultCount: 1,
    maxCount: 5,
    roll: rollRange(10),
    face: (v) =>
      v === 1
        ? { kind: "symbol", id: "vtm-skull" }
        : v <= 5
          ? { kind: "empty" }
          : v <= 9
            ? { kind: "symbol", id: "vtm-ankh" }
            : { kind: "symbol", id: "vtm-ankh-fangs" },
  },
];

function summarizeVtm(rolls: RolledDie[]): string {
  const hungerRolls = rolls.filter((r) => r.dieId === "vtm-hunger");
  const successOf = (v: number) => (v >= 10 ? 2 : v >= 6 ? 1 : 0);
  const successes = rolls.reduce((sum, r) => sum + successOf(r.value), 0);
  const critPairs = rolls.filter((r) => r.value === 10).length;
  const hungerCrit = hungerRolls.some((r) => r.value === 10);
  const hungerBotch = hungerRolls.some((r) => r.value === 1);
  const isCritical = critPairs >= 2;

  let text = pluralize(successes, "success", "successes");
  if (isCritical) text += hungerCrit ? " — messy critical" : " — critical";
  else if (successes === 0 && hungerBotch) text += " — bestial failure";
  return text;
}

// ───────────────────────── 7th Sea ─────────────────────────
const seventhSeaDice: DieTypeConfig[] = [
  {
    id: "ss-d10",
    label: "d10",
    sides: 10,
    defaultCount: 5,
    maxCount: 15,
    roll: rollRange(10),
    face: (v) =>
      v === 10
        ? { kind: "symbol", id: "seventh-sea-swords" }
        : { kind: "number" },
  },
];

/**
 * A raise is formed by grouping rolled dice into sets that each sum to at
 * least 10 — e.g. {4,7} or {1,3,6} — and the number of raises is the most
 * such disjoint groups you can form from the whole pool, not just the
 * count of dice that individually show a 10.
 *
 * Greedily anchor each group on the highest remaining die, then keep
 * folding in the lowest remaining dice until it crosses 10 — the same way
 * players total raises by hand at the table. This spends as few extra
 * dice as possible per group, leaving the most dice available for
 * further raises.
 */
function countRaises(values: number[]): number {
  const pool = [...values].sort((a, b) => a - b);
  let raises = 0;
  while (pool.length > 0) {
    let sum = pool.pop()!;
    while (sum < 10 && pool.length > 0) {
      sum += pool.shift()!;
    }
    if (sum < 10) break;
    raises++;
  }
  return raises;
}

function summarizeSeventhSea(rolls: RolledDie[]): string {
  const raises = countRaises(rolls.map((r) => r.value));
  return pluralize(raises, "raise");
}

// ───────────────────────── The Expanse ─────────────────────────
const expanseDice: DieTypeConfig[] = [
  {
    id: "exp-d6",
    label: "d6",
    sides: 6,
    defaultCount: 3,
    maxCount: 10,
    roll: rollRange(6),
    face: numberFace,
  },
  {
    id: "exp-drama",
    label: "drama die",
    sides: 6,
    color: "warning",
    defaultCount: 1,
    maxCount: 1,
    roll: rollRange(6),
    face: (v) =>
      v === 6 ? { kind: "symbol", id: "expanse-rocket" } : { kind: "number" },
  },
];

function summarizeExpanse(rolls: RolledDie[]): string {
  const total = rolls.reduce((sum, r) => sum + r.value, 0);
  const dramaTriggered = rolls.some(
    (r) => r.dieId === "exp-drama" && r.value === 6,
  );
  let text = `Total ${total}`;
  if (dramaTriggered) text += " — drama die triggered";
  return text;
}

// ───────────────────────── Slavic 800 AD ─────────────────────────
const slavicPoolFace: (value: number) => DieFace = (v) =>
  v === 1
    ? { kind: "symbol", id: "slavic-bane" }
    : v === 6
      ? { kind: "symbol", id: "slavic-success" }
      : { kind: "empty" };

const slavicSkillFace: (value: number) => DieFace = (v) =>
  v === 6 ? { kind: "symbol", id: "slavic-success" } : { kind: "empty" };

/** How many successes a single face is worth: 1 (bane) is none, 6-7 is one,
 *  scaling up to 4 at 12 — only reachable on the d8/d10/d12 gear dice,
 *  since the d6 pools cap at 6 (always worth exactly one success here). */
function slavicSuccessCount(value: number): number {
  if (value >= 12) return 4;
  if (value >= 10) return 3;
  if (value >= 8) return 2;
  if (value >= 6) return 1;
  return 0;
}

const slavicGearFace: (value: number) => DieFace = (v) => {
  if (v === 1) return { kind: "symbol", id: "slavic-bane" };
  const successes = slavicSuccessCount(v);
  return successes > 0
    ? { kind: "symbol", id: "slavic-success", badge: String(successes) }
    : { kind: "empty" };
};

const slavicDice: DieTypeConfig[] = [
  {
    id: "sl-base",
    label: "d6",
    group: "Base",
    sides: 6,
    color: "primary",
    defaultCount: 2,
    maxCount: 10,
    showValueBadge: true,
    roll: rollRange(6),
    face: slavicPoolFace,
  },
  {
    id: "sl-skill",
    label: "d6",
    group: "Skill",
    sides: 6,
    color: "info",
    defaultCount: 1,
    maxCount: 10,
    showValueBadge: true,
    roll: rollRange(6),
    face: slavicSkillFace,
  },
  {
    id: "sl-weapon",
    label: "d6",
    group: "Gear / Weapon",
    sides: 6,
    color: "secondary",
    defaultCount: 1,
    maxCount: 10,
    showValueBadge: true,
    roll: rollRange(6),
    face: slavicPoolFace,
  },
  {
    id: "sl-d8",
    label: "d8",
    group: "Gear / Weapon",
    sides: 8,
    color: "secondary",
    defaultCount: 0,
    maxCount: 10,
    showValueBadge: true,
    roll: rollRange(8),
    face: slavicGearFace,
  },
  {
    id: "sl-d10",
    label: "d10",
    group: "Gear / Weapon",
    sides: 10,
    color: "secondary",
    defaultCount: 0,
    maxCount: 10,
    showValueBadge: true,
    roll: rollRange(10),
    face: slavicGearFace,
  },
  {
    id: "sl-d12",
    label: "d12",
    group: "Gear / Weapon",
    sides: 12,
    color: "secondary",
    defaultCount: 0,
    maxCount: 10,
    showValueBadge: true,
    roll: rollRange(12),
    face: slavicGearFace,
  },
];

// Inferred from the bane/success face icons: count successes (1 per d6
// pool hit, scaled per slavicSuccessCount on the gear dice) and banes (1s)
// across every rolled die, the way Forged-in-the-Dark-style pools resolve
// — no specific house rule was specified, so flag to the project owner if
// Slavic 800 AD resolves this differently.
function summarizeSlavic(rolls: RolledDie[]): string {
  const successes = rolls.reduce(
    (sum, r) => sum + slavicSuccessCount(r.value),
    0,
  );
  const banes = rolls.filter((r) => r.value === 1).length;
  const parts = [pluralize(successes, "success", "successes")];
  if (banes > 0) parts.push(pluralize(banes, "bane"));
  return parts.join(" · ");
}

// ───────────────────────── Call of Cthulhu ─────────────────────────
const cocDice: DieTypeConfig[] = [
  {
    id: "coc-tens",
    label: "tens",
    sides: 10,
    defaultCount: 1,
    maxCount: 1,
    roll: () => rollDigit() * 10,
    face: (v) =>
      v === 0 ? { kind: "symbol", id: "coc-elder-sign" } : { kind: "number" },
    formatValue: (v) => (v === 0 ? "00" : String(v)),
  },
  {
    id: "coc-ones",
    label: "ones",
    sides: 10,
    defaultCount: 1,
    maxCount: 1,
    roll: rollDigit,
    face: numberFace,
  },
  {
    id: "coc-d4",
    label: "d4",
    sides: 4,
    defaultCount: 0,
    maxCount: 10,
    roll: rollRange(4),
    face: numberFace,
  },
  {
    id: "coc-d6",
    label: "d6",
    sides: 6,
    defaultCount: 0,
    maxCount: 10,
    roll: rollRange(6),
    face: numberFace,
  },
  {
    id: "coc-d8",
    label: "d8",
    sides: 8,
    defaultCount: 0,
    maxCount: 10,
    roll: rollRange(8),
    face: numberFace,
  },
];

function summarizeCoc(rolls: RolledDie[], dice: DieTypeConfig[]): string {
  const tens = rolls.find((r) => r.dieId === "coc-tens");
  const ones = rolls.find((r) => r.dieId === "coc-ones");
  const parts: string[] = [];
  if (tens && ones) {
    const percentile =
      tens.value + ones.value === 0 ? 100 : tens.value + ones.value;
    // CoC 7e: a roll of 01 always succeeds, critically, regardless of skill.
    // A roll of 100 is only a fumble if it's *also* a failure against the
    // investigator's skill — which this roller has no skill value to check
    // — so it's left as a plain (likely-failed) percentile instead of
    // guessing at a fumble.
    let result = `${percentile}%`;
    if (percentile === 1) result += " — critical success";
    parts.push(result);
  }
  const damageDice = rolls.filter(
    (r) => !["coc-tens", "coc-ones"].includes(r.dieId),
  );
  if (damageDice.length > 0) {
    const sum = damageDice.reduce((s, r) => s + r.value, 0);
    const labels = damageDice.map(
      (r) => `${dieById(dice, r.dieId)?.label ?? r.dieId}:${r.value}`,
    );
    parts.push(`damage ${sum} (${labels.join(", ")})`);
  }
  return parts.join(" · ") || "no dice selected";
}

// ───────────────────────── Custom / fallback ─────────────────────────
const customDice: DieTypeConfig[] = [
  {
    id: "c-d4",
    label: "d4",
    sides: 4,
    defaultCount: 0,
    maxCount: 10,
    roll: rollRange(4),
    face: numberFace,
  },
  {
    id: "c-d6",
    label: "d6",
    sides: 6,
    defaultCount: 1,
    maxCount: 10,
    roll: rollRange(6),
    face: numberFace,
  },
  {
    id: "c-d8",
    label: "d8",
    sides: 8,
    defaultCount: 0,
    maxCount: 10,
    roll: rollRange(8),
    face: numberFace,
  },
  {
    id: "c-d10",
    label: "d10",
    sides: 10,
    defaultCount: 0,
    maxCount: 10,
    roll: rollRange(10),
    face: numberFace,
  },
  {
    id: "c-d12",
    label: "d12",
    sides: 12,
    defaultCount: 0,
    maxCount: 10,
    roll: rollRange(12),
    face: numberFace,
  },
  {
    id: "c-d20",
    label: "d20",
    sides: 20,
    defaultCount: 0,
    maxCount: 5,
    roll: rollRange(20),
    face: numberFace,
  },
];

function summarizeGeneric(rolls: RolledDie[]): string {
  const total = rolls.reduce((sum, r) => sum + r.value, 0);
  return `Total ${total}`;
}

export const GAME_DICE: Record<GameType, GameDiceConfig> = {
  [GameType.SHADOWRUN]: { dice: shadowrunDice, summarize: summarizeShadowrun },
  [GameType.VAMPIRE_THE_MASQUERADE]: { dice: vtmDice, summarize: summarizeVtm },
  [GameType.CALL_OF_CTHULHU]: { dice: cocDice, summarize: summarizeCoc },
  [GameType.SEVENTH_SEA]: {
    dice: seventhSeaDice,
    summarize: summarizeSeventhSea,
  },
  [GameType.EXPANSE]: { dice: expanseDice, summarize: summarizeExpanse },
  [GameType.SLAVIC]: { dice: slavicDice, summarize: summarizeSlavic },
  [GameType.CUSTOM]: { dice: customDice, summarize: summarizeGeneric },
};
