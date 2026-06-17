import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
  Grid,
  Accordion,
  AccordionSummary,
  Chip,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import {
  AccordionGridStyle,
  CardBoxStyle,
  InfoBoxStyle,
  InfoInnerBoxStyle,
  SkillsBoxStyle,
  DamageGridStyle,
  DamageComponentBoxStyle,
  getDamageColor,
  CreateDamageInputFieldStyle,
} from "../styles/styles";
import {
  CharacterProps,
  HealthTrack,
  V5Weapon,
  ShadowrunCharacter,
  VampireCharacter,
  CthulhuCharacter,
  SeventhSeaCharacter,
  ExpanseCharacter,
  SlavicCharacter,
} from "../models/CharacterProps";
import { GameType } from "../models/Types";
import useAppStore from "../stores/appStore";

// =====================
// Shared sub-components
// =====================

interface HealthTrackComponentProps {
  label: string;
  track: HealthTrack;
}

const HealthTrackComponent: React.FC<HealthTrackComponentProps> = ({
  label,
  track,
}) => {
  const [current, setCurrent] = useState(track.current);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const inputEl = inputRef.current;
    const handleWheel = (e: WheelEvent) => {
      if (document.activeElement === inputEl) e.stopPropagation();
    };
    inputEl?.addEventListener("wheel", handleWheel, { passive: false });
    return () => inputEl?.removeEventListener("wheel", handleWheel);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (val >= 0 && val <= track.max) setCurrent(val);
  };

  const percentage = current / track.max;

  return (
    <>
      <Typography>{label}:</Typography>
      <Box sx={DamageComponentBoxStyle()}>
        <TextField
          type="number"
          value={current}
          onChange={handleChange}
          size="small"
          inputRef={inputRef}
          sx={CreateDamageInputFieldStyle(percentage)}
        />
        <CircularProgress
          variant="determinate"
          value={percentage * 100}
          size={60}
          thickness={4}
          sx={{ color: getDamageColor(percentage), padding: "5px" }}
        />
        <Typography sx={{ color: getDamageColor(percentage) }}>
          {`${current}/${track.max}`}
        </Typography>
      </Box>
    </>
  );
};

interface KeyValueListProps {
  title: string;
  entries: Record<string, number | string>;
}

const KeyValueList: React.FC<KeyValueListProps> = ({ title, entries }) => (
  <Box sx={InfoBoxStyle()}>
    <Box sx={InfoInnerBoxStyle()}>
      <Typography variant="body2" fontWeight="bold">
        {title}:
      </Typography>
      {Object.entries(entries).map(([key, value]) => (
        <Typography key={key} variant="body2">
          {key}: {value}
        </Typography>
      ))}
    </Box>
  </Box>
);

interface TagListProps {
  title: string;
  items: string[];
}

const TagList: React.FC<TagListProps> = ({ title, items }) => (
  <Box sx={{ my: 1 }}>
    <Typography variant="body2" fontWeight="bold">
      {title}:
    </Typography>
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
      {items.map((item) => (
        <Chip key={item} label={item} size="small" variant="outlined" />
      ))}
    </Box>
  </Box>
);

// =====================
// NPC views — combat-relevant fields only
// =====================

// Combat skills to surface; anything not in this set is suppressed.
const SR_COMBAT_SKILLS = new Set([
  "Automatics",
  "Pistols",
  "Rifles",
  "Shotguns",
  "Heavy Weapons",
  "Blades",
  "Clubs",
  "Unarmed Combat",
  "Archery",
  "Throwing Weapons",
  "Sneaking",
  "Perception",
  "Gymnastics",
  "Pilot Ground Craft",
  "Pilot Aircraft",
]);

