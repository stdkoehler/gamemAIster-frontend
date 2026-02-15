import { createTheme, Theme, ThemeOptions } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";
import { GameType } from "./models/Types";
import { shadowrunTheme } from "./themes/shadowrun";
import { vampireTheme } from "./themes/vampire";
import { cthulhuTheme } from "./themes/cthulhu";
import { seventhSeaTheme } from "./themes/seventhSea";
import { expanseTheme } from "./themes/expanse";

const memoizedThemes: Partial<Record<GameType, Theme>> = {};

// Game independent global overrides
const globalOverrides: ThemeOptions = {
  components: {
    MuiTooltip: {
      defaultProps: {
        enterDelay: 500,
        enterTouchDelay: 0,
        leaveTouchDelay: 3000,
      },
    },
  },
};

const injectGlobals = (baseTheme: Theme): Theme => {
  // We use createTheme again to ensure the merged result
  // maintains correct MUI internal structures
  return createTheme(deepmerge(baseTheme, globalOverrides));
};

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
  // Check if we already built this theme
  if (memoizedThemes[gameType]) {
    return memoizedThemes[gameType]!;
  }
  const baseTheme = themeMap[gameType] || shadowrunTheme;
  const finalTheme = injectGlobals(baseTheme);
  // Cache it for next time
  memoizedThemes[gameType] = finalTheme;

  return finalTheme;
}
