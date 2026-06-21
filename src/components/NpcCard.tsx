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
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  accordionGridStyle,
  cardBoxStyle,
  infoBoxStyle,
  infoInnerBoxStyle,
  skillsBoxStyle,
  trackGridStyle,
  trackMeterBoxStyle,
  getTrackColor,
  trackInputStyle,
} from "../styles/styles";
import {
  CharacterProps,
  StatTrack,
  V5Weapon,
  CocWeapon,
  AgeWeapon,
  SeventhSeaWeapon,
  ShadowrunCharacter,
  VampireCharacter,
  CthulhuCharacter,
  SeventhSeaCharacter,
  ExpanseCharacter,
  SlavicCharacter,
} from "../models/CharacterProps";
import { GameType } from "../models/Types";
import { CharacterRecord } from "../models/MissionModels";
import useAppStore from "../stores/appStore";
import useCharacterStore from "../stores/characterStore";
import useNotificationStore from "../stores/notificationStore";
import { createNpcDummy } from "../data/defaultCharacters";
import { createNpc, deleteCharacterSheet } from "../functions/restInterface";

// =====================
// Shared sub-components
// =====================

interface StatMeterProps {
  label: string;
  track: StatTrack;
  onChange?: (current: number) => void;
  /** When true, high values are good (remaining HP/resource). Low values become red. */
  inverse?: boolean;
}