const ShadowrunNpcCard: React.FC<ShadowrunCharacter> = (c) => {
  const combatSkills = Object.fromEntries(
    Object.entries(c.skills).filter(([k]) => SR_COMBAT_SKILLS.has(k)),
  );

  return (
    <Box sx={CardBoxStyle()}>
      <Typography variant="h5">{c.name}</Typography>
      <Typography variant="body2">
        {c.metatype} · {c.archetype}
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2} justifyContent="center">
        <Grid>
          <KeyValueList title="Attributes" entries={c.attributes} />
        </Grid>
        <Grid>
          <Box sx={SkillsBoxStyle()}>
            <KeyValueList title="Combat Skills" entries={combatSkills} />
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2} justifyContent="center">
        <Grid>
          <Box sx={InfoBoxStyle()}>
            <Box sx={InfoInnerBoxStyle()}>
              <Typography variant="body2">Armor: {c.armor}</Typography>
              <Typography variant="body2">
                Init: {c.derived.initiativeBase}+{c.derived.initiativeDice}d6
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid>
          <TagList title="Weapons" items={c.weapons} />
        </Grid>
        <Grid>
          <TagList title="Cyberware" items={c.cyberware} />
        </Grid>
      </Grid>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2} sx={DamageGridStyle()}>
        <Grid>
          <HealthTrackComponent label="Physical" track={c.damage.physical} />
        </Grid>
        <Grid>
          <HealthTrackComponent label="Stun" track={c.damage.stun} />
        </Grid>
      </Grid>
    </Box>
  );
};

// V5 weapon table row
const V5WeaponList: React.FC<{ weapons: V5Weapon[] }> = ({ weapons }) => (
  <Box sx={{ my: 1 }}>
    <Typography variant="body2" fontWeight="bold">
      Weapons:
    </Typography>
    {weapons.map((w) => (
      <Typography key={w.name} variant="body2">
        {w.name} — DMG +{w.damage} ({w.skill}
        {w.range !== undefined ? `, ${w.range}m` : ""})
        {w.properties && w.properties.length > 0
          ? ` [${w.properties.join(", ")}]`
          : ""}
      </Typography>
    ))}
  </Box>
);

const VTM_COMBAT_SKILLS: Array<keyof VampireCharacter["skills"]> = [
  "Athletics",
  "Brawl",
  "Firearms",
  "Melee",
  "Stealth",
  "Intimidation",
  "Awareness",
];

const VampireNpcCard: React.FC<VampireCharacter> = (c) => {
  const combatSkills = Object.fromEntries(
    VTM_COMBAT_SKILLS.map((k) => [k, c.skills[k]]).filter(([, v]) => (v as number) > 0),
  );

  const physicalAttrs = {
    Strength: c.attributes.Strength,
    Dexterity: c.attributes.Dexterity,
    Stamina: c.attributes.Stamina,
  };

  // Subtitle varies by nature
  const subtitle =
    c.nature === "mortal"
      ? "Mortal"
      : c.nature === "ghoul"
        ? `Ghoul${c.clan ? ` (${c.clan})` : ""}`
        : c.nature === "thin-blood"
          ? `Thin-blood${c.clan ? ` — Clan ${c.clan}` : ""}`
          : `Clan ${c.clan} · ${c.generation}th Gen · ${c.predatorType}`;

  return (
    <Box sx={CardBoxStyle()}>
      <Typography variant="h5">{c.name}</Typography>
      <Typography variant="body2">{subtitle}</Typography>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2} justifyContent="center">
        <Grid>
          <KeyValueList title="Physical" entries={physicalAttrs} />
        </Grid>
        <Grid>
          <Box sx={SkillsBoxStyle()}>
            <KeyValueList title="Combat Skills" entries={combatSkills} />
          </Box>
        </Grid>
        {c.disciplines && Object.keys(c.disciplines).length > 0 && (
          <Grid>
            <KeyValueList title="Disciplines" entries={c.disciplines} />
          </Grid>
        )}
      </Grid>
      {c.weapons && c.weapons.length > 0 && (
        <V5WeaponList weapons={c.weapons} />
      )}
      {(c.nature === "vampire" || c.nature === "thin-blood") && (
        <Grid container spacing={2} justifyContent="center">
          <Grid>
            <Box sx={InfoBoxStyle()}>
              <Box sx={InfoInnerBoxStyle()}>
                {c.hunger !== undefined && (
                  <Typography variant="body2">Hunger: {c.hunger}/5</Typography>
                )}
                {c.humanity !== undefined && (
                  <Typography variant="body2">Humanity: {c.humanity}/10</Typography>
                )}
                {c.bloodPotency !== undefined && (
                  <Typography variant="body2">Blood Potency: {c.bloodPotency}</Typography>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2} sx={DamageGridStyle()}>
        <Grid>
          <HealthTrackComponent label="Health" track={c.health} />
        </Grid>
        <Grid>
          <HealthTrackComponent label="Willpower" track={c.willpower} />
        </Grid>
      </Grid>
    </Box>
  );
};

const COC_COMBAT_SKILLS = new Set([
  "Fighting (Brawl)",
  "Firearms (Handgun)",
  "Firearms (Rifle)",
  "Dodge",
  "Spot Hidden",
  "Stealth",
  "Throw",
]);

const CthulhuNpcCard: React.FC<CthulhuCharacter> = (c) => {
  const combatSkills = Object.fromEntries(
    Object.entries(c.skills).filter(([k]) => COC_COMBAT_SKILLS.has(k)),
  );

  const combatChars = {
    STR: c.characteristics.STR,
    CON: c.characteristics.CON,
    DEX: c.characteristics.DEX,
    SIZ: c.characteristics.SIZ,
  };

  return (
    <Box sx={CardBoxStyle()}>
      <Typography variant="h5">{c.name}</Typography>
      <Typography variant="body2">{c.occupation}</Typography>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2} justifyContent="center">
        <Grid>
          <KeyValueList title="Characteristics" entries={combatChars} />
        </Grid>
        <Grid>
          <Box sx={SkillsBoxStyle()}>
            <KeyValueList title="Combat Skills (%)" entries={combatSkills} />
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2} justifyContent="center">
        <Grid>
          <Box sx={InfoBoxStyle()}>
            <Box sx={InfoInnerBoxStyle()}>
              <Typography variant="body2">
                Build: {c.derived.build}
              </Typography>
              <Typography variant="body2">
                Damage Bonus: {c.derived.damageBonus}
              </Typography>
              <Typography variant="body2">
                Move: {c.derived.moveRate}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2} sx={DamageGridStyle()}>
        <Grid>
          <HealthTrackComponent label="Hit Points" track={c.hitPoints} />
        </Grid>
        <Grid>
          <HealthTrackComponent label="Sanity" track={c.sanity} />
        </Grid>
      </Grid>
    </Box>
  );
};

