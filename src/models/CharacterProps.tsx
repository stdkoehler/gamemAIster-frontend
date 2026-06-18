import { GameType } from "./Types";

export interface StatTrack {
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
    initiativeDice: number; // 1d6 normally; +1d6 per Wired Reflexes level, etc.
  };

  // Active skills (name → rating 1–12)
  skills: Record<string, number>;

  // Skill specializations grant +2 dice; expertises grant +4 (skill → spec name)
  skillSpecializations?: Record<string, string>;

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

  // Resources & reputation
  nuyen: number;
  lifestyle: string; // Squatter / Low / Middle / High / Luxury
  streetCred: number;
  notoriety: number;
  publicAwareness: number;
  karma?: number; // unspent karma pool

  // Damage monitors
  // max physical = 8 + ceil(Body / 2)
  // max stun     = 8 + ceil(Willpower / 2)
  damage: {
    physical: StatTrack;
    stun: StatTrack;
  };

  // Awakened (Mages / Shamans)
  spells?: string[];
  rituals?: string[];
  mentorSpirit?: string;

  // Physical Adept powers (separate from spells)
  adeptPowers?: string[];

  // Technomancer
  complexForms?: string[];
  registeredSprites?: string[]; // sprite type + level, e.g. "Machine Sprite 4"

  // Decker — cyberdeck/commlink matrix attributes
  matrixStats?: {
    device: string; // e.g. "Microtrónica Azteca 200"
    Attack: number;
    Sleaze: number;
    DataProcessing: number;
    Firewall: number;
    matrixConditionMonitor: StatTrack; // max = 8 + ceil(Device Rating / 2)
  };

  // Rigger — vehicles/drones
  vehicles?: string[]; // e.g. "GMC Banshee (Pilot 3, Sensor 3)"

  notes?: string;
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
//   "kindred"    — full Kindred sheet (clan, generation, disciplines, hunger, blood potency)
//   "ghoul"      — disciplines (one), no hunger/blood potency
//   "thin-blood" — thin-blood alchemy instead of disciplines, hunger present
//   "mortal"     — no vampire-specific fields at all
export type V5Nature = "kindred" | "ghoul" | "thin-blood" | "mortal";

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
  birthday?: string;     // mortal birth date
  embraced?: string;     // date of embrace
  apparentAge?: number;  // apparent age in years

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

  // Skill specialties (+1 die when applicable; skill name → specialty label)
  skillSpecialties?: Record<string, string>;

  // Weapons with V5 corebook stats (all natures can carry weapons)
  weapons?: V5Weapon[];

  // Disciplines — level plus the specific powers chosen within that discipline.
  // V5 requires explicitly selecting powers; having Dominate 3 does not mean
  // all three level-1/2/3 powers are known — they must be purchased individually.
  disciplines?: Record<string, {
    level: number; // highest level purchased (1–5)
    powers: string[]; // e.g. ["Cloud Memory", "Compel", "Mesmerize"]
  }>;

  // Merits & Flaws (Advantages / Flaws in V5 terminology); name → level 1–5
  merits?: Record<string, number>;
  flaws?: Record<string, number>;

  // Blood — Kindred and thin-bloods only
  hunger?: number; // 0–5
  bloodPotency?: number; // 0–10
  resonance?: string; // Choleric / Melancholy / Phlegmatic / Sanguine / Animal / Bagged
  temperament?: string; // Fleeting / Acute / Resonant

  // Thin-blood only — alchemy formulae (replaces disciplines for thin-bloods)
  thinBloodAlchemy?: string[];

  // Morality (tracked for Kindred; mortals start at 10)
  humanity?: number; // 0–10

  // Chronicle-level fields
  chronicleTenets?: string[];
  touchstones?: string[];

  // Clan-specific (Kindred only)
  clanBane?: string;
  compulsion?: string;

  // Backgrounds (name → rating, e.g. Resources: 3, Haven: 2)
  backgrounds?: Record<string, number>;

  // Loresheets (optional special background benefits tied to clan/organisation)
  loresheets?: string[];

  // Derived
  // Health max    = Stamina + 3
  // Willpower max = Composure + Resolve
  health: StatTrack;
  willpower: StatTrack;

  // Experience
  experienceTotal?: number;
  experienceSpent?: number;

  notes?: string;
}

