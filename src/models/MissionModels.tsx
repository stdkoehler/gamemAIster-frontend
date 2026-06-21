import { CharacterProps } from "./CharacterProps";
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

export interface CharacterRecord {
  sheetId: number | null;
  isProtagonist: boolean;
  isNpc?: boolean;
  data: CharacterProps;
}

export type MissionLoadData = {
  mission: Mission;
  interactions: Interaction[];
  characterSheets: CharacterRecord[];
};
