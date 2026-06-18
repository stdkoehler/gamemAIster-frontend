import React, { useState } from "react";
import { Box, Typography, IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { VampireCharacter } from "../../models/CharacterProps";
import {
  SheetSection, FieldRow, NumInput, TextInput, DotRating,
  ListEditor, RecordNumEditor, TwoCol, ChipListEditor,
} from "./shared";

interface Props {
  character: VampireCharacter;
  onUpdate: (c: VampireCharacter) => void;
}

const PHYSICAL_ATTRS = ["Strength", "Dexterity", "Stamina"] as const;
const SOCIAL_ATTRS = ["Charisma", "Manipulation", "Composure"] as const;
const MENTAL_ATTRS = ["Intelligence", "Wits", "Resolve"] as const;

const PHYSICAL_SKILLS = [
  "Athletics", "Brawl", "Craft", "Drive", "Firearms",
  "Melee", "Larceny", "Stealth", "Survival",
] as const;
const SOCIAL_SKILLS = [
  "Animal Ken", "Etiquette", "Insight", "Intimidation", "Leadership",
  "Performance", "Persuasion", "Streetwise", "Subterfuge",
] as const;
const MENTAL_SKILLS = [
  "Academics", "Awareness", "Finance", "Investigation",
  "Medicine", "Occult", "Politics", "Science", "Technology",
] as const;

const AttrColumn: React.FC<{
  title: string;
  keys: readonly string[];
  attrs: VampireCharacter["attributes"];
  onChange: (k: keyof VampireCharacter["attributes"], v: number) => void;
}> = ({ title, keys, attrs, onChange }) => (
  <Box>
    <Typography variant="caption" sx={{ fontWeight: "bold", color: "primary.light" }}>
      {title}
    </Typography>
    {keys.map((k) => (
      <Box key={k} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.25 }}>
        <Typography variant="body2" sx={{ mr: 1 }}>{k}</Typography>
        <DotRating
          value={attrs[k as keyof VampireCharacter["attributes"]] as number}
          onChange={(n) => onChange(k as keyof VampireCharacter["attributes"], n)}
        />
      </Box>
    ))}
  </Box>
);

const SkillColumn: React.FC<{
  title: string;
  keys: readonly string[];
  skills: VampireCharacter["skills"];
  onChange: (k: keyof VampireCharacter["skills"], v: number) => void;
}> = ({ title, keys, skills, onChange }) => (
  <Box>
    <Typography variant="caption" sx={{ fontWeight: "bold", color: "primary.light" }}>
      {title}
    </Typography>
    {keys.map((k) => (
      <Box key={k} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.25 }}>
        <Typography variant="body2" sx={{ mr: 1, fontSize: "0.75rem" }}>{k}</Typography>
        <DotRating
          value={skills[k as keyof VampireCharacter["skills"]] as number}
          onChange={(n) => onChange(k as keyof VampireCharacter["skills"], n)}
        />
      </Box>
    ))}
  </Box>
);

