import { useCallback, RefObject } from "react";
import {
  postNewMission,
  postSaveMission,
  getListMissions,
  getLoadMissions,
} from "../functions/restInterface";
import { Mission } from "../models/MissionModels";
import { MissionPayload } from "../models/RestInterface";
import { HistoryHandle } from "../models/HistoryTypes";
import { GameType } from "../models/Types";

type UseMissionControlCallbacksProps = {
  mission: number | null;
  setMission: (val: number | null) => void;
  setAdventure: (val: string) => void;
  reset: () => Promise<void>;
  setGameType: (val: GameType) => void;
  historyRef: RefObject<HistoryHandle>;
};

export type MissionControlCallbacks = {
  sendNewMissionGenerate: (
    gameType: GameType,
    background: string
  ) => Promise<void>;
  saveMission: (nameCustom: string) => Promise<void>;
  listMissions: () => Promise<Mission[]>;
  loadMission: (missionId: number) => Promise<void>;
};

export function useMissionControlCallbacks({
  mission,
  setMission,
  setAdventure,
  reset,
  setGameType,
  historyRef,
}: UseMissionControlCallbacksProps): MissionControlCallbacks {
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

  const saveMission = useCallback(
    async (nameCustom: string): Promise<void> => {
      if (mission !== null) {
        await postSaveMission(mission, nameCustom);
      }
    },
    [mission]
  );

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
      const loaded = await getLoadMissions(missionId);
      setMission(loaded.mission.missionId);
      setAdventure(loaded.mission.nameCustom || loaded.mission.name);
      setGameType(loaded.mission.gameType);

      // Use imperative handle to load history data directly
      const loadedInteractions = loaded.interactions;

      if (loadedInteractions.length > 0) {
        const lastInteraction =
          loadedInteractions[loadedInteractions.length - 1];
        historyRef.current?.loadHistoryData({
          interactions: loadedInteractions.slice(0, -1) || [],
          lastPlayerInput: lastInteraction?.playerInput ?? "",
          lastLlmOutput: lastInteraction?.llmOutput ?? "",
        });
      } else {
        historyRef.current?.loadHistoryData({
          interactions: [],
          lastPlayerInput: "",
          lastLlmOutput: "",
        });
      }
    },
    [setMission, setAdventure, setGameType, historyRef]
  );

  return {
    sendNewMissionGenerate,
    saveMission,
    listMissions,
    loadMission,
  };
}

export default useMissionControlCallbacks;
