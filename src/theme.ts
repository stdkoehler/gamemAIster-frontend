import { Theme } from "@mui/material/styles";
import { GameType } from "./models/Types";
import { shadowrunTheme } from "./themes/shadowrun";
import { vampireTheme } from "./themes/vampire";
import { cthulhuTheme } from "./themes/cthulhu";
import { seventhSeaTheme } from "./themes/seventhSea";
import { expanseTheme } from "./themes/expanse";

/**
 * Helper function to get the appropriate theme for a game type
 * @param gameType The game type to get the theme for
 * @returns The corresponding theme object
 */
const themeMap: Record<GameType, Theme> = {
  [GameType.VAMPIRE_THE_MASQUERADE]: vampireTheme,
  [GameType.CALL_OF_CTHULHU]: cthulhuTheme,
  [GameType.SEVENTH_SEA]: seventhSeaTheme,
  [GameType.EXPANSE]: expanseTheme,
  [GameType.CUSTOM]: seventhSeaTheme, // Consider creating a custom theme if needed
  [GameType.SHADOWRUN]: shadowrunTheme,
};

export function getThemeForGameType(gameType: GameType): Theme {
  return themeMap[gameType] || shadowrunTheme;
}
