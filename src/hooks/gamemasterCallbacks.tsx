import { useCallback } from "react";
import { sendPlayerInputToLlm } from "../functions/restInterface";
import useHistoryStore from "../stores/historyStore";
import useAppStore from "../stores/appStore";

type UseGamemasterCallbacksProps = {
  mission: number | null;
};

export type GamemasterCallbacks = {
  sendGamemasterInput: (gamemasterInput: string) => Promise<void>;
};

export function useGamemasterCallbacks({
  mission,
}: UseGamemasterCallbacksProps): GamemasterCallbacks {
  const sendGamemasterInputCallback = useCallback(
    async (gamemasterInput: string): Promise<void> => {
      const { mission } = useAppStore.getState();
      const { setLlmOutput } = useHistoryStore.getState();

      if (mission !== null) {
        await sendPlayerInputToLlm({
          missionId: mission,
          setStateCallback: ({ llmOutput }: { llmOutput: string }) =>
            setLlmOutput(llmOutput),
          playerInputField: gamemasterInput,
        });
      }
    },
    []
  );

  return {
    sendGamemasterInput: sendGamemasterInputCallback,
  };
}

export default useGamemasterCallbacks;