const SS_COMBAT_SKILLS: Array<keyof SeventhSeaCharacter["skills"]> = [
  "Aim",
  "Athletics",
  "Brawl",
  "Intimidate",
  "Notice",
  "Warfare",
  "Weaponry",
];

const SeventhSeaNpcCard: React.FC<SeventhSeaCharacter> = (c) => {
  const combatSkills = Object.fromEntries(
    SS_COMBAT_SKILLS.map((k) => [k, c.skills[k]]).filter(([, v]) => (v as number) > 0),
  );

  return (
    <Box sx={CardBoxStyle()}>
      <Typography variant="h5">{c.name}</Typography>
      <Typography variant="body2">
        {c.nation} · Virtue: {c.arcana.virtue} · Hubris: {c.arcana.hubris}
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2} justifyContent="center">
        <Grid>
          <KeyValueList title="Traits" entries={c.traits} />
        </Grid>
        <Grid>
          <Box sx={SkillsBoxStyle()}>
            <KeyValueList title="Combat Skills" entries={combatSkills} />
          </Box>
        </Grid>
      </Grid>
      {c.duelingStyle && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Dueling Style: {c.duelingStyle}
        </Typography>
      )}
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2} sx={DamageGridStyle()}>
        <Grid>
          <HealthTrackComponent label="Wounds" track={c.wounds} />
        </Grid>
      </Grid>
    </Box>
  );
};

const EXPANSE_COMBAT_ABILITIES: Array<keyof ExpanseCharacter["abilities"]> = [
  "Accuracy",
  "Constitution",
  "Dexterity",
  "Fighting",
  "Perception",
  "Strength",
];

