import { GameType } from "./models/Types";

interface GameSystemConfig {
  title: string;
  sheetTitle: string;
  /** What this system calls its group of player characters, shown as the
   *  character sheet popup's title when opened for a PC (e.g. "Runners"). */
  partyLabel: string;
  sheetWidth?: number;
  /** Max height (px) of the dice roller popup — falls back to the
   *  roller's own default if unset. Systems whose sections need more
   *  vertical room (e.g. Dragonlance's d20 + damage sections both with
   *  their own Roll button and preview) can raise it so the roll log
   *  underneath isn't pushed out of frame. */
  diceMaxHeight?: number;
}

export const GAME_SYSTEMS: Record<GameType, GameSystemConfig> = {
  [GameType.SHADOWRUN]: {
    title: "Shadowrun",
    sheetTitle: "Shadowrun 5e",
    partyLabel: "Runners",
  },
  [GameType.VAMPIRE_THE_MASQUERADE]: {
    title: "Vampire: The Masquerade",
    sheetTitle: "Vampire: The Masquerade V5",
    partyLabel: "Coterie",
    sheetWidth: 1100,
  },
  [GameType.CALL_OF_CTHULHU]: {
    title: "Call of Cthulhu",
    sheetTitle: "Call of Cthulhu 7e",
    partyLabel: "Investigators",
  },
  [GameType.SEVENTH_SEA]: {
    title: "7th Sea",
    sheetTitle: "7th Sea 2e",
    partyLabel: "Crew",
  },
  [GameType.EXPANSE]: {
    title: "The Expanse",
    sheetTitle: "The Expanse RPG",
    partyLabel: "Crew",
  },
  [GameType.SLAVIC]: {
    title: "Slavic 800 AD",
    sheetTitle: "Slavic 800 AD",
    partyLabel: "Adventurers",
  },
  [GameType.DRAGONLANCE]: {
    title: "Dragonlance",
    sheetTitle: "Dragonlance: Shadow of the Dragon Queen (D&D 5E)",
    partyLabel: "Heroes",
    sheetWidth: 1100,
    diceMaxHeight: 760,
  },
  [GameType.CUSTOM]: {
    title: "Custom",
    sheetTitle: "Custom",
    partyLabel: "Party",
  },
};
