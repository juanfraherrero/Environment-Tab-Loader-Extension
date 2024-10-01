// load environments
document.addEventListener("DOMContentLoaded", () => {
  window.focus();

  // get command
  const urlParams = new URLSearchParams(window.location.search);
  const command = urlParams.get("command");

  // get environments
  chrome.storage.sync.get(["environments"], (result) => {
    const arrayOfEnvironments = [];
    const environments = result.environments || {};
    const envList = document.getElementById("environmentsList");
    envList.innerHTML = "";

    let index = 1;
    for (const envName in environments) {
      // add enviornments to array to keep order
      arrayOfEnvironments[index] = envName;

      // add button to UI
      const button = document.createElement("button");
      button.textContent = `${index}. ${envName}`;
      button.onclick = () => openEnvironment(envName, command);
      envList.appendChild(button);
      index++;
    }

    document.addEventListener("keydown", (event) => {
      const key = event.key;

      if (key >= "1" && key <= `${arrayOfEnvironments.length}`) {
        const buttonIndex = parseInt(key);
        openEnvironment(arrayOfEnvironments[buttonIndex], command);
      }
    });
  });
});

// Execute main functionality with the environment selected
function openEnvironment(envName, command) {
  chrome.storage.sync.get(["environments"], (result) => {
    const environments = result.environments || {};
    const urls = environments[envName] || [];
    console.log("Calling bg function");
    if (urls.length > 0) {
      chrome.runtime.sendMessage(
        {
          action: "executeMainFunction",
          selectedEnv: envName,
          command: command,
        },
        (response) => {
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
  });
}
