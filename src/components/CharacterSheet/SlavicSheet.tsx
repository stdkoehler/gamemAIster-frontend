import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { SlavicCharacter } from "../../models/CharacterProps";
import {
  SheetSection, FieldRow, NumInput, TextInput, DotRating,
  ListEditor, TwoCol, ChipListEditor,
} from "./shared";

interface Props {
  character: SlavicCharacter;
  onUpdate: (c: SlavicCharacter) => void;
}

const ATTRS = ["Strength", "Agility", "Wits", "Empathy"] as const;

const SKILLS_BY_ATTR: Record<string, (keyof SlavicCharacter["skills"])[]> = {
  Strength: ["Endurance", "Fight"],
  Agility: ["Sneak", "Move", "Marksmanship"],
  Wits: ["Scout", "Lore", "Survival", "Craft"],
  Empathy: ["Insight", "Manipulation", "Healing", "Performance"],
};

const SlavicSheet: React.FC<Props> = ({ character, onUpdate }) => {
  const [c, setC] = useState(character);

  const up = <K extends keyof SlavicCharacter>(k: K, v: SlavicCharacter[K]) => {
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

  const upSkill = (k: keyof SlavicCharacter["skills"], v: number) => {
    const next = { ...c, skills: { ...c.skills, [k]: v } };
    setC(next);
    onUpdate(next);
  };

  const upWyrd = (field: "current" | "max", v: number) => {
    const next = { ...c, wyrd: { ...(c.wyrd ?? { current: 0, max: 0 }), [field]: v } };
    setC(next);
    onUpdate(next);
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* ── Identity ── */}
      <SheetSection title="Identity">
        <TwoCol
          leftFlex={2}
          left={
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
              <FieldRow label="Name">
                <TextInput value={c.name} onChange={(v) => up("name", v)} />
              </FieldRow>
              <FieldRow label="Kin">
                <TextInput value={c.kin} onChange={(v) => up("kin", v)} />
              </FieldRow>
              <FieldRow label="Kin Ability">
                <TextInput value={c.kinAbility} onChange={(v) => up("kinAbility", v)} />
              </FieldRow>
              <FieldRow label="Calling">
                <TextInput value={c.calling} onChange={(v) => up("calling", v)} />
              </FieldRow>
              <FieldRow label="Age">
                <TextInput value={c.age ?? ""} onChange={(v) => up("age", v)} />
              </FieldRow>
              <FieldRow label="Experience">
                <NumInput value={c.experience ?? 0} onChange={(v) => up("experience", v)} max={9999} width={80} />
              </FieldRow>
            </Box>
          }
          right={
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
              <TextInput
                value={c.description}
                onChange={(v) => up("description", v)}
                multiline rows={3}
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

      {/* ── Attributes & Damage Tracks ── */}
      <SheetSection title="Attributes & Damage">
        <Box sx={{ display: "flex", gap: 2 }}>
          {ATTRS.map((attr) => (
            <Box key={attr} sx={{ flex: 1, textAlign: "center" }}>
              <Typography variant="caption" sx={{ fontWeight: "bold", display: "block", mb: 0.5, color: "primary.light" }}>
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
              <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.25 }}>
                Max: {c.attributes[attr]}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.25 }}>
                Current:
              </Typography>
              <NumInput
                value={c.attributeDamage[attr]}
                onChange={(v) => upDmg(attr, Math.min(v, c.attributes[attr]))}
                min={0}
                max={c.attributes[attr]}
              />
              <Typography variant="caption" sx={{ color: "error.main", display: "block", mt: 0.25, fontSize: "0.65rem" }}>
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
                    sx={{ fontWeight: "bold", color: "primary.light", display: "block", mb: 0.25 }}
                  >
                    {attr}
                  </Typography>
                  {SKILLS_BY_ATTR[attr].map((skill) => (
                    <Box key={skill} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.25 }}>
                      <Typography variant="body2" sx={{ fontSize: "0.75rem", mr: 1 }}>{skill}</Typography>
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

            {/* ── Wyrd ── */}
            {c.wyrd !== undefined && (
              <SheetSection title="Wyrd (Spiritual Power)">
                <Box sx={{ display: "flex", gap: 2 }}>
                  <FieldRow label="Current">
                    <NumInput value={c.wyrd!.current} onChange={(v) => upWyrd("current", v)} max={10} />
                  </FieldRow>
                  <FieldRow label="Max">
                    <NumInput value={c.wyrd!.max} onChange={(v) => upWyrd("max", v)} max={10} />
                  </FieldRow>
                </Box>
              </SheetSection>
            )}
          </>
        }
        right={
          <>
            {/* ── Talents ── */}
            <SheetSection title="Talents">
              <ChipListEditor value={c.talents} onChange={(v) => up("talents", v)} />
            </SheetSection>

            {/* ── Weapons ── */}
            <SheetSection title="Weapons">
              <ListEditor value={c.weapons ?? []} onChange={(v) => up("weapons", v)} rows={3} />
            </SheetSection>

            {/* ── Armor ── */}
            <SheetSection title="Armor">
              <FieldRow label="Name">
                <TextInput
                  value={c.armor?.name ?? ""}
                  onChange={(v) => up("armor", { ...(c.armor ?? { name: "", rating: 0 }), name: v })}
                />
              </FieldRow>
              <FieldRow label="Rating">
                <NumInput
                  value={c.armor?.rating ?? 0}
                  onChange={(v) => up("armor", { ...(c.armor ?? { name: "", rating: 0 }), rating: v })}
                  max={10}
                />
              </FieldRow>
            </SheetSection>

            {/* ── Gear ── */}
            <SheetSection title="Gear">
              <ListEditor value={c.gear ?? []} onChange={(v) => up("gear", v)} rows={3} />
            </SheetSection>

            {/* ── Relationships ── */}
            <SheetSection title="Relationships & Bonds">
              <ListEditor value={c.relationships ?? []} onChange={(v) => up("relationships", v)} rows={3} />
            </SheetSection>
          </>
        }
      />
    </Box>
  );
};

export default SlavicSheet;
