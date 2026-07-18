import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { CthulhuCharacter, CocWeapon } from "../../models/CharacterProps";
import { EquipmentType } from "../../models/Types";
import {
  SheetSection, FieldRow, NumInput, TextInput,
  ListEditor, TwoCol, EquipmentSuggestField,
} from "./shared";

interface Props {
  character: CthulhuCharacter;
  onUpdate: (c: CthulhuCharacter) => void;
}

const CHARS = ["STR", "CON", "SIZ", "DEX", "APP", "INT", "POW", "EDU"] as const;

const CthulhuSheet: React.FC<Props> = ({ character, onUpdate }) => {
  const [c, setC] = useState(character);

  const up = <K extends keyof CthulhuCharacter>(k: K, v: CthulhuCharacter[K]) => {
    const next = { ...c, [k]: v };
    setC(next);
    onUpdate(next);
  };

  const upChar = (k: keyof CthulhuCharacter["characteristics"], v: number) => {
    const chars = { ...c.characteristics, [k]: v };
    // auto-update half/fifth
    const half = Object.fromEntries(
      CHARS.map((key) => [key, Math.floor(chars[key] / 2)])
    ) as CthulhuCharacter["derived"]["half"];
    const fifth = Object.fromEntries(
      CHARS.map((key) => [key, Math.floor(chars[key] / 5)])
    ) as CthulhuCharacter["derived"]["fifth"];
    const next = { ...c, characteristics: chars, derived: { ...c.derived, half, fifth } };
    setC(next);
    onUpdate(next);
  };

  const upDerived = <K extends keyof Omit<CthulhuCharacter["derived"], "half" | "fifth">>(
    k: K,
    v: CthulhuCharacter["derived"][K],
  ) => {
    const next = { ...c, derived: { ...c.derived, [k]: v } };
    setC(next);
    onUpdate(next);
  };

  const upTrack = (
    track: "hitPoints" | "sanity" | "magicPoints",
    field: "current" | "max",
    v: number,
  ) => {
    const next = { ...c, [track]: { ...c[track], [field]: v } };
    setC(next);
    onUpdate(next);
  };

  const upWeapon = (i: number, patch: Partial<CocWeapon>) => {
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
              <FieldRow label="Occupation">
                <TextInput value={c.occupation} onChange={(v) => up("occupation", v)} />
              </FieldRow>
              <FieldRow label="Era">
                <TextInput value={c.era} onChange={(v) => up("era", v)} />
              </FieldRow>
              <FieldRow label="Age">
                <NumInput value={c.age} onChange={(v) => up("age", v)} max={120} />
              </FieldRow>
              <FieldRow label="Residence">
                <TextInput value={c.residence ?? ""} onChange={(v) => up("residence", v)} />
              </FieldRow>
              <FieldRow label="Birthplace">
                <TextInput value={c.birthplace ?? ""} onChange={(v) => up("birthplace", v)} />
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

      {/* ── Resources (currency & experience-equivalent — kept prominent, right below Identity) ── */}
      <SheetSection title="Resources">
        <FieldRow label="Cash">
          <NumInput value={c.cash ?? 0} onChange={(v) => up("cash", v)} max={999999} width={104} />
        </FieldRow>
        <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 1 }}>
          Improvement Checks (skills used successfully this session — roll to improve between sessions)
        </Typography>
        <ListEditor
          value={c.skillImprovementChecks ?? []}
          onChange={(v) => up("skillImprovementChecks", v)}
          rows={2}
        />
      </SheetSection>

      <TwoCol
        left={
          <>
            {/* ── Characteristics ── */}
            <SheetSection title="Characteristics">
              <Box sx={{ display: "grid", gridTemplateColumns: "80px 64px 56px 56px", gap: 0.5, alignItems: "center" }}>
                <Typography variant="caption" sx={{ fontWeight: "bold" }}>Char.</Typography>
                <Typography variant="caption" sx={{ fontWeight: "bold", textAlign: "center" }}>Regular</Typography>
                <Typography variant="caption" sx={{ fontWeight: "bold", textAlign: "center" }}>Half</Typography>
                <Typography variant="caption" sx={{ fontWeight: "bold", textAlign: "center" }}>Fifth</Typography>
                {CHARS.map((k) => (
                  <React.Fragment key={k}>
                    <Typography variant="body2">{k}</Typography>
                    <NumInput
                      value={c.characteristics[k]}
                      onChange={(v) => upChar(k, v)}
                      max={99}
                    />
                    <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
                      {c.derived.half[k]}
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
                      {c.derived.fifth[k]}
                    </Typography>
                  </React.Fragment>
                ))}
              </Box>
            </SheetSection>

            {/* ── Derived Stats ── */}
            <SheetSection title="Derived Stats">
              <FieldRow label="HP Max">
                <NumInput value={c.derived.hpMax} onChange={(v) => upDerived("hpMax", v)} max={30} />
              </FieldRow>
              <FieldRow label="MP Max">
                <NumInput value={c.derived.mpMax} onChange={(v) => upDerived("mpMax", v)} max={30} />
              </FieldRow>
              <FieldRow label="Sanity Max">
                <NumInput value={c.derived.sanityMax} onChange={(v) => upDerived("sanityMax", v)} max={99} />
              </FieldRow>
              <FieldRow label="Build">
                <NumInput value={c.derived.build} onChange={(v) => upDerived("build", v)} min={-2} max={4} />
              </FieldRow>
              <FieldRow label="Damage Bonus">
                <TextInput value={c.derived.damageBonus} onChange={(v) => upDerived("damageBonus", v)} fullWidth={false} />
              </FieldRow>
              <FieldRow label="Move Rate">
                <NumInput value={c.derived.moveRate} onChange={(v) => upDerived("moveRate", v)} min={1} max={12} />
              </FieldRow>
            </SheetSection>

            {/* ── Tracks ── */}
            <SheetSection title="Condition Tracks">
              {(
                [
                  ["Hit Points", "hitPoints"],
                  ["Sanity", "sanity"],
                  ["Magic Points", "magicPoints"],
                ] as const
              ).map(([label, key]) => (
                <Box key={key} sx={{ mb: 0.75 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>{label}</Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <FieldRow label="Cur">
                      <NumInput value={c[key].current} onChange={(v) => upTrack(key, "current", v)} max={50} />
                    </FieldRow>
                    <FieldRow label="Max">
                      <NumInput value={c[key].max} onChange={(v) => upTrack(key, "max", v)} max={50} />
                    </FieldRow>
                  </Box>
                </Box>
              ))}
              <Box sx={{ display: "flex", gap: 2 }}>
                <FieldRow label="Luck">
                  <NumInput value={c.luck} onChange={(v) => up("luck", v)} max={99} />
                </FieldRow>
                <FieldRow label="Cthulhu Mythos">
                  <NumInput value={c.cthulhuMythos} onChange={(v) => up("cthulhuMythos", v)} max={99} />
                </FieldRow>
              </Box>
            </SheetSection>

            {/* ── Equipment ── */}
            <SheetSection title="Equipment">
              <FieldRow label="Spending Level">
                <TextInput value={c.spendingLevel ?? ""} onChange={(v) => up("spendingLevel", v)} />
              </FieldRow>
              <FieldRow label="Assets">
                <TextInput value={c.assets ?? ""} onChange={(v) => up("assets", v)} />
              </FieldRow>
              <FieldRow label="Armor Name">
                <TextInput
                  value={c.armor?.name ?? ""}
                  onChange={(v) => up("armor", { ...(c.armor ?? { name: "", rating: 0 }), name: v })}
                />
              </FieldRow>
              <FieldRow label="Armor Rating">
                <NumInput
                  value={c.armor?.rating ?? 0}
                  onChange={(v) => up("armor", { ...(c.armor ?? { name: "", rating: 0 }), rating: v })}
                  max={20}
                />
              </FieldRow>
              <Box sx={{ mt: 0.75 }}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>Gear</Typography>
                <EquipmentSuggestField
                  gameType={c.gameType}
                  equipmentType={EquipmentType.GEAR}
                  onAdd={(item) => up("gear", [...(c.gear ?? []), item.name])}
                />
                <Box sx={{ mt: 0.5 }}>
                  <ListEditor value={c.gear ?? []} onChange={(v) => up("gear", v)} rows={3} />
                </Box>
              </Box>
            </SheetSection>
          </>
        }
        right={
          <>
            {/* ── Skills ── */}
            <SheetSection title="Skills (%)">
              <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
                {Object.entries(c.skills).map(([skill, pct]) => (
                  <Box key={skill} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}>
                    <Typography variant="body2" sx={{ flex: 1, fontSize: "0.75rem" }}>{skill}</Typography>
                    <NumInput
                      value={pct}
                      onChange={(v) => up("skills", { ...c.skills, [skill]: v })}
                      max={99}
                    />
                  </Box>
                ))}
              </Box>
            </SheetSection>

            {/* ── Weapons ── */}
            <SheetSection title="Weapons">
              <EquipmentSuggestField
                gameType={c.gameType}
                equipmentType={EquipmentType.WEAPONS}
                onAdd={(item) =>
                  up("weapons", [
                    ...(c.weapons ?? []),
                    { name: item.name, skill: "", damage: "" },
                  ])
                }
              />
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
                    <FieldRow label="Skill">
                      <TextInput value={w.skill} onChange={(v) => upWeapon(i, { skill: v })} fullWidth={false} />
                    </FieldRow>
                    <FieldRow label="Damage">
                      <TextInput value={w.damage} onChange={(v) => upWeapon(i, { damage: v })} fullWidth={false} />
                    </FieldRow>
                  </Box>
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 0.5 }}>
                    <FieldRow label="Range">
                      <TextInput value={w.range ?? ""} onChange={(v) => upWeapon(i, { range: v })} fullWidth={false} />
                    </FieldRow>
                    <FieldRow label="APR">
                      <NumInput value={w.attacksPerRound ?? 1} onChange={(v) => upWeapon(i, { attacksPerRound: v })} max={10} />
                    </FieldRow>
                    <FieldRow label="Ammo">
                      <NumInput value={w.ammo ?? 0} onChange={(v) => upWeapon(i, { ammo: v })} max={999} width={72} />
                    </FieldRow>
                    <FieldRow label="Malf">
                      <NumInput value={w.malfunction ?? 100} onChange={(v) => upWeapon(i, { malfunction: v })} max={100} width={72} />
                    </FieldRow>
                  </Box>
                </Box>
              ))}
              <IconButton
                size="small"
                onClick={() =>
                  up("weapons", [
                    ...(c.weapons ?? []),
                    { name: "New Weapon", skill: "Fighting (Brawl)", damage: "1d3+db" },
                  ])
                }
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </SheetSection>

            {/* ── Spells & Tomes ── */}
            <SheetSection title="Spells & Tomes">
              <Typography variant="caption" sx={{ color: "text.secondary" }}>Spells Known</Typography>
              <ListEditor value={c.spells ?? []} onChange={(v) => up("spells", v)} rows={3} />
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>Tomes Studied</Typography>
                <ListEditor value={c.tomesStudied ?? []} onChange={(v) => up("tomesStudied", v)} rows={2} />
              </Box>
            </SheetSection>

            {/* ── Backstory ── */}
            <SheetSection title="Backstory">
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <TextInput
                  value={c.personalDescription ?? ""}
                  onChange={(v) => up("personalDescription", v)}
                  multiline rows={2}
                  label="Personal Description"
                />
                <TextInput
                  value={(c.traits ?? []).join("\n")}
                  onChange={(v) => up("traits", v.split("\n").filter(Boolean))}
                  multiline rows={2}
                  label="Traits & Mannerisms"
                />
                <TextInput
                  value={(c.ideologyBeliefs ?? []).join("\n")}
                  onChange={(v) => up("ideologyBeliefs", v.split("\n").filter(Boolean))}
                  multiline rows={2}
                  label="Ideology & Beliefs"
                />
                <TextInput
                  value={(c.significantPeople ?? []).join("\n")}
                  onChange={(v) => up("significantPeople", v.split("\n").filter(Boolean))}
                  multiline rows={2}
                  label="Significant People"
                />
                <TextInput
                  value={(c.fellowsAndContacts ?? []).join("\n")}
                  onChange={(v) => up("fellowsAndContacts", v.split("\n").filter(Boolean))}
                  multiline rows={2}
                  label="Fellows & Contacts"
                />
                <TextInput
                  value={(c.meaningfulLocations ?? []).join("\n")}
                  onChange={(v) => up("meaningfulLocations", v.split("\n").filter(Boolean))}
                  multiline rows={2}
                  label="Meaningful Locations"
                />
                <TextInput
                  value={(c.treasuredPossessions ?? []).join("\n")}
                  onChange={(v) => up("treasuredPossessions", v.split("\n").filter(Boolean))}
                  multiline rows={2}
                  label="Treasured Possessions"
                />
                <TextInput
                  value={(c.injuries ?? []).join("\n")}
                  onChange={(v) => up("injuries", v.split("\n").filter(Boolean))}
                  multiline rows={2}
                  label="Injuries & Scars"
                />
              </Box>
            </SheetSection>
          </>
        }
      />

      {/* ── Notes ── */}
      <SheetSection title="Notes">
        <TextInput value={c.notes ?? ""} onChange={(v) => up("notes", v)} multiline rows={4} />
      </SheetSection>
    </Box>
  );
};

export default CthulhuSheet;
