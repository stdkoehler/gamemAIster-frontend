import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CharacterProps,
  ShadowrunCharacter,
  VampireCharacter,
  CthulhuCharacter,
  SeventhSeaCharacter,
  ExpanseCharacter,
  SlavicCharacter,
} from "../models/CharacterProps";
import { GameType } from "../models/Types";

interface CharacterState {
  characters: CharacterProps[];
  activeCharacterId: number | null;
  isSheetOpen: boolean;
  openSheet: (characterId: number) => void;
  closeSheet: () => void;
  updateCharacter: (updated: CharacterProps) => void;
}

const DEFAULT_SR: ShadowrunCharacter = {
  gameType: GameType.SHADOWRUN,
  id: 10001,
  name: "Ghost",
  metatype: "Human",
  archetype: "Decker",
  gender: "Female",
  age: 26,
  description: "Ex-corporate decker turned shadowrunner. Prefers hacking to firefights.",
  attributes: {
    Body: 3, Agility: 4, Reaction: 4, Strength: 2,
    Willpower: 4, Logic: 6, Intuition: 5, Charisma: 3,
    Edge: 4, Essence: 5.2,
  },
  derived: {
    physicalLimit: 5, mentalLimit: 9, socialLimit: 6,
    composure: 7, judgeIntentions: 8, memory: 10,
    liftCarry: 5, initiativeBase: 9, initiativeDice: 1,
  },
  skills: {
    Cracking: 9, Electronics: 8, "Computer": 8, Perception: 5,
    Pistols: 4, Sneaking: 4, "Electronic Warfare": 7,
  },
  skillSpecializations: { Cracking: "Cybercombat", Electronics: "Cyberdecks" },
  knowledgeSkills: { "Corporate Politics": 5, "Seattle Underworld": 4, "Matrix Security": 6 },
  qualities: {
    positive: ["Analytical Mind", "Tech Savant"],
    negative: ["Addiction (Betaware, Mild)", "Corp SIN"],
  },
  contacts: {
    "Silk (Fixer)": { loyalty: 4, connection: 5 },
    "Dr. Nguyen (Street Doc)": { loyalty: 3, connection: 3 },
    "Icon (Matrix Contact)": { loyalty: 5, connection: 4 },
  },
  armor: 9,
  weapons: ["Ares Light Fire 75 (Light Pistol)", "Stun Baton"],
  cyberware: ["Cerebral Booster 2", "Datajack", "Reaction Enhancers 1"],
  gear: ["Hermes Chariot (Cyberdeck)", "Tag Eraser", "Contacts (R3)", "Medkit R3"],
  nuyen: 8500,
  lifestyle: "Middle",
  streetCred: 3, notoriety: 0, publicAwareness: 1, karma: 2,
  damage: { physical: { current: 0, max: 10 }, stun: { current: 0, max: 10 } },
  matrixStats: {
    device: "Hermes Chariot", Attack: 6, Sleaze: 7, DataProcessing: 8, Firewall: 7,
    matrixConditionMonitor: { current: 0, max: 12 },
  },
};

const DEFAULT_VTM: VampireCharacter = {
  gameType: GameType.VAMPIRE_THE_MASQUERADE,
  id: 10002,
  nature: "vampire",
  name: "Séraphine Morel",
  clan: "Toreador",
  generation: 11,
  predatorType: "Siren",
  sire: "Étienne de Beaumont",
  ambition: "Become the artistic voice of the city's Kindred",
  desire: "Find her mortal muse reborn",
  description: "Embraced in 1920s Paris. Uses her Presence to build a salon empire.",
  attributes: {
    Strength: 2, Dexterity: 3, Stamina: 2,
    Charisma: 4, Manipulation: 3, Composure: 3,
    Intelligence: 3, Wits: 3, Resolve: 2,
  },
  skills: {
    Athletics: 1, Brawl: 1, Craft: 4, Drive: 1, Firearms: 0,
    Melee: 1, Larceny: 1, Stealth: 2, Survival: 0,
    "Animal Ken": 0, Etiquette: 4, Insight: 3, Intimidation: 1,
    Leadership: 2, Performance: 5, Persuasion: 4, Streetwise: 1, Subterfuge: 3,
    Academics: 3, Awareness: 3, Finance: 1, Investigation: 2,
    Medicine: 0, Occult: 2, Politics: 2, Science: 0, Technology: 1,
  },
  skillSpecialties: ["Performance (Fine Art)", "Persuasion (Seduction)", "Craft (Painting)"],
  weapons: [
    { name: "Knife", damage: 1, skill: "Melee", properties: ["Concealable"] },
  ],
  disciplines: {
    Auspex: { level: 2, powers: ["Heightened Senses", "Sense the Unseen"] },
    Celerity: { level: 1, powers: ["Cat's Grace"] },
    Presence: { level: 3, powers: ["Awe", "Daunt", "Entrancement"] },
  },
  hunger: 2, bloodPotency: 1, resonance: "Sanguine", temperament: "Acute",
  humanity: 7,
  chronicleTenets: ["Never destroy art", "Protect the Masquerade"],
  touchstones: ["Claude (mortal art student, her current muse)"],
  clanBane: "Aesthetic Fixation — must make a Humanity check to harm beautiful things.",
  compulsion: "Obsession — must spend time indulging their artistic passion.",
  backgrounds: { Resources: 3, Haven: 3, Allies: 2, Status: 2 },
  merits: ["Beautiful", "Elegant"],
  flaws: ["Prey Exclusion (Artists)"],
  loresheets: ["The Toreador Salon"],
  health: { current: 5, max: 5 },
  willpower: { current: 5, max: 5 },
  experienceTotal: 0, experienceSpent: 0,
};

