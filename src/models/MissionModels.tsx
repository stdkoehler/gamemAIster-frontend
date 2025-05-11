import { GameType } from "./Types";

export interface MissionOption {
  label: string;
  value: number;
  nameCustom?: string;
  gameType: GameType;
}

export type Interaction = {
  playerInput: string;
  llmOutput: string;
};
