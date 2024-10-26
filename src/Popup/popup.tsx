import { useCallback, useEffect, useState } from "react";
import { Environments } from "../types/Environment";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function PopupPage() {
  const [enviroments, setEnvironments] = useState<Environments>({});
  const [command, setCommand] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    window.focus();

    // get command
    const urlParams = new URLSearchParams(window.location.search);
    const command = urlParams.get("command");
    if (command) setCommand(command);

    // get environments
    chrome.storage.sync.get(["environments"], (result) => {
      if (chrome.runtime.lastError) {
        toast({
          variant: "destructive",
          title: "Failed to retrieve environments",
        });
      }

      const environments: Environments = result.environments || {};
      setEnvironments(environments);
    });
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  /**
   * Calls background service to open the environment
   */
  const openEnvironment = useCallback(
    (envName: string, command: string) => {
      const urls = enviroments[envName] || [];

      if (urls.length > 0) {
        chrome.runtime.sendMessage(
          {
            action: "executeMainFunction",
            selectedEnv: envName,
            command: command,
          },
          (response) => {
            if (response?.success) {
              window.close();
            } else {
              toast({
                variant: "destructive",
                title: "Fail app, contact creator",
              });
            }
          }
        );
      } else {
        toast({
          title: "No tabs configured for environment selected",
        });
      }
    },
    [enviroments, toast]
  );

  /**
   * Event handler when key is pressed
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key;

      if (key >= "1" && key <= `${Object.keys(enviroments).length}`) {
        const buttonIndex = parseInt(key);
        const selectedEnvironment =
          Object.keys(enviroments).sort()[buttonIndex - 1]; // Adjust the index since key starts at 1
        openEnvironment(selectedEnvironment, command);
      }
    },
    [enviroments, command, openEnvironment]
  );

  // use effect for add and remove event handlers
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enviroments, handleKeyDown]);

  // verify if exists environments
  if (Object.keys(enviroments).length == 0) {
    return (
      <>
        <h1 className="text-center mt-3 mb-5 scroll-m-20 text-2xl font-extrabold tracking-tight">
          Se debe crear un entorno
        </h1>
      </>
    );
  }

  return (
    <>
      <h1 className="text-center mt-3 mb-5 scroll-m-20 text-2xl font-extrabold tracking-tight">
        Seleccionar Entorno
      </h1>
      <div
        id="environmentsList"
        className="flex flex-col items-center space-y-1.5 p-6"
      >
        {Object.keys(enviroments).map((env: string, key: number) => {
          return (
            <Button
              type="button"
              key={env}
              onClick={() => openEnvironment(env, command)}
              className="px-4 py-2 ml-2 min-w-64"
            >
              {key + 1}. {env}
            </Button>
          );
        })}
      </div>
      <Toaster />
    </>
  );
}
