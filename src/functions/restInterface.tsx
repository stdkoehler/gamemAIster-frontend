/**
 * @module restInterface
 *
 * Service module for handling all API communications with the game backend.
 * Provides a functional, stateless interface for game-related operations.
 *
 * ## Primary Responsibilities:
 * - Mission lifecycle management (create/save/load/list)
 * - Player-LLM interaction handling (send/stop)
 * - Stream processing for real-time LLM responses
 * - Data type definitions for game entities and payloads
 *
 * ## Key Features:
 * - Type-safe interfaces for all API contracts
 * - Consistent, robust error handling patterns
 * - Stream processing for real-time LLM responses
 * - Data transformation between API and client formats
 *
 * ## API Endpoints:
 * - Base: http://127.0.0.1:8000
 * - Includes: /interaction/ and /mission/ routes
 */

////////////////////
// Configuration  //
////////////////////

/**
 * The base URL for all backend API requests.
 * @constant
 */
const API_BASE = "http://127.0.0.1:8000";

////////////////////
//  Data Types    //
////////////////////

/**
 * Represents a single in-game interaction.
 * @typedef {object} Interaction
 * @property {string} playerInput - Player's input text.
 * @property {string} llmOutput - LLM's generated output.
 */
export type Interaction = {
  playerInput: string;
  llmOutput: string;
};

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
interface PromptPayload {
  mission_id: number;
  prompt?: string;
  prev_interaction?: {
    user_input: string;
    llm_output: string;
  };
}

/**
 * Combined object for player inputs, controller, and previous state.
 * @typedef {object} PlayerInputData
 * @property {number} missionId - The target mission's ID.
 * @property {(state: State) => void} setStateCallback - Callback for streaming state updates.
 * @property {string} [playerInputField] - Text input from player.
 * @property {Interaction} [prevInteraction] - Previous prompt/response context.
 */
interface PlayerInputData {
  missionId: number;
  setStateCallback: (state: State) => void;
  playerInputField?: string;
  prevInteraction?: Interaction;
}

/**
 * Mission data structure returned by API endpoints.
 * @typedef {object} MissionPayload
 * @property {number} mission_id - Mission's unique identifier.
 * @property {string} name - Mission's default or system name.
 * @property {string} [name_custom] - Custom name, if set by the user.
 * @property {string} description - Mission description.
 */
export interface MissionPayload {
  mission_id: number;
  name: string;
  name_custom?: string;
  description: string;
}

/**
 * Mission load payload with low-level interaction format (API shape).
 * @typedef {object} MissionLoadPayload
 * @property {MissionPayload} mission - Mission metadata.
 * @property {{ user_input: string; llm_output: string }[]} interactions - Raw interaction list.
 */
export interface MissionLoadPayload {
  mission: MissionPayload;
  interactions: { user_input: string; llm_output: string }[];
}

/**
 * Enhanced mission data type with typed interactions for client.
 * @typedef {object} MissionLoadData
 * @property {MissionPayload} mission - Mission metadata.
 * @property {Interaction[]} interactions - List of structured interactions.
 */
export type MissionLoadData = {
  mission: MissionPayload;
  interactions: Interaction[];
};

////////////////////
// Helper Logic   //
////////////////////

/**
 * Performs a fetch-based API request with streamlined error reporting and JSON parsing.
 * @template T
 * @param {string} path - API endpoint path (relative to API_BASE)
 * @param {"GET"|"POST"} method - HTTP method.
 * @param {any} [body] - Body payload for POST requests.
 * @returns {Promise<T>} - Resolves to the parsed JSON response.
 * @throws {Error} If the fetch/network/response fails.
 */
