import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  DragonlanceCharacter,
  DragonlanceWeapon,
} from "../../models/CharacterProps";
import { EquipmentType } from "../../models/Types";
import {
  SheetSection,
  FieldRow,
  NumInput,
  TextInput,
  ListEditor,
  TwoCol,
  EquipmentSuggestField,
} from "./shared";

interface Props {
  character: DragonlanceCharacter;
  onUpdate: (c: DragonlanceCharacter) => void;
}

const ABILITIES = [
  "Strength",
  "Dexterity",
  "Constitution",
  "Intelligence",
  "Wisdom",
  "Charisma",
] as const;
type Ability = (typeof ABILITIES)[number];

const SKILL_ABILITY: Record<string, Ability> = {
  Acrobatics: "Dexterity",
  "Animal Handling": "Wisdom",
  Arcana: "Intelligence",
  Athletics: "Strength",
  Deception: "Charisma",
  History: "Intelligence",
  Insight: "Wisdom",
  Intimidation: "Charisma",
  Investigation: "Intelligence",
  Medicine: "Wisdom",
  Nature: "Intelligence",
  Perception: "Wisdom",
  Performance: "Charisma",
  Persuasion: "Charisma",
  Religion: "Intelligence",
  "Sleight of Hand": "Dexterity",
  Stealth: "Dexterity",
  Survival: "Wisdom",
};

const SPELL_LEVELS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

const labelMinWidth = 130;

const abilityMod = (score: number) => Math.floor((score - 10) / 2);
const fmtMod = (n: number) => (n >= 0 ? `+${n}` : `${n}`);

function recomputeSkills(
  abilities: DragonlanceCharacter["abilities"],
  proficiencyBonus: number,
  proficiencies: Record<string, boolean> | undefined,
): Record<string, number> {
  return Object.fromEntries(
    Object.entries(SKILL_ABILITY).map(([skill, ability]) => [
      skill,
      abilityMod(abilities[ability]) +
        (proficiencies?.[skill] ? proficiencyBonus : 0),
    ]),
  );
}

function recomputeSavingThrows(
  abilities: DragonlanceCharacter["abilities"],
  proficiencyBonus: number,
  proficiencies: Record<string, boolean> | undefined,
): Record<string, number> {
  return Object.fromEntries(
    ABILITIES.map((ability) => [
      ability,
      abilityMod(abilities[ability]) +
        (proficiencies?.[ability] ? proficiencyBonus : 0),
    ]),
  );
}

function recomputeSpellcasting(
  spellcasting: DragonlanceCharacter["spellcasting"],
  abilities: DragonlanceCharacter["abilities"],
  proficiencyBonus: number,
): DragonlanceCharacter["spellcasting"] {
  if (!spellcasting.ability) return spellcasting;
  const mod = abilityMod(abilities[spellcasting.ability as Ability] ?? 10);
  return {
    ...spellcasting,
    saveDc: 8 + proficiencyBonus + mod,
    attackBonus: proficiencyBonus + mod,
  };
}