// =====================
// Call of Cthulhu 7th Ed
// =====================

// CoC 7e weapon table stats.
// damage may include "db" meaning the character's damage bonus is added.
// malfunction: firearm jams on a roll >= this number (100 = never jams).
export interface CocWeapon {
  name: string;
  skill: string; // e.g. "Fighting (Brawl)", "Firearms (Handgun)", "Firearms (Rifle)"
  damage: string; // e.g. "1d3+db", "1d8", "1d10+2"
  range?: string; // yards (ranged only), e.g. "15 yds" or "15/30/50 yds"
  attacksPerRound?: number;
  ammo?: number; // magazine/cylinder capacity
  malfunction?: number; // 100 = reliable; lower = more prone to jam
}

export interface CthulhuCharacter {
  gameType: GameType.CALL_OF_CTHULHU;
  id: number;
  name: string;
  occupation: string;
  era: string; // "1920s" | "Modern" | "Dark Ages" | custom
  age: number;
  residence?: string;
  birthplace?: string;
  description: string;

  // Characteristics (5×roll or point-buy; 15–90 range typical)
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

  // Derived — half and fifth values are used for Hard / Extreme success thresholds
  // in every dice roll, so they belong on the character sheet.
  derived: {
    hpMax: number; // floor((CON + SIZ) / 10)
    mpMax: number; // floor(POW / 5)
    sanityMax: number; // 99 − Cthulhu Mythos
    build: number; // −2 to +2 based on STR+SIZ
    damageBonus: string; // e.g. "+1d4", "−1", "0"
    moveRate: number; // 7–9 based on STR/DEX vs SIZ
    // Half and Fifth values for each characteristic
    half: {
      STR: number; DEX: number; INT: number; CON: number;
      APP: number; POW: number; SIZ: number; EDU: number;
    };
    fifth: {
      STR: number; DEX: number; INT: number; CON: number;
      APP: number; POW: number; SIZ: number; EDU: number;
    };
  };

  // Skills (name → regular %; Hard = half, Extreme = fifth — derived at use time)
  skills: Record<string, number>;

  // Tracks
  hitPoints: StatTrack;
  sanity: StatTrack;
  magicPoints: StatTrack;
  luck: number;
  cthulhuMythos: number; // reduces sanity max; increases as Mythos is encountered

  // Spells learned from Mythos tomes / entities
  spells?: string[];

  // Mythos tomes studied (affects Cthulhu Mythos skill gain)
  tomesStudied?: string[];

  // Backstory (official CoC 7e character sheet sections)
  personalDescription?: string;
  traits?: string[];
  ideologyBeliefs?: string[];
  injuries?: string[];
  fellowsAndContacts?: string[];
  significantPeople?: string[];
  meaningfulLocations?: string[];
  treasuredPossessions?: string[];

  // Equipment
  weapons?: CocWeapon[];
  gear?: string[];
  spendingLevel?: string;
  cash?: number;
  assets?: string;

  notes?: string;
}

// =====================
// Seventh Sea 2nd Ed
// =====================

