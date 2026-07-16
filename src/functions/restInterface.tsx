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
 * - Base: Configured via `API_BASE` constant (e.g., http://127.0.0.1:8000).
 * - Includes: `/interaction/` and `/mission/` routes for game interactions and mission management respectively.
 * - Also includes `/tts/` routes for Text-to-Speech services.
 *
 * @version 1.0.0
 * @author YourName/YourTeam
 */

import { CharacterRecord, Interaction, Mission, MissionLoadData } from "../models/MissionModels";
import {
  CharacterSheetPayload,
  MissionPayload,
  PromptPayload,
  LlmSettingsOverviewPayload,
  SaveLlmSettingsPayload,
  KnownLocalModel,
} from "../models/RestInterface";
import { PlayerInputData } from "../models/PlayerInputData";
import { MissionLoadPayload } from "../models/RestInterface";
import { CharacterProps } from "../models/CharacterProps";
import { GameType } from "../models/Types";
import { auth } from "../auth/firebase";

////////////////////
// Configuration  //
////////////////////

/**
 * The base URL for all backend API requests.
 * @constant
 */
const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const USE_FIREBASE = import.meta.env.VITE_USE_FIREBASE !== "false";

////////////////////
// Helper Logic   //
////////////////////

/** Thrown when the backend reports `error_code: "llm_not_configured"` (HTTP
 * 428) — the user hasn't picked an LLM provider/model, or a key-based
 * provider is missing its key. `message` is the backend's own friendly,
 * user-facing text, ready to show as-is. */
export class LlmNotConfiguredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LlmNotConfiguredError";
  }
}

/** Reads a non-OK response body and, if it carries the backend's
 * `llm_not_configured` shape, returns its friendly `detail` message so
 * callers can throw `LlmNotConfiguredError` instead of a generic error. */
async function readLlmNotConfiguredDetail(res: Response): Promise<string | null> {
  try {
    const data = await res.clone().json();
    if (data?.error_code === "llm_not_configured" && typeof data.detail === "string") {
      return data.detail;
    }
  } catch {
    // Not JSON, or doesn't match the shape — not this error.
  }
  return null;
}

/**
 * Performs a fetch-based API request with streamlined error reporting and JSON parsing.
 * It's a generic function designed to be used by other specific API call functions.
 *
 * @async
 * @template T - The expected type of the JSON response from the API.
 * @param {string} path - API endpoint path (relative to `API_BASE`).
 * @param {"GET"|"POST"} method - HTTP method.
 * @param {any} [body] - Optional body payload for POST requests. This will be JSON.stringify-ed.
 * @returns {Promise<T>} - Resolves to the parsed JSON response of type `T`.
 * @throws {Error} If the fetch operation, network request, or response processing (e.g., non-OK status) fails.
 *                 The error message will contain details about the URL and status code if available.
 */
