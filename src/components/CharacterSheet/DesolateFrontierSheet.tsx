import React, { useState } from "react";
import { Box, Typography, IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  DesolateFrontierCharacter,
  DesolateFrontierWeapon,
  DesolateFrontierBounty,
} from "../../models/CharacterProps";
import { EquipmentType } from "../../models/Types";
import {
  SheetSection,
  FieldRow,
  NumInput,
  TextInput,
  DotRating,
  ListEditor,
  TwoCol,
  ChipListEditor,
  EquipmentSuggestField,
  parseCatalogNumber,
} from "./shared";

interface Props {
  character: DesolateFrontierCharacter;
  onUpdate: (c: DesolateFrontierCharacter) => void;
}

const labelMinWidth = 130;

const ATTRS = ["Strength", "Agility", "Wits", "Empathy"] as const;

// The Damned Frontier's custom 16-skill list, 4 per attribute (ruleset §1).
const SKILLS_BY_ATTR: Record<
  string,
  (keyof DesolateFrontierCharacter["skills"])[]
> = {
  Strength: ["Melee", "Endurance", "Labor", "Intimidation"],
  Agility: ["Shooting", "Riding", "Sleight of Hand", "Move"],
  Wits: ["Tracking", "Survival", "Gambling", "Repair"],
  Empathy: ["Persuasion", "Leadership", "Animal Handling", "Healing"],
};

const ReputationAdder: React.FC<{ onAdd: (tag: string) => void }> = ({
  onAdd,
}) => {
  const [tag, setTag] = useState("");
  const add = () => {
    const trimmed = tag.trim();
    if (trimmed) {
      onAdd(trimmed);
      setTag("");
    }
  };
  return (
    <Box sx={{ display: "flex", gap: 0.5 }}>
      <TextField
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add();
          }
        }}
        size="small"
        placeholder="Add tag (e.g. Lawman)..."
        sx={{ flex: 1 }}
      />
      <IconButton size="small" onClick={add}>
        <AddIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

