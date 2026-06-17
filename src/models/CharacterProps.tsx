import { GameType } from "./Types";

export interface HealthTrack {
  current: number;
  max: number;
}

// =====================
// Shadowrun 5th Edition
// =====================

export interface ShadowrunCharacter {
  gameType: GameType.SHADOWRUN;
  id: number;
  name: string;
  metatype: string; // Human, Elf, Dwarf, Ork, Troll
  archetype: string; // Street Samurai, Decker, Mage, Shaman, Rigger, Face, etc.
  gender?: string;
  age?: number;
  description: string;

  // Core attributes (natural 1–6, augmented up to +4)
  attributes: {
    Body: number;
    Agility: number;
    Reaction: number;
    Strength: number;
    Willpower: number;
    Logic: number;
    Intuition: number;
    Charisma: number;
    Edge: number;
    Essence: number; // 0.0–6.0; reduced by cyberware/bioware
    Magic?: number; // Awakened only
    Resonance?: number; // Technomancer only
  };

  // Derived stats — computed from attributes but stored for quick reference
  derived: {
    physicalLimit: number; // floor((STR×2 + BOD + REA) / 3)
    mentalLimit: number; // floor((LOG×2 + INT + WIL) / 3)
    socialLimit: number; // floor((CHA×2 + WIL + ESS) / 3)
    composure: number; // WIL + CHA
    judgeIntentions: number; // INT + CHA
    memory: number; // LOG + WIL
    liftCarry: number; // BOD + STR
    initiativeBase: number; // REA + INT
    initiativeDice: number; // 1d6 normally; more with wired reflexes etc.
  };

  // Active skills (name → rating 1–12)
  skills: Record<string, number>;

  // Knowledge & language skills (name → rating)
  knowledgeSkills: Record<string, number>;

  // Qualities
  qualities: {
    positive: string[];
    negative: string[];
  };

  // Contacts (name → loyalty 1–6, connection 1–6)
  contacts: Record<string, { loyalty: number; connection: number }>;

  // Combat gear
  armor: number;
  weapons: string[];
  cyberware: string[];
  bioware?: string[];
  gear: string[];

  // Resources
  nuyen: number;
  lifestyle: string; // Squatter / Low / Middle / High / Luxury
  streetCred: number;
  notoriety: number;
  publicAwareness: number;

  // Damage monitors
  // max physical = 8 + ceil(Body / 2)
  // max stun     = 8 + ceil(Willpower / 2)
  damage: {
    physical: HealthTrack;
    stun: HealthTrack;
  };

  // Awakened
  spells?: string[];
  rituals?: string[];
  mentorSpirit?: string;

  // Technomancer
  complexForms?: string[];
}

// =====================
// Vampire: The Masquerade V5
// =====================

// Weapon stats as listed in the V5 corebook weapons table.
// damage = bonus damage dice added to the attack pool.
// range  = meters (ranged weapons only).
export interface V5Weapon {
  name: string;
  damage: number;
  skill: "Brawl" | "Melee" | "Firearms";
  range?: number;
  properties?: Array<"Concealable" | "Two-handed" | "Loud" | "Automatic" | "Special">;
}

// nature drives which optional blocks apply:
//   "vampire"    — full Kindred sheet (clan, generation, disciplines, hunger, blood potency)
//   "ghoul"      — disciplines (one), no hunger/blood potency
//   "thin-blood" — thin-blood alchemy instead of disciplines, hunger present
//   "mortal"     — no vampire-specific fields at all
export type V5Nature = "vampire" | "ghoul" | "thin-blood" | "mortal";

export interface VampireCharacter {
  gameType: GameType.VAMPIRE_THE_MASQUERADE;
  id: number;
  name: string;
  nature: V5Nature;
  description: string;

  // Vampire / ghoul / thin-blood identity (omit for mortals)
  clan?: string;
  sire?: string;
  generation?: number; // 4th–16th
  predatorType?: string; // Alleycat, Sandman, Siren, Bagger, etc.

  ambition?: string;
  desire?: string;

  // Attributes 1–5 (Physical / Social / Mental)
  attributes: {
    Strength: number;
    Dexterity: number;
    Stamina: number;
    Charisma: number;
    Manipulation: number;
    Composure: number;
    Intelligence: number;
    Wits: number;
    Resolve: number;
  };