async function apiRequest<T>(
  path: string,
  method: "GET" | "POST",
  body?: any
): Promise<T> {
  const url = `${API_BASE}${path}`;
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    if (!res.ok) {
      let errorDetail = "";
      try {
        errorDetail = "\n" + (await res.text());
      } catch {}
      throw new Error(
        `Request to ${url} failed [${res.status}]: ${errorDetail}`
      );
    }

    // 204 No Content? (rare, but handle)
    if (res.status === 204) {
      return {} as T;
    }

    const json = (await res.json()) as T;
    return json;
  } catch (err) {
    throw new Error(
      `API request to "${path}" failed: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}

////////////////////
// Main API Logic //
////////////////////

/**
 * Sends player input to the LLM and streams the response in real-time.
 * Designed for client usage to handle interactive/streaming scenarios.
 *
 * @param {PlayerInputData} params - Describes mission context, player input, previous exchange, and streaming callback.
 * @returns {Promise<void>}
 * @throws {Error} On network, API, or streaming/decode errors.
 */
export async function sendPlayerInputToLlm({
  missionId,
  setStateCallback,
  playerInputField,
  prevInteraction,
}: PlayerInputData): Promise<void> {
  const payload: PromptPayload = {
    mission_id: missionId,
    prompt: playerInputField,
  };
  if (prevInteraction) {
    payload.prev_interaction = {
      user_input: prevInteraction.playerInput,
      llm_output: prevInteraction.llmOutput,
    };
  }

  try {
    const response = await fetch(`${API_BASE}/interaction/gamemaster-send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to stream LLM: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Unable to get reader from response body.");
    }

    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);
      const lines = chunk
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      for (const line of lines) {
        try {
          const jsonData = JSON.parse(line);
          if (typeof jsonData.text === "string") {
            accumulated += jsonData.text;
          }
        } catch {
          // Could be an incomplete/faulty chunk, just log for debugging
          console.error("Unable to parse JSON chunk from LLM stream:", line);
        }
      }
      setStateCallback({ llmOutput: accumulated });
    }
    setStateCallback({ llmOutput: accumulated.trim() });
  } catch (err) {
    setStateCallback({ llmOutput: "❌ Error receiving LLM response." });
    throw new Error(
      `Error streaming LLM output: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}

/**
 * Sends a command to stop the current LLM generation (interrupt).
 *
 * @returns {Promise<void>}
 * @throws {Error} On network or server error.
 */
export async function postStopGeneration(): Promise<void> {
  await apiRequest<void>("/interaction/stop-generation", "POST", {});
}

/**
 * Creates a new mission (server-side).
 *
 * @returns {Promise<MissionPayload>} - Newly created mission data.
 * @throws {Error} On network or API error.
 */
export async function postNewMission(): Promise<MissionPayload> {
  return await apiRequest<MissionPayload>("/mission/new-mission", "POST", {});
}

/**
 * Saves the current mission with a custom name.
 *
 * @param {number} missionId - Mission to save.
 * @param {string} nameCustom - Arbitrary custom name for the mission.
 * @returns {Promise<void>}
 * @throws {Error} On network or API error.
 */
export async function postSaveMission(
  missionId: number,
  nameCustom: string
): Promise<void> {
  await apiRequest<void>("/mission/save-mission", "POST", {
    mission_id: missionId,
    name_custom: nameCustom,
  });
}

/**
 * Fetches mission meta-information/details by ID.
 *
 * @param {number} mission_id - Mission's numeric ID.
 * @returns {Promise<MissionPayload | null>} - Mission metadata, or null if not found.
 * @throws {Error} On network or API error.
 */
export async function getMission(
  mission_id: number
): Promise<MissionPayload | null> {
  return await apiRequest<MissionPayload>(
    `/mission/mission/${mission_id}`,
    "GET"
  );
}

/**
 * Fetches a list of all available missions (summaries).
 *
 * @returns {Promise<MissionPayload[]>} - Array of mission descriptors.
 * @throws {Error} On network or API error.
 */
export async function getListMissions(): Promise<MissionPayload[]> {
  return await apiRequest<MissionPayload[]>("/mission/missions", "GET");
}

/**
 * Loads a complete mission with all its interaction history for play or editing.
 *
 * @param {number} mission_id - Mission's identifier to load.
 * @returns {Promise<MissionLoadData>} - Full mission details and rewritten interactions.
 * @throws {Error} On network or API error.
 */
export async function getLoadMissions(
  mission_id: number
): Promise<MissionLoadData> {
  const data = await apiRequest<MissionLoadPayload>(
    `/mission/load-mission/${mission_id}`,
    "GET"
  );
  // Map API's interaction shape to cleaner Interaction[]
  return {
    mission: data.mission,
    interactions: Array.isArray(data.interactions)
      ? data.interactions.map(({ user_input, llm_output }) => ({
          playerInput: user_input,
          llmOutput: llm_output,
        }))
      : [],
  };
}