const DesolateFrontierSheet: React.FC<Props> = ({ character, onUpdate }) => {
  const [c, setC] = useState(character);

  const up = <K extends keyof DesolateFrontierCharacter>(
    k: K,
    v: DesolateFrontierCharacter[K],
  ) => {
    const next = { ...c, [k]: v };
    setC(next);
    onUpdate(next);
  };

  const upAttr = (k: (typeof ATTRS)[number], v: number) => {
    const next = { ...c, attributes: { ...c.attributes, [k]: v } };
    setC(next);
    onUpdate(next);
  };

  const upDmg = (k: (typeof ATTRS)[number], v: number) => {
    const next = { ...c, attributeDamage: { ...c.attributeDamage, [k]: v } };
    setC(next);
    onUpdate(next);
  };

  const upSkill = (k: keyof DesolateFrontierCharacter["skills"], v: number) => {
    const next = { ...c, skills: { ...c.skills, [k]: v } };
    setC(next);
    onUpdate(next);
  };

  const upWillpower = (field: "current" | "max", v: number) => {
    const next = {
      ...c,
      willpower: { ...(c.willpower ?? { current: 0, max: 0 }), [field]: v },
    };
    setC(next);
    onUpdate(next);
  };

  const upBountyAmount = (v: number) => {
    const next: DesolateFrontierBounty = {
      ...(c.bounty ?? { amount: 0, level: "Minor" }),
      amount: v,
    };
    up("bounty", next);
  };

  const upBountyLevel = (v: DesolateFrontierBounty["level"]) => {
    const next: DesolateFrontierBounty = {
      ...(c.bounty ?? { amount: 0, level: "Minor" }),
      level: v,
    };
    up("bounty", next);
  };

  const upReputation = (tag: string, level: number | null) => {
    const next = { ...(c.reputation ?? {}) };
    if (level === null) {
      delete next[tag];
    } else {
      next[tag] = level;
    }
    up("reputation", next);
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
              <FieldRow label="Origin" labelMinWidth={labelMinWidth}>
                <TextInput value={c.origin} onChange={(v) => up("origin", v)} />
              </FieldRow>
              <FieldRow label="Origin Ability" labelMinWidth={labelMinWidth}>
                <TextInput
                  value={c.originAbility}
                  onChange={(v) => up("originAbility", v)}
                />
              </FieldRow>
              <FieldRow label="Profession" labelMinWidth={labelMinWidth}>
                <TextInput
                  value={c.profession}
                  onChange={(v) => up("profession", v)}
                />
              </FieldRow>
              <FieldRow label="Age" labelMinWidth={labelMinWidth}>
                <TextInput value={c.age ?? ""} onChange={(v) => up("age", v)} />
              </FieldRow>
            </Box>
          }
          right={
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
              <TextInput
                value={c.description}
                onChange={(v) => up("description", v)}
                multiline
                rows={4}
                label="Description"
              />
              <TextInput
                value={c.pride ?? ""}
                onChange={(v) => up("pride", v)}
                label="Pride"
              />
              <TextInput
                value={c.darkSecret ?? ""}
                onChange={(v) => up("darkSecret", v)}
                label="Dark Secret"
              />
            </Box>
          }
        />
      </SheetSection>

      {/* ── Resources (currency & experience — kept prominent, right below Identity) ── */}
      <SheetSection title="Resources">
        <Box sx={{ display: "flex", gap: 2 }}>
          <FieldRow label="Experience" labelMinWidth={labelMinWidth}>
            <NumInput
              value={c.experience ?? 0}
              onChange={(v) => up("experience", v)}
              max={9999}
              width={80}
            />
          </FieldRow>
          <FieldRow label="Cash ($)" labelMinWidth={labelMinWidth}>
            <NumInput
              value={c.cash ?? 0}
              onChange={(v) => up("cash", v)}
              max={999999}
              float
              width={90}
            />
          </FieldRow>
        </Box>
      </SheetSection>

      {/* ── Attributes & Damage Tracks ── */}
      <SheetSection title="Attributes & Damage">
        <Box sx={{ display: "flex", gap: 2 }}>
          {ATTRS.map((attr) => (
            <Box key={attr} sx={{ flex: 1, textAlign: "center" }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: "bold",
                  display: "block",
                  mb: 0.5,
                  color: "primary.light",
                }}
              >
                {attr}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 0.5 }}>
                <DotRating
                  value={c.attributes[attr]}
                  max={5}
                  size={12}
                  onChange={(n) => upAttr(attr, n)}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", display: "block", mb: 0.25 }}
              >
                Max: {c.attributes[attr]}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", display: "block", mb: 0.25 }}
              >
                Current:
              </Typography>
              <NumInput
                value={c.attributeDamage[attr]}
                onChange={(v) => upDmg(attr, Math.min(v, c.attributes[attr]))}
                min={0}
                max={c.attributes[attr]}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "error.main",
                  display: "block",
                  mt: 0.25,
                  fontSize: "0.65rem",
                }}
              >
                {c.attributeDamage[attr] === 0 ? "BROKEN" : ""}
              </Typography>
            </Box>
          ))}
        </Box>
      </SheetSection>

      <TwoCol
        left={
          <>
            {/* ── Skills (grouped by attribute) ── */}
            <SheetSection title="Skills">
              {ATTRS.map((attr) => (
                <Box key={attr} sx={{ mb: 1.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: "bold",
                      color: "primary.light",
                      display: "block",
                      mb: 0.25,
                    }}
                  >
                    {attr}
                  </Typography>
                  {SKILLS_BY_ATTR[attr].map((skill) => (
                    <Box
                      key={skill}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 0.25,
                      }}
                    >
                      <Typography variant="body2">{skill}</Typography>
                      <DotRating
                        value={c.skills[skill]}
                        max={5}
                        onChange={(n) => upSkill(skill, n)}
                      />
                    </Box>
                  ))}
                </Box>
              ))}
            </SheetSection>

            {/* ── Willpower (fuels Grit/Luck/Faith, ruleset §8) ── */}
            {c.willpower !== undefined && (
              <SheetSection title="Willpower">
                <Box sx={{ display: "flex", gap: 2 }}>
                  <FieldRow label="Current">
                    <NumInput
                      value={c.willpower!.current}
                      onChange={(v) => upWillpower("current", v)}
                      max={10}
                    />
                  </FieldRow>
                  <FieldRow label="Max">
                    <NumInput
                      value={c.willpower!.max}
                      onChange={(v) => upWillpower("max", v)}
                      max={10}
                    />
                  </FieldRow>
                </Box>
              </SheetSection>
            )}

            {/* ── Reputation & Bounty (ruleset §10) ── */}
            <SheetSection title="Reputation & Bounty">
              {Object.entries(c.reputation ?? {}).map(([tag, level]) => (
                <Box
                  key={tag}
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
                >
                  <Typography variant="body2" sx={{ flex: 1, minWidth: 0 }}>
                    {tag}
                  </Typography>
                  <NumInput
                    value={level}
                    onChange={(v) => upReputation(tag, v)}
                    min={-2}
                    max={2}
                    width={56}
                  />
                  <IconButton
                    size="small"
                    onClick={() => upReputation(tag, null)}
                    sx={{ p: 0.25 }}
                  >
                    ×
                  </IconButton>
                </Box>
              ))}
              <ReputationAdder onAdd={(tag) => upReputation(tag, 1)} />
              <Box sx={{ display: "flex", gap: 2, mt: 1.5, alignItems: "center" }}>
                <FieldRow label="Bounty ($)">
                  <NumInput
                    value={c.bounty?.amount ?? 0}
                    onChange={upBountyAmount}
                    max={999999}
                    width={90}
                  />
                </FieldRow>
                <FieldRow label="Level">
                  <TextInput
                    value={c.bounty?.level ?? ""}
                    onChange={(v) =>
                      upBountyLevel(v as DesolateFrontierBounty["level"])
                    }
                    fullWidth={false}
                  />
                </FieldRow>
              </Box>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", display: "block", mt: 0.5 }}
              >
                Reputation: -2/-1/1/2 = Extreme Negative/Negative/Positive/
                Extreme Positive. Bounty level: Minor/Moderate/Major/Legendary.
              </Typography>
            </SheetSection>
          </>
        }
        right={
          <>
            {/* ── Talents ── */}
            <SheetSection title="Talents">
              <ChipListEditor
                value={c.talents}
                onChange={(v) => up("talents", v)}
              />
            </SheetSection>

            {/* ── Weapons ── */}
            <SheetSection title="Weapons">
              <EquipmentSuggestField
                gameType={c.gameType}
                equipmentType={EquipmentType.WEAPONS}
                onAdd={(item) =>
                  up("weapons", [
                    ...(c.weapons ?? []),
                    {
                      name: item.name,
                      grip: "1H",
                      damage: parseCatalogNumber(item.damage, 1),
                      range: "Arm's Length",
                    },
                  ])
                }
              />
              {(c.weapons ?? []).map((w, i) => (
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
                  <Box sx={{ display: "flex", gap: 0.5, mb: 0.5 }}>
                    <TextInput
                      value={w.name}
                      onChange={(v) => {
                        const ws = [...(c.weapons ?? [])];
                        ws[i] = { ...ws[i], name: v };
                        up("weapons", ws);
                      }}
                      label="Name"
                    />
                    <IconButton
                      size="small"
                      onClick={() => {
                        const ws = [...(c.weapons ?? [])];
                        ws.splice(i, 1);
                        up("weapons", ws);
                      }}
                      sx={{ p: 0.25 }}
                    >
                      ×
                    </IconButton>
                  </Box>
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    <FieldRow label="Grip">
                      <TextInput
                        value={w.grip}
                        onChange={(v) => {
                          const ws = [...(c.weapons ?? [])];
                          ws[i] = { ...ws[i], grip: v as "1H" | "2H" };
                          up("weapons", ws);
                        }}
                        fullWidth={false}
                      />
                    </FieldRow>
                    <FieldRow label="Damage">
                      <NumInput
                        value={w.damage}
                        onChange={(v) => {
                          const ws = [...(c.weapons ?? [])];
                          ws[i] = { ...ws[i], damage: v };
                          up("weapons", ws);
                        }}
                        max={6}
                        width={56}
                      />
                    </FieldRow>
                    <FieldRow label="Range">
                      <TextInput
                        value={w.range}
                        onChange={(v) => {
                          const ws = [...(c.weapons ?? [])];
                          ws[i] = {
                            ...ws[i],
                            range: v as DesolateFrontierWeapon["range"],
                          };
                          up("weapons", ws);
                        }}
                        fullWidth={false}
                      />
                    </FieldRow>
                  </Box>
                </Box>
              ))}
              <IconButton
                size="small"
                onClick={() =>
                  up("weapons", [
                    ...(c.weapons ?? []),
                    {
                      name: "New Weapon",
                      grip: "1H",
                      damage: 1,
                      range: "Arm's Length",
                    },
                  ])
                }
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </SheetSection>

            {/* ── Armor ── */}
            <SheetSection title="Armor">
              <EquipmentSuggestField
                gameType={c.gameType}
                equipmentType={EquipmentType.ARMOR}
                onAdd={(item) => {
                  const rating = parseCatalogNumber(item.damage, 0);
                  up("armor", { name: item.name, rating: { current: rating, max: rating } });
                }}
              />
              <FieldRow label="Name">
                <TextInput
                  value={c.armor?.name ?? ""}
                  onChange={(v) =>
                    up("armor", {
                      ...(c.armor ?? {
                        name: "",
                        rating: { current: 0, max: 0 },
                      }),
                      name: v,
                    })
                  }
                />
              </FieldRow>
              <FieldRow label="Rating (current / max)">
                <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                  <NumInput
                    value={c.armor?.rating?.current ?? 0}
                    onChange={(v) =>
                      up("armor", {
                        ...(c.armor ?? {
                          name: "",
                          rating: { current: 0, max: 0 },
                        }),
                        rating: {
                          ...(c.armor?.rating ?? { current: 0, max: 0 }),
                          current: v,
                        },
                      })
                    }
                    max={10}
                  />
                  <Typography variant="caption">/</Typography>
                  <NumInput
                    value={c.armor?.rating?.max ?? 0}
                    onChange={(v) =>
                      up("armor", {
                        ...(c.armor ?? {
                          name: "",
                          rating: { current: 0, max: 0 },
                        }),
                        rating: {
                          ...(c.armor?.rating ?? { current: 0, max: 0 }),
                          max: v,
                        },
                      })
                    }
                    max={10}
                  />
                </Box>
              </FieldRow>
            </SheetSection>

            {/* ── Gear ── */}
            <SheetSection title="Gear">
              <EquipmentSuggestField
                gameType={c.gameType}
                equipmentType={EquipmentType.GEAR}
                onAdd={(item) => up("gear", [...(c.gear ?? []), item.name])}
              />
              <Box sx={{ mt: 0.5 }}>
                <ListEditor
                  value={c.gear ?? []}
                  onChange={(v) => up("gear", v)}
                  rows={3}
                />
              </Box>
            </SheetSection>

            {/* ── Relationships ── */}
            <SheetSection title="Relationships & Bonds">
              <ListEditor
                value={c.relationships ?? []}
                onChange={(v) => up("relationships", v)}
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

export default DesolateFrontierSheet;
