import { GameType } from "./models/Types";

interface GameSystemConfig {
  title: string;
  sheetTitle: string;
  sheetWidth?: number;
}

export const GAME_SYSTEMS: Record<GameType, GameSystemConfig> = {
  [GameType.SHADOWRUN]: { title: "Shadowrun", sheetTitle: "Shadowrun 5e" },
  [GameType.VAMPIRE_THE_MASQUERADE]: { title: "Vampire: The Masquerade", sheetTitle: "Vampire: The Masquerade V5", sheetWidth: 1100 },
  [GameType.CALL_OF_CTHULHU]: { title: "Call of Cthulhu", sheetTitle: "Call of Cthulhu 7e" },
  [GameType.SEVENTH_SEA]: { title: "7th Sea", sheetTitle: "7th Sea 2e" },
  [GameType.EXPANSE]: { title: "The Expanse", sheetTitle: "The Expanse RPG" },
  [GameType.SLAVIC]: { title: "Slavic 800 AD", sheetTitle: "Slavic 800 AD" },
  [GameType.CUSTOM]: { title: "Custom", sheetTitle: "Custom" },
};
