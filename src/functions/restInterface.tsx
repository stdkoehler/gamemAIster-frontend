/**
 * @module restInterface
 *
 * Service module for handling all API communications with the game backend.
 * Maintains a functional, stateless interface for game-related operations.
 *
 * Primary Responsibilities:
 * - Mission lifecycle management (create/save/load/list)
 * - Player-LLM interaction handling
 * - Stream processing for real-time LLM responses
 * - Data type definitions for game entities
 *
 * Key Features:
 * - Type-safe interfaces for all API contracts
 * - Consistent error handling patterns
 * - Stream processing for LLM responses
 * - Data transformation between API and client formats
 *
 * API Endpoints:
 * - All endpoints target http://127.0.0.1:8000
 * - Covers /interaction/ and /mission/ routes
 */

/**
 * Represents a single interaction between player and LLM
 */
export type Interaction = {
  playerInput: string;
  llmOutput: string;
};

interface State {
  llmOutput: string;
}

interface PromptPayload {
  mission_id: number;
  prompt?: string;
  prev_interaction?: {
    user_input: string;
    llm_output: string;
  };
}

interface PlayerInputData {
  missionId: number;
  setStateCallback: (state: State) => void;
  playerInputField?: string;
  prevInteraction?: Interaction;
}

/**
 * Mission data structure returned by the API
 */
export interface MissionPayload {
  mission_id: number;
  name: string;
  name_custom?: string;
  description: string;
}

export interface MissionLoadPayload {
  mission: MissionPayload;
  interactions: [{ user_input: string; llm_output: string }];
}

/**
 * Enhanced mission data with properly typed interactions
 */
export type MissionLoadData = {
  mission: MissionPayload;
  interactions: Interaction[];
};

/**
 * Sends player input to LLM and streams the response
 * @param params - {@link PlayerInputData} containing:
 *   - missionId: Current mission ID
 *   - setStateCallback: State updater for streaming response
 *   - playerInputField: Current player input
 *   - prevInteraction: Optional previous interaction for context
 * @throws {Error} On network issues or malformed responses
 */
export async function sendPlayerInputToLlm({
  missionId,
  setStateCallback,
  playerInputField,
  prevInteraction,
}: PlayerInputData) {
  try {
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

    const fastapiurl = "http://127.0.0.1:8000/interaction/gamemaster-send";
    console.log("sending prompt");
    const response = await fetch(fastapiurl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const reader = response.body?.getReader();

    if (reader === undefined) {
      throw new Error("Reader is undefined");
    }

    let result = "";
    let done_flag = false;
    while (!done_flag) {
      const { done, value } = await reader.read();
      if (done) {
        done_flag = true;
        break;
      }
      const streamPackage = new TextDecoder().decode(value);
      const jsonStrings = streamPackage.split("\n");

      // it's possible that the endpoints sends multiple \n separated json strings in one response
      jsonStrings.forEach((jsonString) => {
        jsonString = jsonString.trim();
        if (jsonString.length > 0) {
          try {
            const jsonData = JSON.parse(jsonString);
            result += jsonData.text;
          } catch (err) {
            console.error(`json not parsable: ${streamPackage}`);
            throw new Error("json not parsable");
          }
        }
      });

      setStateCallback({ llmOutput: result });
    }
    result = result.trim();
    setStateCallback({ llmOutput: result });
  } catch (err) {
    console.error("Error sending data", err);
  }
}

/**
 * Stops current LLM generation
 * @throws {Error} On network issues
 */ export async function postStopGeneration() {
  // For now, consider the data is stored on a static `users.json` file
  try {
    const res = await fetch(
      "http://127.0.0.1:8000/interaction/stop-generation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );
    if (!res.ok) {
      // Check if the response status is not OK (e.g., 404, 500)
      throw new Error(`Server responded with status: ${res.status}`);
    }
    return res.json() as Promise<MissionPayload[]>;
  } catch (error) {
    console.error("Error getting new mission:", error);
    throw new Error("Server responded with status");
  }
}

/**
 * Creates a new mission
 * @returns {Promise<MissionPayload>} New mission data
 * @throws {Error} On network issues
 */
export async function postNewMission(): Promise<MissionPayload> {
  // For now, consider the data is stored on a static `users.json` file
  try {
    const res = await fetch("http://127.0.0.1:8000/mission/new-mission", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      // Check if the response status is not OK (e.g., 404, 500)
      throw new Error(`Server responded with status: ${res.status}`);
    }
    return res.json() as Promise<MissionPayload>;
  } catch (error) {
    console.error("Error getting new mission:", error);
    throw new Error("Server responded with status");
  }
}

/**
 * Saves a mission with custom name
 * @param missionId - Mission ID to save
 * @param nameCustom - Custom name for the mission
 * @throws {Error} On network issues
 */
export async function postSaveMission(missionId: number, nameCustom: string) {
  // For now, consider the data is stored on a static `users.json` file
  try {
    const res = await fetch("http://127.0.0.1:8000/mission/save-mission", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mission_id: missionId,
        name_custom: nameCustom,
      }),
    });
    if (!res.ok) {
      // Check if the response status is not OK (e.g., 404, 500)
      throw new Error(`Server responded with status: ${res.status}`);
    }
  } catch (error) {
    console.error("Error getting new mission:", error);
    throw new Error("Server responded with status");
  }
}