const DEFAULT_COC: CthulhuCharacter = {
  gameType: GameType.CALL_OF_CTHULHU,
  id: 10003,
  name: "Dr. Evelyn Shaw",
  occupation: "Archaeologist",
  era: "1920s",
  age: 38,
  residence: "Boston, Massachusetts",
  birthplace: "Oxford, England",
  description: "A seasoned academic whose curiosity has led her to dig up things best left buried.",
  characteristics: { STR: 50, CON: 60, SIZ: 50, DEX: 65, APP: 60, INT: 80, POW: 70, EDU: 85 },
  derived: {
    hpMax: 11, mpMax: 14, sanityMax: 91, build: 0,
    damageBonus: "+0", moveRate: 8,
    half:  { STR: 25, CON: 30, SIZ: 25, DEX: 32, APP: 30, INT: 40, POW: 35, EDU: 42 },
    fifth: { STR: 10, CON: 12, SIZ: 10, DEX: 13, APP: 12, INT: 16, POW: 14, EDU: 17 },
  },
  skills: {
    Archaeology: 75, "Library Use": 70, "Spot Hidden": 60, History: 65,
    Occult: 50, "First Aid": 45, Psychology: 40, "Language (Arabic)": 40,
    "Language (Latin)": 55, "Fighting (Brawl)": 30, "Firearms (Handgun)": 35,
    Dodge: 32, Stealth: 30, Navigate: 40,
  },
  hitPoints: { current: 11, max: 11 },
  sanity: { current: 62, max: 70 },
  magicPoints: { current: 14, max: 14 },
  luck: 45,
  cthulhuMythos: 8,
  personalDescription: "Wiry and weathered, perpetually ink-stained fingers.",
  traits: ["Methodical", "Cautiously curious"],
  ideologyBeliefs: ["Science can explain everything, eventually"],
  significantPeople: ["Prof. Harrington (mentor, now missing)"],
  fellowsAndContacts: ["Marcus Webb (journalist)"],
  meaningfulLocations: ["The Miskatonic University Library"],
  treasuredPossessions: ["Her father's compass"],
  injuries: [],
  weapons: [
    { name: "Revolver (.38)", skill: "Firearms (Handgun)", damage: "1d8", range: "15 yds", attacksPerRound: 1, ammo: 6, malfunction: 100 },
    { name: "Fist", skill: "Fighting (Brawl)", damage: "1d3+db", attacksPerRound: 1 },
  ],
  gear: ["Archaeology Tools", "Leather Satchel", "Notebook", "Electric Torch"],
  spendingLevel: "$10/day", cash: 85, assets: "University salary, small inheritance",
};

const DEFAULT_SS: SeventhSeaCharacter = {
  gameType: GameType.SEVENTH_SEA,
  id: 10004,
  name: "Capitaine Isabelle Leblanc",
  nation: "Montaigne",
  religion: "Vaticine Church (lapsed)",
  arcana: { virtue: "Loyal", hubris: "Arrogant" },
  description: "A brilliant duelist and privateer sailing under letters of marque she may have forged.",
  traits: { Brawn: 2, Finesse: 4, Resolve: 3, Wits: 3, Panache: 4 },
  skills: {
    Aim: 1, Athletics: 2, Brawl: 2, Convince: 3, Empathy: 2,
    Hide: 1, Intimidate: 2, Notice: 2, Perform: 2, Ride: 1,
    Sailing: 3, Tempt: 2, Theft: 1, Warfare: 2, Weaponry: 4,
  },
  advantages: ["Commander", "Sea Legs", "Valroux Duelist Academy", "Friend at Court"],
  duelingStyle: "Valroux (Feint & Riposte)",
  sorcery: { type: "Porte (dilettante)", knacks: ["Pocket"] },
  secretSociety: { name: "Explorer's Society", rank: "Member" },
  reputation: 8, corruption: 1, wealth: 3,
  languages: ["Montaigne (native)", "Castillian", "Thean"],
  weapons: [
    { name: "Rapier", trait: "Finesse", type: "fencing", properties: ["Dueling"] },
    { name: "Main Gauche", trait: "Finesse", type: "fencing", properties: ["Dueling", "Paired", "Defensive"] },
    { name: "Flintlock Pistol", trait: "Finesse", type: "firearm", properties: ["Reload", "Gunpowder"] },
  ],
  gear: ["Spyglass", "Navigator's Charts", "Fine Clothes", "Lock Picks"],
  stories: ["Recover the Leblanc family signet ring", "Expose the corrupt Montaigne admiral"],
  goals: ["Become the most feared captain in the Théan Sea"],
  wounds: { current: 0, max: 15 },
  heroPoints: 3,
  backgrounds: ["Pirate", "Montaigne Noble (Disgraced)"],
};

