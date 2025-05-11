import { GameType } from "./Types";

export interface Mission {
  missionId: number;
  name: string;
  gameType: GameType;
  nameCustom?: string;
  description?: string;
}

export type Interaction = {
  playerInput: string;
  llmOutput: string;
};

/**
 * Mission load payload with low-level interaction format (API shape).
 * @typedef {object} MissionLoadData
 * @property {Mission} mission - Mission metadata.
 * @property {Interaction[]} interactions - List of structured interactions.
 */
export type MissionLoadData = {
  mission: Mission;
  interactions: Interaction[];
};
