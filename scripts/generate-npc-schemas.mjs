// Generates per-system JSON Schemas from the canonical frontend CharacterProps
// TS interfaces and writes them into the backend repo's tests/schemas/ dir.
//
// The frontend's *Character interfaces (and the hand-crafted NpcCard
// components that render them) are the design source of truth for the NPC
// sheet shape. The backend's merge_npc() output must conform to them — this
// script keeps the contract check (tests/test_npc_schema_contract.py) in
// sync with the frontend types without hand-duplicating the shape in Python.
//
// Run with: npm run gen:npc-schemas

import { createGenerator } from "ts-json-schema-generator";
import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(__dirname, "..");
const outputDir = path.resolve(frontendRoot, "../gamemAIster-backend/tests/schemas");

const TYPES = [
  ["shadowrun", "ShadowrunCharacter"],
  ["vampire_the_masquerade", "VampireCharacter"],
  ["call_of_cthulhu", "CthulhuCharacter"],
  ["seventh_sea", "SeventhSeaCharacter"],
  ["expanse", "ExpanseCharacter"],
  ["slavic", "SlavicCharacter"],
  ["dragonlance", "DragonlanceCharacter"],
];

mkdirSync(outputDir, { recursive: true });

for (const [gameType, typeName] of TYPES) {
  const config = {
    path: path.resolve(frontendRoot, "src/models/CharacterProps.tsx"),
    tsconfig: path.resolve(frontendRoot, "tsconfig.json"),
    type: typeName,
  };
  const schema = createGenerator(config).createSchema(typeName);
  const outPath = path.resolve(outputDir, `${gameType}.schema.json`);
  writeFileSync(outPath, JSON.stringify(schema, null, 2) + "\n", "utf-8");
  console.log(`Wrote ${outPath}`);
}
