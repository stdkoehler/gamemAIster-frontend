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

/**
 * UI state for streaming LLM outputs.
 * @typedef {object} State
 * @property {string} llmOutput - The current/accumulated LLM output.
 */
export interface State {
  llmOutput: string;
}

/**
 * Payload sent to the backend for a prompt/turn.
 * @typedef {object} PromptPayload
 * @property {number} mission_id - The current mission's numeric ID.
 * @property {string} [prompt] - The current prompt text.
 * @property {object} [prev_interaction] - Previous exchange context.
 * @property {string} prev_interaction.user_input - Last user input.
 * @property {string} prev_interaction.llm_output - Last LLM output.
 */
export interface PromptPayload {
  mission_id: number;
  prompt?: string;
  prev_interaction?: {
    user_input: string;
    llm_output: string;
  };
}