const ExpanseNpcCard: React.FC<ExpanseCharacter> = (c) => {
  const combatAbilities = Object.fromEntries(
    EXPANSE_COMBAT_ABILITIES.map((k) => [k, c.abilities[k]]),
  );

  const combatFocuses = c.focuses.filter((f) =>
    /weapon|combat|fight|tactical|heavy|pistol|rifle|blade|unarmed|athletics/i.test(f),
  );

  return (
    <Box sx={CardBoxStyle()}>
      <Typography variant="h5">{c.name}</Typography>
      <Typography variant="body2">
        {c.origin} · {c.faction}
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2} justifyContent="center">
        <Grid>
          <KeyValueList title="Combat Abilities" entries={combatAbilities} />
        </Grid>
        {combatFocuses.length > 0 && (
          <Grid>
            <TagList title="Combat Focuses" items={combatFocuses} />
          </Grid>
        )}
      </Grid>
      <Grid container spacing={2} justifyContent="center">
        <Grid>
          <Box sx={InfoBoxStyle()}>
            <Box sx={InfoInnerBoxStyle()}>
              <Typography variant="body2">Speed: {c.speed}</Typography>
              <Typography variant="body2">Defense: {c.defense}</Typography>
            </Box>
          </Box>
        </Grid>
        {c.weapons && c.weapons.length > 0 && (
          <Grid>
            <TagList title="Weapons" items={c.weapons} />
          </Grid>
        )}
      </Grid>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2} sx={DamageGridStyle()}>
        <Grid>
          <HealthTrackComponent label="Health" track={c.health} />
        </Grid>
      </Grid>
    </Box>
  );
};

const SLAVIC_COMBAT_SKILLS: Array<keyof SlavicCharacter["skills"]> = [
  "Endurance",
  "Fight",
  "Sneak",
  "Move",
  "Marksmanship",
  "Scout",
];

const SlavicNpcCard: React.FC<SlavicCharacter> = (c) => {
  const combatSkills = Object.fromEntries(
    SLAVIC_COMBAT_SKILLS.map((k) => [k, c.skills[k]]).filter(([, v]) => (v as number) > 0),
  );

  return (
    <Box sx={CardBoxStyle()}>
      <Typography variant="h5">{c.name}</Typography>
      <Typography variant="body2">
        {c.kin} · {c.calling}
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2} justifyContent="center">
        <Grid>
          <KeyValueList title="Attributes" entries={c.attributes} />
        </Grid>
        <Grid>
          <Box sx={SkillsBoxStyle()}>
            <KeyValueList title="Combat Skills" entries={combatSkills} />
          </Box>
        </Grid>
      </Grid>
      {c.weapons && c.weapons.length > 0 && (
        <TagList title="Weapons" items={c.weapons} />
      )}
      {c.armor && (
        <Typography variant="body2">Armor: {c.armor}</Typography>
      )}
      {c.talents.length > 0 && (
        <TagList title="Talents" items={c.talents} />
      )}
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2} sx={DamageGridStyle()}>
        <Grid>
          <HealthTrackComponent label="Health" track={c.health} />
        </Grid>
        <Grid>
          <HealthTrackComponent label="Willpower" track={c.willpower} />
        </Grid>
      </Grid>
    </Box>
  );
};

// =====================
// NpcCard dispatcher
// =====================

export const NpcCard: React.FC<CharacterProps> = (props) => {
  switch (props.gameType) {
    case GameType.SHADOWRUN:
      return <ShadowrunNpcCard {...props} />;
    case GameType.VAMPIRE_THE_MASQUERADE:
      return <VampireNpcCard {...props} />;
    case GameType.CALL_OF_CTHULHU:
      return <CthulhuNpcCard {...props} />;
    case GameType.SEVENTH_SEA:
      return <SeventhSeaNpcCard {...props} />;
    case GameType.EXPANSE:
      return <ExpanseNpcCard {...props} />;
    case GameType.SLAVIC:
      return <SlavicNpcCard {...props} />;
    default:
      return null;
  }
};

// =====================
// Dummy NPCs per system
// =====================