async function apiRequest<T>(
  path: string,
  method: "GET" | "POST" | "DELETE",
  body?: any,
): Promise<T> {
  const url = `${API_BASE}${path}`;
  try {
    let headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (USE_FIREBASE) {
      // Add Firebase token if available
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers["Authorization"] = `Bearer ${token}`;
      }
    } else {
      // Demo mode: send username from localStorage
      const demoUser = localStorage.getItem("demoUser") || "demo-user";
      headers["X-Demo-User"] = demoUser;
    }
    const res = await fetch(url, {
      method,
      headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    if (!res.ok) {
      const llmNotConfiguredDetail = await readLlmNotConfiguredDetail(res);
      if (llmNotConfiguredDetail) {
        throw new LlmNotConfiguredError(llmNotConfiguredDetail);
      }
      let errorDetail = "";
      try {
        errorDetail = "\n" + (await res.text());
      } catch {}
      throw new Error(
        `Request to ${url} failed [${res.status}]: ${errorDetail}`,
      );
    }

    // 204 No Content? (rare, but handle)
    if (res.status === 204) {
      return {} as T;
    }

    const json = (await res.json()) as T;
    return json;
  } catch (err) {
    if (err instanceof LlmNotConfiguredError) {
      throw err;
    }
    if (err instanceof TypeError) {
      // fetch() rejects with a TypeError (e.g. "Failed to fetch") when the
      // network request itself never completes, as opposed to the server
      // responding with a non-OK status.
      throw new Error(
        `Could not reach the server at ${API_BASE}. Is the backend running?`,
      );
    }
    throw new Error(
      `API request to "${path}" failed: ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
  }
}

////////////////////
// Main API Logic //
////////////////////

/**
 * Sends player input to the LLM and streams the response in real-time.
 * This function is designed for client-side usage to handle interactive scenarios
 * where the LLM's response is displayed as it arrives.
 * It constructs a payload including the current prompt and, optionally, the previous interaction,
 * then makes a POST request to the `/interaction/gamemaster-send` endpoint.
 * The response is expected to be a stream of JSON objects, each containing a `text` field.
 * These chunks are decoded, accumulated, and passed to the `setStateCallback` to update the UI.
 *
 * @async
 * @param {PlayerInputData} params - Object containing parameters for sending player input.
 * @param {number} params.missionId - The ID of the current mission.
 * @param {function({ llmOutput: string }): void} params.setStateCallback - A callback function
 *   that is invoked with the accumulated LLM output as new chunks arrive. This is used to update the
 *   application's state and display the streaming text.
 * @param {string} params.playerInputField - The text input provided by the player.
 * @param {Interaction} [params.prevInteraction] - Optional. The previous interaction (player input and LLM output)
 *   to provide context to the LLM.
 * @returns {Promise<void>} - A promise that resolves when the stream has ended.
 * @throws {Error} On network errors, if the API returns a non-OK response, if the response body cannot be read,
 *                 or if there's an error during stream processing/decoding. An error is also thrown into `setStateCallback`
 *                 if an error occurs during streaming.
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
    let headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (USE_FIREBASE) {
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers["Authorization"] = `Bearer ${token}`;
      }
    } else {
      const demoUser = localStorage.getItem("demoUser") || "demo-user";
      headers["X-Demo-User"] = demoUser;
    }
    const response = await fetch(`${API_BASE}/interaction/gamemaster-send`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const llmNotConfiguredDetail = await readLlmNotConfiguredDetail(response);
      if (llmNotConfiguredDetail) {
        throw new LlmNotConfiguredError(llmNotConfiguredDetail);
      }
      throw new Error(`Failed to stream LLM: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Unable to get reader from response body.");
    }

    let accumulatedText = "";
    let accumulatedThinking = "";

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
          if (jsonData.type === "thinking") {
            accumulatedThinking += jsonData.content;
          } else if (jsonData.type === "text") {
            accumulatedText += jsonData.content;
          }
        } catch {
          // Could be an incomplete/faulty chunk, just log for debugging
          console.error("Unable to parse JSON chunk from LLM stream:", line);
        }
      }
      setStateCallback({
        llmOutput: accumulatedText,
        llmThinking: accumulatedThinking,
      });
    }
    setStateCallback({
      llmOutput: accumulatedText.trim(),
      llmThinking: accumulatedThinking.trim(),
    });
  } catch (err) {
    setStateCallback({
      llmOutput: "❌ Error receiving LLM response.",
      llmThinking: "",
    });
    if (err instanceof LlmNotConfiguredError) {
      throw err;
    }
    throw new Error(
      `Error streaming LLM output: ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
  }
}

/**
 * Sends a command to the backend to stop any ongoing LLM generation for the current session or context.
 * This is typically used to allow the user to interrupt a long or unwanted response from the LLM.
 *
 * @async
 * @returns {Promise<void>} - A promise that resolves when the stop command has been successfully sent.
 * @throws {Error} Propagated from `apiRequest` if the network request or server response fails.
 */
export async function postStopGeneration(): Promise<void> {
  await apiRequest<void>("/interaction/stop-generation", "POST", {});
}

/**
 * Creates a new mission on the server.
 *
 * @async
 * @param {object} payload - Payload containing the necessary information to create a new mission.
 * @param {GameType} payload.game_type - The specific game type for the new mission (e.g., Shadowrun, Vampire).
 * @param {string} payload.background - A string providing the background story or context for the new mission.
 * @param {string} payload.detailed_background - A string providing a more detailed background story or context for the new mission.
 * @param {boolean} payload.non_hero_mode - A boolean indicating whether the mission is in non-hero mode.
 * @param {boolean} payload.oracle - A boolean indicating whether the mission uses the oracle feature.
 * @returns {Promise<MissionPayload>} - A promise that resolves with the data of the newly created mission,
 *                                      as defined by {@link MissionPayload}.
 * @throws {Error} Propagated from `apiRequest` if the network request or server response fails.
 */
export async function postNewMission(payload: {
  game_type: GameType;
  background: string;
  detailed_background: string;
  non_hero_mode: boolean;
  oracle: boolean;
}): Promise<MissionPayload> {
  return await apiRequest<MissionPayload>(
    "/mission/new-mission",
    "POST",
    payload,
  );
}

/**
 * Saves the current mission progress, associating it with a custom name provided by the user.
 *
 * @async
 * @param {number} missionId - The unique identifier of the mission to be saved.
 * @param {string} nameCustom - An arbitrary custom name for the mission, provided by the user for later identification.
 * @returns {Promise<void>} - A promise that resolves when the mission has been successfully saved.
 * @throws {Error} Propagated from `apiRequest` if the network request or server response fails.
 */
export async function postSaveMission(
  missionId: number,
  nameCustom: string,
): Promise<void> {
  await apiRequest<void>("/mission/save-mission", "POST", {
    mission_id: missionId,
    name_custom: nameCustom,
  });
}

/**
 * Fetches detailed meta-information for a specific mission by its ID.
 *
 * @async
 * @param {number} mission_id - The numeric ID of the mission to retrieve.
 * @returns {Promise<MissionPayload | null>} - A promise that resolves with the mission's metadata (see {@link MissionPayload}).
 *                                            Returns `null` if the mission is not found (though the current `apiRequest`
 *                                            implementation might throw an error for a 404, this indicates intended behavior
 *                                            if the API were to return, e.g., 204 or a specific "not found" JSON).
 * @throws {Error} Propagated from `apiRequest` if the network request or server response fails.
 */
export async function getMission(
  mission_id: number,
): Promise<MissionPayload | null> {
  return await apiRequest<MissionPayload>(
    `/mission/mission/${mission_id}`,
    "GET",
  );
}

/**
 * Fetches a list of all available missions, providing summary information for each.
 * This is typically used to display a list of missions that the user can choose to load.
 *
 * @async
 * @returns {Promise<MissionPayload[]>} - A promise that resolves with an array of mission descriptors ({@link MissionPayload}).
 *                                       Each object in the array represents a mission summary.
 * @throws {Error} Propagated from `apiRequest` if the network request or server response fails.
 */
export async function getListMissions(): Promise<MissionPayload[]> {
  return await apiRequest<MissionPayload[]>("/mission/missions", "GET");
}

/**
 * Loads a complete mission, including all its interaction history, for playback or editing.
 * This function fetches the raw mission data ({@link MissionLoadPayload}) from the API
 * and then transforms it into a client-friendly format ({@link MissionLoadData}).
 * The transformation involves mapping API field names (e.g., `mission_id`) to client-side names (e.g., `missionId`)
 * and restructuring the interactions array.
 *
 * @async
 * @param {number} mission_id - The numeric identifier of the mission to load.
 * @returns {Promise<MissionLoadData>} - A promise that resolves with the full mission details and its interactions,
 *                                       formatted for client-side use.
 * @throws {Error} Propagated from `apiRequest` if the network request or server response fails.
 *                 Also throws if the received data structure is not as expected (e.g., `data.interactions` not an array).
 */
export async function getLoadMissions(
  mission_id: number,
): Promise<MissionLoadData> {
  const data = await apiRequest<MissionLoadPayload>(
    `/mission/load-mission/${mission_id}`,
    "GET",
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

  const characterSheets: CharacterRecord[] = Array.isArray(data.character_sheets)
    ? data.character_sheets.map((s) => ({
        sheetId: s.character_sheet_id,
        isProtagonist: s.is_protagonist,
        isNpc: s.is_npc,
        isActive: s.is_active,
        data: s.content,
      }))
    : [];

  return { mission, interactions, characterSheets };
}

/**
 * Sends text to an external Text-to-Speech (TTS) service and returns the resulting MP3 audio as a Blob.
 * This function is suitable for scenarios where the entire audio file is needed before playback can begin.
 * The caller is responsible for creating an Object URL from the Blob and managing playback.
 *
 * @async
 * @param {string} text - The text content to be converted to speech.
 * @returns {Promise<Blob>} - A promise that resolves with a Blob containing the MP3 audio data.
 * @throws {Error} If the TTS request to the backend fails (e.g., network error, non-OK HTTP response).
 */
export async function upsertCharacterSheet(payload: {
  character_sheet_id: number | null;
  mission_id: number;
  name: string;
  game_type: string;
  content: CharacterProps;
  is_protagonist: boolean;
  is_npc?: boolean;
  is_active?: boolean;
}): Promise<CharacterSheetPayload> {
  return await apiRequest<CharacterSheetPayload>(
    "/mission/upsert-character-sheet",
    "POST",
    { ...payload, is_npc: payload.is_npc ?? false, is_active: payload.is_active ?? true },
  );
}

/**
 * Marks an NPC as active/inactive in the current scene without rewriting its
 * full content blob, so only active NPCs are injected into the LLM prompt.
 */
export async function setNpcActive(
  character_sheet_id: number,
  mission_id: number,
  is_active: boolean,
): Promise<void> {
  await apiRequest<void>("/mission/set-npc-active", "POST", {
    character_sheet_id,
    mission_id,
    is_active,
  });
}

/**
 * Generates a new NPC via the backend's LLM pipeline (profile -> stats -> equipment)
 * and persists it as a character sheet for the given mission.
 */
export async function createNpc(payload: {
  mission_id: number;
  name: string;
}): Promise<CharacterSheetPayload> {
  return await apiRequest<CharacterSheetPayload>(
    "/mission/create-npc",
    "POST",
    payload,
  );
}

export async function deleteCharacterSheet(
  character_sheet_id: number,
  mission_id: number,
): Promise<void> {
  await apiRequest<void>("/mission/delete-character-sheet", "POST", {
    character_sheet_id,
    mission_id,
  });
}

export async function getCharacterSheets(
  mission_id: number,
): Promise<CharacterRecord[]> {
  const sheets = await apiRequest<CharacterSheetPayload[]>(
    `/mission/character-sheets/${mission_id}`,
    "GET",
  );
  return sheets.map((s) => ({
    sheetId: s.character_sheet_id,
    isProtagonist: s.is_protagonist,
    isNpc: s.is_npc,
    isActive: s.is_active,
    data: s.content,
  }));
}

export async function sendTextToSpeech(text: string, voice: string): Promise<Blob> {
  // Send POST request to TTS service, expecting a Blob (audio/mp3)
  const response = await fetch(`${API_BASE}/tts/tts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, voice }),
  });

  if (!response.ok) {
    throw new Error(
      `TTS request failed: ${response.status} ${response.statusText}`,
    );
  }

  return await response.blob();
}

