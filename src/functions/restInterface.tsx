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

import { Interaction, Mission, MissionLoadData } from "../models/MissionModels";
import { MissionPayload, PromptPayload } from "../models/RestInterface";
import { PlayerInputData } from "../models/PlayerInputData";
import { MissionLoadPayload } from "../models/RestInterface";
import { GameType } from "../models/Types";

////////////////////
// Configuration  //
////////////////////

/**
 * The base URL for all backend API requests.
 * @constant
 */
//const API_BASE = "http://127.0.0.1:8000";
const API_BASE = "http://192.168.0.109:8000";

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
 * @param {object} payload - Payload containing the game type and background.
 * @param {GameType} payload.game_type - The game type.
 * @param {string} payload.background - The background string.
 * @returns {Promise<MissionPayload>} - Newly created mission data.
 * @throws {Error} On network or API error.
 */
export async function postNewMission(payload: {
  game_type: GameType;
  background: string;
}): Promise<MissionPayload> {
  return await apiRequest<MissionPayload>(
    "/mission/new-mission",
    "POST",
    payload
  );
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
  const mission: Mission = {
    missionId: data.mission.mission_id,
    name: data.mission.name,
    nameCustom: data.mission.name_custom,
    description: data.mission.description,
    gameType: data.mission.game_type,
  };

  const interactions: Interaction[] = Array.isArray(data.interactions)
    ? data.interactions.map(({ user_input, llm_output }) => ({
        playerInput: user_input,
        llmOutput: llm_output,
      }))
    : [];

  return {
    mission,
    interactions,
  };
}

/**
 * Sends text to an external TTS service and returns the resulting MP3 audio as a Blob.
 * The caller is responsible for handling playback or further processing.
 *
 * @param {string} text - The text to convert to speech.
 * @returns {Promise<Blob>} - The MP3 audio as a Blob.
 * @throws {Error} If the TTS request fails.
 */
export async function sendTextToSpeech(text: string): Promise<Blob> {
  // Send POST request to TTS service, expecting a Blob (audio/mp3)
  const response = await fetch(`${API_BASE}/tts/tts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(
      `TTS request failed: ${response.status} ${response.statusText}`
    );
  }

  return await response.blob();
}

/**
 * Sends text to TTS service and streams the WebM Opus audio response.
 * Uses MediaSource with Opus-in-WebM for excellent browser support.
 *
 * @param {string} text - The text to convert to speech.
 * @returns {Promise<HTMLAudioElement>} - Audio element that plays the streaming Opus WebM audio.
 * @throws {Error} If the TTS streaming request fails or browser doesn't support WebM Opus streaming.
 */
export async function sendTextToSpeechStream(
  text: string
): Promise<HTMLAudioElement> {
  const response = await fetch(`${API_BASE}/tts/tts-stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok || !response.body) {
    throw new Error(
      `TTS stream request failed: ${response.status} ${response.statusText}`
    );
  }

  // Use WebM Opus MIME type for streaming audio
  const mimeType = 'audio/webm; codecs="opus"';
  if (!window.MediaSource.isTypeSupported(mimeType)) {
    throw new Error(`Browser does not support ${mimeType} streaming`);
  }

  const mediaSource = new MediaSource();
  const audio = new Audio();
  audio.src = URL.createObjectURL(mediaSource);

  let sourceBuffer: SourceBuffer;
  let isSourceOpen = false;

  function cleanup() {
    audio.src = "";
    try {
      URL.revokeObjectURL(audio.src);
    } catch {}
  }

  mediaSource.addEventListener("sourceopen", async () => {
    try {
      isSourceOpen = true;
      sourceBuffer = mediaSource.addSourceBuffer(mimeType);

      const reader = response.body!.getReader();
      let appendQueue: Uint8Array[] = [];
      let isBufferUpdating = false;
      let isEnded = false;
      let initialBuffer = false;

      // Function to append next chunk in queue if possible
      const tryAppend = () => {
        if (!isBufferUpdating && appendQueue.length > 0 && isSourceOpen) {
          isBufferUpdating = true;
          const chunk = appendQueue.shift()!;
          sourceBuffer.appendBuffer(chunk);

          // After the first append, start playback
          if (!initialBuffer) {
            initialBuffer = true;
            sourceBuffer.addEventListener("updateend", function playStarter() {
              sourceBuffer.removeEventListener("updateend", playStarter);
              setTimeout(() => {
                audio.play().catch((e) => {
                  /* Ignore play failures (e.g. autoplay policy) */
                });
              }, 0);
            });
          }
        }
      };

      sourceBuffer.addEventListener("updateend", () => {
        isBufferUpdating = false;
        tryAppend();
        // If stream ended and no data left, end MediaSource
        if (
          isEnded &&
          appendQueue.length === 0 &&
          mediaSource.readyState === "open"
        ) {
          try {
            mediaSource.endOfStream();
          } catch {}
        }
      });

      // Read loop
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          isEnded = true;
          if (
            !isBufferUpdating &&
            appendQueue.length === 0 &&
            mediaSource.readyState === "open"
          ) {
            try {
              mediaSource.endOfStream();
            } catch {}
          }
          break;
        }
        if (value?.length) {
          appendQueue.push(value);
          tryAppend();
        }
      }
    } catch (err) {
      cleanup();
      // Attempt to end stream
      if (mediaSource.readyState === "open") {
        try {
          mediaSource.endOfStream("decode");
        } catch {}
      }
      throw err;
    }
  });

  audio.addEventListener("error", cleanup);
  audio.load();

  return audio;
}
