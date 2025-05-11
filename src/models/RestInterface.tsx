import { GameType } from "./Types";

export interface MissionPayload {
  mission_id: number;
  name: string;
  name_custom?: string;
  description: string;
  game_type: GameType;
}

export interface MissionPayload {
  mission_id: number;
  name: string;
  name_custom?: string;
  description: string;
  game_type: GameType;
}

export interface MissionLoadPayload {
  mission: MissionPayload;
  interactions: { user_input: string; llm_output: string }[];
}
