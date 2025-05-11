/**
 * @hook useGamemasterCallbacks
 *
 * React hook providing all callback functions for managing game master interactions in an LLM-based adventure game.
 * Handles mission lifecycle, player input processing, and conversation state management.
 *
 * ## Key Functionality:
 * - Mission management (create/save/list/load)
 * - Player input processing and LLM interaction
 * - Conversation history maintenance
 * - Generation control (start/stop/regenerate)
 *
 * ## State Management:
 * - Maintains mission ID and adventure name
 * - Tracks current and previous player inputs
 * - Manages LLM output and interaction history
 *
 * ## Usage Example:
 * ```tsx
 * const callbacks = useGamemasterCallbacks({
 *   mission,
 *   setMission,
 *   setAdventure,
 *   interactions,
 *   setInteractions,
 *   playerInputOld,
 *   setPlayerInputOld,
 *   llmOutput,
 *   setLlmOutput,
 *   playerInput,
 *   setPlayerInput,
 *   reset,
 * });
 * ```
 *
 * @param {UseGameCallbacksProps} props - Props containing all state, setters, values, and reset function required to manage the game master.
 * @returns {object} An object with all game master callback utilities.
 */

import { useCallback } from "react";
import {
  sendPlayerInputToLlm,
  postStopGeneration,
  postNewMission,
  postSaveMission,
  getListMissions,
  getLoadMissions,
} from "../functions/restInterface";
import { MissionOption, Interaction } from "../models/MissionModels";
import { MissionPayload } from "../models/RestInterface";
import { GameType } from "../models/Types";

/**
 * @typedef {object} UseGameCallbacksProps
 * Props required for useGamemasterCallbacks.
 * @property {number | null} mission - Current mission ID.
 * @property {(val: number|null) => void} setMission - Updates current mission ID.
 * @property {(val: string) => void} setAdventure - Updates current adventure name.
 * @property {Interaction[]} interactions - Conversation history.
 * @property {(ints: Interaction[]) => void} setInteractions - Updates conversation history.
 * @property {string} playerInputOld - Previous player input.
 * @property {(val: string) => void} setPlayerInputOld - Updates previous input.
 * @property {string} llmOutput - Current LLM output.
 * @property {(val: string) => void} setLlmOutput - Updates LLM output.
 * @property {string} playerInput - Current player input.
 * @property {(val: string) => void} setPlayerInput - Updates player input.
 * @property {() => Promise<void>} reset - Resets the game state.
 */
type UseGameCallbacksProps = {
  mission: number | null;
  setMission: (val: number | null) => void;
  setAdventure: (val: string) => void;
  interactions: Interaction[];
  setInteractions: (ints: Interaction[]) => void;
  playerInputOld: string;
  setPlayerInputOld: (val: string) => void;
  llmOutput: string;
  setLlmOutput: (val: string) => void;
  playerInput: string;
  setPlayerInput: (val: string) => void;
  reset: () => Promise<void>;
  setGameType: (val: GameType) => void;
};

/**
 * useGamemasterCallbacks implementation
 * @param {UseGameCallbacksProps} props
 * @returns {{
 *   sendNewMissionGenerate: (game: GameType, background: string) => Promise<void>,
 *   saveMission: (nameCustom: string) => Promise<void>,
 *   listMissions: () => Promise<Array<{ label: string, value: number, name_custom?: string }>>,
 *   loadMission: (missionId: number) => Promise<void>,
 *   sendRegenerate: () => Promise<void>,
 *   sendPlayerInput: () => Promise<void>,
 *   stopGeneration: () => Promise<void>,
 *   changeCallbackPlayerInputOld: (value: string) => void,
 *   changeCallbackPlayerInput: (value: string) => void,
 *   changeCallbackLlmOutput: (value: string) => void,
 * }}
 */