const StatMeter: React.FC<StatMeterProps> = ({
  label,
  track,
  onChange,
  inverse = false,
}) => {
  const theme = useTheme();
  const [current, setCurrent] = useState(track.current);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Sync local state when the store updates (e.g. character sheet edit)
  React.useEffect(() => {
    setCurrent(track.current);
  }, [track.current]);

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
    if (val >= 0 && val <= track.max) {
      setCurrent(val);
      onChange?.(val);
    }
  };

  const percentage = current / track.max;
  const colorPercentage = inverse ? 1 - percentage : percentage;

  return (
    <>
      <Typography>{label}:</Typography>
      <Box sx={trackMeterBoxStyle}>
        <TextField
          type="number"
          value={current}
          onChange={handleChange}
          size="small"
          inputRef={inputRef}
          sx={trackInputStyle(colorPercentage)}
        />
        <CircularProgress
          variant="determinate"
          value={percentage * 100}
          size={60}
          thickness={4}
          sx={{
            color: getTrackColor(colorPercentage, theme.trackColors),
            padding: "5px",
          }}
        />
        <Typography
          sx={{ color: getTrackColor(colorPercentage, theme.trackColors) }}
        >
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
  <Box sx={infoBoxStyle}>
    <Box sx={infoInnerBoxStyle}>
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

type WithUpdate = { onCharacterUpdate?: (c: CharacterProps) => void };

const ShadowrunNpcCard: React.FC<ShadowrunCharacter & WithUpdate> = (c) => {
  const { onCharacterUpdate } = c;
  const combatSkills = Object.fromEntries(
    Object.entries(c.skills).filter(([k]) => SR_COMBAT_SKILLS.has(k)),
  );

  return (
    <Box sx={cardBoxStyle}>
      <Typography variant="h5">{c.name}</Typography>
      <Typography variant="body2">
        {c.metatype} — {c.archetype}
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2} justifyContent="center">
        <Grid>
          <KeyValueList title="Attributes" entries={c.attributes} />
        </Grid>
        <Grid>
          <Box sx={skillsBoxStyle}>
            <KeyValueList title="Combat Skills" entries={combatSkills} />
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2} justifyContent="center">
        <Grid>
          <Box sx={infoBoxStyle}>
            <Box sx={infoInnerBoxStyle}>
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
      <Grid container spacing={2} sx={trackGridStyle}>
        <Grid>
          <StatMeter
            label="Physical"
            track={c.damage.physical}
            onChange={(val) =>
              onCharacterUpdate?.({
                ...c,
                damage: {
                  ...c.damage,
                  physical: { ...c.damage.physical, current: val },
                },
              })
            }
          />
        </Grid>
        <Grid>
          <StatMeter
            label="Stun"
            track={c.damage.stun}
            onChange={(val) =>
              onCharacterUpdate?.({
                ...c,
                damage: {
                  ...c.damage,
                  stun: { ...c.damage.stun, current: val },
                },
              })
            }
          />
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

const VampireNpcCard: React.FC<VampireCharacter & WithUpdate> = (c) => {
  const { onCharacterUpdate } = c;
  const combatSkills = Object.fromEntries(
    VTM_COMBAT_SKILLS.map((k) => [k, c.skills[k]]).filter(
      ([, v]) => (v as number) > 0,
    ),
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
          ? ["Thin-blood", c.clan && `Clan ${c.clan}`]
              .filter(Boolean)
              .join(" – ")
          : [
              c.clan && `Clan ${c.clan}`,
              c.generation && `${c.generation}th Gen`,
              c.predatorType,
            ]
              .filter(Boolean)
              .join(" · ") || "Kindred";

  return (
    <Box sx={cardBoxStyle}>
      <Typography variant="h5">{c.name}</Typography>
      <Typography variant="body2">{subtitle}</Typography>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2} justifyContent="center">
        <Grid>
          <KeyValueList title="Physical" entries={physicalAttrs} />
        </Grid>
        <Grid>
          <Box sx={skillsBoxStyle}>
            <KeyValueList title="Combat Skills" entries={combatSkills} />
          </Box>
        </Grid>
        {c.disciplines && Object.keys(c.disciplines).length > 0 && (
          <Grid>
            <Box sx={infoBoxStyle}>
              <Box sx={infoInnerBoxStyle}>
                <Typography variant="body2" fontWeight="bold">
                  Disciplines:
                </Typography>
                {Object.entries(c.disciplines).map(([name, d]) => (
                  <Typography key={name} variant="body2">
                    {name} {d.level} — {d.powers.join(", ")}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
      {c.weapons && c.weapons.length > 0 && (
        <V5WeaponList weapons={c.weapons} />
      )}
      {(c.nature === "kindred" || c.nature === "thin-blood") && (
        <Grid container spacing={2} justifyContent="center">
          <Grid>
            <Box sx={infoBoxStyle}>
              <Box sx={infoInnerBoxStyle}>
                {c.hunger !== undefined && (
                  <Typography variant="body2">Hunger: {c.hunger}/5</Typography>
                )}
                {c.humanity !== undefined && (
                  <Typography variant="body2">
                    Humanity: {c.humanity}/10
                  </Typography>
                )}
                {c.bloodPotency !== undefined && (
                  <Typography variant="body2">
                    Blood Potency: {c.bloodPotency}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2} sx={trackGridStyle}>
        <Grid>
          <StatMeter
            label="Health"
            track={c.health}
            onChange={(val) =>
              onCharacterUpdate?.({
                ...c,
                health: { ...c.health, current: val },
              })
            }
            inverse
          />
        </Grid>
        <Grid>
          <StatMeter
            label="Willpower"
            track={c.willpower}
            onChange={(val) =>
              onCharacterUpdate?.({
                ...c,
                willpower: { ...c.willpower, current: val },
              })
            }
            inverse
          />
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

const CthulhuNpcCard: React.FC<CthulhuCharacter & WithUpdate> = (c) => {
  const { onCharacterUpdate } = c;
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
    <Box sx={cardBoxStyle}>
      <Typography variant="h5">{c.name}</Typography>
      <Typography variant="body2">{c.occupation}</Typography>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2} justifyContent="center">
        <Grid>
          <KeyValueList title="Characteristics" entries={combatChars} />
        </Grid>
        <Grid>
          <Box sx={skillsBoxStyle}>
            <KeyValueList title="Combat Skills (%)" entries={combatSkills} />
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2} justifyContent="center">
        <Grid>
          <Box sx={infoBoxStyle}>
            <Box sx={infoInnerBoxStyle}>
              <Typography variant="body2">Build: {c.derived.build}</Typography>
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
      {c.weapons && c.weapons.length > 0 && (
        <Box sx={{ my: 1 }}>
          <Typography variant="body2" fontWeight="bold">
            Weapons:
          </Typography>
          {c.weapons.map((w: CocWeapon) => (
            <Typography key={w.name} variant="body2">
              {w.name} — {w.damage} ({w.skill}){w.range ? `, ${w.range}` : ""}
              {w.ammo !== undefined ? `, ${w.ammo} rds` : ""}
              {w.malfunction !== undefined && w.malfunction < 100
                ? `, malf ${w.malfunction}`
                : ""}
            </Typography>
          ))}
        </Box>
      )}
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2} sx={trackGridStyle}>
        <Grid>
          <StatMeter
            label="Hit Points"
            track={c.hitPoints}
            onChange={(val) =>
              onCharacterUpdate?.({
                ...c,
                hitPoints: { ...c.hitPoints, current: val },
              })
            }
            inverse
          />
        </Grid>
        <Grid>
          <StatMeter
            label="Sanity"
            track={c.sanity}
            onChange={(val) =>
              onCharacterUpdate?.({
                ...c,
                sanity: { ...c.sanity, current: val },
              })
            }
            inverse
          />
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

const SeventhSeaNpcCard: React.FC<SeventhSeaCharacter & WithUpdate> = (c) => {
  const { onCharacterUpdate } = c;
  const combatSkills = Object.fromEntries(
    SS_COMBAT_SKILLS.map((k) => [k, c.skills[k]]).filter(
      ([, v]) => (v as number) > 0,
    ),
  );

  return (
    <Box sx={cardBoxStyle}>
      <Typography variant="h5">{c.name}</Typography>
      <Typography variant="body2">
        {c.nation} — Virtue: {c.arcana.virtue} — Hubris: {c.arcana.hubris}
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2} justifyContent="center">
        <Grid>
          <KeyValueList title="Traits" entries={c.traits} />
        </Grid>
        <Grid>
          <Box sx={skillsBoxStyle}>
            <KeyValueList title="Combat Skills" entries={combatSkills} />
          </Box>
        </Grid>
      </Grid>
      {c.duelingStyle && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Dueling Style: {c.duelingStyle}
        </Typography>
      )}
      {c.weapons && c.weapons.length > 0 && (
        <Box sx={{ my: 1 }}>
          <Typography variant="body2" fontWeight="bold">
            Weapons:
          </Typography>
          {c.weapons.map((w: SeventhSeaWeapon) => (
            <Typography key={w.name} variant="body2">
              {w.name} ({w.trait}, {w.type}
              {w.properties && w.properties.length > 0
                ? ` — ${w.properties.join(", ")}`
                : ""}
              )
            </Typography>
          ))}
        </Box>
      )}
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2} sx={trackGridStyle}>
        <Grid>
          <StatMeter
            label="Wounds"
            track={c.wounds}
            onChange={(val) =>
              onCharacterUpdate?.({
                ...c,
                wounds: { ...c.wounds, current: val },
              })
            }
          />
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

const ExpanseNpcCard: React.FC<ExpanseCharacter & WithUpdate> = (c) => {
  const { onCharacterUpdate } = c;
  const combatAbilities = Object.fromEntries(
    EXPANSE_COMBAT_ABILITIES.map((k) => [k, c.abilities[k]]),
  );

  const combatFocuses = c.focuses.filter((f) =>
    /weapon|combat|fight|tactical|heavy|pistol|rifle|blade|unarmed|athletics/i.test(
      f,
    ),
  );

  return (
    <Box sx={cardBoxStyle}>
      <Typography variant="h5">{c.name}</Typography>
      <Typography variant="body2">
        {c.origin} — {c.faction}
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
          <Box sx={infoBoxStyle}>
            <Box sx={infoInnerBoxStyle}>
              <Typography variant="body2">Speed: {c.speed}</Typography>
              <Typography variant="body2">Defense: {c.defense}</Typography>
            </Box>
          </Box>
        </Grid>
        {c.weapons && c.weapons.length > 0 && (
          <Grid>
            <Box sx={{ my: 1 }}>
              <Typography variant="body2" fontWeight="bold">
                Weapons:
              </Typography>
              {c.weapons.map((w: AgeWeapon) => (
                <Typography key={w.name} variant="body2">
                  {w.name} — {w.damage}
                  {w.range ? `, ${w.range}` : ""}
                  {w.qualities && w.qualities.length > 0
                    ? ` [${w.qualities.join(", ")}]`
                    : ""}
                </Typography>
              ))}
            </Box>
          </Grid>
        )}
      </Grid>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2} sx={trackGridStyle}>
        <Grid>
          <StatMeter
            label="Health"
            track={c.health}
            onChange={(val) =>
              onCharacterUpdate?.({
                ...c,
                health: { ...c.health, current: val },
              })
            }
            inverse
          />
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

const SlavicNpcCard: React.FC<SlavicCharacter & WithUpdate> = (c) => {
  const { onCharacterUpdate } = c;
  const combatSkills = Object.fromEntries(
    SLAVIC_COMBAT_SKILLS.map((k) => [k, c.skills[k]]).filter(
      ([, v]) => (v as number) > 0,
    ),
  );

  // Build per-attribute damage tracks from attributeDamage vs attributes
  const attrTracks: {
    label: string;
    track: StatTrack;
    onChange?: (val: number) => void;
    inverse: boolean;
  }[] = (["Strength", "Agility", "Wits", "Empathy"] as const).map((attr) => ({
    label: attr,
    track: { current: c.attributeDamage[attr], max: c.attributes[attr] },
    onChange: onCharacterUpdate
      ? (val: number) =>
          onCharacterUpdate({
            ...c,
            attributeDamage: { ...c.attributeDamage, [attr]: val },
          })
      : undefined,
    inverse: true,
  }));

  return (
    <Box sx={cardBoxStyle}>
      <Typography variant="h5">{c.name}</Typography>
      <Typography variant="body2">
        {c.kin} — {c.calling}
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2} justifyContent="center">
        <Grid>
          <KeyValueList title="Attributes" entries={c.attributes} />
        </Grid>
        <Grid>
          <Box sx={skillsBoxStyle}>
            <KeyValueList title="Combat Skills" entries={combatSkills} />
          </Box>
        </Grid>
      </Grid>
      {c.weapons && c.weapons.length > 0 && (
        <TagList title="Weapons" items={c.weapons} />
      )}
      {c.armor && (
        <Typography variant="body2">
          Armor: {c.armor.name} (Rating {c.armor.rating})
        </Typography>
      )}
      {c.talents.length > 0 && <TagList title="Talents" items={c.talents} />}
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2} sx={trackGridStyle}>
        {attrTracks.map(({ label, track, onChange, inverse }) => (
          <Grid key={label}>
            <StatMeter
              label={label}
              track={track}
              onChange={onChange}
              inverse={inverse}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// =====================
// NpcCard dispatcher
// =====================

export const NpcCard: React.FC<CharacterProps & WithUpdate> = (props) => {
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
// NpcManager
// =====================

interface NpcManagerProps {
  onCreateNPCs?: () => void;
}

export const NpcManager: React.FC<NpcManagerProps> = ({ onCreateNPCs }) => {
  const gameType = useAppStore((s) => s.gameType);
  const missionId = useAppStore((s) => s.mission);
  const { characters, addCharacter, removeCharacter, openSheet: openCharacterSheet } =
    useCharacterStore();
  const npcs = characters.filter(
    (r) => r.isNpc && r.data.gameType === gameType,
  );
  const [pendingDeleteRecord, setPendingDeleteRecord] =
    useState<CharacterRecord | null>(null);
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [creating, setCreating] = useState(false);
  const showError = useNotificationStore((s) => s.showError);

  const handleCreate = useCallback(() => {
    setNameInput("");
    setNameDialogOpen(true);
  }, []);

  const cancelCreate = useCallback(() => {
    setNameDialogOpen(false);
    setNameInput("");
  }, []);

  const handleConfirmCreate = useCallback(async () => {
    const name = nameInput.trim();
    if (!name) return;

    setNameDialogOpen(false);
    setNameInput("");

    if (missionId === null) {
      const dummy = createNpcDummy(gameType, Date.now());
      if (dummy) {
        addCharacter({
          sheetId: null,
          isProtagonist: false,
          isNpc: true,
          data: { ...dummy, name },
        });
      }
      onCreateNPCs?.();
      return;
    }

    setCreating(true);
    try {
      const saved = await createNpc({ mission_id: missionId, name });
      addCharacter({
        sheetId: saved.character_sheet_id,
        isProtagonist: false,
        isNpc: true,
        data: saved.content,
      });
      onCreateNPCs?.();
    } catch (err) {
      console.error("Failed to create NPC:", err);
      showError(err instanceof Error ? err.message : "Failed to create NPC.");
    } finally {
      setCreating(false);
    }
  }, [nameInput, missionId, gameType, onCreateNPCs, showError, addCharacter]);

  const confirmDelete = useCallback(async () => {
    if (!pendingDeleteRecord) return;
    const { sheetId } = pendingDeleteRecord;
    if (sheetId !== null && missionId !== null) {
      try {
        await deleteCharacterSheet(sheetId, missionId);
      } catch (err) {
        console.error("Failed to delete NPC sheet:", err);
        showError(err instanceof Error ? err.message : "Failed to delete NPC.");
        setPendingDeleteRecord(null);
        return;
      }
    }
    removeCharacter(pendingDeleteRecord.data.id);
    setPendingDeleteRecord(null);
  }, [pendingDeleteRecord, missionId, showError, removeCharacter]);

  const cancelDelete = useCallback(() => setPendingDeleteRecord(null), []);

  const pendingName = pendingDeleteRecord?.data.name ?? "";

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
        disabled={creating}
        startIcon={
          creating ? (
            <CircularProgress size={14} />
          ) : (
            <PersonAddIcon sx={{ fontSize: "14px !important" }} />
          )
        }
        sx={{ width: "100%", justifyContent: "flex-start", mb: 0 }}
      >
        {creating ? "Generating NPC..." : "Create NPC"}
      </Button>

      <Box sx={[{ mt: 1 }, accordionGridStyle]}>
        {npcs.map((record) => (
          <Accordion key={record.sheetId ?? record.data.id}>
            <AccordionSummary
              aria-controls={`panel${record.data.id}-content`}
              id={`panel${record.data.id}-header`}
              sx={{
                "& .MuiAccordionSummary-content": { alignItems: "center" },
              }}
            >
              <Typography sx={{ flexGrow: 1 }}>{record.data.name}</Typography>
              <Box
                component="span"
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  openCharacterSheet(record.data.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    openCharacterSheet(record.data.id);
                  }
                }}
                sx={{
                  ml: 1,
                  cursor: "pointer",
                  color: alpha(theme.palette.primary.main, 0.5),
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: "50%",
                  padding: "4px",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <OpenInNewIcon fontSize="small" />
              </Box>
              <Box
                component="span"
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  setPendingDeleteRecord(record);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    setPendingDeleteRecord(record);
                  }
                }}
                sx={{
                  ml: 1,
                  cursor: "pointer",
                  color: alpha(theme.palette.primary.main, 0.5),
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: "50%",
                  padding: "4px",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <CloseIcon fontSize="small" />
              </Box>
            </AccordionSummary>
            <NpcCard {...record.data} />
          </Accordion>
        ))}
      </Box>

      <Dialog open={nameDialogOpen} onClose={cancelCreate}>
        <DialogTitle>Create NPC</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Name the new NPC. Their description, stats, and equipment will be
            generated from the mission's recent events.
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirmCreate();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelCreate}>Cancel</Button>
          <Button
            onClick={handleConfirmCreate}
            disabled={!nameInput.trim() || creating}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={pendingDeleteRecord !== null} onClose={cancelDelete}>
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