const DragonlanceSheet: React.FC<Props> = ({ character, onUpdate }) => {
  const [c, setC] = useState(character);

  const up = <K extends keyof DragonlanceCharacter>(
    k: K,
    v: DragonlanceCharacter[K],
  ) => {
    const next = { ...c, [k]: v };
    setC(next);
    onUpdate(next);
  };

  const upAbility = (ability: Ability, v: number) => {
    const abilities = { ...c.abilities, [ability]: v };
    const next = {
      ...c,
      abilities,
      skills: recomputeSkills(
        abilities,
        c.proficiencyBonus,
        c.skillProficiencies,
      ),
      savingThrows: recomputeSavingThrows(
        abilities,
        c.proficiencyBonus,
        c.savingThrowProficiencies,
      ),
      spellcasting: recomputeSpellcasting(
        c.spellcasting,
        abilities,
        c.proficiencyBonus,
      ),
    };
    setC(next);
    onUpdate(next);
  };

  const upProficiencyBonus = (v: number) => {
    const next = {
      ...c,
      proficiencyBonus: v,
      skills: recomputeSkills(c.abilities, v, c.skillProficiencies),
      savingThrows: recomputeSavingThrows(
        c.abilities,
        v,
        c.savingThrowProficiencies,
      ),
      spellcasting: recomputeSpellcasting(c.spellcasting, c.abilities, v),
    };
    setC(next);
    onUpdate(next);
  };

  const toggleSkillProficiency = (skill: string) => {
    const skillProficiencies = {
      ...c.skillProficiencies,
      [skill]: !c.skillProficiencies?.[skill],
    };
    const next = {
      ...c,
      skillProficiencies,
      skills: recomputeSkills(
        c.abilities,
        c.proficiencyBonus,
        skillProficiencies,
      ),
    };
    setC(next);
    onUpdate(next);
  };

  const toggleSaveProficiency = (ability: Ability) => {
    const savingThrowProficiencies = {
      ...c.savingThrowProficiencies,
      [ability]: !c.savingThrowProficiencies?.[ability],
    };
    const next = {
      ...c,
      savingThrowProficiencies,
      savingThrows: recomputeSavingThrows(
        c.abilities,
        c.proficiencyBonus,
        savingThrowProficiencies,
      ),
    };
    setC(next);
    onUpdate(next);
  };

  const upSpellcastingAbility = (ability: string) => {
    up(
      "spellcasting",
      recomputeSpellcasting(
        { ...c.spellcasting, ability: ability || null },
        c.abilities,
        c.proficiencyBonus,
      ),
    );
  };

  const upSpellSlot = (level: string, field: "current" | "max", v: number) => {
    const prev = c.spellcasting.spellSlots?.[level] ?? { current: 0, max: 0 };
    const spellSlots = {
      ...c.spellcasting.spellSlots,
      [level]: { ...prev, [field]: v },
    };
    up("spellcasting", { ...c.spellcasting, spellSlots });
  };

  const upWeapon = (i: number, patch: Partial<DragonlanceWeapon>) => {
    const weapons = [...c.weapons];
    weapons[i] = { ...weapons[i], ...patch };
    up("weapons", weapons);
  };

  const addWeapon = () =>
    up("weapons", [
      ...c.weapons,
      {
        name: "New Weapon",
        damage: "1d6",
        damageType: "Slashing",
        attackBonus: 0,
      },
    ]);

  const removeWeapon = (i: number) => {
    const weapons = [...c.weapons];
    weapons.splice(i, 1);
    up("weapons", weapons);
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* ── Identity ── */}
      <SheetSection title="Identity">
        <TwoCol
          leftFlex={2}
          left={
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
              <FieldRow label="Name" labelMinWidth={labelMinWidth}>
                <TextInput value={c.name} onChange={(v) => up("name", v)} />
              </FieldRow>
              <FieldRow label="Race" labelMinWidth={labelMinWidth}>
                <TextInput value={c.race} onChange={(v) => up("race", v)} />
              </FieldRow>
              <FieldRow label="Class & Level" labelMinWidth={labelMinWidth}>
                <TextInput
                  value={c.characterClass}
                  onChange={(v) => up("characterClass", v)}
                />
              </FieldRow>
              <FieldRow label="Background" labelMinWidth={labelMinWidth}>
                <TextInput
                  value={c.background}
                  onChange={(v) => up("background", v)}
                />
              </FieldRow>
              <FieldRow label="Alignment" labelMinWidth={labelMinWidth}>
                <TextInput
                  value={c.alignment ?? ""}
                  onChange={(v) => up("alignment", v)}
                  fullWidth={false}
                />
              </FieldRow>
            </Box>
          }
          right={
            <TextInput
              value={c.description}
              onChange={(v) => up("description", v)}
              multiline
              rows={6}
              label="Description, Personality, Backstory & Allies"
            />
          }
        />
      </SheetSection>

      <TwoCol
        left={
          <>
            {/* ── Ability Scores ── */}
            <SheetSection title="Ability Scores">
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 1.5,
                }}
              >
                {ABILITIES.map((ability) => (
                  <Box key={ability} sx={{ textAlign: "center" }}>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", display: "block" }}
                    >
                      {ability}
                    </Typography>
                    <NumInput
                      value={c.abilities[ability]}
                      onChange={(v) => upAbility(ability, v)}
                      min={1}
                      max={30}
                      width={64}
                    />
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mt: 0.25 }}
                    >
                      {fmtMod(abilityMod(c.abilities[ability]))}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </SheetSection>

            {/* ── Combat ── */}
            <SheetSection title="Combat">
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 0.5 }}>
                <FieldRow label="Proficiency">
                  <NumInput
                    value={c.proficiencyBonus}
                    onChange={upProficiencyBonus}
                    min={0}
                    max={10}
                  />
                </FieldRow>
                <FieldRow label="Armor Class">
                  <NumInput
                    value={c.armorClass}
                    onChange={(v) => up("armorClass", v)}
                    max={30}
                  />
                </FieldRow>
                <FieldRow label="Speed (ft)">
                  <NumInput
                    value={c.speed}
                    onChange={(v) => up("speed", v)}
                    max={120}
                  />
                </FieldRow>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Typography variant="body2">
                  Initiative: {fmtMod(abilityMod(c.abilities.Dexterity))}
                </Typography>
                <Typography variant="body2">
                  Passive Perception: {10 + (c.skills["Perception"] ?? 0)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  mt: 0.5,
                  flexWrap: "wrap",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={!!c.inspiration}
                      onChange={() => up("inspiration", !c.inspiration)}
                    />
                  }
                  label={<Typography variant="body2">Inspiration</Typography>}
                />
                <FieldRow label="Hit Dice">
                  <TextInput
                    value={c.hitDice ?? ""}
                    onChange={(v) => up("hitDice", v)}
                    fullWidth={false}
                  />
                </FieldRow>
              </Box>
            </SheetSection>

            {/* ── Hit Points ── */}
            <SheetSection title="Hit Points">
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <FieldRow label="Current">
                  <NumInput
                    value={c.hitPoints.current}
                    onChange={(v) =>
                      up("hitPoints", { ...c.hitPoints, current: v })
                    }
                    max={500}
                  />
                </FieldRow>
                <FieldRow label="Max">
                  <NumInput
                    value={c.hitPoints.max}
                    onChange={(v) =>
                      up("hitPoints", { ...c.hitPoints, max: v })
                    }
                    max={500}
                  />
                </FieldRow>
                <FieldRow label="Temp">
                  <NumInput
                    value={c.temporaryHitPoints ?? 0}
                    onChange={(v) => up("temporaryHitPoints", v)}
                    max={500}
                  />
                </FieldRow>
              </Box>
              <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
                <FieldRow label="Death Successes">
                  <NumInput
                    value={c.deathSaves?.successes ?? 0}
                    onChange={(v) =>
                      up("deathSaves", {
                        successes: v,
                        failures: c.deathSaves?.failures ?? 0,
                      })
                    }
                    min={0}
                    max={3}
                  />
                </FieldRow>
                <FieldRow label="Death Failures">
                  <NumInput
                    value={c.deathSaves?.failures ?? 0}
                    onChange={(v) =>
                      up("deathSaves", {
                        successes: c.deathSaves?.successes ?? 0,
                        failures: v,
                      })
                    }
                    min={0}
                    max={3}
                  />
                </FieldRow>
              </Box>
            </SheetSection>

            {/* ── Saving Throws ── */}
            <SheetSection title="Saving Throws">
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto 56px",
                  gap: 0.5,
                  alignItems: "center",
                }}
              >
                {ABILITIES.map((ability) => (
                  <React.Fragment key={ability}>
                    <Typography variant="body2">{ability}</Typography>
                    <Checkbox
                      size="small"
                      checked={!!c.savingThrowProficiencies?.[ability]}
                      onChange={() => toggleSaveProficiency(ability)}
                      sx={{ p: 0.25 }}
                    />
                    <NumInput
                      value={c.savingThrows?.[ability] ?? 0}
                      onChange={(v) =>
                        up("savingThrows", { ...c.savingThrows, [ability]: v })
                      }
                      min={-10}
                      max={20}
                    />
                  </React.Fragment>
                ))}
              </Box>
            </SheetSection>
          </>
        }
        right={
          <>
            {/* ── Skills ── */}
            <SheetSection title="Skills">
              <Box
                sx={{
                  maxHeight: 320,
                  overflowY: "auto",
                  display: "grid",
                  gridTemplateColumns: "1fr auto 76px",
                  gap: 0.5,
                  alignItems: "center",
                }}
              >
                {Object.entries(SKILL_ABILITY).map(([skill, ability]) => (
                  <React.Fragment key={skill}>
                    <Typography variant="body2">
                      {skill}{" "}
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        ({ability.slice(0, 3)})
                      </Typography>
                    </Typography>
                    <Checkbox
                      size="small"
                      checked={!!c.skillProficiencies?.[skill]}
                      onChange={() => toggleSkillProficiency(skill)}
                      sx={{ p: 0.25 }}
                    />
                    <NumInput
                      value={c.skills[skill] ?? 0}
                      onChange={(v) =>
                        up("skills", { ...c.skills, [skill]: v })
                      }
                      min={-10}
                      max={20}
                    />
                  </React.Fragment>
                ))}
              </Box>
            </SheetSection>

            {/* ── Attacks & Spellcasting ── */}
            <SheetSection title="Attacks">
              <EquipmentSuggestField
                gameType={c.gameType}
                equipmentType={EquipmentType.WEAPONS}
                onAdd={(item) =>
                  up("weapons", [
                    ...c.weapons,
                    {
                      name: item.name,
                      damage: item.damage ?? "1d4",
                      damageType: item.type ?? "Bludgeoning",
                      attackBonus: 0,
                    },
                  ])
                }
              />
              {c.weapons.map((w, i) => (
                <Box
                  key={i}
                  sx={{
                    mb: 1,
                    p: 1,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 0.5,
                      mb: 0.5,
                      alignItems: "center",
                    }}
                  >
                    <TextInput
                      value={w.name}
                      onChange={(v) => upWeapon(i, { name: v })}
                      label="Name"
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeWeapon(i)}
                      sx={{ p: 0.25 }}
                    >
                      ×
                    </IconButton>
                  </Box>
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    <FieldRow label="Atk Bonus">
                      <NumInput
                        value={w.attackBonus}
                        onChange={(v) => upWeapon(i, { attackBonus: v })}
                        min={-5}
                        max={20}
                      />
                    </FieldRow>
                    <FieldRow label="Damage">
                      <TextInput
                        value={w.damage}
                        onChange={(v) => upWeapon(i, { damage: v })}
                        fullWidth={false}
                      />
                    </FieldRow>
                    <FieldRow label="Type">
                      <TextInput
                        value={w.damageType}
                        onChange={(v) => upWeapon(i, { damageType: v })}
                        fullWidth={false}
                      />
                    </FieldRow>
                    <FieldRow label="Range (ft)">
                      <NumInput
                        value={w.rangeFt ?? 0}
                        onChange={(v) => upWeapon(i, { rangeFt: v })}
                        max={600}
                      />
                    </FieldRow>
                  </Box>
                </Box>
              ))}
              <IconButton size="small" onClick={addWeapon}>
                <AddIcon fontSize="small" />
              </IconButton>
            </SheetSection>

            {/* ── Equipment ── */}
            <SheetSection title="Equipment">
              <EquipmentSuggestField
                gameType={c.gameType}
                equipmentType={EquipmentType.ARMOR}
                placeholder="Search armor/shields to add..."
                onAdd={(item) => up("armorName", item.name)}
              />
              <FieldRow label="Armor">
                <TextInput
                  value={c.armorName ?? ""}
                  onChange={(v) => up("armorName", v || null)}
                />
              </FieldRow>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={c.shield}
                    onChange={() => up("shield", !c.shield)}
                  />
                }
                label={<Typography variant="body2">Shield</Typography>}
              />
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Gear
              </Typography>
              <EquipmentSuggestField
                gameType={c.gameType}
                equipmentType={EquipmentType.GEAR}
                onAdd={(item) => up("gear", [...c.gear, item.name])}
              />
              <Box sx={{ mt: 0.5 }}>
                <ListEditor
                  value={c.gear}
                  onChange={(v) => up("gear", v)}
                  rows={3}
                />
              </Box>
            </SheetSection>

            {/* ── Spellcasting ── */}
            <SheetSection title="Spellcasting">
              <FieldRow label="Ability">
                <TextInput
                  value={c.spellcasting.ability ?? ""}
                  onChange={upSpellcastingAbility}
                  fullWidth={false}
                  placeholder="Intelligence / Wisdom / Charisma"
                />
              </FieldRow>
              <Box sx={{ display: "flex", gap: 2, mb: 0.5 }}>
                <FieldRow label="Save DC">
                  <Typography variant="body2">
                    {c.spellcasting.saveDc ?? "—"}
                  </Typography>
                </FieldRow>
                <FieldRow label="Attack Bonus">
                  <Typography variant="body2">
                    {c.spellcasting.attackBonus != null
                      ? fmtMod(c.spellcasting.attackBonus)
                      : "—"}
                  </Typography>
                </FieldRow>
              </Box>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Cantrips
              </Typography>
              <ListEditor
                value={c.spellcasting.cantrips ?? []}
                onChange={(v) =>
                  up("spellcasting", { ...c.spellcasting, cantrips: v })
                }
                rows={2}
              />
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", display: "block", mt: 0.75 }}
              >
                Known Spells
              </Typography>
              <ListEditor
                value={c.spellcasting.knownSpells}
                onChange={(v) =>
                  up("spellcasting", { ...c.spellcasting, knownSpells: v })
                }
                rows={3}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  display: "block",
                  mt: 0.75,
                  mb: 0.5,
                }}
              >
                Spell Slots (current / max)
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 1,
                }}
              >
                {SPELL_LEVELS.map((lvl) => {
                  const slot = c.spellcasting.spellSlots?.[lvl] ?? {
                    current: 0,
                    max: 0,
                  };
                  return (
                    <Box
                      key={lvl}
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography variant="caption" sx={{ minWidth: 12 }}>
                        {lvl}
                      </Typography>
                      <NumInput
                        value={slot.current}
                        onChange={(v) => upSpellSlot(lvl, "current", v)}
                        max={20}
                        width={62}
                      />
                      <Typography variant="caption">/</Typography>
                      <NumInput
                        value={slot.max}
                        onChange={(v) => upSpellSlot(lvl, "max", v)}
                        max={20}
                        width={62}
                      />
                    </Box>
                  );
                })}
              </Box>
            </SheetSection>

            {/* ── Features & Proficiencies ── */}
            <SheetSection title="Features & Traits">
              <ListEditor
                value={c.featuresAndTraits ?? []}
                onChange={(v) => up("featuresAndTraits", v)}
                rows={4}
              />
            </SheetSection>
            <SheetSection title="Other Proficiencies & Languages">
              <ListEditor
                value={c.proficienciesAndLanguages ?? []}
                onChange={(v) => up("proficienciesAndLanguages", v)}
                rows={3}
              />
            </SheetSection>
          </>
        }
      />

      {/* ── Notes ── */}
      <SheetSection title="Notes">
        <TextInput
          value={c.notes ?? ""}
          onChange={(v) => up("notes", v)}
          multiline
          rows={4}
        />
      </SheetSection>
    </Box>
  );
};

export default DragonlanceSheet;
