import React, { useEffect, useRef, useState } from "react";
import { keyframes } from "@emotion/react";
import { Theme, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { DiceSymbol, DiceSymbolId } from "../../dice/diceSymbols";

export type DieFace =
  | { kind: "number"; text?: string }
  | { kind: "empty" }
  | {
      kind: "symbol";
      id: DiceSymbolId;
      /** Small label rendered under the icon — e.g. how many successes this
       *  particular face is worth, for dice where that varies by value. */
      badge?: string;
    };

export type DieColor =
  | "default"
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "danger";

function accentPaletteFor(theme: Theme, color: DieColor) {
  switch (color) {
    case "primary":
      return theme.palette.primary;
    case "secondary":
      return theme.palette.secondary;
    case "info":
      return theme.palette.info;
    case "success":
      return theme.palette.success;
    case "warning":
      return theme.palette.warning;
    case "danger":
      return theme.palette.error;
    default:
      return null;
  }
}

function dieColors(theme: Theme, color: DieColor, borderAlpha = 0.28) {
  const accentPalette = accentPaletteFor(theme, color);
  return {
    borderColor: accentPalette
      ? alpha(accentPalette.main, Math.max(borderAlpha, 0.55))
      : alpha(theme.palette.text.primary, borderAlpha),
    background: accentPalette
      ? alpha(accentPalette.main, 0.1)
      : theme.palette.background.paper,
    textColor: accentPalette ? accentPalette.main : theme.palette.text.primary,
  };
}

/**
 * A top-down outline per face count, so a d10 doesn't look like a d6.
 * Loosely matches each die's real silhouette: d4 -> triangle, d6 -> square
 * (the default, rendered as a plain rect), d8 -> diamond, d10 -> elongated
 * kite, d12 -> octagon-ish, d20 -> hexagon. Points are in a 0-100 viewBox.
 *
 * Rendered as a real SVG polygon rather than a CSS `clip-path` + `border` —
 * clip-path crops a rectangular border down to the polygon's silhouette,
 * but the border itself stays rectangular and only survives at the few
 * points where the polygon touches the box edge, so non-square dice ended
 * up with an all-but-invisible outline. An SVG `stroke` actually traces
 * the polygon, which is what we want here.
 */
function dieShapePoints(sides: number): string | null {
  switch (sides) {
    case 4:
      return "50,4 96,94 4,94";
    case 8:
      return "50,2 98,50 50,98 2,50";
    case 10:
      return "50,2 95,26 95,74 50,98 5,74 5,26";
    case 12:
      return "30,3 70,3 97,30 97,70 70,97 30,97 3,70 3,30";
    case 20:
      return "25,3 75,3 97,50 75,97 25,97 3,50";
    default:
      return null;
  }
}

interface DieShapeProps {
  sides: number;
  background: string;
  borderColor: string;
}

const DieShape: React.FC<DieShapeProps> = ({
  sides,
  background,
  borderColor,
}) => {
  const points = dieShapePoints(sides);
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      {points ? (
        <polygon
          points={points}
          fill={background}
          stroke={borderColor}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
      ) : (
        <rect
          x="2"
          y="2"
          width="96"
          height="96"
          rx="10"
          fill={background}
          stroke={borderColor}
          strokeWidth={2.5}
        />
      )}
    </svg>
  );
};

function dieContainerStyle(theme: Theme, size: number, sides: number) {
  return {
    position: "relative",
    width: size,
    height: size,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    fontWeight: 500,
    fontSize: size * 0.4,
    flexShrink: 0,
    boxSizing: "border-box",
    // A d4's visual centroid sits below its bounding-box center, so its
    // content needs a slight downward nudge to look centered in the triangle.
    paddingTop: sides === 4 ? size * 0.12 : 0,
  } as const;
}

/** A static, dim placeholder shown for dice that are selected but not yet
 *  rolled — lets the picker preview update live as counts change. */
export const DiePlaceholder: React.FC<{
  color?: DieColor;
  size?: number;
  sides?: number;
}> = ({ color = "default", size = 52, sides = 6 }) => {
  const theme = useTheme();
  // The outline stays at near-full contrast — it's the whole point of
  // previewing shape/count before rolling — only the inner dash fades, to
  // read as "not rolled yet" without washing out the silhouette.
  const { borderColor, background } = dieColors(theme, color, 0.55);
  return (
    <div style={dieContainerStyle(theme, size, sides)}>
      <DieShape
        sides={sides}
        background={background}
        borderColor={borderColor}
      />
      <span
        style={{ position: "relative", fontSize: size * 0.45, opacity: 0.5 }}
      >
        –
      </span>
    </div>
  );
};