/**
 * Sends text to a Text-to-Speech (TTS) service and streams the audio response.
 * This function is designed for real-time audio playback as data arrives from the server.
 * It uses the `MediaSource` API to feed audio chunks (Opus codec in WebM container)
 * into an `HTMLAudioElement`.
 *
 * The process involves:
 * 1. Making a POST request to the `/tts/tts-stream` endpoint.
 * 2. Creating an `HTMLAudioElement` and a `MediaSource` instance.
 * 3. Setting the `audio.src` to an object URL created from the `MediaSource`.
 * 4. When the `MediaSource` opens, a `SourceBuffer` is added with the `audio/webm; codecs="opus"` MIME type.
 * 5. Reading chunks from the response body stream.
 * 6. Appending these chunks to the `SourceBuffer` via a queue (`appendQueue`) to manage backpressure.
 *    - The `tryAppend` inner function handles appending data from the queue when the buffer is not updating.
 * 7. Initiating playback (`audio.play()`) after the first chunk is appended to the `SourceBuffer`.
 *    This is done in a `setTimeout` within the `updateend` event of the first append to ensure the buffer is ready.
 * 8. When the stream ends, `mediaSource.endOfStream()` is called.
 * 9. The `cleanup` inner function handles detaching the `MediaSource` and revoking the object URL,
 *    called on errors or when the audio element is no longer needed (implicitly by the browser garbage collector
 *    or explicitly by the calling component if it manages the audio element's lifecycle).
 *
 * @async
 * @param {string} text - The text content to be converted to speech.
 * @returns {Promise<HTMLAudioElement>} - A promise that resolves with an `HTMLAudioElement` configured
 *                                       to play the streaming audio. The caller can use this element
 *                                       to control playback (e.g., pause, volume) or listen to events.
 *                                       Playback typically starts automatically once enough data is buffered.
 * @throws {Error} If the TTS streaming request fails (e.g., network error, non-OK HTTP response),
 *                 if the browser does not support the required `MediaSource` and MIME type (`audio/webm; codecs="opus"`),
 *                 or if any error occurs during the streaming and `MediaSource` handling process.
 */
