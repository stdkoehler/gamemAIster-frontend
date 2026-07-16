import React from "react";
import ankhSvg from "../../assets/vampire/dice/ankh.svg?raw";
import ankhCritSvg from "../../assets/vampire/dice/ankh-crit.svg?raw";
import ankhFangsSvg from "../../assets/vampire/dice/ankh-fangs.svg?raw";
import skullSvg from "../../assets/vampire/dice/skull.svg?raw";
import elderSignSvg from "../../assets/callofcthulhu/dice/elder_sign.svg?raw";
import hitSvg from "../../assets/shadowrun/dice/hit.svg?raw";
import slavicBaneSvg from "../../assets/slavic800ad/dice/bane.svg?raw";
import slavicSuccessSvg from "../../assets/slavic800ad/dice/success.svg?raw";
import desolateFrontierBaneSvg from "../../assets/desolate_frontier/dice/bane.svg?raw";
import desolateFrontierSuccessSvg from "../../assets/desolate_frontier/dice/success.svg?raw";

export type DiceSymbolId =
  | "vtm-ankh"
  | "vtm-ankh-crit"
  | "vtm-skull"
  | "vtm-ankh-fangs"
  | "shadowrun-bolt"
  | "shadowrun-hit"
  | "seventh-sea-swords"
  | "expanse-rocket"
  | "slavic-kolovrat"
  | "slavic-bane"
  | "slavic-success"
  | "df-bane"
  | "df-success"
  | "coc-eye"
  | "coc-elder-sign";

interface DiceSymbolDef {
  /** Inline placeholder render, used when no `svg` is set. */
  render?: () => React.ReactNode;
  /**
   * Raw SVG markup for a symbol backed by a real asset file (e.g. imported
   * via Vite's `?raw` suffix) — inlined directly into the DOM rather than
   * loaded as an <img>, so it still inherits `currentColor` and themes
   * correctly (an <img> would bake in whatever color the file specifies,
   * fixed regardless of die color or light/dark mode). Swap a symbol to a
   * new file by pointing the import at it; no other code needs to change.
   */
  svg?: string;
}

const DICE_SYMBOLS: Record<DiceSymbolId, DiceSymbolDef> = {
  // Hand-drawn by the project owner in svg_editor/, stored as standalone
  // files under src/assets/vampire/dice/ (fill set to currentColor there so
  // they stay theme-recolorable) for easy replacement going forward.
  "vtm-ankh": { svg: ankhSvg },
  "vtm-ankh-crit": { svg: ankhCritSvg },
  "vtm-skull": { svg: skullSvg },
  "vtm-ankh-fangs": { svg: ankhFangsSvg },
  "shadowrun-bolt": {
    render: () => (
      <svg viewBox="0 0 24 24" width="100%" height="100%">
        <path d="M13 2 4 14h6l-1 8 9-12h-6Z" fill="currentColor" />
      </svg>
    ),
  },
  // Placed by the project owner in src/assets/shadowrun/dice/.
  "shadowrun-hit": { svg: hitSvg },
  "seventh-sea-swords": {
    render: () => (
      <svg viewBox="0 0 24 24" width="100%" height="100%">
        <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none">
          <line x1="4" y1="4" x2="19" y2="19" />
          <line x1="19" y1="4" x2="4" y2="19" />
        </g>
        <circle cx="4" cy="4" r="1.5" fill="currentColor" />
        <circle cx="19" cy="4" r="1.5" fill="currentColor" />
        <circle cx="4" cy="19" r="1.5" fill="currentColor" />
        <circle cx="19" cy="19" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  "expanse-rocket": {
    render: () => (
      <svg viewBox="0 0 24 24" width="100%" height="100%">
        <path
          d="M12 2c2.6 2.1 3.6 5.6 3.6 8.6 0 1.9-.6 3.2-.9 3.8H9.3c-.3-.6-.9-1.9-.9-3.8C8.4 7.6 9.4 4.1 12 2Z"
          fill="currentColor"
        />
        <path d="M9 13.4c-1.6.5-2.6 1.7-2.8 3.5 1.7-.3 2.9-1.1 3.3-2.2Z" fill="currentColor" />
        <path d="M15 13.4c1.6.5 2.6 1.7 2.8 3.5-1.7-.3-2.9-1.1-3.3-2.2Z" fill="currentColor" />
        <path d="M10.4 16.5h3.2l-1.6 4.7Z" fill="currentColor" />
      </svg>
    ),
  },
  "slavic-kolovrat": {
    render: () => (
      <svg viewBox="0 0 24 24" width="100%" height="100%">
        <g stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <circle cx="12" cy="12" r="3" />
          <line x1="12" y1="2" x2="12" y2="8.2" />
          <line x1="12" y1="15.8" x2="12" y2="22" />
          <line x1="2" y1="12" x2="8.2" y2="12" />
          <line x1="15.8" y1="12" x2="22" y2="12" />
          <line x1="5" y1="5" x2="9.2" y2="9.2" />
          <line x1="14.8" y1="14.8" x2="19" y2="19" />
          <line x1="19" y1="5" x2="14.8" y2="9.2" />
          <line x1="9.2" y1="14.8" x2="5" y2="19" />
        </g>
      </svg>
    ),
  },
  "coc-eye": {
    render: () => (
      <svg viewBox="0 0 24 24" width="100%" height="100%">
        <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="2.6" fill="currentColor" />
      </svg>
    ),
  },
  // Placed by the project owner in src/assets/slavic800ad/dice/.
  "slavic-bane": { svg: slavicBaneSvg },
  "slavic-success": { svg: slavicSuccessSvg },
  // Placed by the project owner in src/assets/desolate_frontier/dice/.
  "df-bane": { svg: desolateFrontierBaneSvg },
  "df-success": { svg: desolateFrontierSuccessSvg },
  // Placed by the project owner in src/assets/callofcthulhu/dice/.
  "coc-elder-sign": { svg: elderSignSvg },
};

interface DiceSymbolProps {
  id: DiceSymbolId;
  size?: number | string;
}

export const DiceSymbol: React.FC<DiceSymbolProps> = ({ id, size = "60%" }) => {
  const def = DICE_SYMBOLS[id];
  const style: React.CSSProperties = { width: size, height: size, display: "inline-flex", color: "inherit" };
  if (def.svg) {
    return <span style={style} dangerouslySetInnerHTML={{ __html: def.svg }} />;
  }
  return <span style={style}>{def.render!()}</span>;
};
