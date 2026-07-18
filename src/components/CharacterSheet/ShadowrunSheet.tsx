import React, { useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import { ShadowrunCharacter } from "../../models/CharacterProps";
import { EquipmentType } from "../../models/Types";
import {
  SheetSection, FieldRow, NumInput, TextInput,
  ListEditor, RecordNumEditor, TwoCol, EquipmentSuggestField,
} from "./shared";

interface Props {
  character: ShadowrunCharacter;
  onUpdate: (c: ShadowrunCharacter) => void;
}

const ShadowrunSheet: React.FC<Props> = ({ character, onUpdate }) => {
  const [c, setC] = useState(character);

  const up = <K extends keyof ShadowrunCharacter>(k: K, v: ShadowrunCharacter[K]) => {
    const next = { ...c, [k]: v };
    setC(next);
    onUpdate(next);
  };

  const upAttr = <K extends keyof ShadowrunCharacter["attributes"]>(k: K, v: number) => {
    const next = { ...c, attributes: { ...c.attributes, [k]: v } };
    setC(next);
    onUpdate(next);
  };

  const upDerived = <K extends keyof ShadowrunCharacter["derived"]>(k: K, v: number) => {
    const next = { ...c, derived: { ...c.derived, [k]: v } };
    setC(next);
    onUpdate(next);
  };

  const upDamage = (
    track: "physical" | "stun",
    field: "current" | "max",
    v: number,
  ) => {
    const next = {
      ...c,
      damage: { ...c.damage, [track]: { ...c.damage[track], [field]: v } },
    };
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
              <FieldRow label="Metatype">
                <TextInput value={c.metatype} onChange={(v) => up("metatype", v)} />
              </FieldRow>
              <FieldRow label="Archetype">
                <TextInput value={c.archetype} onChange={(v) => up("archetype", v)} />
              </FieldRow>
              <FieldRow label="Gender">
                <TextInput value={c.gender ?? ""} onChange={(v) => up("gender", v)} />
              </FieldRow>
              <FieldRow label="Age">
                <NumInput value={c.age ?? 0} onChange={(v) => up("age", v)} max={200} />
              </FieldRow>
              <FieldRow label="Lifestyle">
                <TextInput value={c.lifestyle} onChange={(v) => up("lifestyle", v)} />
              </FieldRow>
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

      {/* ── Resources (currency & experience — kept prominent, right below Identity) ── */}
      <SheetSection title="Resources">
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <FieldRow label="Nuyen">
            <NumInput value={c.nuyen} onChange={(v) => up("nuyen", v)} max={9999999} width={104} />
          </FieldRow>
          <FieldRow label="Karma">
            <NumInput value={c.karma ?? 0} onChange={(v) => up("karma", v)} max={999} />
          </FieldRow>
        </Box>
      </SheetSection>

      <TwoCol
        left={
          <>
            {/* ── Attributes ── */}
            <SheetSection title="Attributes">
              {(
                [
                  "Body", "Agility", "Reaction", "Strength",
                  "Willpower", "Logic", "Intuition", "Charisma",
                  "Edge", "Essence",
                ] as const
              ).map((attr) => (
                <FieldRow key={attr} label={attr}>
                  <NumInput
                    value={c.attributes[attr] as number}
                    onChange={(v) => upAttr(attr, v)}
                    max={attr === "Essence" ? 6 : 12}
                    float={attr === "Essence"}
                    step={attr === "Essence" ? 0.1 : 1}
                  />
                </FieldRow>
              ))}
              {c.attributes.Magic !== undefined && (
                <FieldRow label="Magic">
                  <NumInput value={c.attributes.Magic} onChange={(v) => upAttr("Magic", v)} max={12} />
                </FieldRow>
              )}
              {c.attributes.Resonance !== undefined && (
                <FieldRow label="Resonance">
                  <NumInput value={c.attributes.Resonance} onChange={(v) => upAttr("Resonance", v)} max={12} />
                </FieldRow>
              )}
            </SheetSection>

            {/* ── Derived ── */}
            <SheetSection title="Derived Stats">
              {(
                [
                  ["Phys Limit", "physicalLimit"],
                  ["Ment Limit", "mentalLimit"],
                  ["Soc Limit", "socialLimit"],
                  ["Composure", "composure"],
                  ["Judge Intent", "judgeIntentions"],
                  ["Memory", "memory"],
                  ["Lift/Carry", "liftCarry"],
                  ["Init Base", "initiativeBase"],
                  ["Init Dice", "initiativeDice"],
                ] as const
              ).map(([label, key]) => (
                <FieldRow key={key} label={label}>
                  <NumInput
                    value={c.derived[key]}
                    onChange={(v) => upDerived(key, v)}
                    max={20}
                  />
                </FieldRow>
              ))}
            </SheetSection>

            {/* ── Damage Monitors ── */}
            <SheetSection title="Damage Monitors">
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Physical
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 0.5 }}>
                <FieldRow label="Current">
                  <NumInput value={c.damage.physical.current} onChange={(v) => upDamage("physical", "current", v)} max={20} />
                </FieldRow>
                <FieldRow label="Max">
                  <NumInput value={c.damage.physical.max} onChange={(v) => upDamage("physical", "max", v)} max={20} />
                </FieldRow>
              </Box>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Stun
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <FieldRow label="Current">
                  <NumInput value={c.damage.stun.current} onChange={(v) => upDamage("stun", "current", v)} max={20} />
                </FieldRow>
                <FieldRow label="Max">
                  <NumInput value={c.damage.stun.max} onChange={(v) => upDamage("stun", "max", v)} max={20} />
                </FieldRow>
              </Box>
            </SheetSection>

            {/* ── Reputation & Armor ── */}
            <SheetSection title="Reputation & Armor">
              <FieldRow label="Street Cred">
                <NumInput value={c.streetCred} onChange={(v) => up("streetCred", v)} max={99} />
              </FieldRow>
              <FieldRow label="Notoriety">
                <NumInput value={c.notoriety} onChange={(v) => up("notoriety", v)} max={99} />
              </FieldRow>
              <FieldRow label="Pub. Awareness">
                <NumInput value={c.publicAwareness} onChange={(v) => up("publicAwareness", v)} max={99} />
              </FieldRow>
              <FieldRow label="Armor">
                <NumInput value={c.armor} onChange={(v) => up("armor", v)} max={30} />
              </FieldRow>
            </SheetSection>
          </>
        }
        right={
          <>
            {/* ── Active Skills ── */}
            <SheetSection title="Active Skills">
              <RecordNumEditor
                value={c.skills}
                onChange={(v) => up("skills", v)}
              />
            </SheetSection>

            {/* ── Knowledge Skills ── */}
            <SheetSection title="Knowledge Skills">
              <RecordNumEditor
                value={c.knowledgeSkills}
                onChange={(v) => up("knowledgeSkills", v)}
              />
            </SheetSection>

            {/* ── Qualities ── */}
            <SheetSection title="Qualities">
              <Typography variant="caption" sx={{ color: "text.secondary" }}>Positive</Typography>
              <ListEditor
                value={c.qualities.positive}
                onChange={(v) => up("qualities", { ...c.qualities, positive: v })}
                rows={3}
              />
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>Negative</Typography>
                <ListEditor
                  value={c.qualities.negative}
                  onChange={(v) => up("qualities", { ...c.qualities, negative: v })}
                  rows={3}
                />
              </Box>
            </SheetSection>

            {/* ── Contacts ── */}
            <SheetSection title="Contacts">
              {Object.entries(c.contacts).map(([name, { loyalty, connection }]) => (
                <Box key={name} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <Typography variant="body2" sx={{ flex: 1 }}>{name}</Typography>
                  <Typography variant="caption">L</Typography>
                  <NumInput
                    value={loyalty}
                    onChange={(v) =>
                      up("contacts", { ...c.contacts, [name]: { loyalty: v, connection } })
                    }
                    max={6}
                  />
                  <Typography variant="caption">C</Typography>
                  <NumInput
                    value={connection}
                    onChange={(v) =>
                      up("contacts", { ...c.contacts, [name]: { loyalty, connection: v } })
                    }
                    max={6}
                  />
                </Box>
              ))}
            </SheetSection>

            {/* ── Gear & Weapons ── */}
            <SheetSection title="Weapons">
              <EquipmentSuggestField
                gameType={c.gameType}
                equipmentType={EquipmentType.WEAPONS}
                onAdd={(item) => up("weapons", [...c.weapons, item.name])}
              />
              <Box sx={{ mt: 0.5 }}>
                <ListEditor value={c.weapons} onChange={(v) => up("weapons", v)} rows={3} />
              </Box>
            </SheetSection>

            <SheetSection title="Cyberware">
              <EquipmentSuggestField
                gameType={c.gameType}
                equipmentType={EquipmentType.CYBERWARE}
                onAdd={(item) => up("cyberware", [...c.cyberware, item.name])}
              />
              <Box sx={{ mt: 0.5 }}>
                <ListEditor value={c.cyberware} onChange={(v) => up("cyberware", v)} rows={3} />
              </Box>
            </SheetSection>

            {c.bioware !== undefined && (
              <SheetSection title="Bioware">
                <ListEditor value={c.bioware ?? []} onChange={(v) => up("bioware", v)} rows={2} />
              </SheetSection>
            )}

            <SheetSection title="Gear">
              <EquipmentSuggestField
                gameType={c.gameType}
                equipmentType={EquipmentType.GEAR}
                onAdd={(item) => up("gear", [...c.gear, item.name])}
              />
              <Box sx={{ mt: 0.5 }}>
                <ListEditor value={c.gear} onChange={(v) => up("gear", v)} rows={3} />
              </Box>
            </SheetSection>

            {/* ── Awakened / Technomancer ── */}
            {(c.spells !== undefined || c.adeptPowers !== undefined || c.complexForms !== undefined) && (
              <SheetSection title="Awakened / Technomancer">
                {c.mentorSpirit !== undefined && (
                  <FieldRow label="Mentor Spirit">
                    <TextInput value={c.mentorSpirit ?? ""} onChange={(v) => up("mentorSpirit", v)} />
                  </FieldRow>
                )}
                {c.spells !== undefined && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>Spells</Typography>
                    <ListEditor value={c.spells ?? []} onChange={(v) => up("spells", v)} rows={3} />
                  </Box>
                )}
                {c.adeptPowers !== undefined && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>Adept Powers</Typography>
                    <ListEditor value={c.adeptPowers ?? []} onChange={(v) => up("adeptPowers", v)} rows={3} />
                  </Box>
                )}
                {c.complexForms !== undefined && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>Complex Forms</Typography>
                    <ListEditor value={c.complexForms ?? []} onChange={(v) => up("complexForms", v)} rows={2} />
                  </Box>
                )}
              </SheetSection>
            )}

            {/* ── Matrix Stats ── */}
            {c.matrixStats && (
              <SheetSection title="Matrix Stats">
                <FieldRow label="Device">
                  <TextInput
                    value={c.matrixStats.device}
                    onChange={(v) =>
                      up("matrixStats", { ...c.matrixStats!, device: v })
                    }
                  />
                </FieldRow>
                {(["Attack", "Sleaze", "DataProcessing", "Firewall"] as const).map((k) => (
                  <FieldRow key={k} label={k}>
                    <NumInput
                      value={c.matrixStats![k]}
                      onChange={(v) => up("matrixStats", { ...c.matrixStats!, [k]: v })}
                      max={12}
                    />
                  </FieldRow>
                ))}
                <Divider sx={{ my: 0.5 }} />
                <Box sx={{ display: "flex", gap: 1 }}>
                  <FieldRow label="Matrix CM Current">
                    <NumInput
                      value={c.matrixStats.matrixConditionMonitor.current}
                      onChange={(v) =>
                        up("matrixStats", {
                          ...c.matrixStats!,
                          matrixConditionMonitor: { ...c.matrixStats!.matrixConditionMonitor, current: v },
                        })
                      }
                      max={20}
                    />
                  </FieldRow>
                  <FieldRow label="Max">
                    <NumInput
                      value={c.matrixStats.matrixConditionMonitor.max}
                      onChange={(v) =>
                        up("matrixStats", {
                          ...c.matrixStats!,
                          matrixConditionMonitor: { ...c.matrixStats!.matrixConditionMonitor, max: v },
                        })
                      }
                      max={20}
                    />
                  </FieldRow>
                </Box>
              </SheetSection>
            )}
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

export default ShadowrunSheet;