const VampireSheet: React.FC<Props> = ({ character, onUpdate }) => {
  const [c, setC] = useState(character);

  const up = <K extends keyof VampireCharacter>(k: K, v: VampireCharacter[K]) => {
    const next = { ...c, [k]: v };
    setC(next);
    onUpdate(next);
  };

  const upAttr = (k: keyof VampireCharacter["attributes"], v: number) => {
    const next = { ...c, attributes: { ...c.attributes, [k]: v } };
    setC(next);
    onUpdate(next);
  };

  const upSkill = (k: keyof VampireCharacter["skills"], v: number) => {
    const next = { ...c, skills: { ...c.skills, [k]: v } };
    setC(next);
    onUpdate(next);
  };

  const upHealth = (field: "current" | "max", v: number) => {
    const next = { ...c, health: { ...c.health, [field]: v } };
    setC(next);
    onUpdate(next);
  };

  const upWillpower = (field: "current" | "max", v: number) => {
    const next = { ...c, willpower: { ...c.willpower, [field]: v } };
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
              <FieldRow label="Nature">
                <TextInput value={c.nature} onChange={(v) => up("nature", v as VampireCharacter["nature"])} />
              </FieldRow>
              {c.clan !== undefined && (
                <FieldRow label="Clan">
                  <TextInput value={c.clan ?? ""} onChange={(v) => up("clan", v)} />
                </FieldRow>
              )}
              {c.generation !== undefined && (
                <FieldRow label="Generation">
                  <NumInput value={c.generation ?? 13} onChange={(v) => up("generation", v)} min={4} max={16} />
                </FieldRow>
              )}
              {c.predatorType !== undefined && (
                <FieldRow label="Predator Type">
                  <TextInput value={c.predatorType ?? ""} onChange={(v) => up("predatorType", v)} />
                </FieldRow>
              )}
              {c.sire !== undefined && (
                <FieldRow label="Sire">
                  <TextInput value={c.sire ?? ""} onChange={(v) => up("sire", v)} />
                </FieldRow>
              )}
              <FieldRow label="Ambition">
                <TextInput value={c.ambition ?? ""} onChange={(v) => up("ambition", v)} />
              </FieldRow>
              <FieldRow label="Desire">
                <TextInput value={c.desire ?? ""} onChange={(v) => up("desire", v)} />
              </FieldRow>
            </Box>
          }
          right={
            <TextInput
              value={c.description}
              onChange={(v) => up("description", v)}
              multiline rows={7}
              label="Description / Background"
            />
          }
        />
      </SheetSection>

      {/* ── Attributes ── */}
      <SheetSection title="Attributes">
        <Box sx={{ display: "flex", gap: 3 }}>
          <AttrColumn title="Physical" keys={PHYSICAL_ATTRS} attrs={c.attributes} onChange={upAttr} />
          <AttrColumn title="Social" keys={SOCIAL_ATTRS} attrs={c.attributes} onChange={upAttr} />
          <AttrColumn title="Mental" keys={MENTAL_ATTRS} attrs={c.attributes} onChange={upAttr} />
        </Box>
      </SheetSection>

      {/* ── Skills ── */}
      <SheetSection title="Skills">
        <Box sx={{ display: "flex", gap: 3 }}>
          <SkillColumn title="Physical" keys={PHYSICAL_SKILLS} skills={c.skills} onChange={upSkill} />
          <SkillColumn title="Social" keys={SOCIAL_SKILLS} skills={c.skills} onChange={upSkill} />
          <SkillColumn title="Mental" keys={MENTAL_SKILLS} skills={c.skills} onChange={upSkill} />
        </Box>
        <Box sx={{ mt: 1 }}>
          <ChipListEditor
            value={c.skillSpecialties ?? []}
            onChange={(v) => up("skillSpecialties", v)}
            label="Specialties (e.g. Melee (Swords))"
          />
        </Box>
      </SheetSection>

      <TwoCol
        left={
          <>
            {/* ── Disciplines ── */}
            <SheetSection title="Disciplines">
              {Object.entries(c.disciplines ?? {}).map(([disc, { level, powers }]) => (
                <Box key={disc} sx={{ mb: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold", flex: 1 }}>{disc}</Typography>
                    <DotRating
                      value={level}
                      onChange={(n) =>
                        up("disciplines", { ...c.disciplines, [disc]: { level: n, powers } })
                      }
                    />
                    <IconButton
                      size="small"
                      onClick={() => {
                        const next = { ...c.disciplines };
                        delete next[disc];
                        up("disciplines", next);
                      }}
                      sx={{ p: 0.25 }}
                    >
                      ×
                    </IconButton>
                  </Box>
                  <ListEditor
                    value={powers}
                    onChange={(v) =>
                      up("disciplines", { ...c.disciplines, [disc]: { level, powers: v } })
                    }
                    rows={2}
                    placeholder="Powers (one per line)"
                  />
                </Box>
              ))}
              <AddDisciplineRow
                onAdd={(name) =>
                  up("disciplines", { ...c.disciplines, [name]: { level: 1, powers: [] } })
                }
              />
            </SheetSection>

            {/* ── Blood Mechanics ── */}
            {(c.nature === "vampire" || c.nature === "thin-blood") && (
              <SheetSection title="Blood">
                <FieldRow label="Hunger">
                  <DotRating value={c.hunger ?? 0} max={5} onChange={(v) => up("hunger", v)} />
                </FieldRow>
                <FieldRow label="Blood Potency">
                  <DotRating value={c.bloodPotency ?? 0} max={10} size={9} onChange={(v) => up("bloodPotency", v)} />
                </FieldRow>
                <FieldRow label="Resonance">
                  <TextInput value={c.resonance ?? ""} onChange={(v) => up("resonance", v)} />
                </FieldRow>
                <FieldRow label="Temperament">
                  <TextInput value={c.temperament ?? ""} onChange={(v) => up("temperament", v)} />
                </FieldRow>
                <FieldRow label="Clan Bane">
                  <TextInput value={c.clanBane ?? ""} onChange={(v) => up("clanBane", v)} />
                </FieldRow>
                <FieldRow label="Compulsion">
                  <TextInput value={c.compulsion ?? ""} onChange={(v) => up("compulsion", v)} />
                </FieldRow>
              </SheetSection>
            )}

            {/* ── Health & Willpower ── */}
            <SheetSection title="Health & Willpower">
              <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>Health</Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <FieldRow label="Cur">
                      <NumInput value={c.health.current} onChange={(v) => upHealth("current", v)} max={20} />
                    </FieldRow>
                    <FieldRow label="Max">
                      <NumInput value={c.health.max} onChange={(v) => upHealth("max", v)} max={20} />
                    </FieldRow>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>Willpower</Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <FieldRow label="Cur">
                      <NumInput value={c.willpower.current} onChange={(v) => upWillpower("current", v)} max={20} />
                    </FieldRow>
                    <FieldRow label="Max">
                      <NumInput value={c.willpower.max} onChange={(v) => upWillpower("max", v)} max={20} />
                    </FieldRow>
                  </Box>
                </Box>
              </Box>
              <FieldRow label="Humanity">
                <DotRating value={c.humanity ?? 7} max={10} size={9} onChange={(v) => up("humanity", v)} />
              </FieldRow>
            </SheetSection>

            {/* ── Experience ── */}
            <SheetSection title="Experience">
              <Box sx={{ display: "flex", gap: 2 }}>
                <FieldRow label="Total">
                  <NumInput value={c.experienceTotal ?? 0} onChange={(v) => up("experienceTotal", v)} max={9999} width={80} />
                </FieldRow>
                <FieldRow label="Spent">
                  <NumInput value={c.experienceSpent ?? 0} onChange={(v) => up("experienceSpent", v)} max={9999} width={80} />
                </FieldRow>
              </Box>
            </SheetSection>
          </>
        }
        right={
          <>
            {/* ── Merits & Flaws ── */}
            <SheetSection title="Merits & Flaws">
              <Typography variant="caption" sx={{ color: "text.secondary" }}>Merits</Typography>
              <ListEditor value={c.merits ?? []} onChange={(v) => up("merits", v)} rows={2} />
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>Flaws</Typography>
                <ListEditor value={c.flaws ?? []} onChange={(v) => up("flaws", v)} rows={2} />
              </Box>
            </SheetSection>

            {/* ── Backgrounds ── */}
            <SheetSection title="Backgrounds">
              <RecordNumEditor
                value={c.backgrounds ?? {}}
                onChange={(v) => up("backgrounds", v)}
                useDots
                maxDots={5}
              />
            </SheetSection>

            {/* ── Weapons ── */}
            <SheetSection title="Weapons">
              {(c.weapons ?? []).map((w, i) => (
                <Box key={i} sx={{ mb: 1, p: 1, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.25 }}>
                    <TextInput value={w.name} onChange={(v) => {
                      const ws = [...(c.weapons ?? [])];
                      ws[i] = { ...ws[i], name: v };
                      up("weapons", ws);
                    }} label="Name" />
                    <IconButton size="small" onClick={() => {
                      const ws = [...(c.weapons ?? [])];
                      ws.splice(i, 1);
                      up("weapons", ws);
                    }} sx={{ p: 0.25 }}>×</IconButton>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <FieldRow label="DMG">
                      <NumInput value={w.damage} onChange={(v) => {
                        const ws = [...(c.weapons ?? [])];
                        ws[i] = { ...ws[i], damage: v };
                        up("weapons", ws);
                      }} max={6} />
                    </FieldRow>
                    <FieldRow label="Skill">
                      <TextInput value={w.skill} onChange={(v) => {
                        const ws = [...(c.weapons ?? [])];
                        ws[i] = { ...ws[i], skill: v as typeof w.skill };
                        up("weapons", ws);
                      }} fullWidth={false} />
                    </FieldRow>
                  </Box>
                </Box>
              ))}
              <IconButton
                size="small"
                onClick={() =>
                  up("weapons", [...(c.weapons ?? []), { name: "New Weapon", damage: 0, skill: "Melee" }])
                }
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </SheetSection>

            {/* ── Chronicle ── */}
            <SheetSection title="Chronicle">
              <Typography variant="caption" sx={{ color: "text.secondary" }}>Chronicle Tenets</Typography>
              <ListEditor value={c.chronicleTenets ?? []} onChange={(v) => up("chronicleTenets", v)} rows={2} />
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>Touchstones</Typography>
                <ListEditor value={c.touchstones ?? []} onChange={(v) => up("touchstones", v)} rows={2} />
              </Box>
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>Loresheets</Typography>
                <ListEditor value={c.loresheets ?? []} onChange={(v) => up("loresheets", v)} rows={2} />
              </Box>
            </SheetSection>

            {/* ── Thin-blood Alchemy ── */}
            {c.nature === "thin-blood" && (
              <SheetSection title="Thin-blood Alchemy">
                <ListEditor value={c.thinBloodAlchemy ?? []} onChange={(v) => up("thinBloodAlchemy", v)} rows={3} />
              </SheetSection>
            )}
          </>
        }
      />
    </Box>
  );
};

const AddDisciplineRow: React.FC<{ onAdd: (name: string) => void }> = ({ onAdd }) => {
  const [name, setName] = useState("");
  return (
    <Box sx={{ display: "flex", gap: 0.5 }}>
      <TextField
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && name.trim()) { onAdd(name.trim()); setName(""); }
        }}
        size="small" placeholder="Add discipline..."
        sx={{ flex: 1 }}
      />
      <IconButton size="small" onClick={() => { if (name.trim()) { onAdd(name.trim()); setName(""); } }}>
        <AddIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default VampireSheet;
