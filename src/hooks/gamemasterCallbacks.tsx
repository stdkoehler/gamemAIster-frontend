/**
 * @hook useGamemasterCallbacks
 *
 * Provides all callback functions for managing game master interactions in an LLM-based adventure game.
 * Handles mission lifecycle, player input processing, and conversation state management.
 *
 * Key Functionality:
 * - Mission management (create/save/list/load)
 * - Player input processing and LLM interaction
 * - Conversation history maintenance
 * - Generation control (start/stop/regenerate)
 *
 * State Management:
 * - Maintains mission ID and adventure name
 * - Tracks current and previous player inputs
 * - Manages LLM output and interaction history
 *
 * Usage:
 * const callbacks = useGamemasterCallbacks({ ...requiredProps });
 *
 * Props Interface:
 * @type UseGameCallbacksProps - Contains all necessary state setters and values including:
 *   - mission: Current mission ID
 *   - interactions: Conversation history
 *   - playerInput/playerInputOld: Current/previous player inputs
 *   - llmOutput: Current LLM response
 *   - reset: Shared reset function
 */

import { useCallback } from "react";
import {
  sendPlayerInputToLlm,
  postStopGeneration,
  postNewMission,
  postSaveMission,
  getListMissions,
  getLoadMissions,
  MissionPayload,
  Interaction,
} from "../functions/restInterface";

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
};

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
}: UseGameCallbacksProps) {
  // Reusable utilities
  function stripOutput(llmOutput: string): string {
    const regexPattern =
      /\b(?:What do you want to |What would you like to )\S[\S\s]*\?\s*$/;
    return llmOutput.replace(regexPattern, "");
  }

  const sendNewMissionGenerate = useCallback(async () => {
    await reset();
    const response = await postNewMission();
    if (response !== null) {
      setMission(response.mission_id);
      setAdventure(response.name);
    }
  }, [reset, setMission, setAdventure]);

  const saveMission = useCallback(
    async (nameCustom: string) => {
      if (mission !== null) {
        postSaveMission(mission, nameCustom);
      }
    },
    [mission]
  );

  const listMissions = useCallback(async (): Promise<any[]> => {
    const missionPayloads = await getListMissions();
    return missionPayloads.map((mission: MissionPayload) => ({
      label: mission.name,
      value: mission.mission_id,
      name_custom: mission.name_custom,
    }));
  }, []);

  const loadMission = useCallback(
    async (missionId: number) => {
      const loaded = await getLoadMissions(missionId);
      setMission(loaded.mission.mission_id);
      setAdventure(loaded.mission.name_custom || loaded.mission.name);
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
    [setMission, setAdventure, setInteractions, setPlayerInputOld, setLlmOutput]
  );

  const sendRegenerate = useCallback(async () => {
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

  const sendPlayerInput = useCallback(async () => {
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

  const stopGeneration = useCallback(async () => {
    try {
      await postStopGeneration();
    } catch (error) {
      // Handle error as needed
    }
  }, []);

  // Change handlers, purely delegated, for clarity.
  const changeCallbackPlayerInputOld = useCallback(
    (value: string) => {
      setPlayerInputOld(value);
    },
    [setPlayerInputOld]
  );
  const changeCallbackPlayerInput = useCallback(
    (value: string) => {
      setPlayerInput(value);
    },
    [setPlayerInput]
  );
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
