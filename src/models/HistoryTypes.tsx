import { Interaction } from "./MissionModels";

export interface LoadedHistoryData {
  interactions: Interaction[];
  lastPlayerInput: string;
  lastLlmOutput: string;
}

export interface HistoryHandle {
  loadHistoryData: (data: LoadedHistoryData) => void;
  clearHistory: () => void;
  hydrateFromStorage: () => void;
}
