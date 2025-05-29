import { Interaction } from "./MissionModels";

export interface LoadedHistoryData {
  interactions: Interaction[];
  lastPlayerInput: string;
  lastLlmOutput: string;
}

