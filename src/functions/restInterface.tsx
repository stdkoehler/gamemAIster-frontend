export type Interaction = {
  playerInput: string;
  llmOutput: string;
};

interface State {
  llmOutput: string;
}

interface PromptPayload {
  mission_id: number;
  prompt: string;
  prev_interaction?: {
    user_input: string;
    llm_output: string;
  };
}

export interface MissionPayload {
  mission_id: number;
  name: string;
  name_custom?: string;
  description: string;
}

/**
 * Sends the player's input to the Language Model (LLM) server for processing.
 *
 *
 * @param missionId - The ID of the mission.
 * @param playerInputField - The player's input.
 * @param setStateCallback - A callback function to update the state with the LLM output for live stream update.
 * @param prevInteraction - (Optional) Previous interaction. This will be send with the new input and only then is persisted in the database of the backend
 *  This is to allow for changes by the user in the Player Prev and Gamemaster field. It will not be send at first input or when using "regenerate"
 * @returns {Promise<void>} - A Promise that resolves when the request is completed.
 * @throws {Error} - If the network response is not ok or if the reader is undefined.
 */
export async function sendPlayerInputToLlm(
  missionId: number,
  playerInputField: string,
  setStateCallback: (state: State) => void,
  prevInteraction?: Interaction
) {
  try {
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

    const fastapiurl = "http://127.0.0.1:8000/interaction/gamemaster-send";
    console.log("sending prompt");
    const response = await fetch(fastapiurl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const reader = response.body?.getReader();

    if (reader === undefined) {
      throw new Error("Reader is undefined");
    }

    let result = "";
    let done_flag = false;
    while (!done_flag) {
      const { done, value } = await reader.read();
      if (done) {
        done_flag = true;
        break;
      }
      const streamPackage = new TextDecoder().decode(value);
      const jsonData = JSON.parse(streamPackage);
      result += jsonData.text;
      setStateCallback({ llmOutput: result });
    }
    result = result.trim();
    setStateCallback({ llmOutput: result });
  } catch (err) {
    console.error("Error sending data", err);
  }
}

export async function postStopGeneration() {
  // For now, consider the data is stored on a static `users.json` file
  try {
    const res = await fetch(
      "http://127.0.0.1:8000/interaction/stop-generation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );
    if (!res.ok) {
      // Check if the response status is not OK (e.g., 404, 500)
      throw new Error(`Server responded with status: ${res.status}`);
    }
    return res.json() as Promise<MissionPayload[]>;
  } catch (error) {
    console.error("Error getting new mission:", error);
    throw new Error("Server responded with status");
  }
}

export async function postNewMission(): Promise<MissionPayload> {
  // For now, consider the data is stored on a static `users.json` file
  try {
    const res = await fetch("http://127.0.0.1:8000/mission/new-mission", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      // Check if the response status is not OK (e.g., 404, 500)
      throw new Error(`Server responded with status: ${res.status}`);
    }
    return res.json() as Promise<MissionPayload>;
  } catch (error) {
    console.error("Error getting new mission:", error);
    throw new Error("Server responded with status");
  }
}

export async function postSaveMission(missionId: number, nameCustom: string) {
  // For now, consider the data is stored on a static `users.json` file
  try {
    const res = await fetch("http://127.0.0.1:8000/mission/save-mission", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mission_id: missionId,
        name_custom: nameCustom,
      }),
    });
    if (!res.ok) {
      // Check if the response status is not OK (e.g., 404, 500)
      throw new Error(`Server responded with status: ${res.status}`);
    }
  } catch (error) {
    console.error("Error getting new mission:", error);
    throw new Error("Server responded with status");
  }
}

export async function getMission(
  mission_id: number
): Promise<MissionPayload | null> {
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/mission/mission/${mission_id}`,
      {
        method: "GET",
      }
    );
    if (!res.ok) {
      // Check if the response status is not OK (e.g., 404, 500)
      throw new Error(`Server responded with status: ${res.status}`);
    }
    return res.json() as Promise<MissionPayload>;
  } catch (error) {
    console.error("Error getting new mission:", error);
    throw new Error("Server responded with status");
  }
}

export async function getListMissions(): Promise<MissionPayload[]> {
  // For now, consider the data is stored on a static `users.json` file
  try {
    const res = await fetch("http://127.0.0.1:8000/mission/missions", {
      method: "GET",
    });
    if (!res.ok) {
      // Check if the response status is not OK (e.g., 404, 500)
      throw new Error(`Server responded with status: ${res.status}`);
    }
    return res.json() as Promise<MissionPayload[]>;
  } catch (error) {
    console.error("Error getting new mission:", error);
    throw new Error("Server responded with status");
  }
}
