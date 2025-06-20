import { useCallback } from "react";
import {
  postNewMission,
  postSaveMission,
  getListMissions,
  getLoadMissions,
} from "../functions/restInterface";
import { Mission } from "../models/MissionModels";
import { MissionPayload } from "../models/RestInterface";
import { GameType } from "../models/Types";
import useAppStore from "../stores/appStore";
import useHistoryStore from "../stores/historyStore";

export type MissionControlCallbacks = {
  sendNewMissionGenerate: (
    gameType: GameType,
    background: string,
    nonHeroMode: boolean
  ) => Promise<void>;
  saveMission: (nameCustom: string) => Promise<void>;
  listMissions: () => Promise<Mission[]>;
  loadMission: (missionId: number) => Promise<void>;
};

export function useMissionControlCallbacks(): MissionControlCallbacks {
  // Get history actions hook for cleaner API
  const clearHistory = useHistoryStore((state) => state.clearHistory);
  const loadHistoryData = useHistoryStore((state) => state.loadHistoryData);

  const sendNewMissionGenerate = useCallback(
    async (
      gameType: GameType,
      background: string,
      nonHeroMode: boolean
    ): Promise<void> => {
      const { reset, setMission, setAdventure } = useAppStore.getState();

      // Reset both stores
      reset();
      clearHistory();

      const response = await postNewMission({
        game_type: gameType,
        background,
        non_hero_mode: nonHeroMode,
      });
      if (response !== null) {
        setMission(response.mission_id);
        setAdventure(response.name);
      }
    },
    [clearHistory]
  );

  const saveMission = useCallback(async (nameCustom: string): Promise<void> => {
    const { mission } = useAppStore.getState();
    if (mission !== null) {
      await postSaveMission(mission, nameCustom);
    }
  }, []);

  const listMissions = useCallback(async (): Promise<Mission[]> => {
    const missionPayloads = await getListMissions();

    return missionPayloads.map((payload: MissionPayload) => ({
      name: payload.name,
      missionId: payload.mission_id,
      nameCustom: payload.name_custom,
      gameType: payload.game_type,
      description: "",
    }));
  }, []);

  const loadMission = useCallback(
    async (missionId: number): Promise<void> => {
      const { setMission, setAdventure, setGameType } = useAppStore.getState();

      // Clear history first
      clearHistory();

      const loaded = await getLoadMissions(missionId);

      setMission(loaded.mission.missionId);
      setAdventure(loaded.mission.nameCustom || loaded.mission.name);
      setGameType(loaded.mission.gameType);

      const loadedInteractions = loaded.interactions;

      if (loadedInteractions.length > 0) {
        const lastInteraction =
          loadedInteractions[loadedInteractions.length - 1];
        loadHistoryData({
          interactions: loadedInteractions.slice(0, -1) || [],
          lastPlayerInput: lastInteraction?.playerInput ?? "",
          lastLlmOutput: lastInteraction?.llmOutput ?? "",
        });
      } else {
        loadHistoryData({
          interactions: [],
          lastPlayerInput: "",
          lastLlmOutput: "",
        });
      }
    },
    [clearHistory, loadHistoryData]
  );

  return {
    sendNewMissionGenerate,
    saveMission,
    listMissions,
    loadMission,
  };
}

export default useMissionControlCallbacks;
