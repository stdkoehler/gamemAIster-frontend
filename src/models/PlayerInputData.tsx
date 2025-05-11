import { State } from "../functions/restInterface";
import { Interaction } from "./MissionModels";

export interface PlayerInputData {
  missionId: number;
  setStateCallback: (state: State) => void;
  playerInputField?: string;
  prevInteraction?: Interaction;
}
