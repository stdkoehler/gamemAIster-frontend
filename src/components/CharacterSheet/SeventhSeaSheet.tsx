import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  SeventhSeaCharacter,
  SeventhSeaWeapon,
} from "../../models/CharacterProps";
import {
  SheetSection,
  FieldRow,
  NumInput,
  TextInput,
  DotRating,
  ListEditor,
  TwoCol,
  ChipListEditor,
} from "./shared";

interface Props {
  character: SeventhSeaCharacter;
  onUpdate: (c: SeventhSeaCharacter) => void;
}

const TRAITS = ["Brawn", "Finesse", "Resolve", "Wits", "Panache"] as const;
const SKILL_COL1 = [
  "Aim",
  "Athletics",
  "Brawl",
  "Convince",
  "Empathy",
] as const;
const SKILL_COL2 = ["Hide", "Intimidate", "Notice", "Perform", "Ride"] as const;
const SKILL_COL3 = [
  "Sailing",
  "Tempt",
  "Theft",
  "Warfare",
  "Weaponry",
] as const;

const SeventhSeaSheet: React.FC<Props> = ({ character, onUpdate }) => {
  const [c, setC] = useState(character);

  const up = <K extends keyof SeventhSeaCharacter>(
    k: K,
    v: SeventhSeaCharacter[K],
  ) => {
    const next = { ...c, [k]: v };
    setC(next);
    onUpdate(next);
  };

  const upTrait = (k: keyof SeventhSeaCharacter["traits"], v: number) => {
    const next = { ...c, traits: { ...c.traits, [k]: v } };
    setC(next);
    onUpdate(next);
  };

  const upSkill = (k: keyof SeventhSeaCharacter["skills"], v: number) => {
    const next = { ...c, skills: { ...c.skills, [k]: v } };
    setC(next);
    onUpdate(next);
  };

  const upWounds = (field: "current" | "max", v: number) => {
    const next = { ...c, wounds: { ...c.wounds, [field]: v } };
    setC(next);
    onUpdate(next);
  };

  const upWeapon = (i: number, patch: Partial<SeventhSeaWeapon>) => {
    const ws = [...(c.weapons ?? [])];
    ws[i] = { ...ws[i], ...patch };
    up("weapons", ws);
  };

  const SkillCol: React.FC<{
    keys: readonly (keyof SeventhSeaCharacter["skills"])[];
  }> = ({ keys }) => (
    <Box>
      {keys.map((k) => (
        <Box
          key={k}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 0.35,
          }}
        >
          <Typography variant="body2" sx={{ mr: 2, fontSize: "0.95rem" }}>
            {k}
          </Typography>
          <DotRating value={c.skills[k]} onChange={(n) => upSkill(k, n)} />
        </Box>
      ))}
    </Box>
  );

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
              <FieldRow label="Nation">
                <TextInput value={c.nation} onChange={(v) => up("nation", v)} />
              </FieldRow>
              <FieldRow label="Religion">
                <TextInput
                  value={c.religion ?? ""}
                  onChange={(v) => up("religion", v)}
                />
              </FieldRow>
              <FieldRow label="Virtue">
                <TextInput
                  value={c.arcana.virtue}
                  onChange={(v) => up("arcana", { ...c.arcana, virtue: v })}
                />
              </FieldRow>
              <FieldRow label="Hubris">
                <TextInput
                  value={c.arcana.hubris}
                  onChange={(v) => up("arcana", { ...c.arcana, hubris: v })}
                />
              </FieldRow>
              <Box sx={{ display: "flex", gap: 2 }}>
                <FieldRow label="Reputation">
                  <NumInput
                    value={c.reputation ?? 0}
                    onChange={(v) => up("reputation", v)}
                    min={-10}
                    max={20}
                    width={72}
                  />
                </FieldRow>
                <FieldRow label="Corruption">
                  <NumInput
                    value={c.corruption ?? 0}
                    onChange={(v) => up("corruption", v)}
                    max={10}
                  />
                </FieldRow>
                <FieldRow label="Wealth">
                  <DotRating
                    value={c.wealth ?? 0}
                    max={5}
                    onChange={(v) => up("wealth", v)}
                  />
                </FieldRow>
              </Box>
            </Box>
          }
          right={
            <TextInput
              value={c.description}
              onChange={(v) => up("description", v)}
              multiline
              rows={6}
              label="Description / Background"
            />
          }
        />
      </SheetSection>

      {/* ── Traits ── */}
      <SheetSection title="Traits">
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          {TRAITS.map((t) => (
            <Box key={t} sx={{ textAlign: "center" }}>
              <Typography
                variant="caption"
                sx={{ display: "block", fontWeight: "bold", mb: 0.5 }}
              >
                {t}
              </Typography>
              <DotRating
                value={c.traits[t]}
                onChange={(n) => upTrait(t, n)}
                size={14}
              />
            </Box>
          ))}
        </Box>
      </SheetSection>

      {/* ── Skills ── */}
      <SheetSection title="Skills">
        <Box sx={{ display: "flex", gap: 3 }}>
          <SkillCol keys={SKILL_COL1} />
          <SkillCol keys={SKILL_COL2} />
          <SkillCol keys={SKILL_COL3} />
        </Box>
      </SheetSection>

      <TwoCol
        left={
          <>
            {/* ── Advantages ── */}
            <SheetSection title="Advantages">
              <ChipListEditor
                value={c.advantages}
                onChange={(v) => up("advantages", v)}
              />
            </SheetSection>

            {/* ── Special ── */}
            <SheetSection title="Special Abilities">
              {c.duelingStyle !== undefined && (
                <FieldRow label="Dueling Style">
                  <TextInput
                    value={c.duelingStyle ?? ""}
                    onChange={(v) => up("duelingStyle", v)}
                  />
                </FieldRow>
              )}
              {c.sorcery && (
                <Box sx={{ mb: 1 }}>
                  <FieldRow label="Sorcery Type">
                    <TextInput
                      value={c.sorcery.type}
                      onChange={(v) =>
                        up("sorcery", { ...c.sorcery!, type: v })
                      }
                    />
                  </FieldRow>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Knacks
                  </Typography>
                  <ListEditor
                    value={c.sorcery.knacks}
                    onChange={(v) =>
                      up("sorcery", { ...c.sorcery!, knacks: v })
                    }
                    rows={2}
                  />
                </Box>
              )}
              {c.secretSociety && (
                <Box sx={{ mb: 0.5 }}>
                  <FieldRow label="Secret Society">
                    <TextInput
                      value={c.secretSociety.name}
                      onChange={(v) =>
                        up("secretSociety", { ...c.secretSociety!, name: v })
                      }
                    />
                  </FieldRow>
                  <FieldRow label="Rank">
                    <TextInput
                      value={c.secretSociety.rank}
                      onChange={(v) =>
                        up("secretSociety", { ...c.secretSociety!, rank: v })
                      }
                    />
                  </FieldRow>
                </Box>
              )}
            </SheetSection>

            {/* ── Languages ── */}
            <SheetSection title="Languages">
              <ChipListEditor
                value={c.languages ?? []}
                onChange={(v) => up("languages", v)}
              />
            </SheetSection>

            {/* ── Backgrounds ── */}
            <SheetSection title="Backgrounds">
              <ChipListEditor
                value={c.backgrounds ?? []}
                onChange={(v) => up("backgrounds", v)}
              />
            </SheetSection>

            {/* ── Stories & Goals ── */}
            <SheetSection title="Stories & Goals">
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Stories
              </Typography>
              <ListEditor
                value={c.stories ?? []}
                onChange={(v) => up("stories", v)}
                rows={2}
              />
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Goals
                </Typography>
                <ListEditor
                  value={c.goals ?? []}
                  onChange={(v) => up("goals", v)}
                  rows={2}
                />
              </Box>
            </SheetSection>
          </>
        }
        right={
          <>
            {/* ── Combat State ── */}
            <SheetSection title="Combat State">
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Wounds (Helpless at max = Resolve trait)
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
                <FieldRow label="Current">
                  <NumInput
                    value={c.wounds.current}
                    onChange={(v) => upWounds("current", v)}
                    max={30}
                  />
                </FieldRow>
                <FieldRow label="Max">
                  <NumInput
                    value={c.wounds.max}
                    onChange={(v) => upWounds("max", v)}
                    max={30}
                  />
                </FieldRow>
              </Box>
              <FieldRow label="Hero Points">
                <NumInput
                  value={c.heroPoints}
                  onChange={(v) => up("heroPoints", v)}
                  max={20}
                />
              </FieldRow>
            </SheetSection>

            {/* ── Weapons ── */}
            <SheetSection title="Weapons">
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
                      onChange={(v) => upWeapon(i, { name: v })}
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
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <FieldRow label="Trait">
                      <TextInput
                        value={w.trait}
                        onChange={(v) =>
                          upWeapon(i, { trait: v as SeventhSeaWeapon["trait"] })
                        }
                        fullWidth={false}
                      />
                    </FieldRow>
                    <FieldRow label="Type">
                      <TextInput
                        value={w.type}
                        onChange={(v) =>
                          upWeapon(i, { type: v as SeventhSeaWeapon["type"] })
                        }
                        fullWidth={false}
                      />
                    </FieldRow>
                  </Box>
                  <Box sx={{ mt: 0.5 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      Properties
                    </Typography>
                    <ChipListEditor
                      value={w.properties ?? []}
                      onChange={(v) =>
                        upWeapon(i, {
                          properties: v as SeventhSeaWeapon["properties"],
                        })
                      }
                    />
                  </Box>
                </Box>
              ))}
              <IconButton
                size="small"
                onClick={() =>
                  up("weapons", [
                    ...(c.weapons ?? []),
                    { name: "New Weapon", trait: "Finesse", type: "fencing" },
                  ])
                }
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </SheetSection>

            {/* ── Gear ── */}
            <SheetSection title="Gear">
              <ListEditor
                value={c.gear ?? []}
                onChange={(v) => up("gear", v)}
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

export default SeventhSeaSheet;
