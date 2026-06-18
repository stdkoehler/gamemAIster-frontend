import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CharacterProps } from "../models/CharacterProps";
import { DEFAULT_CHARACTERS } from "../data/defaultCharacters";

interface CharacterState {
  characters: CharacterProps[];
  activeCharacterId: number | null;
  isSheetOpen: boolean;
  openSheet: (characterId: number) => void;
  closeSheet: () => void;
  updateCharacter: (updated: CharacterProps) => void;
}

const useCharacterStore = create<CharacterState>()(
  persist(
    (set) => ({
      characters: DEFAULT_CHARACTERS,
      activeCharacterId: null,
      isSheetOpen: false,
      openSheet: (characterId) =>
        set({ activeCharacterId: characterId, isSheetOpen: true }),
      closeSheet: () => set({ isSheetOpen: false }),
      updateCharacter: (updated) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === updated.id ? updated : c,
          ),
        })),
    }),
    {
      name: "character-storage",
      partialize: (state) => ({ characters: state.characters }),
    },
  ),
);

export default useCharacterStore;
