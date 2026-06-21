import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CharacterProps } from "../models/CharacterProps";
import { CharacterRecord } from "../models/MissionModels";
import { DEFAULT_CHARACTERS } from "../data/defaultCharacters";

const DEFAULT_RECORDS: CharacterRecord[] = DEFAULT_CHARACTERS.map((data) => ({
  sheetId: null,
  isProtagonist: false,
  data,
}));

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
  isSheetOpen: boolean;
  openSheet: (characterId: number) => void;
  closeSheet: () => void;
  updateCharacterData: (updated: CharacterProps) => void;
  setCharacters: (records: CharacterRecord[]) => void;
  addCharacter: (record: CharacterRecord) => void;
  removeCharacter: (characterId: number) => void;
  setProtagonist: (characterId: number) => void;
  resetCharacters: () => void;
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
    (set) => ({
      characters: DEFAULT_RECORDS,
      activeCharacterId: null,
      isSheetOpen: false,

      openSheet: (characterId) =>
        set({ activeCharacterId: characterId, isSheetOpen: true }),

      closeSheet: () => set({ isSheetOpen: false }),

      updateCharacterData: (updated) =>
        set((state) => ({
          characters: state.characters.map((r) =>
            r.data.id === updated.id ? { ...r, data: updated } : r
          ),
        })),

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

      resetCharacters: () => set({ characters: [] }),
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