// In 7th Sea 2e, weapons determine which Trait backs the attack roll
// and whether the weapon qualifies for a Duelist School style.
// Damage is resolved via Raises (each Raise = 1 Wound) — no separate damage dice.
export interface SeventhSeaWeapon {
  name: string;
  trait: "Brawn" | "Finesse" | "Wits"; // Trait used with Weaponry or Aim
  type: "fencing" | "heavy" | "firearm" | "improvised" | "thrown";
  properties?: Array<"Dueling" | "Paired" | "Reload" | "Reach" | "Gunpowder" | "Defensive">;
}

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

  // Advantages (special purchased abilities; e.g. "Sea Legs", "Valroux Duelist")
  advantages: string[];

  // Sorcery (optional; Porté, Laerdom, El Fuego Adentro, Sorte, etc.)
  sorcery?: {
    type: string;
    knacks: string[];
  };

  // Dueling style (from a Duelist Academy advantage)
  duelingStyle?: string;

  // Secret society membership
  secretSociety?: {
    name: string; // Explorer's Society, Sophia's Daughters, Invisible College, etc.
    rank: string; // e.g. "Recruit", "Member", "Advocate"
  };

  // Social standing
  // reputation: positive = heroic, negative = villainous
  reputation?: number;
  // Corruption from dark pacts or forbidden sorcery
  corruption?: number;
  // Wealth trait 0–5: determines purchasing power and spending dice
  wealth?: number;

  // Languages spoken (beyond native)
  languages?: string[];

  // Equipment
  weapons?: SeventhSeaWeapon[];
  gear?: string[];

  // Stories & Goals
  stories?: string[];
  goals?: string[];

  // State
  // Dramatic Wounds — Helpless when wounds = Resolve trait (not Resolve × 5)
  wounds: StatTrack;
  heroPoints: number;

  // Background archetypes from chargen
  backgrounds?: string[];

  notes?: string;
}

// =====================
// The Expanse RPG — AGE System
// =====================

// AGE weapon stats (The Expanse corebook weapons table)
export interface AgeWeapon {
  name: string;
  damage: string; // e.g. "2d6+3", "1d6+5"
  minStr?: number; // minimum Strength to use without penalty
  range?: string; // e.g. "Short/Long 10/30m"
  qualities?: string[]; // e.g. "Accurate", "Burst Fire", "Piercing 2"
}

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
  speed: number; // 10 + Dexterity
  defense: number; // 10 + Dexterity
  toughness?: number; // from armor / talents

  // State
  health: StatTrack;
  fortune: number; // Fortune points for player agency

  // Active conditions (Injured, Fatigued, Frightened, etc.)
  conditions?: string[];

  // Equipment
  weapons?: AgeWeapon[];
  armor?: string;
  gear?: string[];

  // Drive & Relationships
  drive?: string;
  relationships?: string[];

  notes?: string;
}

// =====================
// Slavic 800 AD
// Based on Forbidden Lands (Free League Publishing) —
// Year Zero Engine; 4 attributes each act as both stat and health pool.
// Damage is dealt to the governing attribute directly (not a separate HP pool).
// Broken when any attribute is reduced to 0.
// =====================

export interface SlavicArmor {
  name: string;
  rating: number; // armor protection value (reduces damage)
}

export interface SlavicCharacter {
  gameType: GameType.SLAVIC;
  id: number;
  name: string;
  kin: string; // e.g. Human, Völva-born, Warrior-born (homebrew kin types)
  kinAbility: string; // each kin has a unique special ability
  calling: string; // Warrior, Hunter, Volkhv (shaman), Skald, Kupets (merchant)
  age?: string; // Young / Middle-aged / Old (affects starting attribute values)
  description: string;

  // Attributes 2–5 (one die per point: d6/d8/d10/d12)
  // In Forbidden Lands each attribute is also its own damage track.
  // A character is Broken in an aspect when that attribute's current value = 0.
  attributes: {
    Strength: number;
    Agility: number;
    Wits: number;
    Empathy: number;
  };

  // Attribute damage — tracks current value after taking damage.
  // Broken conditions: Strength/Agility → Exhausted; Wits → Confused; Empathy → Hopeless.
  attributeDamage: {
    Strength: number; // current (starts equal to attributes.Strength)
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

  // Talents (special abilities from calling or general pool)
  talents: string[];

  // Wyrd — spiritual power / fate points (for mystic callings like Volkhv)
  wyrd?: StatTrack;

  // Equipment
  weapons?: string[];
  armor?: SlavicArmor;
  gear?: string[];

  // Core Forbidden Lands character traits
  pride?: string; // once per session, re-roll all dice if it applies
  darkSecret?: string;

  // Relationships / bonds with other player characters
  relationships?: string[];

  // Experience (used to unlock new skills and talents)
  experience?: number;

  notes?: string;
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