function createNpcDummy(gameType: GameType, id: number): CharacterProps | null {
  switch (gameType) {
    case GameType.SHADOWRUN:
      return {
        gameType: GameType.SHADOWRUN,
        id,
        name: "Razor",
        metatype: "Ork",
        archetype: "Street Samurai",
        description: "Cybered-up muscle-for-hire from the Redmond Barrens.",
        attributes: {
          Body: 5,
          Agility: 6,
          Reaction: 5,
          Strength: 5,
          Willpower: 4,
          Logic: 3,
          Intuition: 4,
          Charisma: 2,
          Edge: 3,
          Essence: 1.8,
        },
        derived: {
          physicalLimit: 8,
          mentalLimit: 5,
          socialLimit: 5,
          composure: 6,
          judgeIntentions: 6,
          memory: 7,
          liftCarry: 10,
          initiativeBase: 9,
          initiativeDice: 3, // Wired Reflexes 2
        },
        skills: {
          Automatics: 9,
          Blades: 7,
          "Unarmed Combat": 5,
          Sneaking: 5,
          Perception: 6,
          Gymnastics: 4,
          "Pilot Ground Craft": 3,
        },
        knowledgeSkills: { "Seattle Gangs": 4, "Mercenary Contracts": 3 },
        qualities: {
          positive: ["Ambidextrous", "Quick Healer"],
          negative: ["Addiction (Stims, Mild)", "Prejudiced (Elves, Biased)"],
        },
        contacts: {
          "Mama Rosa (Fixer)": { loyalty: 4, connection: 5 },
          "Doc Hayashi (Street Doc)": { loyalty: 3, connection: 3 },
        },
        armor: 15,
        weapons: ["Ares Predator V (Heavy Pistol)", "Monofilament Whip", "Shock Gloves"],
        cyberware: [
          "Wired Reflexes 2",
          "Muscle Replacement 2",
          "Cybereyes Rating 3 (Flare Comp, Low-Light, Thermographic)",
          "Cyberears Rating 2 (Audio Enhancement 2)",
        ],
        gear: ["Armor Jacket", "Commlink (Hermes Ikon)", "Medkit R3"],
        nuyen: 4200,
        lifestyle: "Low",
        streetCred: 5,
        notoriety: 1,
        publicAwareness: 0,
        damage: {
          physical: { current: 0, max: 11 }, // 8 + ceil(5/2)
          stun: { current: 0, max: 10 }, // 8 + ceil(4/2)
        },
      };

    case GameType.VAMPIRE_THE_MASQUERADE:
      // Kindred NPC example
      return {
        gameType: GameType.VAMPIRE_THE_MASQUERADE,
        id,
        nature: "vampire",
        name: "Viktor Voss",
        clan: "Ventrue",
        generation: 9,
        predatorType: "Sandman",
        ambition: "Control the city's financial institutions",
        desire: "Revive the memory of his mortal family",
        description:
          "Centuries-old Kindred who steers the local financial elite from the shadows.",
        attributes: {
          Strength: 2,
          Dexterity: 3,
          Stamina: 3,
          Charisma: 4,
          Manipulation: 4,
          Composure: 3,
          Intelligence: 4,
          Wits: 3,
          Resolve: 3,
        },
        skills: {
          Athletics: 1,
          Brawl: 1,
          Craft: 0,
          Drive: 1,
          Firearms: 1,
          Melee: 2,
          Larceny: 0,
          Stealth: 2,
          Survival: 0,
          "Animal Ken": 0,
          Etiquette: 4,
          Insight: 3,
          Intimidation: 3,
          Leadership: 4,
          Performance: 2,
          Persuasion: 4,
          Streetwise: 1,
          Subterfuge: 3,
          Academics: 3,
          Awareness: 2,
          Finance: 4,
          Investigation: 2,
          Medicine: 0,
          Occult: 1,
          Politics: 3,
          Science: 1,
          Technology: 1,
        },
        weapons: [
          // V5 corebook weapon stats
          { name: "Sword (Antique Sabre)", damage: 2, skill: "Melee" },
          {
            name: "Heavy Pistol (.45)",
            damage: 3,
            skill: "Firearms",
            range: 35,
            properties: ["Loud"],
          },
        ],
        disciplines: { Dominate: 3, Fortitude: 2, Presence: 2 },
        hunger: 2,
        bloodPotency: 3,
        resonance: "Sanguine",
        temperament: "Acute",
        humanity: 6,
        chronicleTenets: ["Never betray an ally", "Protect the Masquerade"],
        touchstones: ["Elise (mortal granddaughter)"],
        clanBane: "Rarefied tastes — can only feed from a specific type of mortal.",
        compulsion: "Arrogance — must succeed at any task undertaken.",
        backgrounds: { Resources: 4, Status: 3, Allies: 2, Contacts: 3 },
        health: { current: 6, max: 6 }, // Stamina (3) + 3
        willpower: { current: 6, max: 6 }, // Composure (3) + Resolve (3)
        experienceTotal: 0,
        experienceSpent: 0,
      };

    case GameType.CALL_OF_CTHULHU:
      return {
        gameType: GameType.CALL_OF_CTHULHU,
        id,
        name: "Dr. Evelyn Shaw",
        occupation: "Archaeologist",
        age: 38,
        residence: "Boston, Massachusetts",
        birthplace: "Oxford, England",
        description:
          "A seasoned academic whose curiosity has led her to dig up things best left buried.",
        characteristics: {
          STR: 50,
          CON: 60,
          SIZ: 50,
          DEX: 65,
          APP: 60,
          INT: 80,
          POW: 70,
          EDU: 85,
        },
        derived: {
          hpMax: 11, // floor((CON+SIZ)/10) = floor(110/10)
          mpMax: 14, // floor(POW/5) = 14
          sanityMax: 67, // 99 - Cthulhu Mythos (8) = 91... wait, starting sanity = POW = 70, reduced by events
          build: 0,
          damageBonus: "+0",
          moveRate: 8,
        },
        skills: {
          "Archaeology": 75,
          "Library Use": 70,
          "Spot Hidden": 60,
          "History": 65,
          "Occult": 50,
          "First Aid": 45,
          "Psychology": 40,
          "Language (Arabic)": 40,
          "Language (Latin)": 55,
          "Fighting (Brawl)": 30,
          "Firearms (Handgun)": 35,
          "Dodge": 32,
          "Stealth": 30,
          "Navigate": 40,
        },
        hitPoints: { current: 11, max: 11 },
        sanity: { current: 62, max: 70 },
        magicPoints: { current: 14, max: 14 },
        luck: 45,
        cthulhuMythos: 8,
        traits: ["Methodical", "Cautiously curious"],
        ideologyBeliefs: ["Science can explain everything, eventually"],
        personalDescription: "Wiry and weathered, perpetually ink-stained fingers.",
        weapons: ["Revolver (.38)"],
        gear: ["Archaeology Tools", "Leather Satchel", "Notebook", "Electric Torch"],
        spendingLevel: "$10/day",
        cash: 85,
        assets: "University salary, small inheritance",
      };

    case GameType.SEVENTH_SEA:
      return {
        gameType: GameType.SEVENTH_SEA,
        id,
        name: "Capitaine Isabelle Leblanc",
        nation: "Montaigne",
        religion: "Vaticine Church (lapsed)",
        arcana: { virtue: "Loyal", hubris: "Arrogant" },
        description:
          "A brilliant duelist and privateer sailing under letters of marque she may have forged herself.",
        traits: {
          Brawn: 2,
          Finesse: 4,
          Resolve: 3,
          Wits: 3,
          Panache: 4,
        },
        skills: {
          Aim: 1,
          Athletics: 2,
          Brawl: 2,
          Convince: 3,
          Empathy: 2,
          Hide: 1,
          Intimidate: 2,
          Notice: 2,
          Perform: 2,
          Ride: 1,
          Sailing: 3,
          Tempt: 2,
          Theft: 1,
          Warfare: 2,
          Weaponry: 4,
        },
        advantages: ["Commander", "Sea Legs", "Valroux Duelist Academy", "Friend at Court"],
        duelingStyle: "Valroux (Feint & Riposte)",
        stories: ["Recover the Leblanc family signet ring"],
        goals: ["Become the most feared captain in the Théan Sea"],
        wounds: { current: 0, max: 15 }, // Resolve (3) × 5
        heroPoints: 3,
        backgrounds: ["Pirate", "Montaigne Noble (Disgraced)"],
      };

    case GameType.EXPANSE:
      return {
        gameType: GameType.EXPANSE,
        id,
        name: "Yuki Tanaka",
        origin: "Martian",
        background: "Military",
        faction: "MCR",
        description:
          "Decorated MCRN marine reassigned to the Belt after a classified incident on Ilus.",
        abilities: {
          Accuracy: 1,
          Communication: 0,
          Constitution: 2,
          Dexterity: 1,
          Fighting: 3,
          Intelligence: 1,
          Perception: 1,
          Strength: 3,
          Willpower: 2,
        },
        focuses: [
          "Accuracy (Assault Rifles)",
          "Constitution (Stamina)",
          "Fighting (Heavy Weapons)",
          "Strength (Intimidation)",
          "Intelligence (Military Tactics)",
          "Perception (Seeing)",
        ],
        talents: { "Armor Training": 2, "Contacts": 1, "Pinpoint Attack": 1 },
        speed: 11, // 10 + DEX (1)
        defense: 11, // 10 + DEX (1)
        toughness: 1,
        health: { current: 50, max: 50 },
        fortune: 3,
        weapons: ["Kang HVAR Assault Rifle", "Sidearm (Glock 9mm)", "Combat Knife"],
        armor: "MCRN Infantry Battle Dress",
        gear: ["Tactical Helmet (HUD)", "Medpatch ×3", "Encrypted Communit"],
        drive: "Prove her worth outside the MCRN structure",
        relationships: ["Cpt. Holden (uneasy alliance)", "Lt. Gomez (old squad-mate)"],
      };

    case GameType.SLAVIC:
      return {
        gameType: GameType.SLAVIC,
        id,
        name: "Mstislav Medvezhy",
        kin: "Human",
        calling: "Volkhv",
        age: "Middle-aged",
        description:
          "A wandering shaman who walks between the world of the living and the realm of Nav, carrying secrets of the old gods.",
        attributes: {
          Strength: 2,
          Agility: 3,
          Wits: 4,
          Empathy: 4,
        },
        skills: {
          Endurance: 1,
          Fight: 1,
          Sneak: 2,
          Move: 2,
          Marksmanship: 1,
          Scout: 3,
          Lore: 4,
          Survival: 3,
          Craft: 2,
          Insight: 4,
          Manipulation: 3,
          Healing: 4,
          Performance: 2,
        },
        talents: ["Spirit Caller", "Herb Lore", "Dream Walker"],
        wyrd: { current: 3, max: 3 },
        willpower: { current: 4, max: 4 },
        health: { current: 3, max: 3 }, // Strength attribute value
        weapons: ["Oak Staff"],
        armor: "Linen Robe (no protection)",
        gear: ["Herbalist Pouch", "Carved Runes", "Waterskin", "Tallow Candles"],
        pride: "Never refused to heal a person in need",
        darkSecret: "Bargained with a Navian spirit to save his daughter — owes a debt not yet collected",
      };

    default:
      return null;
  }
}

