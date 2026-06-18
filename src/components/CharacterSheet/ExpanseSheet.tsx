import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ExpanseCharacter, AgeWeapon } from "../../models/CharacterProps";
import {
  SheetSection, FieldRow, NumInput, TextInput,
  ListEditor, RecordNumEditor, TwoCol, ChipListEditor,
} from "./shared";

interface Props {
  character: ExpanseCharacter;
  onUpdate: (c: ExpanseCharacter) => void;
}

const ABILITIES = [
  "Accuracy", "Communication", "Constitution",
  "Dexterity", "Fighting", "Intelligence",
  "Perception", "Strength", "Willpower",
] as const;

const ExpanseSheet: React.FC<Props> = ({ character, onUpdate }) => {
  const [c, setC] = useState(character);

  const up = <K extends keyof ExpanseCharacter>(k: K, v: ExpanseCharacter[K]) => {
    const next = { ...c, [k]: v };
    setC(next);
    onUpdate(next);
  };

  const upAbility = (k: keyof ExpanseCharacter["abilities"], v: number) => {
    const next = { ...c, abilities: { ...c.abilities, [k]: v } };
    setC(next);
    onUpdate(next);
  };

  const upHealth = (field: "current" | "max", v: number) => {
    const next = { ...c, health: { ...c.health, [field]: v } };
    setC(next);
    onUpdate(next);
  };

  const upWeapon = (i: number, patch: Partial<AgeWeapon>) => {
    const ws = [...(c.weapons ?? [])];
    ws[i] = { ...ws[i], ...patch };
    up("weapons", ws);
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
              <FieldRow label="Origin">
                <TextInput value={c.origin} onChange={(v) => up("origin", v)} />
              </FieldRow>
              <FieldRow label="Background">
                <TextInput value={c.background} onChange={(v) => up("background", v)} />
              </FieldRow>
              <FieldRow label="Faction">
                <TextInput value={c.faction} onChange={(v) => up("faction", v)} />
              </FieldRow>
              <FieldRow label="Drive">
                <TextInput value={c.drive ?? ""} onChange={(v) => up("drive", v)} />
              </FieldRow>
            </Box>
          }
          right={
            <TextInput
              value={c.description}
              onChange={(v) => up("description", v)}
              multiline rows={6}
              label="Description / Background"
            />
          }
        />
      </SheetSection>

      <TwoCol
        left={
          <>
            {/* ── Abilities ── */}
            <SheetSection title="Abilities">
              {ABILITIES.map((a) => (
                <FieldRow key={a} label={a}>
                  <NumInput
                    value={c.abilities[a]}
                    onChange={(v) => upAbility(a, v)}
                    min={-2}
                    max={6}
                    width={64}
                  />
                </FieldRow>
              ))}
            </SheetSection>

            {/* ── Derived ── */}
            <SheetSection title="Derived Stats">
              <FieldRow label="Speed">
                <NumInput value={c.speed} onChange={(v) => up("speed", v)} max={30} />
              </FieldRow>
              <FieldRow label="Defense">
                <NumInput value={c.defense} onChange={(v) => up("defense", v)} max={30} />
              </FieldRow>
              <FieldRow label="Toughness">
                <NumInput value={c.toughness ?? 0} onChange={(v) => up("toughness", v)} max={10} />
              </FieldRow>
            </SheetSection>

            {/* ── Health & Fortune ── */}
            <SheetSection title="Health & Fortune">
              <Typography variant="caption" sx={{ color: "text.secondary" }}>Health</Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 0.75 }}>
                <FieldRow label="Cur">
                  <NumInput value={c.health.current} onChange={(v) => upHealth("current", v)} max={200} />
                </FieldRow>
                <FieldRow label="Max">
                  <NumInput value={c.health.max} onChange={(v) => upHealth("max", v)} max={200} />
                </FieldRow>
              </Box>
              <FieldRow label="Fortune">
                <NumInput value={c.fortune} onChange={(v) => up("fortune", v)} max={20} />
              </FieldRow>
            </SheetSection>

            {/* ── Conditions ── */}
            <SheetSection title="Conditions">
              <ChipListEditor
                value={c.conditions ?? []}
                onChange={(v) => up("conditions", v)}
              />
            </SheetSection>

            {/* ── Talents ── */}
            <SheetSection title="Talents">
              <RecordNumEditor
                value={c.talents ?? {}}
                onChange={(v) => up("talents", v)}
                maxDots={3}
              />
            </SheetSection>
          </>
        }
        right={
          <>
            {/* ── Focuses ── */}
            <SheetSection title="Focuses">
              <ChipListEditor
                value={c.focuses}
                onChange={(v) => up("focuses", v)}
                label="(e.g. Accuracy (Pistols))"
              />
            </SheetSection>

            {/* ── Weapons ── */}
            <SheetSection title="Weapons">
              {(c.weapons ?? []).map((w, i) => (
                <Box key={i} sx={{ mb: 1, p: 1, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
                  <Box sx={{ display: "flex", gap: 0.5, mb: 0.5 }}>
                    <TextInput value={w.name} onChange={(v) => upWeapon(i, { name: v })} label="Name" />
                    <IconButton size="small" onClick={() => {
                      const ws = [...(c.weapons ?? [])];
                      ws.splice(i, 1);
                      up("weapons", ws);
                    }} sx={{ p: 0.25 }}>×</IconButton>
                  </Box>
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    <FieldRow label="Damage">
                      <TextInput value={w.damage} onChange={(v) => upWeapon(i, { damage: v })} fullWidth={false} />
                    </FieldRow>
                    <FieldRow label="Min Str">
                      <NumInput value={w.minStr ?? 0} onChange={(v) => upWeapon(i, { minStr: v })} max={6} />
                    </FieldRow>
                    <FieldRow label="Range">
                      <TextInput value={w.range ?? ""} onChange={(v) => upWeapon(i, { range: v })} fullWidth={false} />
                    </FieldRow>
                  </Box>
                  <Box sx={{ mt: 0.5 }}>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>Qualities</Typography>
                    <ChipListEditor
                      value={w.qualities ?? []}
                      onChange={(v) => upWeapon(i, { qualities: v })}
                    />
                  </Box>
                </Box>
              ))}
              <IconButton
                size="small"
                onClick={() =>
                  up("weapons", [
                    ...(c.weapons ?? []),
                    { name: "New Weapon", damage: "1d6+0" },
                  ])
                }
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </SheetSection>

            {/* ── Armor & Gear ── */}
            <SheetSection title="Armor & Gear">
              <FieldRow label="Armor">
                <TextInput value={c.armor ?? ""} onChange={(v) => up("armor", v)} />
              </FieldRow>
              <Box sx={{ mt: 0.75 }}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>Gear</Typography>
                <ListEditor value={c.gear ?? []} onChange={(v) => up("gear", v)} rows={3} />
              </Box>
            </SheetSection>

            {/* ── Relationships ── */}
            <SheetSection title="Relationships">
              <ListEditor value={c.relationships ?? []} onChange={(v) => up("relationships", v)} rows={3} />
            </SheetSection>
          </>
        }
      />
    </Box>
  );
};

export default ExpanseSheet;