  // Skills 0–5 — complete V5 list
  skills: {
    // Physical
    Athletics: number;
    Brawl: number;
    Craft: number;
    Drive: number;
    Firearms: number;
    Melee: number;
    Larceny: number;
    Stealth: number;
    Survival: number;
    // Social
    "Animal Ken": number;
    Etiquette: number;
    Insight: number;
    Intimidation: number;
    Leadership: number;
    Performance: number;
    Persuasion: number;
    Streetwise: number;
    Subterfuge: number;
    // Mental
    Academics: number;
    Awareness: number;
    Finance: number;
    Investigation: number;
    Medicine: number;
    Occult: number;
    Politics: number;
    Science: number;
    Technology: number;
  };

  // Weapons with V5 corebook stats (all natures can carry weapons)
  weapons?: V5Weapon[];

  // Disciplines (name → level 1–5); absent for mortals
  disciplines?: Record<string, number>;

  // Blood — Kindred and thin-bloods only
  hunger?: number; // 0–5
  bloodPotency?: number; // 0–10
  resonance?: string; // Choleric / Melancholy / Phlegmatic / Sanguine / Animal / Bagged
  temperament?: string; // Fleeting / Acute / Resonant

  // Morality (tracked for Kindred; mortals rarely deviate from 10)
  humanity?: number; // 0–10

  // Chronicle-level fields
  chronicleTenets?: string[];
  touchstones?: string[];

  // Clan-specific (Kindred only)
  clanBane?: string;
  compulsion?: string;

  // Backgrounds (name → rating)
  backgrounds?: Record<string, number>;

  // Derived
  // Health max    = Stamina + 3
  // Willpower max = Composure + Resolve
  health: HealthTrack;
  willpower: HealthTrack;

  // Experience
  experienceTotal?: number;
  experienceSpent?: number;
}

// =====================
// Call of Cthulhu 7th Ed
// =====================

export interface CthulhuCharacter {
  gameType: GameType.CALL_OF_CTHULHU;
  id: number;
  name: string;
  occupation: string;
  age: number;
  residence?: string;
  birthplace?: string;
  description: string;

  // Characteristics (5×roll or point-buy; 15–90 range)
  characteristics: {
    STR: number;
    CON: number;
    SIZ: number;
    DEX: number;
    APP: number;
    INT: number;
    POW: number;
    EDU: number;
  };

  // Derived
  derived: {
    hpMax: number; // floor((CON + SIZ) / 10)
    mpMax: number; // floor(POW / 5)
    sanityMax: number; // 99 − Cthulhu Mythos
    build: number; // −2 to +2 based on STR+SIZ
    damageBonus: string; // e.g. "+1d4"
    moveRate: number; // 7–9 based on DEX/STR vs SIZ
  };

  // Skills (name → current %)
  skills: Record<string, number>;

  // Tracks
  hitPoints: HealthTrack;
  sanity: HealthTrack;
  magicPoints: HealthTrack;
  luck: number;
  cthulhuMythos: number; // reduces sanity max

  // Background
  personalDescription?: string;
  traits?: string[];
  ideologyBeliefs?: string[];
  injuries?: string[];
  fellowsAndContacts?: string[];
  significantPeople?: string[];
  meaningfulLocations?: string[];
  treasuredPossessions?: string[];

  // Equipment
  weapons?: string[];
  gear?: string[];
  spendingLevel?: string;
  cash?: number;
  assets?: string;
}

// =====================
// Seventh Sea 2nd Ed
// =====================

export interface SeventhSeaCharacter {
  gameType: GameType.SEVENTH_SEA;
  id: number;
  name: string;
  nation: string; // Castille, Montaigne, Vodacce, Avalon, Eisen, Ussura, Sarmatia…
  religion?: string;
  arcana: {
    virtue: string; // e.g. Loyal, Generous, Intuitive
    hubris: string; // e.g. Arrogant, Stubborn, Proud
  };
  description: string;

  // Traits 1–5
  traits: {
    Brawn: number;
    Finesse: number;
    Resolve: number;
    Wits: number;
    Panache: number;
  };

