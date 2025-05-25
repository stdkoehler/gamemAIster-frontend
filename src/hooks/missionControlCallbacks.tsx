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

type UseMissionControlCallbacksProps = {
  mission: number | null;
  setMission: (val: number | null) => void;
  setAdventure: (val: string) => void;
  reset: () => Promise<void>;
  setGameType: (val: GameType) => void;
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

      // Clear existing interaction state and set up loaded data
      const loadedInteractions = loaded.interactions;

      // Store interactions in localStorage for History component to pick up
      localStorage.setItem(
        "interactions",
        JSON.stringify(loadedInteractions.slice(0, -1) || [])
      );

      if (loadedInteractions.length > 0) {
        const lastInteraction =
          loadedInteractions[loadedInteractions.length - 1];
        localStorage.setItem(
          "playerInputOld",
          lastInteraction?.playerInput ?? ""
        );
        localStorage.setItem("llmOutput", lastInteraction?.llmOutput ?? "");
      } else {
        localStorage.setItem("playerInputOld", "");
        localStorage.setItem("llmOutput", "");
      }
      localStorage.setItem("playerInput", "");

      // Trigger a page refresh or custom event to notify History component
      window.dispatchEvent(new CustomEvent("missionLoaded"));
    },
    [setMission, setAdventure, setGameType]
  );

  return {
    sendNewMissionGenerate,
    saveMission,
    listMissions,
    loadMission,
  };
}

export default useMissionControlCallbacks;