interface DieProps {
  /** The committed final value once the roll settles. */
  value: number;
  /** Bump this to trigger a new shuffle-and-settle animation. */
  rollKey: number;
  /** Maps a face value to what should be displayed on it. */
  face: (value: number) => DieFace;
  /** Produces a random value in this die's range, used for shuffle noise. */
  roll: () => number;
  /** Number of faces on the physical die — purely cosmetic, drives the outline. */
  sides?: number;
  /** Shows the rolled number in a small corner badge even when the face is
   *  a symbol or blank — for rolls where the raw number still matters
   *  (e.g. Shadowrun initiative), so it isn't hidden behind the hit icon. */
  showValueBadge?: boolean;
  /** Scales the symbol icon relative to its normal size (1 = default) —
   *  for systems whose artwork reads better a bit smaller. */
  symbolScale?: number;
  /** Scales the corner value badge's font size relative to its normal size
   *  (1 = default) — for systems where the raw number needs to stand out
   *  more, e.g. to offset a less contrasty accent color. */
  valueBadgeScale?: number;
  color?: DieColor;
  size?: number;
}

const SHUFFLE_INTERVAL_MS = 65;

const settlePop = keyframes`
  0% { transform: scale(1.16); }
  100% { transform: scale(1); }
`;

const Die: React.FC<DieProps> = ({
  value,
  rollKey,
  face,
  roll,
  sides = 6,
  showValueBadge = false,
  symbolScale = 1,
  valueBadgeScale = 1,
  color = "default",
  size = 52,
}) => {
  const theme = useTheme();
  const [display, setDisplay] = useState(value);
  const [pulse, setPulse] = useState(0);
  // Starts as null (never a real rollKey) so the very first roll a Die is
  // mounted for still plays the shuffle animation, instead of being treated
  // as "unchanged" because it'd otherwise match the initial rollKey prop.
  const prevRollKey = useRef<number | null>(null);

  useEffect(() => {
    if (rollKey === prevRollKey.current) return;
    // Only mark this rollKey as "seen" once a shuffle actually completes —
    // not at the start — so React StrictMode's dev-only double-invoke of
    // this effect (run, clean up, run again) can't skip the animation by
    // having its first, synthetic invocation claim the rollKey before the
    // surviving invocation gets a chance to animate it.
    let ticks = 0;
    const maxTicks = 8 + Math.floor(Math.random() * 5);
    const iv = setInterval(() => {
      setDisplay(roll());
      ticks++;
      if (ticks >= maxTicks) {
        clearInterval(iv);
        setDisplay(value);
        setPulse((p) => p + 1);
        prevRollKey.current = rollKey;
      }
    }, SHUFFLE_INTERVAL_MS);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rollKey]);

  const f = face(display);
  const { borderColor, background, textColor } = dieColors(theme, color);

  return (
    <div
      key={pulse}
      style={{
        ...dieContainerStyle(theme, size, sides),
        color: textColor,
        animation: pulse > 0 ? `${settlePop} 160ms ease-out` : undefined,
      }}
    >
      <DieShape
        sides={sides}
        background={background}
        borderColor={borderColor}
      />
      <span
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        {f.kind === "symbol" ? (
          <span
            style={{
              position: "relative",
              display: "inline-flex",
              width: size * 0.52 * symbolScale,
              height: size * 0.52 * symbolScale,
            }}
          >
            <DiceSymbol id={f.id} size={size * 0.52 * symbolScale} />
            {f.badge && (
              <span
                style={{
                  position: "absolute",
                  // Dead center on the success icon is the solid crossguard
                  // where the blades meet — same color as the badge text,
                  // so it'd be illegible there.
                  top: "-20%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: size * 0.22 * valueBadgeScale,
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {f.badge}
              </span>
            )}
          </span>
        ) : f.kind === "number" ? (
          (f.text ?? display)
        ) : null}
      </span>
      {showValueBadge &&
        (sides === 6 ? (
          // The square die has a flush corner to tuck the badge into.
          <span
            style={{
              position: "absolute",
              bottom: size * 0.06,
              right: size * 0.08,
              fontSize: size * 0.22 * valueBadgeScale,
              fontWeight: 500,
              lineHeight: 1,
              opacity: 0.75,
            }}
          >
            {display}
          </span>
        ) : (
          // Every other shape's bottom-right corner is a sloped edge, not a
          // flush corner, so the badge gets clipped/crowded there — bottom
          // center sits inside the shape cleanly for all of them instead.
          <span
            style={{
              position: "absolute",
              bottom: size * 0.08,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: size * 0.22 * valueBadgeScale,
              fontWeight: 500,
              lineHeight: 1,
              opacity: 0.75,
            }}
          >
            {display}
          </span>
        ))}
    </div>
  );
};

export default Die;