export function useGamemasterCallbacks({
  mission,
  setMission,
  setAdventure,
  interactions,
  setInteractions,
  playerInputOld,
  setPlayerInputOld,
  llmOutput,
  setLlmOutput,
  playerInput,
  setPlayerInput,
  reset,
  setGameType,
}: UseGameCallbacksProps) {
  /**
   * Utility that strips trailing prompt-like phrases from the LLM output.
   * For example: removes, "What do you want to do?"
   * @param {string} llmOutput
   * @returns {string} Cleaned LLM output without trailing interaction prompts.
   * @private
   */
  function stripOutput(llmOutput: string): string {
    const regexPattern =
      /\b(?:What do you want to |What would you like to )\S[\S\s]*\?\s*$/;
    return llmOutput.replace(regexPattern, "");
  }

  /**
   * Generates a new mission (and resets state).
   * Also updates the adventure name and active mission ID.
   * @async
   * @param {GameType} game - The game identifier.
   * @param {string} background - The background description for the mission.
   * @returns {Promise<void>}
   */
  const sendNewMissionGenerate = useCallback(
    async (gameType: GameType, background: string): Promise<void> => {
      await reset();
      const response = await postNewMission({
        game_type: gameType,
        background,
      });
      if (response !== null) {
        setMission(response.mission_id);
        setAdventure(response.name);
      }
    },
    [reset, setMission, setAdventure]
  );

  /**
   * Saves the current mission, using a user-specified custom name.
   * @async
   * @param {string} nameCustom - Custom mission name.
   * @returns {Promise<void>}
   */
  const saveMission = useCallback(
    async (nameCustom: string): Promise<void> => {
      if (mission !== null) {
        await postSaveMission(mission, nameCustom);
      }
    },
    [mission]
  );

  /**
   * Lists all available missions in the system.
   * Returns an array of objects suitable for use in select/dropdown fields.
   * Each object includes the mission label, value, optional custom name, and game type.
   * @async
   * @returns {Promise<MissionOption[]>}
   */
  const listMissions = useCallback(async (): Promise<MissionOption[]> => {
    const missionPayloads = await getListMissions();
    return missionPayloads.map((mission: MissionPayload) => ({
      label: mission.name,
      value: mission.mission_id,
      nameCustom: mission.name_custom, // Map name_custom to nameCustom
      gameType: mission.game_type, // Map game_type to gameType
    }));
  }, []);

  /**
   * Loads a mission and its interaction history by mission id.
   * Sets state for mission ID, adventure name, player input, LLM output, and prior interactions.
   * @async
   * @param {number} missionId
   * @returns {Promise<void>}
   */
  const loadMission = useCallback(
    async (missionId: number): Promise<void> => {
      const loaded = await getLoadMissions(missionId);
      setMission(loaded.mission.mission_id);
      setAdventure(loaded.mission.name_custom || loaded.mission.name);
      setGameType(loaded.mission.game_type); // Set the game type
      const loadedInteractions = loaded.interactions;
      if (loadedInteractions.length > 0) {
        const last_interaction = loadedInteractions.pop();
        setInteractions(loadedInteractions);
        setPlayerInputOld(last_interaction?.playerInput ?? "");
        setLlmOutput(last_interaction?.llmOutput ?? "");
      } else {
        setInteractions([]);
        setPlayerInputOld("");
        setLlmOutput("");
      }
    },
    [
      setMission,
      setAdventure,
      setGameType,
      setInteractions,
      setPlayerInputOld,
      setLlmOutput,
    ]
  );

  /**
   * Requests the LLM to regenerate output for the last player input.
   * Uses the previous player input and LLM output as context.
   * @async
   * @returns {Promise<void>}
   */
  const sendRegenerate = useCallback(async (): Promise<void> => {
    if (mission !== null && playerInputOld !== "") {
      const prevInteraction =
        playerInputOld !== "" && llmOutput !== ""
          ? { playerInput: playerInputOld, llmOutput: llmOutput }
          : undefined;

      await sendPlayerInputToLlm({
        missionId: mission,
        setStateCallback: ({ llmOutput }) => setLlmOutput(llmOutput),
        prevInteraction: prevInteraction,
      });
    }
  }, [mission, playerInputOld, llmOutput, setLlmOutput]);

  /**
   * Sends the current player input to the LLM for a response.
   * Updates state: previous/current player input, output, and interaction history.
   * Handles errors gracefully by rolling back state if the send fails.
   * @async
   * @returns {Promise<void>}
   */
  const sendPlayerInput = useCallback(async (): Promise<void> => {
    if (mission !== null && playerInput !== "") {
      const strippedLlmOutput = stripOutput(llmOutput);
      const prevInteraction =
        playerInputOld !== "" && strippedLlmOutput !== ""
          ? { playerInput: playerInputOld, llmOutput: strippedLlmOutput }
          : undefined;

      const stepPlayerInput = playerInput;
      const stepPlayerInputOld = playerInputOld;
      const stepLlmOutputOld = llmOutput;

      if (prevInteraction) {
        setInteractions([...interactions, prevInteraction]);
      }

      setPlayerInputOld(stepPlayerInput);
      setLlmOutput("");
      setPlayerInput("");

      try {
        await sendPlayerInputToLlm({
          missionId: mission,
          setStateCallback: ({ llmOutput }) => setLlmOutput(llmOutput),
          playerInputField: stepPlayerInput,
          prevInteraction: prevInteraction,
        });
      } catch (error) {
        setPlayerInputOld(stepPlayerInputOld);
        setLlmOutput(stepLlmOutputOld);
        setPlayerInput(stepPlayerInput);
      }
    }
  }, [
    mission,
    interactions,
    llmOutput,
    playerInput,
    playerInputOld,
    setPlayerInputOld,
    setLlmOutput,
    setPlayerInput,
    setInteractions,
  ]);

  /**
   * Stops the ongoing LLM response generation (if present).
   * @async
   * @returns {Promise<void>}
   */
  const stopGeneration = useCallback(async (): Promise<void> => {
    try {
      await postStopGeneration();
    } catch (error) {
      // Error is swallowed: caller may handle via UI if desired.
    }
  }, []);

  /**
   * Change handler for previous player input state.
   * @param {string} value - New previous input string.
   */
  const changeCallbackPlayerInputOld = useCallback(
    (value: string) => {
      setPlayerInputOld(value);
    },
    [setPlayerInputOld]
  );
  /**
   * Change handler for current player input.
   * @param {string} value - New player input string.
   */
  const changeCallbackPlayerInput = useCallback(
    (value: string) => {
      setPlayerInput(value);
    },
    [setPlayerInput]
  );
  /**
   * Change handler for LLM output.
   * @param {string} value - New LLM output string.
   */
  const changeCallbackLlmOutput = useCallback(
    (value: string) => {
      setLlmOutput(value);
    },
    [setLlmOutput]
  );

  return {
    sendNewMissionGenerate,
    saveMission,
    listMissions,
    loadMission,
    sendRegenerate,
    sendPlayerInput,
    stopGeneration,
    changeCallbackPlayerInputOld,
    changeCallbackPlayerInput,
    changeCallbackLlmOutput,
  };
}

export default useGamemasterCallbacks;
