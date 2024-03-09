interface State {
  llmOutput: string;
}

interface PromptPayload {
  session_id: string;
  prompt: string;
  prev_interaction?: {
    user_input: string
    llm_output: string
  }
}

export async function sendPlayerInputToLlm(playerInputField: string, setStateCallback: (state: State) => void, playerPrevInputField?: string, llmOutputField?: string) {
  try {
    const payload: PromptPayload = {
      session_id: "AAAA-AAAA-AAAA",
      prompt: playerInputField
    }
    if (llmOutputField && playerPrevInputField && llmOutputField != "") {
      payload.prev_interaction = {
          user_input: playerPrevInputField,
          llm_output: llmOutputField
        }
      }
    
    const fastapiurl = 'http://127.0.0.1:8000/textgen-webui/gamemaster-send';
    console.log("sending prompt")
    const response = await fetch(fastapiurl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const reader = response.body?.getReader();

    if (reader === undefined) {
      throw new Error('Reader is undefined');
    }

    let result = '';
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
    console.error('Error sending data', err);
  }
}