/**
 * Fetches mission details by ID
 * @param mission_id - Mission ID to fetch
 * @returns {Promise<MissionPayload | null>} Mission data or null if not found
 * @throws {Error} On network issues
 */
export async function getMission(
  mission_id: number
): Promise<MissionPayload | null> {
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/mission/mission/${mission_id}`,
      {
        method: "GET",
      }
    );
    if (!res.ok) {
      // Check if the response status is not OK (e.g., 404, 500)
      throw new Error(`Server responded with status: ${res.status}`);
    }
    return res.json() as Promise<MissionPayload>;
  } catch (error) {
    console.error("Error getting new mission:", error);
    throw new Error("Server responded with status");
  }
}

/**
 * Lists all available missions
 * @returns {Promise<MissionPayload[]>} Array of mission summaries
 * @throws {Error} On network issues
 */
export async function getListMissions(): Promise<MissionPayload[]> {
  // For now, consider the data is stored on a static `users.json` file
  try {
    const res = await fetch("http://127.0.0.1:8000/mission/missions", {
      method: "GET",
    });
    if (!res.ok) {
      // Check if the response status is not OK (e.g., 404, 500)
      throw new Error(`Server responded with status: ${res.status}`);
    }
    return res.json() as Promise<MissionPayload[]>;
  } catch (error) {
    console.error("Error getting new mission:", error);
    throw new Error("Server responded with status");
  }
}

/**
 * Loads a full mission with interaction history
 * @param mission_id - Mission ID to load
 * @returns {Promise<MissionLoadData>} Complete mission data with interactions
 * @throws {Error} On network issues
 */
export async function getLoadMissions(
  mission_id: number
): Promise<MissionLoadData> {
  // For now, consider the data is stored on a static `users.json` file
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/mission/load-mission/${mission_id}`,
      {
        method: "GET",
      }
    );
    if (!res.ok) {
      // Check if the response status is not OK (e.g., 404, 500)
      throw new Error(`Server responded with status: ${res.status}`);
    }
    const data = (await res.json()) as MissionLoadPayload;
    const convertedData: MissionLoadData = {
      mission: data.mission,
      interactions: data.interactions.map(
        (interaction: { user_input: string; llm_output: string }) => {
          return {
            playerInput: interaction.user_input,
            llmOutput: interaction.llm_output,
          };
        }
      ),
    };
    return convertedData;
  } catch (error) {
    console.error("Error getting load mission:", error);
    throw new Error("Server responded with status");
  }
}
