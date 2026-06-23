import React, { useCallback, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Divider,
  Tooltip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CasinoIcon from "@mui/icons-material/Casino";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { GameType } from "../../models/Types";
import useAppStore from "../../stores/appStore";
import useDiceStore, { DiceLogEntry } from "../../stores/diceStore";
import { GAME_SYSTEMS } from "../../gameSystemRegistry";
import { GAME_DICE, DieTypeConfig, RolledDie, describeRolls } from "../../dice/diceConfig";
import Die, { DiePlaceholder } from "./Die";

interface CurrentRoll {
  token: number;
  rolls: RolledDie[];
}

/** Groups items by a string key, preserving first-seen order. Items with no
 *  key (e.g. most systems' dice have no `group`) all land in one implicit
 *  group, so they render exactly as before — a single row, no header. */
function groupByField<T>(
  items: T[],
  keyOf: (item: T) => string | undefined
): { name: string | null; items: T[] }[] {
  const groups: { name: string | null; items: T[] }[] = [];
  const indexByName = new Map<string | null, number>();
  items.forEach((item) => {
    const name = keyOf(item) ?? null;
    let idx = indexByName.get(name);
    if (idx === undefined) {
      idx = groups.length;
      indexByName.set(name, idx);
      groups.push({ name, items: [] });
    }
    groups[idx].items.push(item);
  });
  return groups;
}

/** Maps a die's accent color to a theme-aware sx color token, for labels
 *  that should pick up the same accent as the die itself. */
function dieColorSx(color: DieTypeConfig["color"]): string {
  if (!color || color === "default") return "text.secondary";
  return `${color === "danger" ? "error" : color}.main`;
}

// Must be >= the worst-case shuffle duration in <Die> (up to 12 ticks *
// 65ms = 780ms) plus a small margin, so the summary never reveals before
// every die has actually settled.
const ROLL_SETTLE_MS = 850;

interface DiceSectionPanelProps {
  /** Shown above the Roll button — omitted for systems with no sections,
   *  which just get one flat picker for all their dice, as before. */
  title?: string;
  /** Skips the count picker — for a section whose dice have a fixed,
   *  non-adjustable count (e.g. CoC's percentile pair is always exactly
   *  one tens + one ones, so there's nothing to pick). */
  hidePicker?: boolean;
  dice: DieTypeConfig[];
  summarize: (rolls: RolledDie[], dice: DieTypeConfig[]) => string;
  gameType: GameType;
  counts: Record<string, number>;
  setCount: (dieId: string, count: number) => void;
  addLogEntry: (entry: Omit<DiceLogEntry, "id">) => void;
}

/**
 * One independent roll scope: its own picker, Roll button, and
 * preview/result. A system with no `sections` gets exactly one of these for
 * all its dice (reproducing the original single-flow popup exactly); a
 * system with `sections` (e.g. CoC's "Skill Check" vs. "Sanity") gets one
 * per section, each rolling only its own dice without disturbing the
 * others' in-progress or settled results.
 */
const DiceSectionPanel: React.FC<DiceSectionPanelProps> = ({
  title,
  hidePicker,
  dice,
  summarize,
  gameType,
  counts,
  setCount,
  addLogEntry,
}) => {
  const [currentRoll, setCurrentRoll] = useState<CurrentRoll | null>(null);
  // Gates the text summary so it only appears once the dice have actually
  // finished shuffling, instead of alongside them the instant Roll is
  // clicked — the dice themselves animate on a per-die timer inside <Die>,
  // so the summary needs its own delay matched to that animation.
  const [resultSettled, setResultSettled] = useState(false);

  const countFor = useCallback(
    (die: DieTypeConfig) => counts[die.id] ?? die.defaultCount ?? 0,
    [counts, dice]
  );

  // A roll's dice and summary logic are only meaningful for the system that
  // produced them, and only for the exact picker counts it was rolled
  // with — drop any in-progress/just-settled roll as soon as either changes
  // so a stale result isn't re-summarized under the new rules or shown
  // alongside a picker selection it no longer matches. Scoped to just this
  // panel's own dice, so a sibling section's stepper doesn't clear this one.
  const countsKey = dice.map((d) => countFor(d)).join(",");
  useEffect(() => {
    setCurrentRoll(null);
    setResultSettled(false);
  }, [gameType, countsKey]);

  const diceGroups = groupByField(dice, (d) => d.group);

  // Picker layout only: collapse a die that appears in multiple named
  // groups under the same label (e.g. "d6" in Base, Skill, and Gear /
  // Weapon) into one compact matrix row — a shared label with a column of
  // steppers per group — instead of stacking each group's row separately.
  // A group can still have other dice beyond its matrixed one (Gear /
  // Weapon also has d8/d10/d12); those render afterward as their own
  // compact row, keyed by die label instead of group name. Falls back to
  // the original full-width layout for the implicit ungrouped pool every
  // other system uses, so this only changes anything when it applies.
  const namedGroupDice = diceGroups
    .filter((g) => g.name)
    .flatMap((g) => g.items.map((die) => ({ groupName: g.name!, die })));
  const entriesByLabel = new Map<string, typeof namedGroupDice>();
  namedGroupDice.forEach((entry) => {
    if (!entriesByLabel.has(entry.die.label)) entriesByLabel.set(entry.die.label, []);
    entriesByLabel.get(entry.die.label)!.push(entry);
  });
  const matrixRows = Array.from(entriesByLabel.entries()).filter(([, entries]) => entries.length > 1);
  const matrixedDieIds = new Set(matrixRows.flatMap(([, entries]) => entries.map((e) => e.die.id)));
  const matrixedGroupNames = new Set(matrixRows.flatMap(([, entries]) => entries.map((e) => e.groupName)));
  const remainingGroups = diceGroups
    .map((g) => ({ name: g.name, items: g.items.filter((d) => !matrixedDieIds.has(d.id)) }))
    .filter((g) => g.items.length > 0);

  // What will be rolled if the user hits Roll right now, in picker order —
  // drives the live preview rows so changing a stepper is reflected
  // instantly. flatIndex is this item's position in the flat `rolls` array
  // handleRoll produces (same dice + count order), so a grouped layout can
  // still look up each die's settled value after rolling.
  let runningIndex = 0;
  const previewItems: { die: DieTypeConfig; flatIndex: number }[] = [];
  dice.forEach((die) => {
    const n = countFor(die);
    for (let i = 0; i < n; i++) {
      previewItems.push({ die, flatIndex: runningIndex });
      runningIndex++;
    }
  });
  const previewGroups = groupByField(previewItems, (item) => item.die.group);

  const stepper = (die: DieTypeConfig) => (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton
        size="small"
        disabled={countFor(die) <= 0}
        onClick={() => setCount(die.id, Math.max(0, countFor(die) - 1))}
      >
        <RemoveIcon fontSize="small" />
      </IconButton>
      <Typography variant="body2" sx={{ minWidth: 20, textAlign: "center" }}>
        {countFor(die)}
      </Typography>
      <IconButton
        size="small"
        disabled={countFor(die) >= (die.maxCount ?? 10)}
        onClick={() => setCount(die.id, Math.min(die.maxCount ?? 10, countFor(die) + 1))}
      >
        <AddIcon fontSize="small" />
      </IconButton>
    </Box>
  );

  const dieColumn = (die: DieTypeConfig, headerLabel: string) => (
    <Box key={die.id} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.25 }}>
      <Typography
        variant="caption"
        sx={{ color: dieColorSx(die.color), textTransform: "uppercase", letterSpacing: "0.08em" }}
      >
        {headerLabel}
      </Typography>
      {stepper(die)}
    </Box>
  );

  const handleRoll = useCallback(() => {
    const rolls: RolledDie[] = [];
    dice.forEach((die) => {
      const n = countFor(die);
      for (let i = 0; i < n; i++) rolls.push({ dieId: die.id, value: die.roll() });
    });
    if (rolls.length === 0) return;

    const token = Date.now();
    setCurrentRoll({ token, rolls });
    setResultSettled(false);

    window.setTimeout(() => {
      setResultSettled(true);
      addLogEntry({
        gameType,
        timestamp: Date.now(),
        rolls,
        summary: summarize(rolls, dice),
      });
    }, ROLL_SETTLE_MS);
  }, [dice, countFor, gameType, addLogEntry, summarize]);

  const hasAnyCount = dice.some((d) => countFor(d) > 0);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {title && (
        <Typography variant="subtitle2" sx={{ color: "text.primary", fontWeight: 600 }}>
          {title}
        </Typography>
      )}

      {!hidePicker && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {matrixRows.map(([label, entries]) => (
            <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography variant="body2" sx={{ color: "text.secondary", minWidth: 24 }}>
                {label}
              </Typography>
              {entries.map(({ groupName, die }) => dieColumn(die, groupName))}
            </Box>
          ))}
          {remainingGroups.map((group, gi) =>
            group.name ? (
              <Box key={group.name} sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                {!matrixedGroupNames.has(group.name) && (
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.08em" }}
                  >
                    {group.name}
                  </Typography>
                )}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  {group.items.map((die) => dieColumn(die, die.label))}
                </Box>
              </Box>
            ) : (
              <Box key={gi} sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                {group.items.map((die) => (
                  <Box key={die.id} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" sx={{ flex: 1, color: "text.secondary" }}>
                      {die.label}
                    </Typography>
                    {stepper(die)}
                  </Box>
                ))}
              </Box>
            )
          )}
        </Box>
      )}

      <Button variant="contained" onClick={handleRoll} disabled={!hasAnyCount} sx={{ alignSelf: "flex-start" }}>
        Roll
      </Button>

      {/* Preview of what will be rolled, or the live/settled result */}
      {previewItems.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            {previewGroups.map((group, gi) => (
              <Box key={group.name ?? gi} sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                {group.items.map(({ die, flatIndex }) => {
                  const r = currentRoll?.rolls[flatIndex];
                  return r ? (
                    <Die
                      key={flatIndex}
                      value={r.value}
                      rollKey={currentRoll!.token}
                      face={die.face}
                      roll={die.roll}
                      sides={die.sides}
                      showValueBadge={die.showValueBadge}
                      symbolScale={die.symbolScale}
                      valueBadgeScale={die.valueBadgeScale}
                      color={die.color}
                    />
                  ) : (
                    <DiePlaceholder key={flatIndex} sides={die.sides} color={die.color} />
                  );
                })}
              </Box>
            ))}
          </Box>
          {currentRoll && resultSettled && (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {summarize(currentRoll.rolls, dice)}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export const DiceRollerPopup: React.FC = () => {
  const gameType = useAppStore((s) => s.gameType);
  const { isOpen, counts, log, close, setCount, addLogEntry, removeLogEntry, clearLog } =
    useDiceStore();
  const nodeRef = useRef<HTMLDivElement>(null);

  const config = GAME_DICE[gameType];
  const gameLog = log.filter((entry) => entry.gameType === gameType);

  if (!isOpen) return null;

  return (
    <Draggable
      handle="#dice-drag-handle"
      cancel=".MuiIconButton-root,.MuiButton-root"
      nodeRef={nodeRef}
      defaultPosition={{ x: 120, y: 100 }}
    >
      <Paper
        ref={nodeRef}
        elevation={12}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1300,
          width: "min(460px, calc(100vw - 80px))",
          maxHeight: "min(640px, calc(100vh - 80px))",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: 2,
        }}
      >
        {/* ── Title bar / drag handle ── */}
        <Box
          id="dice-drag-handle"
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            cursor: "move",
            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            bgcolor: alpha(theme.palette.background.paper, 0.95),
            userSelect: "none",
            minHeight: 40,
            px: 0.5,
          })}
        >
          <DragIndicatorIcon sx={{ mx: 0.5, color: "text.secondary", fontSize: 18, flexShrink: 0 }} />
          <CasinoIcon sx={{ mr: 0.75, fontSize: 18, color: "primary.main", flexShrink: 0 }} />
          <Typography
            variant="caption"
            sx={{ flexGrow: 1, color: "text.secondary", letterSpacing: "0.08em" }}
          >
            {GAME_SYSTEMS[gameType].sheetTitle} dice
          </Typography>
          <IconButton size="small" onClick={close} sx={{ mr: 0.5 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* ── Body ── */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
          {config.sections ? (
            config.sections.map((section) => (
              <DiceSectionPanel
                key={section.label}
                title={section.label}
                hidePicker={section.hidePicker}
                dice={config.dice.filter((d) => section.diceIds.includes(d.id))}
                summarize={section.summarize}
                gameType={gameType}
                counts={counts}
                setCount={setCount}
                addLogEntry={addLogEntry}
              />
            ))
          ) : (
            <DiceSectionPanel
              dice={config.dice}
              summarize={config.summarize}
              gameType={gameType}
              counts={counts}
              setCount={setCount}
              addLogEntry={addLogEntry}
            />
          )}

          <Divider />

          {/* Log */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="overline" sx={{ color: "text.secondary", letterSpacing: "0.15em" }}>
              Roll log
            </Typography>
            {gameLog.length > 0 && (
              <Button size="small" onClick={() => clearLog(gameType)} sx={{ minWidth: 0, py: 0 }}>
                Clear all
              </Button>
            )}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, overflowY: "auto" }}>
            {gameLog.map((entry) => (
              <Box
                key={entry.id}
                sx={(theme) => ({
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.125,
                  py: 0.5,
                  borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                })}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                  <Typography variant="body2">{entry.summary}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, flexShrink: 0 }}>
                    <Tooltip title={new Date(entry.timestamp).toLocaleString()}>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {new Date(entry.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </Tooltip>
                    <IconButton
                      size="small"
                      onClick={() => removeLogEntry(entry.id)}
                      sx={{ p: 0.25 }}
                      aria-label="Delete roll"
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {describeRolls(entry.rolls, GAME_DICE[entry.gameType].dice)}
                </Typography>
              </Box>
            ))}
            {gameLog.length === 0 && (
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                No rolls yet.
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>
    </Draggable>
  );
};

export default DiceRollerPopup;
