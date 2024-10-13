import { useEffect, useState } from "react"
import { Environments } from "../types/Environment";


export default function PopupPage() {

  const [enviroments, setEnvironments] = useState<Environments>({})
  const [command, setCommand] = useState<string>("")
  useEffect(() => {
    window.focus();

    // get command
    const urlParams = new URLSearchParams(window.location.search);
    const command = urlParams.get("command");
    if (command) setCommand(command)

    // get environments
    chrome.storage.sync.get(["environments"], (result) => {
      const environments: Environments = result.environments || {};
      setEnvironments(environments)

      document.addEventListener("keydown", handleKeyDown);

      // Cleanup the event listener when the component unmounts
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    });

  }, []);

  //define handle key down
  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key;

    if (key >= "1" && key <= `${Object.keys(enviroments).length}`) {
      const buttonIndex = parseInt(key);
      const selectedEnvironment = Object.keys(enviroments).sort()[buttonIndex - 1]; // Adjust the index since key starts at 1
      openEnvironment(selectedEnvironment, command);
    }
  };

  const openEnvironment = (envName: string, command: string) => {
    const urls = enviroments[envName] || [];

    if (urls.length > 0) {
      chrome.runtime.sendMessage(
        {
          action: "executeMainFunction",
          selectedEnv: envName,
          command: command,
        },
        (response) => {
          console.log("recibis en el pop up" + response)
          if (response?.succes) {
            window.close();
          } else {
            console.error("Error calling Bg service");
          }
        }
      );
    } else {
      alert("No hay páginas configuradas para este entorno.");
    }
  }

  return (<>
    <h1>Seleccionar Entorno</h1>
    <div id="environmentsList">
      {
        Object.keys(enviroments).map((env: string, key: number) => {
          return (
            <button key={env} onClick={() => openEnvironment(env, command)}>
              {key + 1}. {env}
            </button>
          )
        })
      }
    </div>
  </>)
}