export async function sendTextToSpeechStream(
  text: string,
  voice: string,
): Promise<HTMLAudioElement> {
  const response = await fetch(`${API_BASE}/tts/tts-stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, voice }),
  });

  if (!response.ok || !response.body) {
    throw new Error(
      `TTS stream request failed: ${response.status} ${response.statusText}`,
    );
  }

  // Use WebM Opus MIME type for streaming audio
  const mimeType = 'audio/webm; codecs="opus"';
  if (!window.MediaSource.isTypeSupported(mimeType)) {
    // This error should be caught by the caller and handled, e.g., by falling back to non-streaming TTS.
    throw new Error(`Browser does not support ${mimeType} streaming`);
  }

  const mediaSource = new MediaSource();
  const audio = new Audio();
  audio.src = URL.createObjectURL(mediaSource); // Create a URL for the MediaSource to be used as audio src.

  let sourceBuffer: SourceBuffer;
  let isSourceOpen = false; // Tracks if the MediaSource 'sourceopen' event has fired and sourceBuffer is ready.

  /**
   * Cleans up resources associated with the audio element and MediaSource.
   * Detaches the src, and revokes the object URL to free resources.
   * This is crucial to prevent memory leaks.
   */
  function cleanup() {
    // Check if audio.src is an object URL before trying to revoke
    if (audio.src && audio.src.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(audio.src);
      } catch (e) {
        // console.warn("Error revoking object URL during cleanup:", e);
      }
    }
    audio.src = ""; // Detach MediaSource
  }

  mediaSource.addEventListener("sourceopen", async () => {
    try {
      isSourceOpen = true;
      sourceBuffer = mediaSource.addSourceBuffer(mimeType); // Add a source buffer for WebM/Opus audio.

      const reader = response.body!.getReader(); // Get reader for the response body stream.
      let appendQueue: Uint8Array[] = []; // Queue to hold audio chunks before appending to sourceBuffer.
      let isBufferUpdating = false; // Flag to prevent appending while sourceBuffer is busy.
      let isEnded = false; // Flag to indicate if the stream has ended.
      let initialBufferAppended = false; // Flag to track if the first chunk has been processed for initiating play.

      /**
       * Tries to append the next chunk from `appendQueue` to the `sourceBuffer`.
       * This function is called after a chunk is read from the stream or after a buffer update completes.
       * It ensures that data is only appended when the `sourceBuffer` is not updating.
       */
      const tryAppend = () => {
        if (
          !isBufferUpdating &&
          appendQueue.length > 0 &&
          isSourceOpen &&
          mediaSource.readyState === "open"
        ) {
          isBufferUpdating = true;
          const chunk = appendQueue.shift()!;
          try {
            sourceBuffer.appendBuffer(chunk); // Append the audio data chunk.
          } catch (e) {
            // console.error("Error appending buffer:", e);
            // If appendBuffer fails (e.g., if MediaSource is closed), attempt cleanup.
            if (mediaSource.readyState === "open") {
              try {
                mediaSource.endOfStream();
              } catch {}
            }
            cleanup();
            // Propagate the error or handle appropriately.
            // This might involve rejecting a promise this whole process is wrapped in.
            return;
          }

          // After the first successful append, try to start playback.
          // This relies on the browser's autoplay policies; user interaction might be required.
          if (!initialBufferAppended) {
            initialBufferAppended = true;
            // It's generally safer to attempt play() after a short delay or user gesture.
            // Here, we do it in a timeout to ensure the event loop has processed the append.
            // The 'updateend' listener for playStarter was removed as it can be tricky with
            // very short initial chunks or fast streams. A direct play attempt or a more robust
            // buffering strategy might be needed for production.
            setTimeout(() => {
              if (audio.paused) {
                // Check if audio is paused before playing
                audio.play().catch((_playError) => {
                  // console.warn("Audio play failed (autoplay policy or other error):", _playError);
                  // UI should inform user that playback couldn't start automatically.
                });
              }
            }, 100); // Small delay to allow buffer to process.
          }
        }
      };

      // Event listener for when sourceBuffer finishes updating (after appendBuffer).
      sourceBuffer.addEventListener("updateend", () => {
        isBufferUpdating = false;
        tryAppend(); // Try to append next chunk in queue.
        // If the stream has ended and the queue is empty, and MediaSource is still open, end it.
        if (
          isEnded &&
          appendQueue.length === 0 &&
          mediaSource.readyState === "open"
        ) {
          try {
            mediaSource.endOfStream();
          } catch (e) {
            // console.warn("Error during endOfStream:", e);
          }
        }
      });

      // Loop to read chunks from the response stream.
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          isEnded = true;
          // If stream is done, and buffer isn't busy & queue is empty, and MediaSource is open, try to end it.
          if (
            !isBufferUpdating &&
            appendQueue.length === 0 &&
            mediaSource.readyState === "open"
          ) {
            try {
              mediaSource.endOfStream();
            } catch (e) {
              // console.warn("Error during endOfStream after done:", e);
            }
          }
          break; // Exit loop.
        }
        if (value?.length) {
          appendQueue.push(value); // Add chunk to queue.
          tryAppend(); // Attempt to append from queue.
        }
      }
    } catch (err) {
      // console.error("Error in MediaSource sourceopen handler:", err);
      cleanup(); // Ensure resources are cleaned up on error.
      // Attempt to gracefully end stream if MediaSource is still open.
      if (mediaSource.readyState === "open") {
        try {
          mediaSource.endOfStream(); // Use "network" or "decode" if appropriate error type is known
        } catch (e) {
          // console.warn("Error during emergency endOfStream:", e);
        }
      }
      // Propagate the error so the caller knows something went wrong.
      // This might involve rejecting a promise that wraps this entire function.
      throw err; // Re-throw the error to be caught by the caller of sendTextToSpeechStream
    }
  });

  // Add error event listener to the audio element itself.
  audio.addEventListener("error", (_) => {
    // console.error("HTMLAudioElement error:", audio.error, e);
    cleanup(); // Clean up on audio element errors.
  });

  audio.load(); // Important: Call load() to initiate the MediaSource lifecycle.

  return audio; // Return the HTMLAudioElement to the caller.
}

/**
 * Sends an audio blob to the backend for speech-to-text transcription.
 * @async
 * @param {Blob} audioBlob - The audio data to transcribe (should be audio/webm or audio/wav).
 * @returns {Promise<string>} - The transcribed text from the backend.
 * @throws {Error} If the request fails or the backend returns an error.
 */
/**
 * Fetches all of the current user's saved per-provider LLM settings plus
 * which provider is active. `active_provider` is `null` when the user has
 * saved nothing, in which case the backend falls back to its deployment-wide
 * env-var configuration.
 */
export async function getLlmSettings(): Promise<LlmSettingsOverviewPayload> {
  return await apiRequest<LlmSettingsOverviewPayload>("/settings/llm", "GET");
}

/**
 * Saves the current user's LLM provider/model/API key. An omitted or blank
 * `api_key` keeps whatever key is already stored for the user.
 */
export async function saveLlmSettings(
  payload: SaveLlmSettingsPayload,
): Promise<void> {
  await apiRequest<void>("/settings/llm", "POST", payload);
}

/**
 * Deletes the current user's stored LLM settings, reverting them to the
 * backend's deployment-wide env-var configuration. Idempotent.
 */
export async function deleteLlmSettings(): Promise<void> {
  await apiRequest<void>("/settings/llm", "DELETE");
}

/**
 * Fetches the backend's known local models — each tagged with which local
 * client mode (native-completions vs native-tool-calling) it needs, so the
 * "LLM Settings" modal can offer them as one-click presets.
 */
export async function getKnownLocalModels(): Promise<KnownLocalModel[]> {
  return await apiRequest<KnownLocalModel[]>("/settings/llm/local-models", "GET");
}

export async function sendSpeechToText(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.webm");

  const response = await fetch(`${API_BASE}/tts/stt-upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      `Speech-to-text request failed: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  // Expecting { text: "..." }
  if (typeof data.text !== "string") {
    throw new Error("Invalid response from speech-to-text endpoint.");
  }
  return data.text;
}
