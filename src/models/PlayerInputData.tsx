import { Interaction } from "./MissionModels";
import { State } from "./RestInterface";

export interface PlayerInputData {
  missionId: number;
  setStateCallback: (state: State) => void;
  playerInputField?: string;
  prevInteraction?: Interaction;
}