const DEFAULT_EXPANSE: ExpanseCharacter = {
  gameType: GameType.EXPANSE,
  id: 10005,
  name: "Yuki Tanaka",
  origin: "Martian",
  background: "Military",
  faction: "MCR",
  description: "Decorated MCRN marine reassigned to the Belt after a classified incident on Ilus.",
  abilities: {
    Accuracy: 1, Communication: 0, Constitution: 2,
    Dexterity: 1, Fighting: 3, Intelligence: 1,
    Perception: 1, Strength: 3, Willpower: 2,
  },
  focuses: [
    "Accuracy (Assault Rifles)", "Constitution (Stamina)",
    "Fighting (Heavy Weapons)", "Strength (Intimidation)",
    "Intelligence (Military Tactics)", "Perception (Seeing)",
  ],
  talents: { "Armor Training": 2, "Contacts": 1, "Pinpoint Attack": 1 },
  speed: 11, defense: 11, toughness: 1,
  health: { current: 50, max: 50 },
  fortune: 3,
  conditions: [],
  weapons: [
    { name: "Kang HVAR Assault Rifle", damage: "3d6+4", range: "30/150m", qualities: ["Burst Fire", "Two-Handed"] },
    { name: "Sidearm (9mm)", damage: "2d6+2", range: "10/30m", qualities: ["Concealable"] },
    { name: "Combat Knife", damage: "1d6+3", qualities: ["Stealthy"] },
  ],
  armor: "MCRN Infantry Battle Dress",
  gear: ["Tactical Helmet (HUD)", "Medpatch ×3", "Encrypted Communit"],
  drive: "Prove her worth outside the MCRN structure",
  relationships: ["Cpt. Holden (uneasy alliance)", "Lt. Gomez (old squad-mate)"],
};

const DEFAULT_SLAVIC: SlavicCharacter = {
  gameType: GameType.SLAVIC,
  id: 10006,
  name: "Mstislav Medvezhy",
  kin: "Human",
  kinAbility: "Adaptable — may re-roll one die when pushing a roll",
  calling: "Volkhv",
  age: "Middle-aged",
  description: "A wandering shaman who walks between the living world and the realm of Nav.",
  attributes: { Strength: 2, Agility: 3, Wits: 4, Empathy: 4 },
  attributeDamage: { Strength: 2, Agility: 3, Wits: 4, Empathy: 4 },
  skills: {
    Endurance: 1, Fight: 1, Sneak: 2, Move: 2, Marksmanship: 1,
    Scout: 3, Lore: 4, Survival: 3, Craft: 2,
    Insight: 4, Manipulation: 3, Healing: 4, Performance: 2,
  },
  talents: ["Spirit Caller", "Herb Lore", "Dream Walker"],
  wyrd: { current: 3, max: 3 },
  weapons: ["Oak Staff"],
  armor: { name: "Linen Robe", rating: 0 },
  gear: ["Herbalist Pouch", "Carved Runes", "Waterskin", "Tallow Candles"],
  pride: "Never refused to heal a person in need",
  darkSecret: "Bargained with a Navian spirit to save his daughter — owes a debt not yet collected",
  relationships: [],
  experience: 0,
};

const DEFAULT_CHARACTERS: CharacterProps[] = [
  DEFAULT_SR,
  DEFAULT_VTM,
  DEFAULT_COC,
  DEFAULT_SS,
  DEFAULT_EXPANSE,
  DEFAULT_SLAVIC,
];

const useCharacterStore = create<CharacterState>()(
  persist(
    (set) => ({
      characters: DEFAULT_CHARACTERS,
      activeCharacterId: null,
      isSheetOpen: false,
      openSheet: (characterId) =>
        set({ activeCharacterId: characterId, isSheetOpen: true }),
      closeSheet: () => set({ isSheetOpen: false }),
      updateCharacter: (updated) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === updated.id ? updated : c,
          ),
        })),
    }),
    {
      name: "character-storage",
      partialize: (state) => ({ characters: state.characters }),
    },
  ),
);

export default useCharacterStore;
