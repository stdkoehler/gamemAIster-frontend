/**
 * @hook useGamemasterCallbacks
 * @version 1.0.0
 * @author YourName/YourTeam
 *
 * @description
 * A comprehensive React hook that encapsulates all callback functions necessary for managing
 * game master interactions within an LLM-driven adventure game. This hook is central to
 * handling the game's lifecycle, processing player inputs, managing conversation state,
 * and interacting with the backend services defined in `restInterface.tsx`.
 *
 * It simplifies the main game component by abstracting the logic for:
 * - Creating, saving, listing, and loading game missions.
 * - Sending player inputs to the LLM and handling responses.
 * - Managing the history of interactions.
 * - Controlling LLM generation (starting, stopping, regenerating).
 *
 * The hook relies on several state variables and their setters, which must be provided
 * as props. This allows `useGamemasterCallbacks` to remain stateless itself while
 * orchestrating complex state changes in the parent component.
 *
 * @param {UseGameCallbacksProps} props - An object containing all necessary state values,
 * setter functions, and a reset function required for the hook to operate.
 * See {@link UseGameCallbacksProps} for detailed property descriptions.
 *
 * @returns {GamemasterCallbacks} An object containing all the callback functions
 * for game master utilities. See {@link GamemasterCallbacks} for detailed property descriptions.
 *
 * @example
 * ```tsx
 * // Inside your main game component:
 * const [mission, setMission] = useState<number | null>(null);
 * const [adventureName, setAdventureName] = useState<string>("");
 * // ... other state variables ...
 *
 * const gamemasterUtils = useGamemasterCallbacks({
 *   mission,
 *   setMission,
 *   setAdventure: setAdventureName,
 *   // ... other props ...
 *   reset: async () => { /* logic to reset all game state */ },
 *   setGameType: (gameType) => { /* logic to set game type state */ },
 * });
 *
 * // Later, you can use the callbacks:
 * // gamemasterUtils.sendNewMissionGenerate(GameType.SHADOWRUN, "A new adventure begins...");
 * // gamemasterUtils.sendPlayerInput();
 * ```
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
import { Mission, Interaction } from "../models/MissionModels";
import { MissionPayload } from "../models/RestInterface";
import { GameType } from "../models/Types";

/**
 * @typedef {object} UseGameCallbacksProps
 * @description Props required by the {@link useGamemasterCallbacks} hook.
 * This object bundles all external state and state setters that the hook needs to interact with.
 *
 * @property {number | null} mission - The ID of the currently active mission, or `null` if no mission is active.
 * @property {function(val: number|null): void} setMission - Setter function to update the current mission ID.
 * @property {function(val: string): void} setAdventure - Setter function to update the name of the current adventure or mission.
 * @property {Interaction[]} interactions - An array representing the history of interactions (player inputs and LLM outputs) in the current mission.
 * @property {function(ints: Interaction[]): void} setInteractions - Setter function to update the conversation history.
 * @property {string} playerInputOld - The player's input from the most recent previous turn. Used for context or regeneration.
 * @property {function(val: string): void} setPlayerInputOld - Setter function to update the previous player input.
 * @property {string} llmOutput - The LLM's output from the most recent turn.
 * @property {function(val: string): void} setLlmOutput - Setter function to update the current LLM output.
 * @property {string} playerInput - The player's current input, typically from an input field, before it's submitted.
 * @property {function(val: string): void} setPlayerInput - Setter function to update the current player input field value.
 * @property {function(): Promise<void>} reset - An asynchronous function that resets the entire game state to its initial values.
 * @property {function(val: GameType): void} setGameType - Setter function to update the {@link GameType} of the current mission (e.g., when loading a mission).
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
 * @typedef {object} GamemasterCallbacks
 * @description Defines the structure of the object returned by the {@link useGamemasterCallbacks} hook.
 * This object contains all the callback functions that can be used to manage the game.
 *
 * @property {function(gameType: GameType, background: string): Promise<void>} sendNewMissionGenerate - Initiates the creation of a new game mission.
 * @property {function(nameCustom: string): Promise<void>} saveMission - Saves the current mission state with a custom name.
 * @property {function(): Promise<Mission[]>} listMissions - Fetches a list of all previously saved missions.
 * @property {function(missionId: number): Promise<void>} loadMission - Loads a specific mission and its history by its ID.
 * @property {function(): Promise<void>} sendRegenerate - Requests the LLM to regenerate its last response, using previous context.
 * @property {function(): Promise<void>} sendPlayerInput - Submits the current player's input to the LLM for processing.
 * @property {function(): Promise<void>} stopGeneration - Sends a command to stop any ongoing LLM generation.
 * @property {function(value: string): void} changeCallbackPlayerInputOld - Callback to update the state of the 'previous player input' field.
 * @property {function(value: string): void} changeCallbackPlayerInput - Callback to update the state of the 'current player input' field.
 * @property {function(value: string): void} changeCallbackLlmOutput - Callback to update the state of the 'LLM output' field.
 */

/**
 * Implementation of the `useGamemasterCallbacks` hook.
 * @param {UseGameCallbacksProps} props - The props for the hook.
 * @returns {GamemasterCallbacks} An object containing all game master callback utilities.
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
}: UseGameCallbacksProps): GamemasterCallbacks {
  /**
   * @private
   * @function stripOutput
   * @description Utility function to remove common trailing prompt-like phrases from LLM output.
   * This helps in cleaning up the text before storing or displaying it.
   * For example, it removes phrases like "What do you want to do?" or "What would you like to do next?".
   *
   * @param {string} llmOutput - The raw output string from the LLM.
   * @returns {string} The LLM output string with trailing interaction prompts removed.
   */
  function stripOutput(llmOutput: string): string {
    const regexPattern =
      // Matches phrases like "What do you want to..." or "What would you like to..."
      // that are followed by any characters up to a question mark, at the end of the string.
      /\b(?:What do you want to |What would you like to )\S[\S\s]*\?\s*$/;
    return llmOutput.replace(regexPattern, "");
  }

  /**
   * @async
   * @function sendNewMissionGenerate
   * @description Initiates the creation of a new game mission. It first resets the current game state,
   * then calls the backend API to create a new mission with the specified game type and background story.
   * Upon successful creation, it updates the application state with the new mission ID and name.
   *
   * @param {GameType} gameType - The type of game for the new mission (e.g., SHADOWRUN, VAMPIRE_THE_MASQUERADE).
   * @param {string} background - A textual description of the background or scenario for the new mission.
   * @returns {Promise<void>} A promise that resolves when the new mission is created and state is updated, or rejects on error.
   */
  const sendNewMissionGenerate = useCallback(
    async (gameType: GameType, background: string): Promise<void> => {
      await reset(); // Reset existing game state.
      const response = await postNewMission({
        game_type: gameType, // API expects snake_case
        background,
      });
      if (response !== null) {
        setMission(response.mission_id); // Update state with new mission ID.
        setAdventure(response.name); // Update state with new mission name.
      }
    },
    [reset, setMission, setAdventure] // Dependencies for useCallback
  );

  /**
   * @async
   * @function saveMission
   * @description Saves the current mission's progress. It calls the backend API to save the mission
   * associated with the current `mission` ID, using a custom name provided by the user.
   * Does nothing if `mission` ID is null.
   *
   * @param {string} nameCustom - The custom name under which to save the mission.
   * @returns {Promise<void>} A promise that resolves when the mission is saved, or rejects on error.
   */
  const saveMission = useCallback(
    async (nameCustom: string): Promise<void> => {
      if (mission !== null) {
        await postSaveMission(mission, nameCustom);
      }
    },
    [mission] // Dependency for useCallback
  );

  /**
   * @async
   * @function listMissions
   * @description Fetches a list of all previously saved missions from the backend.
   * It transforms the raw mission data received from the API ({@link MissionPayload})
   * into an array of {@link Mission} objects suitable for use in the frontend (e.g., in dropdowns).
   *
   * @returns {Promise<Mission[]>} A promise that resolves with an array of {@link Mission} objects.
   * Each object contains details like mission ID, name, custom name, and game type.
   */
  const listMissions = useCallback(async (): Promise<Mission[]> => {
    const missionPayloads = await getListMissions(); // Fetch raw mission data.
    // Map API response (MissionPayload[]) to client-side model (Mission[])
    return missionPayloads.map((payload: MissionPayload) => ({
      name: payload.name,
      missionId: payload.mission_id,
      nameCustom: payload.name_custom,
      gameType: payload.game_type,
      // Note: The 'description' field is not present in MissionPayload from getListMissions,
      // so it won't be mapped here. It's available in getLoadMissions's detailed mission data.
      description: "", // Explicitly set if not available or handle as optional in Mission type
    }));
  }, []); // No dependencies, this function doesn't rely on component state directly.

  /**
   * @async
   * @function loadMission
   * @description Loads a specific mission and its entire interaction history by the mission's ID.
   * After fetching the data from the backend, it updates the application's state to reflect the
   * loaded mission. This includes setting the mission ID, adventure name, game type,
   * past interactions, and the player input and LLM output of the very last interaction.
   * If the loaded mission has no interactions, the interaction-related states are cleared.
   *
   * @param {number} missionId - The unique identifier of the mission to be loaded.
   * @returns {Promise<void>} A promise that resolves when the mission is loaded and state is updated, or rejects on error.
   */
  const loadMission = useCallback(
    async (missionId: number): Promise<void> => {
      const loaded = await getLoadMissions(missionId); // Fetch mission data.
      setMission(loaded.mission.missionId);
      setAdventure(loaded.mission.nameCustom || loaded.mission.name); // Prefer custom name.
      setGameType(loaded.mission.gameType); // Set the game type for the loaded mission.

      const loadedInteractions = loaded.interactions;
      if (loadedInteractions.length > 0) {
        // The last interaction in the loaded data becomes the current "playerInputOld" and "llmOutput".
        const lastInteraction = loadedInteractions.pop(); // Removes and returns the last item.
        setInteractions(loadedInteractions); // The rest are set as the history.
        setPlayerInputOld(lastInteraction?.playerInput ?? "");
        setLlmOutput(lastInteraction?.llmOutput ?? "");
      } else {
        // If no interactions, clear relevant states.
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
    ] // Dependencies for useCallback
  );

  /**
   * @async
   * @function sendRegenerate
   * @description Requests the LLM to regenerate its output based on the previous player input (`playerInputOld`).
   * This is useful if the user wants a different response for their last action.
   * It uses the `playerInputOld` and the current `llmOutput` (which was the result of `playerInputOld`)
   * as the `prevInteraction` context for the LLM.
   * Does nothing if `mission` ID is null or `playerInputOld` is empty.
   *
   * @returns {Promise<void>} A promise that resolves when the regeneration request is complete, or rejects on error.
   * The LLM's new output will be streamed to the `llmOutput` state via `setStateCallback`.
   */
  const sendRegenerate = useCallback(async (): Promise<void> => {
    if (mission !== null && playerInputOld !== "") {
      // Context for regeneration is the last player input and its corresponding LLM output.
      const prevInteraction =
        playerInputOld !== "" && llmOutput !== ""
          ? { playerInput: playerInputOld, llmOutput: llmOutput }
          : undefined;

      // Note: The `playerInputField` to `sendPlayerInputToLlm` is omitted here.
      // The backend should interpret a missing `prompt` (playerInputField) in the presence
      // of `prev_interaction` as a request to regenerate based on `prev_interaction.user_input`.
      // If the backend requires `prompt` to be `prev_interaction.user_input` explicitly,
      // this call should be: playerInputField: playerInputOld.
      // Current `sendPlayerInputToLlm` structure implies `playerInputField` is the *new* prompt.
      // For regeneration, we are *not* sending a new prompt, but asking to retry the last one.
      // This assumes the backend handles an empty/null `prompt` field as a regeneration trigger
      // when `prev_interaction` is provided.
      // If not, the `sendPlayerInputToLlm` or backend might need adjustment, or we pass `playerInputOld` as `playerInputField`.
      // For now, sending `prevInteraction` without a new `playerInputField` (prompt).
      await sendPlayerInputToLlm({
        missionId: mission,
        setStateCallback: ({ llmOutput }) => setLlmOutput(llmOutput), // Update LLM output state with new response.
        prevInteraction: prevInteraction, // Provide context of the interaction to regenerate.
        // playerInputField: playerInputOld, // Potentially needed if backend doesn't infer from missing prompt.
      });
    }
  }, [mission, playerInputOld, llmOutput, setLlmOutput]); // Dependencies for useCallback

  /**
   * @async
   * @function sendPlayerInput
   * @description Submits the current player's input (`playerInput`) to the LLM for processing.
   * Before sending, it archives the current `playerInputOld` and `llmOutput` (after stripping)
   * into the `interactions` history. It then updates `playerInputOld` with the current `playerInput`,
   * clears `llmOutput` and `playerInput` to prepare for the new response.
   * If the API call fails, it attempts to roll back the state changes to maintain consistency.
   * Does nothing if `mission` ID is null or `playerInput` is empty.
   *
   * @returns {Promise<void>} A promise that resolves when the input is sent and response handling begins, or rejects on error.
   * The LLM's response will be streamed to the `llmOutput` state.
   */
  const sendPlayerInput = useCallback(async (): Promise<void> => {
    if (mission !== null && playerInput !== "") {
      const strippedLlmOutput = stripOutput(llmOutput); // Clean up previous LLM output.

      // The interaction to be added to history: previous player input and its (stripped) LLM response.
      const prevInteractionContext =
        playerInputOld !== "" && strippedLlmOutput !== ""
          ? { playerInput: playerInputOld, llmOutput: strippedLlmOutput }
          : undefined;

      // Store current state for potential rollback on error.
      const originalPlayerInput = playerInput;
      const originalPlayerInputOld = playerInputOld;
      const originalLlmOutput = llmOutput;
      const originalInteractions = [...interactions]; // Shallow copy for rollback

      // Update UI state optimistically:
      // Archive the completed interaction (playerInputOld + strippedLlmOutput)
      if (prevInteractionContext) {
        setInteractions([...interactions, prevInteractionContext]);
      }
      // The current playerInput becomes the new playerInputOld for the next turn.
      setPlayerInputOld(originalPlayerInput);
      setLlmOutput(""); // Clear LLM output for the new response.
      setPlayerInput(""); // Clear the input field.

      try {
        await sendPlayerInputToLlm({
          missionId: mission,
          setStateCallback: ({ llmOutput }) => setLlmOutput(llmOutput), // Stream new LLM response.
          playerInputField: originalPlayerInput, // Send the content of the input field.
          // The context for this new input is the *just archived* interaction.
          // So, `prevInteraction` here should be `prevInteractionContext`.
          prevInteraction: prevInteractionContext,
        });
      } catch (error) {
        // Rollback state on error.
        setPlayerInputOld(originalPlayerInputOld);
        setLlmOutput(originalLlmOutput);
        setPlayerInput(originalPlayerInput); // Restore current input field.
        setInteractions(originalInteractions); // Restore interactions history.
        // Consider re-throwing or notifying user of the error.
        console.error("Failed to send player input:", error);
      }
    }
  }, [
    mission,
    interactions, // interactions is needed for optimistic update
    llmOutput,
    playerInput,
    playerInputOld,
    setPlayerInputOld,
    setLlmOutput,
    setPlayerInput,
    setInteractions,
  ]);

  /**
   * @async
   * @function stopGeneration
   * @description Sends a request to the backend to stop any currently ongoing LLM response generation.
   * This allows the user to interrupt the LLM if needed. Errors from the API call are caught
   * and logged but not re-thrown, allowing the UI to remain responsive.
   *
   * @returns {Promise<void>} A promise that resolves when the stop command has been sent, or rejects on error (though errors are caught internally).
   */
  const stopGeneration = useCallback(async (): Promise<void> => {
    try {
      await postStopGeneration();
    } catch (error) {
      // Error is caught and logged; the caller is not expected to handle it directly.
      // UI might reflect a "stop failed" state if desired, but this callback itself doesn't enforce it.
      console.error("Error stopping LLM generation:", error);
    }
  }, []); // No dependencies as it doesn't use any local scope variables from the hook.

  /**
   * @function changeCallbackPlayerInputOld
   * @description Callback function to update the state of the 'previous player input' field.
   * This is typically used when allowing the user to edit past inputs.
   *
   * @param {string} value - The new string value for the previous player input.
   * @returns {void}
   */
  const changeCallbackPlayerInputOld = useCallback(
    (value: string) => {
      setPlayerInputOld(value);
    },
    [setPlayerInputOld] // Dependency: the setter for playerInputOld.
  );

  /**
   * @function changeCallbackPlayerInput
   * @description Callback function to update the state of the 'current player input' field.
   * This is typically connected to an input component where the user types their actions.
   *
   * @param {string} value - The new string value for the current player input.
   * @returns {void}
   */
  const changeCallbackPlayerInput = useCallback(
    (value: string) => {
      setPlayerInput(value);
    },
    [setPlayerInput] // Dependency: the setter for playerInput.
  );

  /**
   * @function changeCallbackLlmOutput
   * @description Callback function to update the state of the 'LLM output' field.
   * This is typically used when allowing the user to edit the LLM's previous response.
   *
   * @param {string} value - The new string value for the LLM output.
   * @returns {void}
   */
  const changeCallbackLlmOutput = useCallback(
    (value: string) => {
      setLlmOutput(value);
    },
    [setLlmOutput] // Dependency: the setter for llmOutput.
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
