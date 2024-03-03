interface State {
  llmOutput: string;
}

/**
 * The sendPlayerInputToLlm() function is an asynchronous function 
 * that is intended to send player input to a LLM (Large Language Model). 
 * 
 * @param {string} playerInputField : The text input by the player.
 * @param {setStateCallback} setStateCallback: Callback function to update the state with the LLM output.
 * 
 * @function
 * @async
 */
export async function sendPlayerInputToLlm(playerInputField: string, setStateCallback: (state: State) => void) {
  try {
    const fastapiurl = 'http://127.0.0.1:8000/textgen-webui/user-prompt';
    console.log("sending prompt")
    const response = await fetch(fastapiurl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: playerInputField })
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
  } catch (err) {
    console.error('Error sending data', err);
  }
}