// =====================
// NpcManager
// =====================

interface NpcManagerProps {
  onCreateNPCs?: () => void;
}

export const NpcManager: React.FC<NpcManagerProps> = ({ onCreateNPCs }) => {
  const gameType = useAppStore((s) => s.gameType);
  const [npcs, setNpcs] = useState<CharacterProps[]>([]);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const handleCreate = useCallback(() => {
    const dummy = createNpcDummy(gameType, Date.now());
    if (dummy) setNpcs((prev) => [...prev, dummy]);
    onCreateNPCs?.();
  }, [gameType, onCreateNPCs]);

  const confirmDelete = useCallback(() => {
    if (pendingDeleteId !== null) {
      setNpcs((prev) => prev.filter((n) => n.id !== pendingDeleteId));
    }
    setPendingDeleteId(null);
  }, [pendingDeleteId]);

  const cancelDelete = useCallback(() => setPendingDeleteId(null), []);

  const pendingName = npcs.find((n) => n.id === pendingDeleteId)?.name ?? "";

  const theme = useTheme();

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        component="span"
        sx={{
          display: "block",
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          color: alpha(theme.palette.primary.main, 0.38),
          textTransform: "uppercase",
          mb: 0.75,
          mt: 1.5,
        }}
      >
        NPCs
      </Box>
      <Button
        onClick={handleCreate}
        startIcon={<PersonAddIcon sx={{ fontSize: "14px !important" }} />}
        sx={{ width: "100%", justifyContent: "flex-start", mb: 0 }}
      >
        Create NPC
      </Button>

      <Box sx={{ mt: 1, ...AccordionGridStyle() }}>
        {npcs.map((npc) => (
          <Accordion key={npc.id}>
            <AccordionSummary
              aria-controls={`panel${npc.id}-content`}
              id={`panel${npc.id}-header`}
              sx={{ "& .MuiAccordionSummary-content": { alignItems: "center" } }}
            >
              <Typography sx={{ flexGrow: 1 }}>{npc.name}</Typography>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setPendingDeleteId(npc.id);
                }}
                sx={{ ml: 1, color: alpha(theme.palette.primary.main, 0.5) }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </AccordionSummary>
            <NpcCard {...npc} />
          </Accordion>
        ))}
      </Box>

      <Dialog open={pendingDeleteId !== null} onClose={cancelDelete}>
        <DialogTitle>Remove NPC?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete <strong>{pendingName}</strong> from the NPC list?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