  // Skills 0–5 (V2 full list)
  skills: {
    Aim: number;
    Athletics: number;
    Brawl: number;
    Convince: number;
    Empathy: number;
    Hide: number;
    Intimidate: number;
    Notice: number;
    Perform: number;
    Ride: number;
    Sailing: number;
    Tempt: number;
    Theft: number;
    Warfare: number;
    Weaponry: number;
  };

  // Advantages (special abilities; names only)
  advantages: string[];

  // Sorcery (optional; Porté, Laerdom, El Fuego Adentro, etc.)
  sorcery?: {
    type: string;
    knacks: string[];
  };

  // Dueling style
  duelingStyle?: string;

  // Stories
  stories?: string[];
  goals?: string[];

  // State
  wounds: HealthTrack; // Dramatic Wounds; max = Resolve × 5 (or similar variant)
  heroPoints: number;

  // Background
  backgrounds?: string[];
}

// =====================
// The Expanse RPG — AGE System
// =====================

export interface ExpanseCharacter {
  gameType: GameType.EXPANSE;
  id: number;
  name: string;
  origin: string; // Earther / Martian / Belter
  background: string; // e.g. Military, Criminal, Academic, Colonist
  faction: string; // UN, MCR, OPA, Independent…
  description: string;

  // Abilities (−2 to 4; typically 0–3 for starting characters)
  abilities: {
    Accuracy: number;
    Communication: number;
    Constitution: number;
    Dexterity: number;
    Fighting: number;
    Intelligence: number;
    Perception: number;
    Strength: number;
    Willpower: number;
  };

  // Focuses (free-text; e.g. "Accuracy (Pistols)")
  focuses: string[];

  // Talents (name → tier 1–3)
  talents?: Record<string, number>;

  // Derived
  speed: number; // 10 + Dexterity (in meters)
  defense: number; // 10 + Dexterity
  toughness?: number; // from armor/talents

  // State
  health: HealthTrack;
  fortune: number; // Fortune points for player agency

  // Equipment
  weapons?: string[];
  armor?: string;
  gear?: string[];

  // Drive & Relationships
  drive?: string; // Character motivation
  relationships?: string[];
}

// =====================
// Slavic 800 AD
// Based on Forbidden Lands (Free League Publishing) —
// a Year Zero Engine OSR game; simple 4-attribute + skill design
// fits dark mythological pre-medieval settings perfectly.
// =====================

export interface SlavicCharacter {
  gameType: GameType.SLAVIC;
  id: number;
  name: string;
  kin: string; // Human, Völva-born, Warrior-born, etc. (homebrew kin types)
  calling: string; // Warrior, Hunter, Volkhv (shaman), Skald, Kupets (merchant)
  age?: string; // Young / Middle-aged / Old (affects starting attributes in FL)
  description: string;

  // Attributes 2–5 (one die per point: d6/d8/d10/d12)
  attributes: {
    Strength: number;
    Agility: number;
    Wits: number;
    Empathy: number;
  };

  // Skills 0–5 (under their governing attribute)
  skills: {
    // Strength
    Endurance: number;
    Fight: number;
    // Agility
    Sneak: number;
    Move: number;
    Marksmanship: number;
    // Wits
    Scout: number;
    Lore: number;
    Survival: number;
    Craft: number;
    // Empathy
    Insight: number;
    Manipulation: number;
    Healing: number;
    Performance: number;
  };

  // Talents (special abilities; names only)
  talents: string[];

  // Wyrd — spiritual power / fate points (optional, for mystic callings)
  wyrd?: HealthTrack;

  // State
  // In Forbidden Lands, damage is dealt to the governing attribute directly.
  // We track it as a combined health pool for simplicity.
  willpower: HealthTrack; // Wits-based, used for pushing rolls and abilities
  health: HealthTrack; // Strength-based; Broken when reduced to 0

  // Equipment
  weapons?: string[];
  armor?: string;
  gear?: string[];

  // Pride & Dark Secret (core FL character traits)
  pride?: string;
  darkSecret?: string;
}

// =====================
// Discriminated union — used by both NpcCard and (future) CharacterCard
// =====================

export type CharacterProps =
  | ShadowrunCharacter
  | VampireCharacter
  | CthulhuCharacter
  | SeventhSeaCharacter
  | ExpanseCharacter
  | SlavicCharacter;
