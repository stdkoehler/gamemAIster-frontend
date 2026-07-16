import { CharacterProps } from "./CharacterProps";
import { GameType } from "./Types";

export interface MissionPayload {
  mission_id: number;
  name: string;
  name_custom?: string;
  description: string;
  game_type: GameType;
}

export interface CharacterSheetPayload {
  character_sheet_id: number;
  mission_id: number;
  name: string;
  game_type: string;
  content: CharacterProps;
  is_protagonist: boolean;
  is_npc: boolean;
  is_active: boolean;
}

export interface MissionLoadPayload {
  mission: MissionPayload;
  interactions: { user_input: string; llm_output: string }[];
  character_sheets: CharacterSheetPayload[];
}

/**
 * UI state for streaming LLM outputs.
 * @typedef {object} State
 * @property {string} llmOutput - The current/accumulated LLM output.
 */
export interface State {
  llmOutput: string;
  llmThinking: string;
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

/** LLM providers selectable from the "LLM Settings" panel — mirrors the
 * backend's `LlmProvider` enum (src/routers/schema/settings.py). */
export enum LlmProvider {
  LOCAL = "LOCAL",
  DEEPSEEK = "DEEPSEEK",
  MINIMAX = "MINIMAX",
  OPENROUTER = "OPENROUTER",
}

/** Local server type — mirrors the backend's `LocalInterface` enum. Only
 * TEXTGEN_WEBUI is functional today; OLLAMA is reserved/disabled in the UI
 * until real support is built. */
export enum LocalInterface {
  TEXTGEN_WEBUI = "TEXTGEN_WEBUI",
  OLLAMA = "OLLAMA",
}

/** Which local client/endpoint a model needs — mirrors the backend's
 * `LocalMode` enum (src/routers/schema/settings.py). */
export enum LocalMode {
  NATIVE_COMPLETIONS = "NATIVE_COMPLETIONS",
  NATIVE_TOOL_CALLING = "NATIVE_TOOL_CALLING",
}

export interface KnownLocalModel {
  id: string;
  label: string;
  mode: LocalMode;
}

/** One provider's saved settings. `has_api_key` reports whether a key is
 * stored without ever exposing it. */
export interface LlmProviderSettingsPayload {
  provider: LlmProvider;
  model_name?: string | null;
  has_api_key: boolean;
  local_host?: string | null;
  local_port?: number | null;
  local_interface?: LocalInterface | null;
  local_mode?: LocalMode | null;
}

/** All of a user's saved per-provider settings plus which one is active. */
export interface LlmSettingsOverviewPayload {
  active_provider: LlmProvider | null;
  providers: LlmProviderSettingsPayload[];
}

/** `local_mode` is only honored by the backend for a *custom* model_name —
 * one that isn't a known preset from GET /settings/llm/local-models. For a
 * known preset, which local client it needs is a property of the model, not
 * a user choice, and is always derived server-side regardless of what's
 * sent here. */
export interface SaveLlmSettingsPayload {
  provider: LlmProvider;
  model_name?: string | null;
  api_key?: string | null;
  local_host?: string | null;
  local_port?: number | null;
  local_interface?: LocalInterface | null;
  local_mode?: LocalMode | null;
}
