import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CharacterProps } from "../models/CharacterProps";
import { CharacterRecord } from "../models/MissionModels";
import { DEFAULT_CHARACTERS } from "../data/defaultCharacters";
import { upsertCharacterSheet } from "../functions/restInterface";
import useAppStore from "./appStore";

const DEFAULT_RECORDS: CharacterRecord[] = DEFAULT_CHARACTERS.map((data) => ({
  sheetId: null,
  isProtagonist: false,
  data,
}));

const SAVE_DEBOUNCE_MS = 800;

// Module-level (not store state) so every edit funnels through the same
// debounce/flush bookkeeping regardless of which component triggered it -
// the reduced sidebar cards and the full character sheet editor both call
// `updateCharacterData`, so persistence only needs to live here once.
const saveTimers = new Map<number, ReturnType<typeof setTimeout>>();
const pendingSaves = new Map<number, CharacterRecord>();

function persistRecord(record: CharacterRecord): void {
  const missionId = useAppStore.getState().mission;
  if (record.sheetId === null || missionId === null) return;
  upsertCharacterSheet({
    character_sheet_id: record.sheetId,
    mission_id: missionId,
    name: record.data.name,
    game_type: useAppStore.getState().gameType,
    content: record.data,
    is_protagonist: record.isProtagonist,
    is_npc: record.isNpc ?? false,
    is_active: record.isActive ?? true,
  }).catch((err) => console.error("Failed to persist character sheet:", err));
}

function flushOne(characterId: number): void {
  const timer = saveTimers.get(characterId);
  if (timer) clearTimeout(timer);
  saveTimers.delete(characterId);
  const record = pendingSaves.get(characterId);
  pendingSaves.delete(characterId);
  if (record) persistRecord(record);
}

function schedulePersist(record: CharacterRecord): void {
  pendingSaves.set(record.data.id, record);
  const existing = saveTimers.get(record.data.id);
  if (existing) clearTimeout(existing);
  saveTimers.set(
    record.data.id,
    setTimeout(() => flushOne(record.data.id), SAVE_DEBOUNCE_MS),
  );
}

function flushAllPending(): void {
  [...pendingSaves.keys()].forEach(flushOne);
}

/**
 * Holds every character sheet (both player characters and NPCs) for the
 * currently active mission. PCs and NPCs are distinguished solely by the
 * `isNpc` flag on each `CharacterRecord` - consumers (CharacterManager,
 * NpcManager, CharacterSheetPopup) derive their own party/NPC subset by
 * filtering on that flag rather than fetching or storing them separately.
 */
interface CharacterState {
  characters: CharacterRecord[];
  activeCharacterId: number | null;
  /** Whether the sheet popup was opened for an NPC or a PC; determines which
   *  subset of `characters` the popup shows and tabs through. */
  activeIsNpc: boolean;
  isSheetOpen: boolean;
  openSheet: (characterId: number) => void;
  closeSheet: () => void;
  updateCharacterData: (updated: CharacterProps) => void;
  setCharacters: (records: CharacterRecord[]) => void;
  addCharacter: (record: CharacterRecord) => void;
  removeCharacter: (characterId: number) => void;
  setProtagonist: (characterId: number) => void;
  setActive: (characterId: number, isActive: boolean) => void;
  resetCharacters: () => void;
  /** Immediately persists any debounced edits instead of waiting for the
   *  save timer - call before anything that depends on the backend having
   *  the latest character data (closing the sheet, sending a chat turn). */
  flushPendingSaves: () => void;
}

// If exactly one non-NPC record exists and none is yet flagged as the
// protagonist, treat it as the protagonist by default. NPCs never qualify.
function withAutoProtagonist(records: CharacterRecord[]): CharacterRecord[] {
  const pcs = records.filter((r) => !r.isNpc);
  if (pcs.length === 1 && !pcs[0].isProtagonist) {
    const soloPc = pcs[0];
    return records.map((r) => (r === soloPc ? { ...r, isProtagonist: true } : r));
  }
  return records;
}

const useCharacterStore = create<CharacterState>()(
  persist(
    (set, get) => ({
      characters: DEFAULT_RECORDS,
      activeCharacterId: null,
      activeIsNpc: false,
      isSheetOpen: false,

      openSheet: (characterId) =>
        set((state) => ({
          activeCharacterId: characterId,
          activeIsNpc: state.characters.find((r) => r.data.id === characterId)?.isNpc ?? false,
          isSheetOpen: true,
        })),

      closeSheet: () => set({ isSheetOpen: false }),

      updateCharacterData: (updated) => {
        set((state) => ({
          characters: state.characters.map((r) =>
            r.data.id === updated.id ? { ...r, data: updated } : r
          ),
        }));
        const record = get().characters.find((r) => r.data.id === updated.id);
        if (record) schedulePersist(record);
      },

      setCharacters: (records) => set({ characters: withAutoProtagonist(records) }),

      addCharacter: (record) =>
        set((state) => ({
          characters: withAutoProtagonist([...state.characters, record]),
        })),

      removeCharacter: (characterId) =>
        set((state) => ({
          characters: state.characters.filter((r) => r.data.id !== characterId),
        })),

      setProtagonist: (characterId) =>
        set((state) => ({
          characters: state.characters.map((r) =>
            r.isNpc ? r : { ...r, isProtagonist: r.data.id === characterId },
          ),
        })),

      setActive: (characterId, isActive) =>
        set((state) => ({
          characters: state.characters.map((r) =>
            r.data.id === characterId ? { ...r, isActive } : r,
          ),
        })),

      resetCharacters: () => set({ characters: [] }),

      flushPendingSaves: () => flushAllPending(),
    }),
    {
      name: "character-storage",
      version: 1,
      migrate: (persisted: any, version: number) => {
        if (version < 1) {
          const oldChars: any[] = persisted?.characters ?? [];
          return {
            ...persisted,
            characters: oldChars.map((c) =>
              c.data !== undefined
                ? c
                : { sheetId: null, isProtagonist: false, data: c }
            ),
          };
        }
        return persisted;
      },
      partialize: (state) => ({ characters: state.characters }),
    }
  )
);

export default useCharacterStore;
